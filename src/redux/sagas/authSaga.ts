import { call, put, takeLatest } from 'redux-saga/effects'
import type { AxiosResponse } from 'axios'
import api from '../../services/api'
import { signInRequest, signUpRequest, type AuthUser } from '../actions/authActions'
import { authFailed, authStarted, authSucceeded } from '../reducers/authReducer'

type ApiResponse<T> = { success: boolean; data: T; message?: string }
const messageFor = (error: unknown) => {
  const candidate = error as { response?: { data?: { message?: string } }; message?: string }
  return candidate.response?.data?.message || candidate.message || 'Unable to authenticate right now.'
}

function* signIn(action: ReturnType<typeof signInRequest>) {
  try {
    yield put(authStarted())
    const response: AxiosResponse<ApiResponse<AuthUser>> = yield call(api.post, '/auth/signin', action.payload)
    yield put(authSucceeded(response.data.data))
  } catch (error) { yield put(authFailed(messageFor(error))) }
}
function* signUp(action: ReturnType<typeof signUpRequest>) {
  try {
    yield put(authStarted())
    const response: AxiosResponse<ApiResponse<AuthUser>> = yield call(api.post, '/auth/signup', action.payload)
    yield put(authSucceeded(response.data.data))
  } catch (error) { yield put(authFailed(messageFor(error))) }
}
export default function* authSaga() {
  yield takeLatest(signInRequest.type, signIn)
  yield takeLatest(signUpRequest.type, signUp)
}
