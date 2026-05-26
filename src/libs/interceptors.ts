import { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { getLocalStorage } from './localStorage'

export interface ConsoleError {
  status: number
  data: unknown
}

export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = getLocalStorage('accessToken')
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

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
  localStorage.removeItem('accessToken')
  // Redirect về BE để login lại qua SSO
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/sso/redirect`
}

export const errorInterceptor = async (error: AxiosError): Promise<void> => {
  if (error.response?.status === 401) {
    // JWT hết hạn hoặc không hợp lệ → logout và SSO lại
    logout()
    return
  }

  if (error.response) {
    const errorMessage: ConsoleError = {
      status: error.response.status,
      data: error.response.data,
    }
    console.error(errorMessage)
  } else if (error.request) {
    console.error(error.request)
  } else {
    console.error('Error', error.message)
  }

  await Promise.reject(error)
}