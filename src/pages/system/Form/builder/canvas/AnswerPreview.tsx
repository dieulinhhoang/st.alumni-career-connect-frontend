import React from 'react'
import type { Question } from '../../../../../feature/form/types'

const base: React.CSSProperties = {
  borderBottom: '1.5px solid #e8eaed', height: 28, fontSize: 13,
  color: '#9ca3af', fontStyle: 'italic', display: 'flex', alignItems: 'center',
  paddingBottom: 4, marginTop: 6,
}

export function AnswerPreview({ question }: { question: Question }) {
  switch (question.type) {
    case 'text':
    case 'email':
    case 'tel':
      return <div style={base}>Câu trả lời...</div>
    case 'address':
      return <div style={base}>Địa chỉ...</div>
    case 'address-province':
      return (
        <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={base}>Địa chỉ...</div>
          <div style={{ ...base, marginTop: 0, fontStyle: 'normal' }}>Chọn Tỉnh / Thành phố ▾</div>
        </div>
      )
    case 'cccd':
      return (
        <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={base}>Số CCCD...</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            Cấp ngày: <span style={{ fontStyle: 'normal' }}>dd / mm / yyyy</span>
          </div>
          <div style={{ ...base, marginTop: 0 }}>Tại...</div>
        </div>
      )
    case 'long':
      return <div style={{ ...base, height: 'auto', paddingBottom: 24 }}>Câu trả lời...</div>
    case 'date':
      return <div style={{ ...base, fontStyle: 'normal', fontSize: 12 }}>dd / mm / yyyy</div>
    case 'radio':
    case 'gender':
    case 'checkbox': {
      const isRadioLike = question.type === 'radio' || question.type === 'gender'
      const opts = question.options ?? []
      const shown = opts.slice(0, 3)
      const rest = opts.length - 3
      return (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {shown.map((o) => (
            <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 14, height: 14, borderRadius: isRadioLike ? '50%' : 3, border: '1.5px solid #d1d5db', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#6b7280' }}>{o.label}</span>
            </div>
          ))}
          {rest > 0 && (
            <div style={{ fontSize: 12, color: '#9ca3af', paddingLeft: 23 }}>+{rest} lựa chọn khác</div>
          )}
          {question.allowOther && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 14, height: 14, borderRadius: isRadioLike ? '50%' : 3, border: '1.5px solid #d1d5db', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>Khác (ô nhập sẽ hiện)</span>
            </div>
          )}
        </div>
      )
    }
    case 'rating':
      return (
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          {[1,2,3,4,5].map((s) => <span key={s} style={{ fontSize: 18, color: '#e5e7eb' }}>★</span>)}
        </div>
      )
    case 'select':
      return <div style={{ ...base, fontStyle: 'normal' }}>Chọn một phương án</div>
    default:
      return null
  }
}