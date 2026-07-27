import cors from 'cors'
import express from 'express'
import assetRoutes from './routes/assetRoutes.js'
import authRoutes from './routes/authRoutes.js'
import auditRoutes from './routes/auditRoutes.js'
import nomineeRoutes from './routes/nomineeRoutes.js'
import willRoutes from './routes/willRoutes.js'
import advocateRoutes from './routes/advocateRoutes.js'
import subscriptionRoutes from './routes/subscriptionRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

// Allow localhost, any 192.168.x.x, and any 10.x.x.x / 172.x.x.x (private LAN).
// Extra origins can be added via CLIENT_ORIGIN=url1,url2 in .env.
const extraOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?$/

app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin requests (Postman, curl, server-to-server via proxy)
    if (!origin) return callback(null, true)
    if (LOCAL_ORIGIN.test(origin) || extraOrigins.includes(origin)) return callback(null, true)
    // Deny but don't crash — return null so the browser handles the blocked response
    callback(null, false)
  },
  credentials: true,
}))
app.use(express.json())
app.get('/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }))
app.use('/api/auth', authRoutes)
app.use('/api/audit-logs', auditRoutes)
app.use('/api/assets', assetRoutes)
app.use('/api/nominees', nomineeRoutes)
app.use('/api/will', willRoutes)
app.use('/api/advocate', advocateRoutes)
app.use('/api/subscription', subscriptionRoutes)
app.use(errorHandler)
export default app
