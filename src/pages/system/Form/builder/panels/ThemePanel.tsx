import { BgColorsOutlined } from '@ant-design/icons'

interface ThemePanelProps {
  logoSize: number
  onLogoSizeChange: (size: number) => void
}

export function ThemePanel(_props: ThemePanelProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 24,
      color: '#d1d5db',
      textAlign: 'center',
      minHeight: 200,
    }}>
      <BgColorsOutlined style={{ fontSize: 32, color: '#e5e7eb' }} />
      <div style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6 }}>
        Tính năng tùy chỉnh giao diện<br />đang được phát triển
      </div>
    </div>
  )
}