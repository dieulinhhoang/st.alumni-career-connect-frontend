import { useState, useRef, useEffect } from 'react'
import { Tooltip, Button, Input } from 'antd'
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
  section, accent, sectionIndex, canDelete, isEmpty = false,
  onRename, onDelete, onAddQuestion,
}: SectionBarProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(section.title)
  const inputRef = useRef<any>(null)

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
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: 12, margin: '22px 0 14px', borderBottom: '1px solid #e5e7eb',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '0 0 10px', borderBottom: `2px solid ${accent}`,
        transform: 'translateY(1px)', minWidth: 0, maxWidth: '100%',
      }}>
        <span style={{
          fontSize: 12, fontWeight: 700, color: '#64748b',
          letterSpacing: '0.04em', textTransform: 'uppercase',
          fontVariantNumeric: 'tabular-nums', flexShrink: 0,
        }}>
          {String(sectionIndex + 1).padStart(2, '0')}
        </span>

        {editing ? (
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit()
              if (e.key === 'Escape') { setDraft(section.title); setEditing(false) }
            }}
            style={{ minWidth: 120, maxWidth: 320, fontSize: 16, fontWeight: 700, padding: '0 4px', height: 'auto' }}
            variant="borderless"
          />
        ) : (
          <div
            onClick={() => setEditing(true)}
            title="Nhấn để đổi tên"
            style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', cursor: 'text', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {section.title}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 6, flexShrink: 0 }}>
        {isEmpty && onAddQuestion && (
          <Tooltip title="Thêm câu hỏi vào phần này" placement="top">
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => onAddQuestion(section.id)}
            />
          </Tooltip>
        )}
        {canDelete && (
          <Tooltip title="Xóa phần này" placement="top">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(section.id)}
            />
          </Tooltip>
        )}
      </div>
    </div>
  )
}
