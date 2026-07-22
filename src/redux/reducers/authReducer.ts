import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '../actions/authActions'

const STORAGE_KEY = 'lv_user'

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch { return null }
}

interface AuthState { user: AuthUser | null; loading: boolean; error: string | null }
const initialState: AuthState = { user: loadUser(), loading: false, error: null }

const authSlice = createSlice({
  name: 'auth', initialState,
  reducers: {
    authStarted: state => { state.loading = true; state.error = null },
    authSucceeded: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload
      state.loading = false
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload))
    },
    authFailed: (state, action: PayloadAction<string>) => { state.loading = false; state.error = action.payload },
    clearAuthError: state => { state.error = null },
    signOut: state => {
      state.user = null
      state.error = null
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})
export const { authStarted, authSucceeded, authFailed, clearAuthError, signOut } = authSlice.actions
export default authSlice.reducer
