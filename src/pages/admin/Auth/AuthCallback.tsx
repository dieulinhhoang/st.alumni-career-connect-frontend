import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/common/loader';

function getSafeReturnUrl(returnUrl: string | null): string {
  if (!returnUrl) return '/admin/dashboard';
  if (!returnUrl.startsWith('/')) return '/admin/dashboard';
  if (returnUrl.startsWith('//')) return '/admin/dashboard';
  return returnUrl;
}

/**
 * Decode JWT payload (không verify signature — chỉ dùng để đọc claims phía client).
 * Backend đã verify khi gọi API, nên đây chỉ để lấy permissions hiển thị UI.
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Chuyển permissions từ JWT payload sang string[] để lưu localStorage.
 *
 * JWT payload có 2 dạng:
 *   - isAdmin = true  → permissions = '*'
 *   - isAdmin = false → permissions = { students: ['read','create'], ... }
 */
function flattenPermissions(payload: Record<string, any>): string[] {
  if (payload.permissions === '*') return ['*'];

  const map: Record<string, string[]> = payload.permissions ?? {};
  return Object.entries(map).flatMap(([resource, actions]) =>
    (actions as string[]).map((action) => `${resource}:${action}`),
  );
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

      // Decode JWT → lưu permissions + isAdmin + thông tin user vào localStorage
      const payload = decodeJwtPayload(token);
      if (payload) {
        const permissions = flattenPermissions(payload);
        localStorage.setItem('permissions', JSON.stringify(permissions));
        localStorage.setItem('isAdmin', JSON.stringify(!!payload.isAdmin));
        localStorage.setItem('currentUser', JSON.stringify({
          id: payload.sub != null ? String(payload.sub) : '',
          name: payload.name ?? '',
          isAdmin: !!payload.isAdmin,
          facultyId: payload.facultyId != null ? String(payload.facultyId) : null,
        }));
      }

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

  return   
    <Loader/>
   ;
}
