import { Tooltip } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

const THEMES = [
  { key: 'blue',    label: 'Blue',    color: '#2563eb' },
  { key: 'teal',    label: 'Teal',    color: '#0d9488' },
  { key: 'violet',  label: 'Violet',  color: '#7c3aed' },
  { key: 'rose',    label: 'Rose',    color: '#e11d48' },
  { key: 'amber',   label: 'Amber',   color: '#d97706' },
  { key: 'emerald', label: 'Emerald', color: '#059669' },
  { key: 'sky',     label: 'Sky',     color: '#0284c7' },
  { key: 'pink',    label: 'Pink',    color: '#db2777' },
  { key: 'indigo',  label: 'Indigo',  color: '#4f46e5' },
  { key: 'orange',  label: 'Orange',  color: '#ea580c' },
  { key: 'slate',   label: 'Slate',   color: '#475569' },
  { key: 'fuchsia', label: 'Fuchsia', color: '#a21caf' },
]

const LOGO_SIZES = [72, 88, 104, 120, 140, 160]

interface ThemePanelProps {
  activeTheme: string
  accent: string
  logoSize: number
  onThemeChange: (key: string, color: string) => void
  onLogoSizeChange: (size: number) => void
}

export function ThemePanel({ activeTheme, accent, logoSize, onThemeChange, onLogoSizeChange }: ThemePanelProps) {
  return (
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Color themes */}
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Màu chủ đề</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {THEMES.map((t) => {
            const isActive = activeTheme === t.key
            return (
              <Tooltip key={t.key} title={t.label} placement="top">
                <button onClick={() => onThemeChange(t.key, t.color)}
                  aria-label={`Chủ đề ${t.label}${isActive ? ' (đang dùng)' : ''}`}
                  aria-pressed={isActive}
                  style={{ height: 44, borderRadius: 10, border: isActive ? `2.5px solid ${t.color}` : '2px solid transparent', background: `${t.color}18`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', outline: 'none', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.border = `2px solid ${t.color}80` }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.border = '2px solid transparent' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isActive && <CheckOutlined style={{ color: '#fff', fontSize: 11 }} />}
                  </div>
                </button>
              </Tooltip>
            )
          })}
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: accent, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{THEMES.find((t) => t.key === activeTheme)?.label ?? 'Custom'}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{accent}</div>
          </div>
        </div>
      </div>

      {/* Logo size */}
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Kích thước logo</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {LOGO_SIZES.map((sz) => (
            <button key={sz} onClick={() => onLogoSizeChange(sz)}
              aria-label={`Logo ${sz}px${logoSize === sz ? ' (đang dùng)' : ''}`}
              aria-pressed={logoSize === sz}
              style={{ height: 36, borderRadius: 8, border: logoSize === sz ? `2px solid ${accent}` : '1.5px solid #e5e7eb', background: logoSize === sz ? `${accent}10` : '#fff', color: logoSize === sz ? accent : '#6b7280', fontSize: 12, fontWeight: logoSize === sz ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .13s' }}>
              {sz}px
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
