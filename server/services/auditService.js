import { findAuditLogsByUserId } from '../queries/auditQueries.js'
export async function listAuditLogs(userId) { return findAuditLogsByUserId(userId) }
