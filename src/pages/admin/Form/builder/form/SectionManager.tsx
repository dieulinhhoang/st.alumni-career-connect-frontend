import { useState } from 'react'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import type { Section } from '../../../../../feature/form/types'

const ibs = (color?: string): React.CSSProperties => ({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: '3px 6px',
  borderRadius: 5,
  fontSize: 13,
  color: color ?? '#6b7280',
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: 'inherit',
})

interface SectionManagerProps {
  sections: Section[]
  accent: string
  onSectionsChange: (s: Section[]) => void
  onDeleteSection?: (id: string) => void
}

export function SectionManager({
  sections,
  accent,
  onSectionsChange,
  onDeleteSection,
}: SectionManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editVal, setEditVal] = useState('')

  const addSection = () => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now())

    const title = `Phần ${sections.length + 1}`

    onSectionsChange([
      ...sections,
      { id, title, order: sections.length },
    ])
    setEditingId(id)
    setEditVal(title)
  }

  const startEdit = (s: Section) => {
    setEditingId(s.id)
    setEditVal(s.title)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditVal('')
  }

  const commitEdit = (id: string) => {
    onSectionsChange(
      sections.map((s) =>
        s.id === id ? { ...s, title: editVal.trim() || s.title } : s
      )
    )
    cancelEdit()
  }

  const removeSection = (id: string) => {
    if (onDeleteSection) {
      onDeleteSection(id)
      return
    }

    onSectionsChange(
      sections
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, order: i }))
    )
  }

  return (
    <div style={{ padding: '10px 0 4px' }}>
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          color: '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '.07em',
          marginBottom: 8,
        }}
      >
        Các phần (Sections)
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sections.map((s, idx) => (
          <div
            key={s.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 7,
              border: `1px solid ${editingId === s.id ? accent : '#e5e7eb'}`,
              background: editingId === s.id ? `${accent}08` : '#fafafa',
            }}
          >
            <span style={{ fontSize: 11, color: '#9ca3af', minWidth: 18 }}>
              {idx + 1}.
            </span>

            {editingId === s.id ? (
              <input
                autoFocus
                value={editVal}
                onChange={(e) => setEditVal(e.target.value)}
                onBlur={() => commitEdit(s.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit(s.id)
                  if (e.key === 'Escape') cancelEdit()
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  color: '#111827',
                }}
              />
            ) : (
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: '#111827',
                  fontWeight: 500,
                }}
              >
                {s.title}
              </span>
            )}

            {editingId === s.id ? (
              <>
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => commitEdit(s.id)} style={ibs(accent)}>
                  <CheckOutlined />
                </button>
                <button onMouseDown={(e) => e.preventDefault()} onClick={cancelEdit} style={ibs()}>
                  <CloseOutlined />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => startEdit(s)} style={ibs()} aria-label={`Sửa ${s.title}`}>
                  <EditOutlined />
                </button>
                {sections.length > 1 && (
                  <button
                    onClick={() => removeSection(s.id)}
                    style={ibs('#dc2626')}
                    aria-label={`Xóa ${s.title}`}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <DeleteOutlined />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addSection}
        style={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          border: `1.5px dashed ${accent}60`,
          borderRadius: 7,
          background: 'transparent',
          color: accent,
          cursor: 'pointer',
          fontSize: 12.5,
          fontWeight: 600,
          fontFamily: 'inherit',
          width: '100%',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = `${accent}10`)}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <PlusOutlined /> Thêm phần mới
      </button>
    </div>
  )
}