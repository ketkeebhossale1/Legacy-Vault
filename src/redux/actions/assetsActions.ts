import { createAction } from '@reduxjs/toolkit'

export interface AssetInput {
  name: string
  category: string
  nomineeName?: string
  accessLevel?: 'full' | 'view'
}

export interface Asset extends AssetInput {
  id: string
  createdAt: string
}

export const fetchAssetsRequest = createAction('assets/fetchRequest')
export const createAssetRequest = createAction<AssetInput>('assets/createRequest')
export const updateAssetRequest = createAction<{ id: string; asset: AssetInput }>('assets/updateRequest')
export const deleteAssetRequest = createAction<string>('assets/deleteRequest')
