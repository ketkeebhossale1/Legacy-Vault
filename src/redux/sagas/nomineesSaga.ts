import { call, put, takeLatest } from 'redux-saga/effects'
import type { AxiosResponse } from 'axios'
import api from '../../services/api'
import {
  fetchNomineesRequest,
  createNomineeRequest,
  updateNomineeRequest,
  deleteNomineeRequest,
} from '../actions/nomineeActions'
import type { Nominee } from '../../data/mockData'
import { createSucceeded, deleteSucceeded, fetchSucceeded, requestFailed, requestStarted, updateSucceeded } from '../reducers/nomineesReducer'

type ApiResponse<T> = { success: boolean; data: T; message?: string }
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.'

function* fetchNominees() {
  try {
    yield put(requestStarted())
    const response: AxiosResponse<ApiResponse<Nominee[]>> = yield call(api.get, '/nominees')
    yield put(fetchSucceeded(response.data.data))
  } catch (error) { yield put(requestFailed(errorMessage(error))) }
}

function* createNominee(action: ReturnType<typeof createNomineeRequest>) {
  try {
    yield put(requestStarted())
    const response: AxiosResponse<ApiResponse<Nominee>> = yield call(api.post, '/nominees', action.payload)
    yield put(createSucceeded(response.data.data))
  } catch (error) { yield put(requestFailed(errorMessage(error))) }
}

function* updateNominee(action: ReturnType<typeof updateNomineeRequest>) {
  try {
    yield put(requestStarted())
    const { id, nominee } = action.payload
    const response: AxiosResponse<ApiResponse<Nominee>> = yield call(api.patch, `/nominees/${id}`, nominee)
    // The edit creates a new row — replace old id with the new row returned
    yield put(updateSucceeded({ oldId: id, nominee: response.data.data }))
  } catch (error) { yield put(requestFailed(errorMessage(error))) }
}

function* deleteNominee(action: ReturnType<typeof deleteNomineeRequest>) {
  try {
    yield put(requestStarted())
    yield call(api.delete, `/nominees/${action.payload}`)
    yield put(deleteSucceeded(action.payload))
  } catch (error) { yield put(requestFailed(errorMessage(error))) }
}

export default function* nomineesSaga() {
  yield takeLatest(fetchNomineesRequest.type, fetchNominees)
  yield takeLatest(createNomineeRequest.type, createNominee)
  yield takeLatest(updateNomineeRequest.type, updateNominee)
  yield takeLatest(deleteNomineeRequest.type, deleteNominee)
}
