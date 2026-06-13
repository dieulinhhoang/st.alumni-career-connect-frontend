import { useState } from 'react'

interface ClickToEditBlockProps {
  accent: string
  label: string
  isEmpty?: boolean
  emptyLabel?: string
  onClick: () => void
  children: React.ReactNode
}

export function ClickToEditBlock({ accent, label, isEmpty, emptyLabel = 'Nhấn thêm nội dung', onClick, children }: ClickToEditBlockProps) {
  const [hover, setHover] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', cursor: 'pointer', borderRadius: 10, border: hover ? `1.5px dashed ${accent}70` : '1.5px dashed transparent', padding: '10px 14px', transition: 'border-color .15s, background .15s', background: hover ? `${accent}05` : 'transparent', margin: '-10px -14px' }}>
      {isEmpty ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13, fontStyle: 'italic', padding: '8px 0' }}>
          <span style={{ fontSize: 16 }}>＋</span>{emptyLabel}
        </div>
      ) : children}
      {hover && (
        <div style={{ position: 'absolute', top: -1, right: -1, background: accent, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '.04em', padding: '3px 9px', borderRadius: '0 9px 0 8px', display: 'flex', alignItems: 'center', gap: 4, pointerEvents: 'none' }}>
          ✏️ {label}
        </div>
      )}
    </div>
  )
}
