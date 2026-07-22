import cors from 'cors'
import express from 'express'
import assetRoutes from './routes/assetRoutes.js'
import authRoutes from './routes/authRoutes.js'
import auditRoutes from './routes/auditRoutes.js'
import nomineeRoutes from './routes/nomineeRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:8443' }))
app.use(express.json())
app.get('/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }))
app.use('/api/auth', authRoutes)
app.use('/api/audit-logs', auditRoutes)
app.use('/api/assets', assetRoutes)
app.use('/api/nominees', nomineeRoutes)
app.use(errorHandler)
export default app
