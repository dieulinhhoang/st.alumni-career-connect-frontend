import { api } from "../../libs/api";

const BE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Redirect sang BE để bắt đầu SSO
export const loginWithSSO = () => {
  window.location.href = `${BE_URL}/auth/sso/redirect`;
};

// Lấy profile sau khi đã có token
export const getProfileAPI = async () => {
  const token = localStorage.getItem('accessToken');
  const { data } = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};