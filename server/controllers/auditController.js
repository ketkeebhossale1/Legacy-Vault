import * as auditService from '../services/auditService.js'
export async function list(req, res, next) {
  try {
    if (!req.query.userId) return res.status(400).json({ success: false, message: 'userId is required', data: null })
    return res.json({ success: true, message: 'Success', data: await auditService.listAuditLogs(req.query.userId) })
  } catch (error) { next(error) }
}
