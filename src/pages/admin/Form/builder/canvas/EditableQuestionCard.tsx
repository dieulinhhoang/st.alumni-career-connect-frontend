import React from 'react'
import { Select, Checkbox, Tooltip } from 'antd'
import {
  CopyOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import type { Question, Section, QuestionType } from '../../../../../feature/form/types'

interface EditableQuestionCardProps {
  question: Question
  index: number
  total: number
  isActive: boolean
  accent: string
  sections: Section[]
  onActivate: () => void
  onDeactivate: () => void
  onUpdate: (patch: Partial<Question>) => void
  onDuplicate: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onAddQuestion: () => void
  onAddOption: () => void
  onUpdateOption: (oid: string, label: string) => void  // oid = option.id (string)
  onRemoveOption: (oid: string) => void                 // oid = option.id (string)
}

const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'short', label: 'Trả lời ngắn' },
  { value: 'long', label: 'Đoạn văn' },
  { value: 'radio', label: 'Trắc nghiệm' },
  { value: 'checkbox', label: 'Hộp kiểm' },
  { value: 'select', label: 'Danh sách thả xuống' },
  { value: 'date', label: 'Ngày' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Số điện thoại' },
  { value: 'address', label: 'Địa chỉ' },
]

const iconBtnBase: React.CSSProperties = {
  width: 36,
  height: 36,
  border: 'none',
  borderRadius: 10,
  background: '#f8fafc',
  color: '#64748b',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all .15s ease',
}

function ActionIcon({
  title, icon, onClick, danger = false, disabled = false,
}: {
  title: string
  icon: React.ReactNode
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}) {
  return (
    <Tooltip title={title}>
      <button
        type="button"
        aria-label={title}
        onClick={onClick}
        disabled={disabled}
        style={{ ...iconBtnBase, opacity: disabled ? 0.45 : 1, color: danger ? '#ef4444' : '#64748b', cursor: disabled ? 'not-allowed' : 'pointer' }}
        onMouseEnter={(e) => { if (disabled) return; e.currentTarget.style.background = danger ? '#fef2f2' : '#f1f5f9' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc' }}
      >
        {icon}
      </button>
    </Tooltip>
  )
}

export function EditableQuestionCard({
  question,
  index,
  total,
  isActive,
  accent,
  sections,
  onActivate,
  onDeactivate,
  onUpdate,
  onDuplicate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddQuestion,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: EditableQuestionCardProps) {
  const qType = (question.type ?? 'short') as QuestionType
  // options luôn là array of { id, label }
  const options = Array.isArray(question.options) ? question.options : []
  const isChoiceType = ['radio', 'checkbox', 'select'].includes(qType)

  return (
    <div
      onClick={onActivate}
      style={{
        background: '#fff',
        borderRadius: 12,
        border: `1px solid ${isActive ? accent : '#e5e7eb'}`,
        boxShadow: isActive ? `0 4px 16px ${accent}18` : '0 1px 3px rgba(0,0,0,.06)',
        padding: 18,
        marginBottom: 12,
        transition: 'all .18s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Active bar */}
      {isActive && (
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: accent, borderRadius: '12px 0 0 12px' }} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title + type row */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ minWidth: 20, color: '#64748b', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  {index + 1}.
                </div>
                <input
                  value={question.title ?? ''}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  placeholder="Câu hỏi"
                  style={{
                    flex: 1,
                    border: 'none',
                    borderBottom: `2px solid ${isActive ? accent : '#d1d5db'}`,
                    outline: 'none',
                    padding: '10px 0 8px',
                    fontSize: 16,
                    fontWeight: 600,
                    background: 'transparent',
                    color: '#0f172a',
                  }}
                />
              </div>
            </div>

            <div style={{ width: 220, maxWidth: '100%' }} onClick={(e) => e.stopPropagation()}>
              <Select
                value={qType}
                onChange={(val) =>
                  onUpdate({
                    type: val,
                    options: ['radio', 'checkbox', 'select'].includes(val)
                      ? options.length
                        ? options
                        : [{ id: crypto.randomUUID(), label: 'Tùy chọn 1' }]
                      : [],
                  })
                }
                style={{ width: '100%' }}
                options={QUESTION_TYPE_OPTIONS}
              />
            </div>
          </div>

          {/* Input preview */}
          <div style={{ marginTop: 14 }}>
            {(qType === 'short' || qType === 'email' || qType === 'tel') && (
              <input
                value={question.placeholder ?? ''}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Văn bản gợi ý"
                style={{ width: '100%', height: 42, border: '1px solid #e5e7eb', borderRadius: 10, padding: '0 14px', fontSize: 14, outline: 'none', color: '#334155', background: '#fff' }}
              />
            )}

            {qType === 'long' && (
              <textarea
                value={question.placeholder ?? ''}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Văn bản gợi ý"
                rows={3}
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px', fontSize: 14, outline: 'none', color: '#334155', background: '#fff', resize: 'vertical' }}
              />
            )}

            {qType === 'date' && (
              <input
                value={question.placeholder ?? ''}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="dd/mm/yyyy"
                style={{ width: 220, maxWidth: '100%', height: 42, border: '1px solid #e5e7eb', borderRadius: 10, padding: '0 14px', fontSize: 14, outline: 'none', color: '#334155', background: '#fff' }}
              />
            )}

            {qType === 'address' && (
              <div style={{ padding: '12px 14px', border: '1px dashed #cbd5e1', borderRadius: 10, color: '#64748b', fontSize: 14, background: '#f8fafc' }}>
                Trường địa chỉ sẽ hiển thị ở chế độ điền biểu mẫu
              </div>
            )}

            {isChoiceType && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {options.map((opt) => (
                  <div
                    key={opt.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ width: 18, display: 'flex', justifyContent: 'center', color: '#94a3b8', flexShrink: 0, fontSize: 14 }}>
                      {qType === 'checkbox' ? (
                        <Checkbox disabled />
                      ) : (
                        <div style={{ width: 14, height: 14, borderRadius: 999, border: '2px solid #cbd5e1' }} />
                      )}
                    </div>

                    <input
                      value={opt.label}
                      onChange={(e) => onUpdateOption(opt.id, e.target.value)}
                      placeholder={`Tùy chọn`}
                      style={{ flex: 1, border: 'none', borderBottom: '1px solid #dbe2ea', outline: 'none', padding: '8px 0', fontSize: 14, color: '#334155', background: 'transparent' }}
                    />

                    {options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveOption(opt.id)}
                        style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4 }}
                        aria-label="Xóa tùy chọn"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onAddOption() }}
                  style={{ border: 'none', background: 'transparent', color: accent, cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: 0, display: 'inline-flex', alignItems: 'center', gap: 6, width: 'fit-content' }}
                >
                  + Thêm tùy chọn
                </button>
              </div>
            )}
          </div>

          {/* Footer: required + actions */}
          <div
            style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #eef2f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={!!question.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
            >
              Bắt buộc
            </Checkbox>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ActionIcon title="Đưa lên" icon={<ArrowUpOutlined />} onClick={onMoveUp} disabled={index === 0} />
              <ActionIcon title="Đưa xuống" icon={<ArrowDownOutlined />} onClick={onMoveDown} disabled={index === total - 1} />
              <ActionIcon title="Nhân bản" icon={<CopyOutlined />} onClick={onDuplicate} />
              <ActionIcon title="Xóa" icon={<DeleteOutlined />} onClick={onRemove} danger />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}