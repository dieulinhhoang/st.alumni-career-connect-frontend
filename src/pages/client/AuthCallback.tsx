import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    if (token) {
      localStorage.setItem('accessToken', token);
      navigate('/admin/dashboard');
    } else {
      navigate('/login?error=auth_failed');
    }
  }, [navigate]);

  return <p>Đang xử lý đăng nhập...</p>;
}