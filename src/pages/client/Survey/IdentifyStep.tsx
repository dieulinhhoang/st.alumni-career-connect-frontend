import React, { useState } from 'react'
import { SafetyCertificateOutlined, CalendarOutlined, InfoCircleOutlined, WarningOutlined, LoadingOutlined, ArrowRightOutlined } from '@ant-design/icons'
import type { SurveyBatch } from '../../../feature/alumni/types'
import { checkStudentInGraduation } from '../../../feature/alumni/api'

export interface Identity {
  studentId: string
  studentName: string
  studentEmail: string
}

interface Props {
  batch: SurveyBatch
  onContinue: (identity: Identity) => void
}

const inp: React.CSSProperties = {
  width: '100%', padding: '13px 16px', borderRadius: 10,
  border: '1.5px solid #e2e8f0', fontSize: 16, color: '#1e293b',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color .13s, box-shadow .13s', background: '#fff',
}

function focusIn(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#1D9E75'
  e.target.style.boxShadow = '0 0 0 3px #1D9E7522'
}
function focusOut(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#e2e8f0'
  e.target.style.boxShadow = 'none'
}

export function IdentifyStep({ batch, onContinue }: Props) {
  const [studentId,    setStudentId]    = useState('')
  const [studentName,  setStudentName]  = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [err,          setErr]          = useState('')
  const [checking,     setChecking]     = useState(false)

  const submit = async () => {
    setErr('')
    if (!studentId.trim() || !studentName.trim() || !studentEmail.trim()) {
      setErr('Vui lòng điền đầy đủ thông tin.'); return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      setErr('Email không hợp lệ.'); return
    }

    if (batch.graduationId) {
      setChecking(true)
      try {
        const found = await checkStudentInGraduation(batch.graduationId, studentId.trim())
        if (!found) {
          setErr('Mã sinh viên không thuộc đợt tốt nghiệp này. Vui lòng kiểm tra lại.')
          return
        }
      } catch {
        // Nếu lỗi mạng, cho phép tiếp tục
      } finally {
        setChecking(false)
      }
    }

    onContinue({
      studentId:    studentId.trim(),
      studentName:  studentName.trim(),
      studentEmail: studentEmail.trim(),
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f0fdf7 0%, #e8f5f0 40%, #f0f9ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      padding: '32px 16px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '48px 52px 44px',
        boxShadow: '0 12px 48px rgba(0,0,0,.10), 0 2px 8px rgba(0,0,0,.06)',
        width: '100%',
        maxWidth: 600,
        border: '1px solid #e8f5ee',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}>
          <img
            src="https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png"
            alt="VNUA"
            style={{ width: 84, height: 84, objectFit: 'contain', marginBottom: 14 }}
          />
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.10em', color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
            Học viện Nông nghiệp Việt Nam
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.4, textAlign: 'center' }}>
            {batch.title}
          </h2>
          {batch.graduationPeriod && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: 20, padding: '4px 14px',
              fontSize: 13, color: '#166534', fontWeight: 600,
            }}>
              <CalendarOutlined style={{ fontSize: 13 }} />
              {batch.graduationPeriod}
            </div>
          )}
        </div>

        {/* Notice */}
        <div style={{
          background: '#f8faff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '14px 18px',
          marginBottom: 28,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <SafetyCertificateOutlined style={{ fontSize: 18, color: '#1D9E75', marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, margin: 0 }}>
            Vui lòng xác nhận thông tin của bạn trước khi bắt đầu điền phiếu khảo sát.
            Thông tin sẽ được <strong>tự động điền</strong> và <strong>không thể thay đổi</strong> sau khi xác thực.
          </p>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {([
            { label: 'Mã sinh viên',  placeholder: 'VD: 650968',             value: studentId,    set: setStudentId },
            { label: 'Họ và tên',     placeholder: 'VD: Nguyễn Thị Thảo',    value: studentName,  set: setStudentName },
            { label: 'Email',         placeholder: 'VD: email@example.com',   value: studentEmail, set: setStudentEmail, type: 'email' },
          ] as const).map(f => (
            <div key={f.label}>
              <label style={{ fontSize: 14.5, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7 }}>
                {f.label} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type={(f as any).type ?? 'text'}
                placeholder={f.placeholder}
                value={f.value}
                onChange={e => { f.set(e.target.value as any); setErr('') }}
                style={inp}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
          ))}
        </div>

        {/* Error */}
        {err && (
          <div style={{
            fontSize: 13.5, color: '#dc2626', marginTop: 16,
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: 8, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <WarningOutlined style={{ fontSize: 15, flexShrink: 0 }} />
            {err}
          </div>
        )}

        {/* Button */}
        <button
          onClick={submit}
          disabled={checking}
          style={{
            width: '100%', height: 52, borderRadius: 12, border: 'none',
            background: checking
              ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
              : 'linear-gradient(135deg, #1D9E75, #16a34a)',
            color: '#fff', fontSize: 17, fontWeight: 700,
            cursor: checking ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            boxShadow: checking ? 'none' : '0 6px 20px #1D9E7540',
            transition: 'opacity .13s, box-shadow .13s',
            marginTop: 28,
            letterSpacing: '.01em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
          onMouseEnter={e => { if (!checking) (e.currentTarget.style.opacity = '.88') }}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {checking
            ? <><LoadingOutlined style={{ fontSize: 18 }} /> Đang xác thực...</>
            : <><SafetyCertificateOutlined style={{ fontSize: 18 }} /> Xác thực và bắt đầu điền phiếu <ArrowRightOutlined style={{ fontSize: 15 }} /></>
          }
        </button>
      </div>
    </div>
  )
}