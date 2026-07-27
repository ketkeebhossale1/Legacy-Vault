import { createAction } from '@reduxjs/toolkit'

export interface AuditEntry {
  id: string
  event: string
  type: string        // nominee_add | nominee_update | executor_add | executor_update | will_saved | will_updated | advocate_share
  name: string        // person or entity name
  detail: string | null
  timestamp: string
}
export const fetchAuditLogsRequest = createAction('audit/fetchRequest')
