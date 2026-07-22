import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Nominee } from '../../data/mockData'

interface NomineesState {
  items: Nominee[]
  loading: boolean
  error: string | null
}

const initialState: NomineesState = { items: [], loading: false, error: null }

const nomineesSlice = createSlice({
  name: 'nominees',
  initialState,
  reducers: {
    requestStarted: state => { state.loading = true; state.error = null },
    fetchSucceeded: (state, action: PayloadAction<Nominee[]>) => { state.items = action.payload; state.loading = false },
    createSucceeded: (state, action: PayloadAction<Nominee>) => { state.items.push(action.payload); state.loading = false },
    // Edit creates a new DB row — swap old id entry with the new row returned
    updateSucceeded: (state, action: PayloadAction<{ oldId: number | string; nominee: Nominee }>) => {
      const { oldId, nominee } = action.payload
      state.items = state.items.map(n => String(n.id) === String(oldId) ? nominee : n)
      state.loading = false
    },
    deleteSucceeded: (state, action: PayloadAction<number | string>) => {
      state.items = state.items.filter(n => String(n.id) !== String(action.payload))
      state.loading = false
    },
    requestFailed: (state, action: PayloadAction<string>) => { state.loading = false; state.error = action.payload },
  },
})

export const { requestStarted, fetchSucceeded, createSucceeded, updateSucceeded, deleteSucceeded, requestFailed } = nomineesSlice.actions
export default nomineesSlice.reducer
