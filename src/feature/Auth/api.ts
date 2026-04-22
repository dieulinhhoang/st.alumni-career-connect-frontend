import type { BaseResponse } from '../../global/globalType'
import { api } from '../../libs/api'
import type { LoginRequest } from './type'
import type { LoginResponse } from './type'
 import type { ProfileInfo } from './type'

export const loginAPI = async (params: LoginRequest): Promise<LoginResponse> => {
  const { data } = await api.post('/v1.0/auth/login', params)
  return data.data
}

export const refreshTokenAPI = async (refreshToken: string): Promise<LoginResponse> => {
  const { data } = await api.get('/v1.0/auth/refresh', {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      'Content-Type': 'application/json'
    },
    // Custom flag to tell interceptor not to override Authorization header
    metadata: { isRefreshToken: true }
  } as any)
  return data.data
}

export const getProfileAPI = async (): Promise<BaseResponse<ProfileInfo>> => {
  const { data } = await api.get('/v1.0/auth/profile')
  return data.data
}
