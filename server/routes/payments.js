import express from 'express'

import { authRequired } from '../middleware/auth.js'
import { getDb, initDb, nowIso } from '../db.js'
import { uuid } from '../utils/crypto.js'

export const paymentsRouter = express.Router()

paymentsRouter.post('/payments/create', authRequired, async (req, res) => {
  await initDb()
  const { amount, currency, provider, reference, meta } = req.body || {}

  const n = Number(amount)
  if (!Number.isFinite(n) || n <= 0) return res.status(400).json({ error: 'invalid amount' })

  const paymentId = uuid()
  const createdAt = nowIso()

  const db = await getDb()
  await db.run(
    'INSERT INTO payments (id, user_id, provider, status, amount, currency, reference, meta_json, created_at, confirmed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      paymentId,
      req.user.id,
      String(provider || 'mock'),
      'created',
      Math.trunc(n),
      String(currency || 'INR'),
      reference ? String(reference) : null,
      meta ? JSON.stringify(meta) : null,
      createdAt,
      null,
    ]
  )

  return res.json({
    payment: {
      id: paymentId,
      status: 'created',
      amount: Math.trunc(n),
      currency: String(currency || 'INR'),
      provider: String(provider || 'mock'),
      created_at: createdAt,
    },
  })
})

paymentsRouter.post('/payments/confirm', authRequired, async (req, res) => {
  await initDb()
  const { payment_id } = req.body || {}
  if (!payment_id) return res.status(400).json({ error: 'payment_id required' })

  const db = await getDb()
  const payment = await db.get(
    'SELECT id, user_id, status, amount, currency, provider FROM payments WHERE id = ? AND user_id = ?',
    [String(payment_id), req.user.id]
  )
  if (!payment) return res.status(404).json({ error: 'payment not found' })

  if (payment.status === 'confirmed') {
    const wallet = await db.get('SELECT user_id, balance, updated_at FROM wallets WHERE user_id = ?', [req.user.id])
    return res.json({ payment, wallet })
  }

  const confirmedAt = nowIso()

  await db.exec('BEGIN')
  try {
    await db.run('UPDATE payments SET status = ?, confirmed_at = ? WHERE id = ?', ['confirmed', confirmedAt, payment.id])

    await db.run('UPDATE wallets SET balance = balance + ?, updated_at = ? WHERE user_id = ?', [Number(payment.amount), confirmedAt, req.user.id])

    await db.run(
      'INSERT INTO transactions (id, user_id, type, amount, note, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [uuid(), req.user.id, 'credit', Number(payment.amount), `Deposit • ${payment.provider}`, confirmedAt]
    )

    await db.exec('COMMIT')
  } catch (e) {
    await db.exec('ROLLBACK')
    return res.status(500).json({ error: 'failed to confirm payment' })
  }

  const updatedPayment = await db.get('SELECT id, user_id, provider, status, amount, currency, reference, meta_json, created_at, confirmed_at FROM payments WHERE id = ?', [payment.id])
  const wallet = await db.get('SELECT user_id, balance, updated_at FROM wallets WHERE user_id = ?', [req.user.id])

  return res.json({ payment: updatedPayment, wallet })
})

paymentsRouter.get('/payments', authRequired, async (req, res) => {
  await initDb()
  const db = await getDb()
  const rows = await db.all(
    'SELECT id, provider, status, amount, currency, reference, created_at, confirmed_at FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 100',
    [req.user.id]
  )
  return res.json({ payments: rows })
})
