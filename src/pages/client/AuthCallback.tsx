import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      localStorage.setItem('app_token', token);
      navigate('/admin/dashboard');
    } else {
      navigate('/login?error=auth_failed');
    }
  }, []);
  return <p>Đang xử lý đăng nhập...</p>;
}