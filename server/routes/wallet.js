import express from 'express'
import { authRequired } from '../middleware/auth.js'
import { getDb, initDb, nowIso } from '../db.js'
import { uuid } from '../utils/crypto.js'

export const walletRouter = express.Router()

walletRouter.get('/wallet', authRequired, async (req, res) => {
  await initDb()
  const db = await getDb()
  const wallet = await db.get('SELECT user_id, balance, bonus_locked, updated_at FROM wallets WHERE user_id = ?', [req.user.id])
  return res.json({ wallet })
})

walletRouter.post('/wallet/withdraw', authRequired, async (req, res) => {
  await initDb()
  const { amount, note } = req.body || {}
  const n = Number(amount)
  if (!Number.isFinite(n) || n <= 0) return res.status(400).json({ error: 'invalid amount' })

  const minWithdraw = 100
  if (Math.trunc(n) < minWithdraw) return res.status(400).json({ error: `minimum withdraw is ₹${minWithdraw}` })

  const db = await getDb()
  const wallet = await db.get('SELECT balance, bonus_locked FROM wallets WHERE user_id = ?', [req.user.id])
  if (!wallet) return res.status(404).json({ error: 'wallet not found' })

  const locked = Math.max(0, Number(wallet.bonus_locked || 0))
  const balance = Number(wallet.balance || 0)
  const withdrawable = Math.max(0, balance - locked)

  if (withdrawable < Math.trunc(n)) return res.status(400).json({ error: 'insufficient withdrawable balance' })

  const txId = uuid()
  const createdAt = nowIso()

  await db.exec('BEGIN')
  try {
    await db.run('UPDATE wallets SET balance = balance - ?, updated_at = ? WHERE user_id = ?', [Math.trunc(n), createdAt, req.user.id])
    await db.run('INSERT INTO transactions (id, user_id, type, amount, note, created_at) VALUES (?, ?, ?, ?, ?, ?)', [txId, req.user.id, 'withdraw', Math.trunc(n), note || 'Withdrawn', createdAt])
    await db.exec('COMMIT')
  } catch (e) {
    await db.exec('ROLLBACK')
    return res.status(500).json({ error: 'failed to withdraw' })
  }

  const updated = await db.get('SELECT user_id, balance, bonus_locked, updated_at FROM wallets WHERE user_id = ?', [req.user.id])
  return res.json({ wallet: updated })
})

walletRouter.post('/wallet/credit', authRequired, async (req, res) => {
  await initDb()
  const { amount, note } = req.body || {}
  const n = Number(amount)
  if (!Number.isFinite(n) || n <= 0) return res.status(400).json({ error: 'invalid amount' })

  const db = await getDb()
  const txId = uuid()
  const createdAt = nowIso()

  await db.run('UPDATE wallets SET balance = balance + ?, updated_at = ? WHERE user_id = ?', [Math.trunc(n), createdAt, req.user.id])
  await db.run('INSERT INTO transactions (id, user_id, type, amount, note, created_at) VALUES (?, ?, ?, ?, ?, ?)', [txId, req.user.id, 'credit', Math.trunc(n), note || 'Added money', createdAt])

  const wallet = await db.get('SELECT user_id, balance, bonus_locked, updated_at FROM wallets WHERE user_id = ?', [req.user.id])
  return res.json({ wallet })
})

walletRouter.post('/wallet/debit', authRequired, async (req, res) => {
  await initDb()
  const { amount, note } = req.body || {}
  const n = Number(amount)
  if (!Number.isFinite(n) || n <= 0) return res.status(400).json({ error: 'invalid amount' })

  const db = await getDb()
  const wallet = await db.get('SELECT balance FROM wallets WHERE user_id = ?', [req.user.id])
  if (!wallet || Number(wallet.balance) < Math.trunc(n)) return res.status(400).json({ error: 'insufficient balance' })

  const txId = uuid()
  const createdAt = nowIso()

  await db.run('UPDATE wallets SET balance = balance - ?, updated_at = ? WHERE user_id = ?', [Math.trunc(n), createdAt, req.user.id])
  await db.run('INSERT INTO transactions (id, user_id, type, amount, note, created_at) VALUES (?, ?, ?, ?, ?, ?)', [txId, req.user.id, 'debit', Math.trunc(n), note || 'Withdrawn', createdAt])

  const updated = await db.get('SELECT user_id, balance, bonus_locked, updated_at FROM wallets WHERE user_id = ?', [req.user.id])
  return res.json({ wallet: updated })
})

walletRouter.get('/transactions', authRequired, async (req, res) => {
  await initDb()
  const db = await getDb()
  const rows = await db.all('SELECT id, type, amount, note, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 100', [req.user.id])
  return res.json({ transactions: rows })
})
