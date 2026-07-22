import bcrypt from 'bcryptjs'
import * as authQueries from '../queries/authQueries.js'

export async function register({ name, email, password }) {
  const existing = await authQueries.findActiveUserByEmail(email)
  if (existing) return { conflict: true }
  const passwordHash = await bcrypt.hash(password, 12)
  return { user: await authQueries.createUser({ name: name.trim(), email: email.trim().toLowerCase(), passwordHash }) }
}

export async function authenticate({ email, password, role }) {
  const user = await authQueries.findActiveUserByEmail(email, role)
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null
  const { passwordHash, ...safeUser } = user
  return safeUser
}
