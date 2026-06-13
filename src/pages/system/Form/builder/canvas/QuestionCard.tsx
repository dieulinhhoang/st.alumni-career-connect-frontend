import { useState, useRef } from 'react'
import { Tooltip } from 'antd'
import { HolderOutlined } from '@ant-design/icons'
import type { Question, Section } from '../../../../../feature/form/types'
import { AnswerPreview } from './AnswerPreview'
import { FloatingPopup } from './FloatingPopup'

interface QuestionCardProps {
  question: Question
  index: number
  total: number
  isActive: boolean
  accent: string
  sections?: Section[]
  onActivate: () => void
  onDeactivate?: () => void
  onUpdate: (patch: Partial<Question>) => void
  onDuplicate: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onAddOption: () => void
  onUpdateOption: (oid: string, label: string) => void
  onRemoveOption: (oid: string) => void
}

export function QuestionCard({
  question, index, total, isActive, accent, sections = [],
  onActivate, onDeactivate, onUpdate, onDuplicate, onRemove,
  onMoveUp, onMoveDown, onAddOption, onUpdateOption, onRemoveOption,
}: QuestionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [popupOpen, setPopupOpen] = useState(false)

  const handleCardClick = () => { onActivate(); setPopupOpen(true) }
  const handleClose = () => { setPopupOpen(false); onDeactivate?.() }

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      role="button"
      aria-label={`Câu hỏi ${index + 1}: ${question.title || 'Chưa có nội dung'}`}
      aria-pressed={isActive}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick() }}
      style={{
        marginBottom: 10, borderRadius: 12, background: '#fff',
        border: isActive ? `1.5px solid ${accent}` : '1px solid #eaecf0',
        boxShadow: isActive ? `0 4px 16px ${accent}18` : '0 1px 3px rgba(0,0,0,.04)',
        transition: 'all .18s cubic-bezier(.16,1,.3,1)', cursor: 'pointer',
        position: 'relative', overflow: 'hidden', outline: 'none',
      }}
      onMouseEnter={(e) => { if (!isActive) { (e.currentTarget.style.borderColor = `${accent}60`); (e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,.07)') } }}
      onMouseLeave={(e) => { if (!isActive) { (e.currentTarget.style.borderColor = '#eaecf0'); (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.04)') } }}
    >
      {/* Active indicator bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: isActive ? 3 : 0, background: accent, borderRadius: '12px 0 0 12px', transition: 'width .18s cubic-bezier(.16,1,.3,1)' }} />

      <div style={{ padding: '13px 16px 13px 20px', display: 'flex', gap: 13, alignItems: 'flex-start' }}>
        {/* Left: drag + index */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <Tooltip title="Kéo sắp xếp" placement="left">
            <div style={{ color: '#d1d5db', fontSize: 13, cursor: 'grab', lineHeight: 1, padding: '2px 1px' }} aria-hidden>
              <HolderOutlined />
            </div>
          </Tooltip>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: isActive ? accent : '#f1f5f9', color: isActive ? '#fff' : '#64748b', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
            {index + 1}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: question.title ? '#1e293b' : '#94a3b8', lineHeight: 1.45 }}>
            {question.title || 'Chưa có nội dung...'}
            {question.required && <span style={{ color: '#dc2626', marginLeft: 3 }} aria-label="bắt buộc">*</span>}
          </div>
          <AnswerPreview question={question} />
        </div>

        {/* Active badge */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 3, opacity: isActive ? 1 : 0, transition: 'opacity .12s' }} aria-hidden>
          <div style={{ fontSize: 12, color: accent, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', background: `${accent}12`, padding: '3px 7px', borderRadius: 20 }}>
            đang chỉnh
          </div>
        </div>
      </div>

      {/* Floating popup */}
      {isActive && popupOpen && (
        <FloatingPopup
          question={question} index={index} accent={accent} sections={sections}
          anchorEl={cardRef.current} onClose={handleClose}
          onUpdate={onUpdate} onAddOption={onAddOption}
          onUpdateOption={onUpdateOption} onRemoveOption={onRemoveOption}
        />
      )}
    </div>
  )
}
