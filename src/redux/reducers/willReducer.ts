import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface WillState {
  text: string | null
  saved: boolean
  sharedWith: string[]
  loading: boolean
  error: string | null
}

const initialState: WillState = {
  text: null,
  saved: false,
  sharedWith: [],
  loading: false,
  error: null,
}

const willSlice = createSlice({
  name: 'will',
  initialState,
  reducers: {
    requestStarted: state => { state.loading = true; state.error = null },
    fetchSucceeded: (state, action: PayloadAction<{ text: string; saved: boolean; sharedWith: string[] } | null>) => {
      if (action.payload) {
        state.text = action.payload.text
        state.saved = action.payload.saved
        state.sharedWith = action.payload.sharedWith
      }
      state.loading = false
    },
    saveSucceeded: (state, action: PayloadAction<{ text: string; saved: boolean; sharedWith: string[] }>) => {
      state.text = action.payload.text
      state.saved = action.payload.saved
      state.sharedWith = action.payload.sharedWith
      state.loading = false
    },
    requestFailed: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const { requestStarted, fetchSucceeded, saveSucceeded, requestFailed } = willSlice.actions
export default willSlice.reducer
