import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Asset } from '../actions/assetsActions'

interface AssetsState {
  items: Asset[]
  loading: boolean
  error: string | null
}

const initialState: AssetsState = { items: [], loading: false, error: null }

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    requestStarted: state => { state.loading = true; state.error = null },
    fetchSucceeded: (state, action: PayloadAction<Asset[]>) => { state.items = action.payload; state.loading = false },
    createSucceeded: (state, action: PayloadAction<Asset>) => { state.items.push(action.payload); state.loading = false },
    updateSucceeded: (state, action: PayloadAction<Asset>) => {
      state.items = state.items.map(asset => asset.id === action.payload.id ? action.payload : asset)
      state.loading = false
    },
    deleteSucceeded: (state, action: PayloadAction<string>) => { state.items = state.items.filter(asset => asset.id !== action.payload); state.loading = false },
    requestFailed: (state, action: PayloadAction<string>) => { state.loading = false; state.error = action.payload },
  },
})

export const { requestStarted, fetchSucceeded, createSucceeded, updateSucceeded, deleteSucceeded, requestFailed } = assetsSlice.actions
export default assetsSlice.reducer
