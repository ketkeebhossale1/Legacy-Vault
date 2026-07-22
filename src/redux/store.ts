import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import assetsReducer from './reducers/assetsReducer'
import authReducer from './reducers/authReducer'
import auditReducer from './reducers/auditReducer'
import nomineesReducer from './reducers/nomineesReducer'
import willReducer from './reducers/willReducer'
import rootSaga from './rootSaga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: { assets: assetsReducer, auth: authReducer, audit: auditReducer, nominees: nomineesReducer, will: willReducer },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
