import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const isReset = searchParams.get('mode') === 'reset'

  // Nhãn hiển thị theo chế độ: đặt lại mật khẩu (đã có tài khoản) vs kích hoạt (lần đầu)
  const txt = isReset
    ? { heading: 'Đặt lại mật khẩu', sub: 'Tạo mật khẩu mới cho tài khoản của bạn', submit: 'Đặt lại mật khẩu', submitting: 'Đang lưu...', doneTitle: 'Đặt lại mật khẩu thành công!' }
    : { heading: 'Kích hoạt tài khoản', sub: 'Đặt mật khẩu để bắt đầu sử dụng hệ thống', submit: 'Kích hoạt tài khoản', submitting: 'Đang kích hoạt...', doneTitle: 'Tài khoản đã kích hoạt!' }

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) setErrorMsg('Liên kết không hợp lệ hoặc đã hết hạn.')
  }, [token])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) { setErrorMsg('Mật khẩu phải có ít nhất 8 ký tự'); return }
    if (form.password !== form.confirm) { setErrorMsg('Mật khẩu xác nhận không khớp'); return }

    setErrorMsg('')
    setStatus('loading')
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/enterprise/accept-invite`, {
        token,
        password: form.password,
      })
      setStatus('success')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message ?? 'Có lỗi xảy ra, vui lòng thử lại.')
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', background: '#f8fafc',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)', padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: '#1D9E75',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(29,158,117,0.3)',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            {txt.heading}
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
            {txt.sub}
          </p>
        </div>

        <div style={{
          background: '#fff', borderRadius: 20, padding: '32px 28px',
          boxShadow: '0 8px 32px rgba(15,23,42,0.08)', border: '1px solid #f1f5f9',
        }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{
                width: 60, height: 60, background: '#dcfce7', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                {txt.doneTitle}
              </div>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
                Bạn có thể đăng nhập ngay bây giờ.
              </p>
              <a href="/enterprise/login" style={{
                display: 'inline-block', padding: '11px 28px', background: '#1D9E75',
                color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 14,
                textDecoration: 'none',
              }}>
                Đăng nhập →
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Mật khẩu mới <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input type="password" required style={inputStyle} placeholder="Ít nhất 8 ký tự" value={form.password} onChange={set('password')} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Xác nhận mật khẩu <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input type="password" required style={inputStyle} placeholder="Nhập lại mật khẩu" value={form.confirm} onChange={set('confirm')} />
              </div>

              {(errorMsg || status === 'error') && (
                <div style={{ fontSize: 13, color: '#ef4444', background: '#fef2f2', padding: '10px 14px', borderRadius: 9 }}>
                  {errorMsg}
                </div>
              )}

              <button type="submit" disabled={status === 'loading' || !token} style={{
                padding: '13px', background: (status === 'loading' || !token) ? '#94a3b8' : '#1D9E75',
                color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700,
                fontSize: 14, cursor: (status === 'loading' || !token) ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s', marginTop: 4,
              }}>
                {status === 'loading' ? txt.submitting : txt.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
