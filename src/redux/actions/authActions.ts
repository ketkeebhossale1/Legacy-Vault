import { createAction } from '@reduxjs/toolkit'

export interface AuthUser { id: string; name: string; email: string; role: string }
export const signInRequest = createAction<{ email: string; password: string; role: 'testator' | 'nominee' }>('auth/signInRequest')
export const signUpRequest = createAction<{ name: string; email: string; password: string }>('auth/signUpRequest')
