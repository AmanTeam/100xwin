import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDb, initDb, nowIso } from '../db.js'
import { config } from '../config.js'
import { uuid } from '../utils/crypto.js'

export const authRouter = express.Router()

authRouter.post('/auth/register', async (req, res) => {
  await initDb()
  const { email, password } = req.body || {}

  if (!email || !password) return res.status(400).json({ error: 'email and password required' })

  const db = await getDb()
  const id = uuid()
  const passwordHash = await bcrypt.hash(String(password), 10)
  const createdAt = nowIso()
  const signupBonus = 100

  try {
    await db.run('INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)', [id, String(email).toLowerCase(), passwordHash, createdAt])
    await db.run('INSERT INTO wallets (user_id, balance, bonus_locked, updated_at) VALUES (?, ?, ?, ?)', [id, signupBonus, signupBonus, createdAt])
    await db.run('INSERT INTO transactions (id, user_id, type, amount, note, created_at) VALUES (?, ?, ?, ?, ?, ?)', [uuid(), id, 'bonus', signupBonus, 'Signup bonus', createdAt])
  } catch (e) {
    if (String(e?.message || '').toLowerCase().includes('unique')) {
      return res.status(409).json({ error: 'email already exists' })
    }
    return res.status(500).json({ error: 'failed to register' })
  }

  const token = jwt.sign({ sub: id, email: String(email).toLowerCase() }, config.jwtSecret, { expiresIn: '7d' })
  return res.json({ token, user: { id, email: String(email).toLowerCase() } })
})

authRouter.post('/auth/login', async (req, res) => {
  await initDb()
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })

  const db = await getDb()
  const user = await db.get('SELECT id, email, password_hash FROM users WHERE email = ?', [String(email).toLowerCase()])
  if (!user) return res.status(401).json({ error: 'invalid credentials' })

  const ok = await bcrypt.compare(String(password), String(user.password_hash))
  if (!ok) return res.status(401).json({ error: 'invalid credentials' })

  const token = jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, { expiresIn: '7d' })
  return res.json({ token, user: { id: user.id, email: user.email } })
})
