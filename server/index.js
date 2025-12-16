import express from 'express'
import cors from 'cors'

import { config } from './config.js'
import { initDb } from './db.js'
import { healthRouter } from './routes/health.js'
import { authRouter } from './routes/auth.js'
import { walletRouter } from './routes/wallet.js'
import { gameRouter } from './routes/game.js'
import { paymentsRouter } from './routes/payments.js'

await initDb()

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '1mb' }))

app.use('/api', healthRouter)
app.use('/api', authRouter)
app.use('/api', walletRouter)
app.use('/api', gameRouter)
app.use('/api', paymentsRouter)

app.listen(config.port, () => {
  // no console comments
  console.log(`API listening on http://localhost:${config.port}`)
})
