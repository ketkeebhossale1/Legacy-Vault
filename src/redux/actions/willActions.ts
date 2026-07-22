import { createAction } from '@reduxjs/toolkit'

export interface WillData {
  text: string
  saved: boolean
  sharedWith: string[]
}

export const fetchWillRequest = createAction('will/fetchRequest')
export const saveWillRequest = createAction<WillData>('will/saveRequest')
