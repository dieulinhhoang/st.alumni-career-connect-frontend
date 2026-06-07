import React from 'react'
import type { Question } from '../../../../../feature/form/types'
import { AddressInput } from '../shared/AddressInput'
import { RichTextDisplay } from '../shared/RichTextDisplay'

const underlineInput: React.CSSProperties = {
  width: '100%',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
  background: '#fff',
  color: '#1e293b',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const underlineTextarea: React.CSSProperties = {
  ...underlineInput,
  resize: 'vertical',
  minHeight: 96,
  lineHeight: 1.65,
}

const radioBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '9px 12px',
  fontSize: 14,
  color: '#334155',
  cursor: 'pointer',
  fontFamily: 'inherit',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#fff',
  transition: 'all 0.15s',
}

interface SurveyQuestionProps {
  question: Question
  index: number          // global index (1-based) – truyền từ ngoài vào
  accent: string
  interactive: boolean
  isRequired: boolean
  isSmall: boolean

  // State cho riêng câu hỏi này (tránh pass cả map to đùng)
  radioValue?: string
  checkboxValues?: Record<string, boolean>
  textValue?: string

  onChangeText: (value: string) => void
  onChangeRadio: (value: string) => void
  onChangeCheckbox: (key: string, checked: boolean) => void
}

export function SurveyQuestion({
  question: q,
  index,
  accent,
  interactive,
  isRequired,
  isSmall,
  radioValue,
  checkboxValues = {},
  textValue = '',
  onChangeText,
  onChangeRadio,
  onChangeCheckbox,
}: SurveyQuestionProps) {
  const commonInputProps = {
    disabled: !interactive,
    required: isRequired,
  }

  const handleFocus = (e: React.FocusEvent<any>) => {
    e.currentTarget.style.borderColor = accent
    e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}18`
  }

  const handleBlur = (e: React.FocusEvent<any>) => {
    e.currentTarget.style.borderColor = '#e2e8f0'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        padding: isSmall ? '16px' : '20px 22px',
        transition: 'box-shadow .15s',
      }}
    >
      {/* Tiêu đề câu hỏi */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#0f172a',
          marginBottom: 14,
          lineHeight: 1.5,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: `${accent}18`,
            color: accent,
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          {index}
        </span>
        <span style={{ flex: 1, wordBreak: 'break-word', whiteSpace: 'normal', minWidth: 0 }}>
          <RichTextDisplay text={q.title} style={{ display: 'inline' }} />
          {isRequired && <span style={{ color: '#ef4444' }}> *</span>}
        </span>
      </div>

      {/* Ngắn / text */}
      {(q.type === 'short' || q.type === 'text') && (
        <input
          type="text"
          placeholder={q.placeholder || 'Câu trả lời của bạn'}
          value={textValue}
          onChange={(e) => onChangeText(e.target.value)}
          style={underlineInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...commonInputProps}
        />
      )}

      {/* Dài */}
      {q.type === 'long' && (
        <textarea
          placeholder={q.placeholder || 'Câu trả lời của bạn'}
          value={textValue}
          onChange={(e) => onChangeText(e.target.value)}
          style={underlineTextarea}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...commonInputProps}
        />
      )}

      {/* Email */}
      {q.type === 'email' && (
        <input
          type="email"
          placeholder={q.placeholder || 'Nhập email'}
          value={textValue}
          onChange={(e) => onChangeText(e.target.value)}
          style={underlineInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...commonInputProps}
        />
      )}

      {/* Số điện thoại */}
      {q.type === 'tel' && (
        <input
          type="tel"
          placeholder={q.placeholder || 'Nhập số điện thoại'}
          value={textValue}
          onChange={(e) => onChangeText(e.target.value)}
          style={underlineInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...commonInputProps}
        />
      )}

      {/* Ngày */}
      {q.type === 'date' && (
        <input
          type="date"
          value={textValue}
          onChange={(e) => onChangeText(e.target.value)}
          style={{ ...underlineInput, width: 'auto', minWidth: 200 }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...commonInputProps}
        />
      )}

      {/* Địa chỉ */}
      {q.type === 'address' && (
        <AddressInput
          value={textValue}
          onChange={onChangeText}
          placeholder={q.placeholder || 'Nhập địa chỉ của bạn'}
        />
      )}

      {/* Radio / Multiple choice */}
      {(q.type === 'radio' || q.type === 'multiple-choice') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(q.options ?? []).map((opt) => {
            const val = typeof opt === 'string' ? opt : (opt as any).label
            const key = typeof opt === 'string' ? opt : (opt as any).id ?? val
            const selected = radioValue === val

            return (
              <div
                key={key}
                onClick={() => interactive && onChangeRadio(val)}
                style={{
                  ...radioBase,
                  background: selected ? `${accent}0d` : '#fff',
                  borderColor: selected ? accent : '#e2e8f0',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: `2px solid ${selected ? accent : '#94a3b8'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: '#fff',
                  }}
                >
                  {selected && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: accent,
                      }}
                    />
                  )}
                </div>
                <span style={{ color: selected ? '#0f172a' : '#334155' }}>{val}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Checkbox */}
      {q.type === 'checkbox' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(q.options ?? []).map((opt) => {
            const val = typeof opt === 'string' ? opt : (opt as any).label
            const key = typeof opt === 'string' ? opt : (opt as any).id ?? val
            const checked = checkboxValues[val] ?? false

            return (
              <div
                key={key}
                onClick={() => interactive && onChangeCheckbox(val, !checked)}
                style={{
                  ...radioBase,
                  background: checked ? `${accent}0d` : '#fff',
                  borderColor: checked ? accent : '#e2e8f0',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: `2px solid ${checked ? accent : '#94a3b8'}`,
                    background: checked ? accent : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {checked && '✓'}
                </div>
                <span style={{ color: checked ? '#0f172a' : '#334155' }}>{val}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Select */}
      {q.type === 'select' && (
        <select
          value={textValue}
          onChange={(e) => onChangeText(e.target.value)}
          style={{
            ...underlineInput,
            appearance: 'auto',
            cursor: interactive ? 'pointer' : 'default',
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...commonInputProps}
        >
          <option value="" disabled>
            Chọn một phương án
          </option>
          {q.options?.map((opt) => (
            <option key={opt as any} value={opt as any}>
              {opt as any}
            </option>
          ))}
        </select>
      )}

      {/* Rating 1–5 */}
      {/* {q.type === 'rating' && (
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              style={{
                fontSize: 18,
                color: Number(textValue) >= s ? accent : '#e5e7eb',
                cursor: interactive ? 'pointer' : 'default',
              }}
              onClick={() => interactive && onChangeText(String(s))}
            >
              ★
            </span>
          ))}
        </div>
      )} */}
    </div>
  )
}