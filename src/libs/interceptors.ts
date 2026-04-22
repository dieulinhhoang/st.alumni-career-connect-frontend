import { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { getLocalStorage, setLocalStorage } from './localStorage'
import { refreshTokenAPI } from '../feature/auth/api'
 
export interface ConsoleError {
  status: number
  data: unknown
}

export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // Check if this is a refresh token request - don't override Authorization header
  const isRefreshToken = (
    config as InternalAxiosRequestConfig & {
      metadata?: { isRefreshToken?: boolean }
    }
  ).metadata?.isRefreshToken

  if (!isRefreshToken) {
    const token = getLocalStorage('accessToken')
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
      config.headers['Access-Control-Allow-Credentials'] = true
    }
  }

  // Only set Content-Type to application/json if it's not already set and data is not FormData
  if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }

  config.baseURL = import.meta.env.VITE_BASE_URL_API
  return config
}

export const successInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response
}

const logout = () => {
  localStorage.setItem('accessToken', '')
  localStorage.setItem('refreshToken', '')
  window.location.href = '/auth/login'
}

export const errorInterceptor = async (error: AxiosError): Promise<void> => {
  // Check if this 401 error is from the refresh token endpoint itself
  const isRefreshTokenRequest = error.config?.url?.includes('/v1.0/auth/refresh')
  if (error.response?.status === 401 && isRefreshTokenRequest) {
    logout()
  }
  if (error.response?.status === 401 && !isRefreshTokenRequest) {
    const refreshToken = getLocalStorage('refreshToken')
    if (refreshToken) {
      try {
        const res = await refreshTokenAPI(refreshToken)
        setLocalStorage('accessToken', res.accessToken)
        setLocalStorage('refreshToken', res.refreshToken)
      } catch {
        await Promise.reject(error)
      }
    } else {
      logout()
    }
    await Promise.reject(error)
  } else {
    if (error.response) {
      const errorMessage: ConsoleError = {
        status: error.response.status,
        data: error.response.data
      }
      console.error(errorMessage)
    } else if (error.request) {
      console.error(error.request)
    } else {
      console.error('Error', error.message)
    }
    await Promise.reject(error)
  }
}
