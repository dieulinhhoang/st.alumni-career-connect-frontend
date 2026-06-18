import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import logoVnua from '../../assets/logoVnua.jpg'

export default function EnterpriseLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/enterprise/login`, form)
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('userType', 'enterprise')
      window.location.href = '/enterprise/dashboard'
    } catch {
      setError('Email hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 8,
    border: '1px solid #e2e8f0', fontSize: 15, outline: 'none',
    fontFamily: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#fff', color: '#1e293b', boxSizing: 'border-box',
  }

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
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src={logoVnua} alt="VNUA" style={{
            width: 120, height: 120, objectFit: 'contain',
            borderRadius: 20, margin: '0 auto 20px', display: 'block',
          }} />
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.4 }}>
            Ứng dụng khảo sát việc làm và hỗ trợ<br />kết nối doanh nghiệp
          </h1>
        </div>

        {/* Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#f0fdf4', borderRadius: 10, padding: '9px 14px',
          marginBottom: 24,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#16a34a' }}>Đăng nhập doanh nghiệp</div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 10, padding: '11px 14px', marginBottom: 16,
            display: 'flex', alignItems: 'flex-start', gap: 9,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: 13, color: '#ef4444', lineHeight: 1.5 }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email" required
              placeholder="email@doanhnghiep.com"
              value={form.email} onChange={set('email')}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 3px #16a34a18'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
              Mật khẩu
            </label>
            <input
              type="password" required
              placeholder="••••••••"
              value={form.password} onChange={set('password')}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 3px #16a34a18'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px',
            background: loading ? '#94a3b8' : '#16a34a',
            color: '#fff', border: 'none', borderRadius: 12,
            fontWeight: 700, fontSize: 15,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s', marginTop: 4,
          }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#15803d'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#16a34a'; }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Back */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: '#94a3b8',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#64748b'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        textAlign: 'center', padding: '12px 24px',
        fontSize: 12, color: '#94a3b8', fontWeight: 500,
      }}>
        © {new Date().getFullYear()} ST TEAM
      </div>
    </div>
  )
}
