import { configureStore, combineReducers } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import assetsReducer  from './reducers/assetsReducer'
import authReducer    from './reducers/authReducer'
import auditReducer   from './reducers/auditReducer'
import nomineesReducer from './reducers/nomineesReducer'
import willReducer    from './reducers/willReducer'
import rootSaga from './rootSaga'

const combinedReducer = combineReducers({
  assets:   assetsReducer,
  auth:     authReducer,
  audit:    auditReducer,
  nominees: nomineesReducer,
  will:     willReducer,
})

type CombinedState = ReturnType<typeof combinedReducer>

// Wipe all user-specific slices when signing out or when a different user signs in
function rootReducer(state: CombinedState | undefined, action: { type: string; payload?: unknown }): CombinedState {
  if (action.type === 'auth/signOut') {
    // Full reset — clears everything including auth
    return combinedReducer(undefined, action)
  }

  if (action.type === 'auth/authSucceeded') {
    // New login — keep the auth slice (it will be updated by authSucceeded)
    // but wipe all other user data so stale data from previous user is gone
    const freshState: CombinedState = {
      ...combinedReducer(undefined, { type: '@@INIT' }),
      auth: state?.auth ?? combinedReducer(undefined, { type: '@@INIT' }).auth,
    }
    return combinedReducer(freshState, action)
  }

  return combinedReducer(state, action)
}

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
