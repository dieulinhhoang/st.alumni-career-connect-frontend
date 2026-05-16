import { useState } from 'react'
import type { SurveyBatch } from '../../../feature/alumni/types'
import { inp, focusIn, focusOut } from './styles'

export interface Identity {
  studentId: string
  studentName: string
  studentEmail: string
}

interface Props {
  batch: SurveyBatch
  onContinue: (identity: Identity) => void
}

export function IdentifyStep({ batch, onContinue }: Props) {
  const [studentId,    setStudentId]    = useState('')
  const [studentName,  setStudentName]  = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [err, setErr] = useState('')

  const submit = () => {
    if (!studentId.trim() || !studentName.trim() || !studentEmail.trim()) {
      setErr('Vui lòng điền đầy đủ thông tin.'); return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      setErr('Email không hợp lệ.'); return
    }
    onContinue({
      studentId:    studentId.trim(),
      studentName:  studentName.trim(),
      studentEmail: studentEmail.trim(),
    })
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f0fdf7',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', -apple-system, sans-serif", padding: '24px 16px',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '40px 40px 36px',
        boxShadow: '0 8px 32px rgba(0,0,0,.08)', width: '100%', maxWidth: 440,
      }}>
        {/* Logo + title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img
            src="https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png"
            alt="VNUA"
            style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 10 }}
          />
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
            Học viện Nông nghiệp Việt Nam
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.4 }}>
            {batch.title}
          </h2>
          <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 6 }}>
            {batch.graduationPeriod} · {batch.year}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 24, marginBottom: 24 }}>
          <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7, margin: '0 0 20px' }}>
            Vui lòng xác nhận thông tin của bạn trước khi bắt đầu điền phiếu khảo sát.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {([
              { label: 'Mã sinh viên', placeholder: 'VD: 650968',           value: studentId,    set: setStudentId },
              { label: 'Họ và tên',    placeholder: 'VD: Nguyễn Thị Thảo',  value: studentName,  set: setStudentName },
              { label: 'Email',        placeholder: 'VD: email@example.com', value: studentEmail, set: setStudentEmail, type: 'email' },
            ] as const).map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                  {f.label} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type={(f as any).type ?? 'text'}
                  placeholder={f.placeholder}
                  value={f.value}
                  onChange={e => { f.set(e.target.value); setErr('') }}
                  style={inp}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
            ))}
          </div>

          {err && (
            <div style={{ fontSize: 12.5, color: '#ef4444', marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
              ⚠ {err}
            </div>
          )}
        </div>

        <button
          onClick={submit}
          style={{
            width: '100%', height: 44, borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #1D9E75, #16a34a)',
            color: '#fff', fontSize: 14.5, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 4px 16px #1D9E7544',
            transition: 'opacity .13s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Bắt đầu điền phiếu →
        </button>
      </div>
    </div>
  )
}
