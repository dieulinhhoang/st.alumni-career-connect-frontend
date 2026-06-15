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

  config.baseURL = import.meta.env.VITE_API_URL  ;
  return config
}

export const successInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response
}

const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('permissions')
  localStorage.removeItem('isAdmin')
  localStorage.removeItem('currentUser')
  // Đưa về trang đăng nhập, không bắn thẳng sang SSO (SSO còn session sẽ tự cấp lại token = vòng lặp)
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

export const errorInterceptor = async (error: AxiosError): Promise<void> => {
  if (error.response?.status === 401) {
    // JWT hết hạn hoặc không hợp lệ → logout về trang đăng nhập
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