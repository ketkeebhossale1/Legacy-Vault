import { createAction } from '@reduxjs/toolkit'

export interface NomineeInput {
  firstName: string
  lastName: string
  email: string
  address: string
  assetName: string
  assetPercentage: number
}

export const fetchNomineesRequest = createAction('nominees/fetchRequest')
export const createNomineeRequest = createAction<NomineeInput>('nominees/createRequest')
export const updateNomineeRequest = createAction<{ id: number | string; nominee: NomineeInput }>('nominees/updateRequest')
export const deleteNomineeRequest = createAction<number | string>('nominees/deleteRequest')
