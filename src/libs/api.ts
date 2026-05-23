// src/libs/api.ts
import axios from 'axios';
import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors';
import { mockApiHandler } from './mock';

// ============ CONFIG ============
const USE_MOCK = false; // true = dùng mock, false = gọi API thật

// ============ AXIOS ============
const axiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL|| 'http://127.0.0.1:8000/api',
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
const api = new Proxy(axiosInstance, {
  get(target, prop) {
    const original = target[prop as keyof typeof target];
    if (USE_MOCK && (prop === 'get' || prop === 'post' || prop === 'put' || prop === 'delete')) {
      return async (url: string, config?: any) => {
        try {
          const mockData = await mockApiHandler(
            (prop as string).toUpperCase(),
            url,
            config?.data,
            prop === 'get' ? config?.params : config?.data
          );
          return { data: mockData };
        } catch (error) {
          console.error('Mock API error:', error);
          throw error;
        }
      };
    }
    return typeof original === 'function' ? original.bind(target) : original;
  }
});

export { api };
