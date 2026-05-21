import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('accessToken', token);
      // Xoá token khỏi URL rồi vào dashboard
      window.history.replaceState({}, '', '/admin/dashboard');
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, []);

  return <div>Đang đăng nhập...</div>;
}