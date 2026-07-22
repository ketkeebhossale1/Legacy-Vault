import { call, put, select, takeLatest } from 'redux-saga/effects'
import type { AxiosResponse } from 'axios'
import api from '../../services/api'
import { fetchAuditLogsRequest, type AuditEntry } from '../actions/auditActions'
import { auditFailed, auditStarted, auditSucceeded } from '../reducers/auditReducer'
import type { RootState } from '../store'

type ApiResponse<T> = { success: boolean; data: T }
function* fetchAuditLogs() {
  try {
    yield put(auditStarted())
    const user: RootState['auth']['user'] = yield select((state: RootState) => state.auth.user)
    if (!user) throw new Error('Sign in to view activity')
    const response: AxiosResponse<ApiResponse<AuditEntry[]>> = yield call(api.get, `/audit-logs?userId=${encodeURIComponent(user.id)}`)
    yield put(auditSucceeded(response.data.data))
  } catch (error) { yield put(auditFailed(error instanceof Error ? error.message : 'Unable to load activity')) }
}
export default function* auditSaga() { yield takeLatest(fetchAuditLogsRequest.type, fetchAuditLogs) }
