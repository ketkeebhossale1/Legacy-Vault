import { createAction } from '@reduxjs/toolkit'

export interface AuthUser { id: string; name: string; email: string; role: string; token: string; plan: 'free' | 'premium' }
export const signInRequest = createAction<{ email: string; password: string; role: 'testator' | 'nominee' }>('auth/signInRequest')
export const signUpRequest = createAction<{ name: string; email: string; password: string }>('auth/signUpRequest')
