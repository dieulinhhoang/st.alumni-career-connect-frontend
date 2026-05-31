// src/libs/mock/api.ts
import axios from 'axios';
import { errorInterceptor, requestInterceptor, successInterceptor } from '../interceptors';

// Bật/tắt mock mode (true = dùng mock, false = gọi API thật)
const USE_MOCK = false;

// ============ AXIOS ============
const axiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosInstance = axios.create(axiosRequestConfig);

// Interceptors
axiosInstance.interceptors.request.use(requestInterceptor);
axiosInstance.interceptors.response.use(successInterceptor, errorInterceptor);

// ============ MOCK WRAPPER ============
// USE_MOCK = false => dùng axiosInstance thật, không cần Proxy
const api = USE_MOCK
  ? new Proxy(axiosInstance, {
      get(target, prop) {
        return typeof target[prop as keyof typeof target] === 'function'
          ? (target[prop as keyof typeof target] as Function).bind(target)
          : target[prop as keyof typeof target];
      },
    })
  : axiosInstance;

export { api };
