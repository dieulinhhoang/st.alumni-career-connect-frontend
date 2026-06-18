import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithSSO } from '../../../feature/auth/api';
import logoVnua from '../../../assets/logoVnua.jpg';

const ERROR_MESSAGES_VI: Record<string, string> = {
  access_denied: 'Tài khoản không có quyền truy cập hệ thống.',
  missing_code: 'Đăng nhập SSO không thành công, vui lòng thử lại.',
  failed_to_get_access_token: 'Không thể lấy access token từ SSO.',
  failed_to_get_user_info: 'Không thể lấy thông tin người dùng từ SSO.',
  sso_callback_failed: 'Đăng nhập SSO thất bại, vui lòng thử lại sau.',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');

  useEffect(() => {
    if (!error && localStorage.getItem('accessToken')) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [error, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8faf9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: 'inherit',
    }}>
      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 500,
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.06)',
        padding: '48px 44px',
        border: '1px solid #eef0ee',
      }}>
        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src={logoVnua} alt="VNUA" style={{
            width: 96, height: 96, objectFit: 'contain',
            borderRadius: 16, margin: '0 auto 20px', display: 'block',
          }} />
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.4 }}>
            Ứng dụng khảo sát việc làm và hỗ trợ<br />kết nối doanh nghiệp
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 10, padding: '11px 14px', marginBottom: 20,
            display: 'flex', alignItems: 'flex-start', gap: 9,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: 13, color: '#ef4444', lineHeight: 1.5 }}>
              {ERROR_MESSAGES_VI[error] ?? 'Đã có lỗi xảy ra, vui lòng thử lại.'}
            </span>
          </div>
        )}

        {/* Divider label */}
        <p style={{ fontSize: 14, fontWeight: 600, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 14px' }}>
          Chọn loại tài khoản
        </p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* SSO */}
          <button onClick={loginWithSSO} style={{
            width: '100%', padding: '16px 20px',
            background: '#fff', border: '1.5px solid #e2e8f0',
            borderRadius: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 14,
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#1D9E75';
              e.currentTarget.style.background = '#f0fdf8';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#fff';
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: '#f0fdf4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Cán bộ / Giảng viên
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>

          {/* Enterprise */}
          <button onClick={() => navigate('/enterprise/login')} style={{
            width: '100%', padding: '16px 20px',
            background: '#fff', border: '1.5px solid #e2e8f0',
            borderRadius: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 14,
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.background = '#f0f6ff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#fff';
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: '#eff6ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Doanh nghiệp
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        textAlign: 'center', padding: '12px 24px',
        fontSize: 12, color: '#94a3b8', fontWeight: 500,
      }}>
        © {new Date().getFullYear()} ST TEAM
      </div>
    </div>
  );
}
