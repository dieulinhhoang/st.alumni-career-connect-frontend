// src/libs/api.ts (hoặc file central api)

import api, { mockApiHandler } from "./mock";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

export async function request<T = any>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  data?: any,
  params?: any,
): Promise<T> {
  if (useMock) {
    // gọi mock layer
    const res = mockApiHandler(method, url, data, params);
    return res as T;
  }

  const res = await api.request<T>({ method, url, data, params });
  return res.data;
}