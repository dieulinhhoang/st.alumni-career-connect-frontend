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
  const [hovered, setHovered] = useState(false)
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
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '32px 0 20px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
        <span
          onClick={() => setEditing(true)}
          title="Nhấn để đổi tên"
          style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', cursor: 'text', letterSpacing: '-0.01em' }}
        >
          {section.title}
        </span>
      )}

      {/* Nút chỉ hiện khi hover */}
      {hovered && !editing && (
        <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
          {isEmpty && onAddQuestion && (
            <Tooltip title="Thêm câu hỏi vào phần này" placement="top">
              <Button size="small" icon={<PlusOutlined />} onClick={() => onAddQuestion(section.id)} />
            </Tooltip>
          )}
          {canDelete && (
            <Tooltip title="Xóa phần này" placement="top">
              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(section.id)} />
            </Tooltip>
          )}
        </div>
      )}
    </div>
  )
}
