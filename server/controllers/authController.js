import * as authService from '../services/authService.js'

const invalid = (res, message) => res.status(400).json({ success: false, message, data: null })
const validInput = ({ email, password, name }, signup) => {
  if (signup && !name?.trim()) return 'Name is required'
  if (!email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'A valid email is required'
  if (!password || password.length < 8) return 'Password must contain at least 8 characters'
  return null
}
export async function signup(req, res, next) {
  try {
    const error = validInput(req.body, true); if (error) return invalid(res, error)
    const result = await authService.register(req.body)
    if (result.conflict) return res.status(409).json({ success: false, message: 'An account with this email already exists', data: null })
    return res.status(201).json({ success: true, message: 'Account created', data: result.user })
  } catch (error) { next(error) }
}
export async function signin(req, res, next) {
  try {
    const error = validInput(req.body, false); if (error) return invalid(res, error)
    if (!['testator', 'nominee'].includes(req.body.role)) return invalid(res, 'Choose Will Creator or Nominee')
    const user = await authService.authenticate(req.body)
    if (!user) return res.status(401).json({ success: false, message: 'Email or password is incorrect', data: null })
    return res.json({ success: true, message: 'Signed in', data: user })
  } catch (error) { next(error) }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body
    if (!email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      return invalid(res, 'A valid email is required')
    await authService.requestPasswordReset(email)
    // Always return success to avoid leaking whether the account exists
    return res.json({ success: true, message: 'If an account exists, a reset link has been sent.', data: null })
  } catch (error) { next(error) }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body
    if (!token) return invalid(res, 'Reset token is required')
    if (!password || password.length < 8) return invalid(res, 'Password must be at least 8 characters')
    const result = await authService.resetPassword(token, password)
    if (result.invalid) return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired', data: null })
    return res.json({ success: true, message: 'Password updated successfully', data: null })
  } catch (error) { next(error) }
}
