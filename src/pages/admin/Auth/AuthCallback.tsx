import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function getSafeReturnUrl(returnUrl: string | null): string {
  if (!returnUrl) return '/admin/dashboard';
  if (!returnUrl.startsWith('/')) return '/admin/dashboard';
  if (returnUrl.startsWith('//')) return '/admin/dashboard';
  return returnUrl;
}

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');
    const returnUrl = getSafeReturnUrl(params.get('returnUrl'));

    if (token) {
      localStorage.setItem('accessToken', token);
      window.history.replaceState({}, '', returnUrl);
      navigate(returnUrl, { replace: true });
      return;
    }

    if (error) {
      window.history.replaceState({}, '', '/');
      navigate('/', { replace: true });
      return;
    }

    window.history.replaceState({}, '', '/');
    navigate('/', { replace: true });
  }, [navigate]);

  return <div>Đang đăng nhập...</div>;
}
