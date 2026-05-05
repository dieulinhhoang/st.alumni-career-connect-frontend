import { useState, useRef, useEffect } from 'react'
import { Tooltip } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { Section } from '../../../../../feature/form/types'

interface SectionBarProps {
  section: Section
  accent: string
  sectionIndex: number
  canDelete: boolean
  isEmpty?: boolean
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
  onAddQuestion?: (sectionId: string) => void
}

export function SectionBar({
  section,
  accent,
  sectionIndex,
  canDelete,
  isEmpty = false,
  onRename,
  onDelete,
  onAddQuestion,
}: SectionBarProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(section.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  useEffect(() => {
    setDraft(section.title)
  }, [section.title])

  const commit = () => {
    setEditing(false)
    const trimmed = draft.trim() || `Phần ${sectionIndex + 1}`
    setDraft(trimmed)
    onRename(section.id, trimmed)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: '18px 0 10px',
        padding: '10px 14px',
        borderRadius: 10,
        background: `${accent}0c`,
        border: `1px dashed ${accent}40`,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          background: accent,
          color: '#fff',
          fontSize: 13,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {sectionIndex + 1}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit()
              if (e.key === 'Escape') {
                setDraft(section.title)
                setEditing(false)
              }
            }}
            style={{
              fontSize: 13,
              fontWeight: 700,
              border: 'none',
              borderBottom: `2px solid ${accent}`,
              outline: 'none',
              background: 'transparent',
              width: '100%',
              color: '#0f172a',
              padding: '0 0 2px',
            }}
          />
        ) : (
          <div
            onClick={() => setEditing(true)}
            title="Nhấn để đổi tên"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#0f172a',
              cursor: 'text',
            }}
          >
            {section.title}
          </div>
        )}
      </div>

      {isEmpty && onAddQuestion && (
        <Tooltip title="Thêm câu hỏi vào phần này" placement="top">
          <button
            onClick={() => onAddQuestion(section.id)}
            aria-label="Thêm câu hỏi vào phần này"
            style={{
              width: 28,
              height: 28,
              border: 'none',
              borderRadius: 7,
              background: `${accent}12`,
              color: accent,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              flexShrink: 0,
              transition: 'all .15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${accent}22`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${accent}12`
            }}
          >
            <PlusOutlined style={{ fontSize: 12 }} />
          </button>
        </Tooltip>
      )}

      {canDelete && (
        <Tooltip title="Bạn muốn xóa phần này?" placement="left">
          <button
            onClick={() => onDelete(section.id)}
            style={{
              width: 28,
              height: 28,
              border: 'none',
              borderRadius: 7,
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              flexShrink: 0,
              transition: 'all .15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee2e2'
              e.currentTarget.style.color = '#dc2626'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#94a3b8'
            }}
          >
            <DeleteOutlined />
          </button>
        </Tooltip>
      )}
    </div>
  )
}