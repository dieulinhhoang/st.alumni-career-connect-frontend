import { useState, useRef, useEffect, useCallback } from 'react'
import { Button, Typography } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

const { Text } = Typography

interface FloatingEditPopupProps {
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
  title: string
  icon: string
  accent: string
  children: React.ReactNode
  width?: number
}

export function FloatingEditPopup({ open, anchorEl, onClose, title, icon, accent, children, width = 340 }: FloatingEditPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const [visible, setVisible] = useState(false)

  const calcPos = useCallback(() => {
    if (!anchorEl || !popupRef.current) return
    const anchor = anchorEl.getBoundingClientRect()
    const popup = popupRef.current.getBoundingClientRect()
    const vw = window.innerWidth, vh = window.innerHeight
    let top = anchor.bottom + 8
    let left = anchor.left + anchor.width / 2 - width / 2
    left = Math.max(12, Math.min(left, vw - width - 12))
    if (top + popup.height > vh - 12) top = anchor.top - popup.height - 8
    setPos({ top: Math.max(12, top), left })
    setVisible(true)
  }, [anchorEl, width])

  useEffect(() => { if (!open) { setVisible(false); return }; const t = setTimeout(calcPos, 10); return () => clearTimeout(t) }, [open, calcPos])
  useEffect(() => { if (!open) return; window.addEventListener('resize', calcPos); return () => window.removeEventListener('resize', calcPos) }, [open, calcPos])
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node) && anchorEl && !anchorEl.contains(e.target as Node)) onClose()
    }
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 80)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handler) }
  }, [open, anchorEl, onClose])

  if (!open) return null
  return (
    <div
      ref={popupRef}
      style={{
        position: 'fixed', top: pos.top, left: pos.left, width, zIndex: 1200,
        background: '#fff', borderRadius: 14,
        boxShadow: `0 0 0 1px rgba(0,0,0,.07), 0 8px 32px rgba(0,0,0,.13), 0 4px 10px ${accent}18`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(.96) translateY(-8px)',
        transition: 'opacity .18s cubic-bezier(.16,1,.3,1), transform .18s cubic-bezier(.16,1,.3,1)',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 9px', borderBottom: '1px solid #f0f2f5', background: `linear-gradient(135deg, ${accent}0a, transparent)` }}>
        <Text strong style={{ fontSize: 12, color: '#1e293b' }}>{title}</Text>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={onClose}
          danger
          style={{ width: 24, height: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        />
      </div>
      <div style={{ padding: '14px 14px 16px', maxHeight: '65vh', overflowY: 'auto' }}>{children}</div>
    </div>
  )
}
