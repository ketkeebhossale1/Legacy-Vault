import { createAction } from '@reduxjs/toolkit'

export interface AuditEntry { id: string; event: string; actor: string; timestamp: string }
export const fetchAuditLogsRequest = createAction('audit/fetchRequest')
