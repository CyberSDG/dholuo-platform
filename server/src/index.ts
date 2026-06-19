import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

import wordsRouter from './routes/words'
import translateRouter from './routes/translate'
import authRouter from './routes/auth'
import adminRouter from './routes/admin'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please slow down' },
  })
)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use('/api/words', wordsRouter)
app.use('/api/translate', translateRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app
