import { all } from 'redux-saga/effects'
import assetsSaga from './sagas/assetsSaga'
import authSaga from './sagas/authSaga'
import auditSaga from './sagas/auditSaga'
import nomineesSaga from './sagas/nomineesSaga'
import willSaga from './sagas/willSaga'

export default function* rootSaga() {
  yield all([assetsSaga(), authSaga(), auditSaga(), nomineesSaga(), willSaga()])
}
