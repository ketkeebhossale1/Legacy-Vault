import { generateWill } from '../services/willService.js'
import * as willQueries from '../queries/willQueries.js'
import { getAllActiveNominees } from '../queries/nomineeQueries.js'

export async function getWillHandler(req, res, next) {
  try {
    const will = await willQueries.getWillByUserId(req.user.id)
    return res.json({ success: true, message: 'OK', data: will })
  } catch (error) { next(error) }
}

export async function saveWillHandler(req, res, next) {
  try {
    const { text, saved, sharedWith } = req.body
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'text is required', data: null })
    const will = await willQueries.upsertWill(req.user.id, {
      text,
      saved: !!saved,
      sharedWith: Array.isArray(sharedWith) ? sharedWith : [],
    })
    return res.json({ success: true, message: 'Will saved', data: will })
  } catch (error) { next(error) }
}

export async function generateWillHandler(req, res, next) {
  try {
    // Enforce: at least 1 active nominee required
    const nominees = await getAllActiveNominees(req.user.id)
    if (!nominees || nominees.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one nominee before generating your will.',
        data: null,
      })
    }

    const text = await generateWill(req.user.id)
    return res.json({ success: true, message: 'Will generated', data: { text } })
  } catch (error) {
    if (error.message === 'Groq API request failed' || error.message === 'Empty response from Groq') {
      return res.status(502).json({ success: false, message: 'AI service unavailable. Please try again.', data: null })
    }
    next(error)
  }
}

export async function uploadCertificateHandler(req, res, next) {
  try {
    // Enforce: will must be saved first
    const existing = await willQueries.getWillByUserId(req.user.id)
    if (!existing || !existing.saved) {
      return res.status(400).json({
        success: false,
        message: 'Please generate and save your digital will before uploading a health certificate.',
        data: null,
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Health certificate file is required.',
        data: null,
      })
    }

    const will = await willQueries.saveCertificate(req.user.id, req.file.filename)
    console.log(`[Legacy Vault] Health certificate uploaded: user=${req.user.id} file=${req.file.filename}`)

    return res.json({ success: true, message: 'Health certificate uploaded successfully', data: will })
  } catch (error) { next(error) }
}
