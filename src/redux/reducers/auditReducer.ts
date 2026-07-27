import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuditEntry } from '../actions/auditActions'

interface AuditState { entries: AuditEntry[]; loading: boolean; error: string | null; fetched: boolean }
const initialState: AuditState = { entries: [], loading: false, error: null, fetched: false }
const auditSlice = createSlice({
  name: 'audit', initialState,
  reducers: {
    auditStarted: state => { state.loading = true; state.error = null; state.fetched = true },
    auditSucceeded: (state, action: PayloadAction<AuditEntry[]>) => { state.entries = action.payload; state.loading = false },
    auditFailed: (state, action: PayloadAction<string>) => { state.loading = false; state.error = action.payload },
  },
})
export const { auditStarted, auditSucceeded, auditFailed } = auditSlice.actions
export default auditSlice.reducer
