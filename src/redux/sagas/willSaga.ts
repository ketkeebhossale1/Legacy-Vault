import { call, put, takeLatest } from 'redux-saga/effects'
import type { AxiosResponse } from 'axios'
import api from '../../services/api'
import { fetchWillRequest, saveWillRequest } from '../actions/willActions'
import { requestStarted, fetchSucceeded, saveSucceeded, requestFailed } from '../reducers/willReducer'

type WillPayload = { text: string; saved: boolean; sharedWith: string[] }
type ApiResponse<T> = { success: boolean; data: T; message?: string }
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.'

function* fetchWill() {
  try {
    yield put(requestStarted())
    const response: AxiosResponse<ApiResponse<WillPayload | null>> = yield call(api.get, '/will')
    yield put(fetchSucceeded(response.data.data))
  } catch (error) { yield put(requestFailed(errorMessage(error))) }
}

function* saveWill(action: ReturnType<typeof saveWillRequest>) {
  try {
    yield put(requestStarted())
    const response: AxiosResponse<ApiResponse<WillPayload>> = yield call(api.post, '/will', action.payload)
    yield put(saveSucceeded(response.data.data))
  } catch (error) { yield put(requestFailed(errorMessage(error))) }
}

export default function* willSaga() {
  yield takeLatest(fetchWillRequest.type, fetchWill)
  yield takeLatest(saveWillRequest.type, saveWill)
}
