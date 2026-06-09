import React, { useState } from 'react'
import { WarningOutlined, LoadingOutlined, ArrowRightOutlined } from '@ant-design/icons'
import type { SurveyBatch } from '../../../feature/alumni/types'
import { getStudentFromGraduation } from '../../../feature/alumni/api'
import type { StudentData } from '../../../feature/alumni/api'

export interface Identity {
  studentId: string
  studentName: string
  studentEmail: string
  studentData?: StudentData | null
}

interface Props {
  batch: SurveyBatch
  onContinue: (identity: Identity) => void
}

const inp: React.CSSProperties = {
  width: '100%', padding: '13px 16px', borderRadius: 10,
  border: '1.5px solid #e2e8f0', fontSize: 15, color: '#1e293b',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color .13s, box-shadow .13s', background: '#fff',
}

function focusIn(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#1D9E75'
  e.target.style.boxShadow = '0 0 0 3px #1D9E7520'
}
function focusOut(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#e2e8f0'
  e.target.style.boxShadow = 'none'
}

export function IdentifyStep({ batch, onContinue }: Props) {
  const [studentName,  setStudentName]  = useState('')
  const [studentId,    setStudentId]    = useState('')
  const [phone,        setPhone]        = useState('')
  const [dob,          setDob]          = useState('')
  const [err,          setErr]          = useState('')
  const [checking,     setChecking]     = useState(false)

  const submit = async () => {
    setErr('')

    // Đếm số trường được điền (ít nhất 2 trong 4)
    const filled = [studentName.trim(), studentId.trim(), phone.trim(), dob.trim()]
      .filter(Boolean).length

    if (filled < 2) {
      setErr('Vui lòng điền đúng ít nhất 2 thông tin để xác nhận.')
      return
    }

    let studentData: StudentData | null = null

    if (batch.graduationId && studentId.trim()) {
      setChecking(true)
      try {
        studentData = await getStudentFromGraduation(batch.graduationId, studentId.trim())
        if (!studentData) {
          setErr('Mã sinh viên không thuộc đợt tốt nghiệp này. Vui lòng kiểm tra lại.')
          return
        }
      } catch {
        // Lỗi mạng → cho tiếp tục
      } finally {
        setChecking(false)
      }
    }

    onContinue({
      studentId:    studentId.trim(),
      studentName:  studentData?.full_name || studentName.trim(),
      studentEmail: studentData?.email || '',
      studentData,
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      padding: '32px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 500 }}>

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', marginBottom: 16 }}>
            <img
              src="https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png"
              alt="VNUA"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 10px', lineHeight: 1.3 }}>
            Xác thực thông tin sinh viên
          </h2>
          <p style={{ fontSize: 13.5, color: '#64748b', fontStyle: 'italic', margin: 0, lineHeight: 1.65, maxWidth: 380 }}>
            (Anh/Chị vui lòng điền đúng ít nhất 2 thông tin để xác nhận là sinh viên của Học viện)
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#e2e8f0', marginBottom: 28 }} />

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {([
            { label: 'Họ và tên',       placeholder: 'Nhập họ và tên của Anh/Chị',  value: studentName,  set: setStudentName,  type: 'text' },
            { label: 'Mã sinh viên',    placeholder: 'Nhập mã sinh viên (nếu nhớ)', value: studentId,    set: setStudentId,    type: 'text' },
            { label: 'Số điện thoại',   placeholder: 'Nhập số điện thoại liên hệ',  value: phone,        set: setPhone,        type: 'tel'  },
            { label: 'Ngày sinh',       placeholder: '',                             value: dob,          set: setDob,          type: 'date' },
          ] as const).map(f => (
            <div key={f.label}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 7 }}>
                {f.label}
              </label>
              <input
                type={f.type}
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
            fontSize: 13, color: '#dc2626', marginTop: 16,
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: 8, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <WarningOutlined style={{ fontSize: 14, flexShrink: 0 }} />
            {err}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={submit}
          disabled={checking}
          style={{
            width: '100%', height: 52, marginTop: 24,
            borderRadius: 28, border: 'none',
            background: checking ? '#93c5fd' : '#2563eb',
            color: '#fff', fontSize: 16, fontWeight: 600,
            cursor: checking ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', letterSpacing: '.01em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'opacity .13s',
          }}
          onMouseEnter={e => { if (!checking) e.currentTarget.style.opacity = '.88' }}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {checking
            ? <><LoadingOutlined style={{ fontSize: 17 }} /> Đang xác thực...</>
            : <>Xác nhận</>
          }
        </button>

      </div>
    </div>
  )
}