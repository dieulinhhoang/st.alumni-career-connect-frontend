/**
 * ThemePanel.tsx — Tab "Giao diện" trong RightPanel
 *
 * Chọn bố cục HEADER cho biểu mẫu (themeId của form):
 *   classic  → logo bên trái, thông tin căn phải (mặc định)
 *   centered → logo ở giữa, thông tin căn giữa bên dưới
 *   right    → logo bên phải, thông tin căn trái
 * Kèm slider chỉnh kích thước logo.
 * themeId được lưu cùng form (backend: theme_config.themeId).
 */

import { Slider } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import type { HeaderLayout } from '../form/SurveyHeader'

interface ThemePanelProps {
  themeId: string
  onThemeChange: (id: string) => void
  logoSize: number
  onLogoSizeChange: (size: number) => void
}

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: '#9ca3af',
  textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8,
}

// ─── Mini mockup từng bố cục ─────────────────────────────────────────────────

function MockLogo({ size = 16 }: { size?: number }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: '#16a34a', border: '2px solid #fbbf24', boxSizing: 'border-box',
    }} />
  )
}

function MockLines({ align }: { align: 'left' | 'right' | 'center' }) {
  const alignSelf = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
      {[26, 38, 20].map((w, i) => (
        <span key={i} style={{ width: w, height: 3, borderRadius: 2, background: i === 1 ? '#64748b' : '#cbd5e1', alignSelf }} />
      ))}
    </span>
  )
}

function LayoutMock({ layout }: { layout: HeaderLayout }) {
  if (layout === 'centered') {
    return (
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: '100%' }}>
        <MockLogo size={14} />
        <MockLines align="center" />
      </span>
    )
  }
  const items = [
    <MockLogo key="logo" />,
    <MockLines key="lines" align={layout === 'right' ? 'left' : 'right'} />,
  ]
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      {layout === 'right' ? items.reverse() : items}
    </span>
  )
}

// ─── Danh sách bố cục ────────────────────────────────────────────────────────

const LAYOUTS: { id: HeaderLayout; name: string; desc: string }[] = [
  { id: 'classic',  name: 'Giao diện 1', desc: 'Logo trái — thông tin căn phải' },
  { id: 'centered', name: 'Giao diện 2', desc: 'Logo giữa — thông tin căn giữa' },
  { id: 'right',    name: 'Giao diện 3', desc: 'Logo phải — thông tin căn trái' },
]

export function ThemePanel({ themeId, onThemeChange, logoSize, onLogoSizeChange }: ThemePanelProps) {
  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Giao diện</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
          Chọn bố cục header cho biểu mẫu
        </div>
      </div>

      {/* Layout cards */}
      <div>
        <div style={labelStyle}>Bố cục header</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LAYOUTS.map(l => {
            const active = l.id === themeId
            return (
              <button
                key={l.id}
                onClick={() => onThemeChange(l.id)}
                aria-pressed={active}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 8,
                  padding: '10px 11px', borderRadius: 10, cursor: 'pointer',
                  border: `1.5px solid ${active ? '#16a34a' : '#e5e7eb'}`,
                  background: active ? '#f0fdf4' : '#fff',
                  fontFamily: 'inherit', textAlign: 'left', width: '100%',
                  transition: 'border-color .12s, background .12s',
                }}
              >
                {/* Mockup */}
                <span style={{
                  display: 'flex', alignItems: 'center',
                  padding: '8px 10px', borderRadius: 7,
                  background: '#f8fafc', border: '1px solid #eef2f7',
                }}>
                  <LayoutMock layout={l.id} />
                </span>
                {/* Tên + mô tả */}
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {active && (
                    <span style={{
                      width: 15, height: 15, borderRadius: '50%', background: '#16a34a', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CheckOutlined style={{ fontSize: 8, color: '#fff' }} />
                    </span>
                  )}
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 12, fontWeight: active ? 700 : 600, color: '#1e293b' }}>
                      {l.name}
                    </span>
                    <span style={{ display: 'block', fontSize: 10.5, color: '#94a3b8' }}>
                      {l.desc}
                    </span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Logo size */}
      <div>
        <div style={labelStyle}>Kích thước logo</div>
        <Slider
          min={60} max={200} step={10}
          value={logoSize}
          onChange={onLogoSizeChange}
          tooltip={{ formatter: v => `${v}px` }}
        />
        <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>{logoSize}px</div>
      </div>

    </div>
  )
}
