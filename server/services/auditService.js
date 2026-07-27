import { findActivityByUserId } from '../queries/auditQueries.js'
export async function listAuditLogs(userId) { return findActivityByUserId(userId) }
