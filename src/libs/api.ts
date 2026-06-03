import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // Không redirect khi đang ở trang survey public
      const isSurveyPage = window.location.pathname.startsWith('/survey/');
      if (!isSurveyPage) {
        localStorage.removeItem("accessToken");
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/sso/redirect`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;