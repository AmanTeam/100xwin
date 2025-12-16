import express from 'express'

import { authRequired } from '../middleware/auth.js'
import { getDb, initDb, nowIso } from '../db.js'
import { randomHex, sha256Hex, uuid } from '../utils/crypto.js'
import { deriveRoundResult } from '../game/provablyFair.js'

export const gameRouter = express.Router()

const FEE_BPS = 800 // 8% demo fee

const ensureOpenRound = async (db) => {
  const openRound = await db.get('SELECT id, status, server_seed_hash, client_seed_public, created_at FROM rounds WHERE status = ? ORDER BY id DESC LIMIT 1', ['open'])
  if (openRound) return openRound

  const serverSeed = randomHex(32)
  const serverSeedHash = sha256Hex(serverSeed)
  const createdAt = nowIso()

  const result = await db.run(
    'INSERT INTO rounds (status, server_seed_hash, client_seed_public, server_seed, result_json, created_at, settled_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['open', serverSeedHash, null, serverSeed, null, createdAt, null]
  )

  return {
    id: result.lastID,
    status: 'open',
    server_seed_hash: serverSeedHash,
    client_seed_public: null,
    created_at: createdAt,
  }
}

gameRouter.get('/game/current-round', async (req, res) => {
  await initDb()
  const db = await getDb()
  const round = await ensureOpenRound(db)
  return res.json({ round })
})

gameRouter.post('/game/place-bet', authRequired, async (req, res) => {
  await initDb()
  const { bet_type, stake, multiplier } = req.body || {}

  const s = Number(stake)
  const m = Number(multiplier)
  if (!bet_type) return res.status(400).json({ error: 'bet_type required' })
  if (!Number.isFinite(s) || s <= 0) return res.status(400).json({ error: 'invalid stake' })
  if (!Number.isFinite(m) || m <= 0) return res.status(400).json({ error: 'invalid multiplier' })

  const db = await getDb()
  const round = await ensureOpenRound(db)

  const wallet = await db.get('SELECT balance FROM wallets WHERE user_id = ?', [req.user.id])
  if (!wallet || Number(wallet.balance) < Math.trunc(s)) return res.status(400).json({ error: 'insufficient balance' })

  const betId = uuid()
  const createdAt = nowIso()

  await db.exec('BEGIN')
  try {
    await db.run('UPDATE wallets SET balance = balance - ?, updated_at = ? WHERE user_id = ?', [Math.trunc(s), createdAt, req.user.id])
    await db.run('INSERT INTO transactions (id, user_id, type, amount, note, created_at) VALUES (?, ?, ?, ?, ?, ?)', [uuid(), req.user.id, 'bet', Math.trunc(s), `Bet • ${bet_type}`, createdAt])
    await db.run(
      'INSERT INTO bets (id, round_id, user_id, bet_type, stake, multiplier, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [betId, round.id, req.user.id, String(bet_type), Math.trunc(s), Math.trunc(m), createdAt]
    )
    await db.exec('COMMIT')
  } catch (e) {
    await db.exec('ROLLBACK')
    return res.status(500).json({ error: 'failed to place bet' })
  }

  const updatedWallet = await db.get('SELECT user_id, balance, updated_at FROM wallets WHERE user_id = ?', [req.user.id])
  return res.json({ bet: { id: betId, round_id: round.id, bet_type, stake: Math.trunc(s), multiplier: Math.trunc(m) }, wallet: updatedWallet })
})

gameRouter.post('/game/settle-round', async (req, res) => {
  await initDb()
  const { client_seed } = req.body || {}
  const clientSeed = String(client_seed || '')
  if (!clientSeed) return res.status(400).json({ error: 'client_seed required' })

  const db = await getDb()
  const round = await db.get('SELECT id, status, server_seed_hash, server_seed FROM rounds WHERE status = ? ORDER BY id DESC LIMIT 1', ['open'])
  if (!round) return res.status(400).json({ error: 'no open round' })

  const bets = await db.all('SELECT id, user_id, bet_type, stake, multiplier FROM bets WHERE round_id = ?', [round.id])

  const result = deriveRoundResult({ serverSeed: round.server_seed, clientSeed, nonce: round.id })

  const poolTotal = bets.reduce((sum, b) => sum + Number(b.stake), 0)
  const fee = Math.floor((poolTotal * FEE_BPS) / 10000)
  const prizePool = poolTotal - fee

  const winningBets = bets.filter(
    (b) => b.bet_type === result.color || b.bet_type === String(result.number) || b.bet_type === result.bigSmall
  )

  const totalWinningStake = winningBets.reduce((sum, b) => sum + Number(b.stake), 0)

  const settledAt = nowIso()

  await db.exec('BEGIN')
  try {
    await db.run(
      'UPDATE rounds SET status = ?, client_seed_public = ?, result_json = ?, settled_at = ? WHERE id = ?',
      ['settled', clientSeed, JSON.stringify({ ...result, poolTotal, fee, prizePool, totalWinningStake }), settledAt, round.id]
    )

    if (totalWinningStake > 0 && prizePool > 0) {
      const payoutsByUser = new Map()
      for (const bet of winningBets) {
        const share = Number(bet.stake) / totalWinningStake
        const payout = Math.floor(prizePool * share)
        payoutsByUser.set(bet.user_id, (payoutsByUser.get(bet.user_id) || 0) + payout)
      }

      for (const [userId, payout] of payoutsByUser.entries()) {
        if (payout <= 0) continue
        await db.run('UPDATE wallets SET balance = balance + ?, updated_at = ? WHERE user_id = ?', [payout, settledAt, userId])
        await db.run('INSERT INTO transactions (id, user_id, type, amount, note, created_at) VALUES (?, ?, ?, ?, ?, ?)', [uuid(), userId, 'win', payout, `Win • Round ${round.id}`, settledAt])
      }
    }

    await db.exec('COMMIT')
  } catch (e) {
    await db.exec('ROLLBACK')
    return res.status(500).json({ error: 'failed to settle round' })
  }

  const next = await ensureOpenRound(db)

  return res.json({
    settled_round: {
      id: round.id,
      server_seed_hash: round.server_seed_hash,
      server_seed: round.server_seed,
      client_seed: clientSeed,
      result,
      pool: { poolTotal, fee, prizePool, totalWinningStake },
    },
    next_round: { id: next.id, server_seed_hash: next.server_seed_hash },
  })
})
