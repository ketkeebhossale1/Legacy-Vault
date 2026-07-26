import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import * as authQueries from '../queries/authQueries.js'
import { sendPasswordResetEmail } from './emailService.js'

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  )
}

export async function register({ name, email, password }) {
  const existing = await authQueries.findActiveUserByEmail(email)
  if (existing) return { conflict: true }
  const passwordHash = await bcrypt.hash(password, 12)
  const user = await authQueries.createUser({ name: name.trim(), email: email.trim().toLowerCase(), passwordHash })
  return { user: { ...user, token: signToken(user) } }
}

export async function authenticate({ email, password, role }) {
  const user = await authQueries.findActiveUserByEmail(email, role)
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null
  const { passwordHash, ...safeUser } = user
  // Auto-downgrade expired plans
  const effectivePlan = safeUser.planExpiresAt && new Date(safeUser.planExpiresAt) < new Date()
    ? 'free'
    : (safeUser.plan || 'free')
  return { ...safeUser, plan: effectivePlan, token: signToken(safeUser) }
}

export async function requestPasswordReset(email) {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  // storeResetToken returns null if email doesn't exist — we still return true
  // to avoid leaking whether an account exists (security best practice)
  const user = await authQueries.storeResetToken(email.trim().toLowerCase(), token, expiresAt)
  if (user) {
    const appUrl = process.env.APP_URL || 'http://localhost:8443'
    const resetUrl = `${appUrl}/reset-password?token=${token}`
    await sendPasswordResetEmail(email.trim().toLowerCase(), resetUrl)
  }
  return true
}

export async function resetPassword(token, newPassword) {
  const user = await authQueries.findUserByResetToken(token)
  if (!user) return { invalid: true }
  const passwordHash = await bcrypt.hash(newPassword, 12)
  await authQueries.updatePasswordAndClearToken(user.id, passwordHash)
  return { success: true }
}
