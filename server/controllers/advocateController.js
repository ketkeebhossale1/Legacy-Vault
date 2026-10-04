import { upsertAdvocate, getAdvocatesByUserId } from '../queries/advocateQueries.js'
import { sendWillToAdvocate } from '../services/emailService.js'
import * as willQueries from '../queries/willQueries.js'

export async function shareWillHandler(req, res, next) {
  try {
    const { email } = req.body
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email?.trim() || !emailRe.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Valid advocate email is required', data: null })
    }

    const will = await willQueries.getWillByUserId(req.user.id)
    if (!will?.text) {
      return res.status(400).json({ success: false, message: 'No will found. Generate and save a will first.', data: null })
    }

    const advocate = await upsertAdvocate(req.user.id, email.trim())

    // Send email in background — don't block the response
    sendWillToAdvocate(email.trim(), will.text, req.user.email).catch(err =>
      console.error('[Legacy Vault] Background email send failed:', err.message)
    )

    return res.json({ success: true, message: `Will sent to ${email.trim()}`, data: advocate })
  } catch (error) { next(error) }
}

export async function getAdvocatesHandler(req, res, next) {
  try {
    const advocates = await getAdvocatesByUserId(req.user.id)
    return res.json({ success: true, message: 'OK', data: advocates })
  } catch (error) { next(error) }
}
