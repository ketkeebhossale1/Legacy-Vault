import { call, put, select, takeLatest } from 'redux-saga/effects'
import api from '../../services/api'
import type { AxiosResponse } from 'axios'
import { createAssetRequest, deleteAssetRequest, fetchAssetsRequest, updateAssetRequest, type Asset, type AssetInput } from '../actions/assetsActions'
import { createSucceeded, deleteSucceeded, fetchSucceeded, requestFailed, requestStarted, updateSucceeded } from '../reducers/assetsReducer'
import type { RootState } from '../store'

type ApiResponse<T> = { success: boolean; data: T; message?: string }
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.'

function* fetchAssets() {
  try {
    yield put(requestStarted())
    const user: RootState['auth']['user'] = yield select((state: RootState) => state.auth.user)
    if (!user) throw new Error('Sign in to view your assets')
    const response: AxiosResponse<ApiResponse<Asset[]>> = yield call(api.get, `/assets?testatorId=${encodeURIComponent(user.id)}`)
    yield put(fetchSucceeded(response.data.data))
  } catch (error) { yield put(requestFailed(errorMessage(error))) }
}

function* createAsset(action: ReturnType<typeof createAssetRequest>) {
  try {
    yield put(requestStarted())
    const response: AxiosResponse<ApiResponse<Asset>> = yield call(api.post, '/assets', action.payload as AssetInput)
    yield put(createSucceeded(response.data.data))
  } catch (error) { yield put(requestFailed(errorMessage(error))) }
}

function* updateAsset(action: ReturnType<typeof updateAssetRequest>) {
  try {
    yield put(requestStarted())
    const { id, asset } = action.payload
    const response: AxiosResponse<ApiResponse<Asset>> = yield call(api.put, `/assets/${id}`, asset)
    yield put(updateSucceeded(response.data.data))
  } catch (error) { yield put(requestFailed(errorMessage(error))) }
}

function* deleteAsset(action: ReturnType<typeof deleteAssetRequest>) {
  try {
    yield put(requestStarted())
    yield call(api.delete, `/assets/${action.payload}`)
    yield put(deleteSucceeded(action.payload))
  } catch (error) { yield put(requestFailed(errorMessage(error))) }
}

export default function* assetsSaga() {
  yield takeLatest(fetchAssetsRequest.type, fetchAssets)
  yield takeLatest(createAssetRequest.type, createAsset)
  yield takeLatest(updateAssetRequest.type, updateAsset)
  yield takeLatest(deleteAssetRequest.type, deleteAsset)
}
