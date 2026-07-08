import logoVnua from '../../../../../assets/logoVnua.jpg'
import type { SurveyHeader as SurveyHeaderType } from '../../../../../feature/form/types'
import { LogoUpload } from './LogoUpload'
import { InlineInput } from '../shared/InlineInput'

/** Bố cục header — themeId của form */
export type HeaderLayout = 'classic' | 'centered' | 'right'

interface SurveyHeaderProps {
  header: SurveyHeaderType
  editable: boolean
  logoUrl?: string
  logoSize: number
  isMobile: boolean
  isSmall: boolean
  isMedium: boolean
  today: string
  layout?: HeaderLayout
  onHeaderChange?: (h: SurveyHeaderType) => void
}

export function SurveyHeader({
  header,
  editable,
  logoUrl,
  logoSize,
  isMobile,
  isSmall,
  isMedium,
  today,
  layout = 'classic',
  onHeaderChange,
}: SurveyHeaderProps) {
  const update = (key: keyof SurveyHeaderType, value: string | boolean) =>
    onHeaderChange?.({ ...header, [key]: value })

  const effectiveSize = isSmall ? 72 : isMedium ? 100 : logoSize
  const logoSrc =
    logoUrl ||
    header.logoUrl ||
    logoVnua

  const ministryText = header.ministry?.trim() || (editable ? '' : 'Bộ/ngành')
  const academyText = header.academy?.trim() || (editable ? '' : 'Học viện / Trường')

  // Bố cục theo layout — mobile luôn ép về dạng dọc, căn giữa
  const isCentered = layout === 'centered' || isMobile
  const flexDir: React.CSSProperties['flexDirection'] =
    isCentered ? 'column' : layout === 'right' ? 'row-reverse' : 'row'
  const align: React.CSSProperties['textAlign'] =
    isCentered ? 'center' : layout === 'right' ? 'left' : 'right'
  const fullWidth = isCentered

  return (
    <div
      style={{
        background: '#fff',
        padding: `${isSmall ? 24 : 48}px ${isSmall ? 14 : 20}px ${isSmall ? 16 : 24}px`,
      }}
    >
      {header.showDate !== false && (
        <div
          style={{
            textAlign: 'right',
            fontSize: 13,
            color: '#374151',
            marginBottom: 14,
            fontStyle: 'italic',
          }}
        >
          Ngày {today}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: flexDir,
          alignItems: 'center',
          gap: isMobile ? 14 : 20,
        }}
      >
        <div style={{ width: fullWidth ? '100%' : '41.666%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
          <LogoUpload
            src={logoSrc}
            size={effectiveSize}
            editable={editable}
            onUpload={(dataUrl) => update('logoUrl', dataUrl)}
          />
        </div>

        <div style={{ width: fullWidth ? '100%' : '58.333%', minWidth: 0 }}>
          {editable ? (
            <>
              <InlineInput
                value={header.ministry}
                onChange={(v) => update('ministry', v)}
                placeholder="Bộ/ngành"
                style={{
                  fontSize: isSmall ? 11 : 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  textAlign: align,
                  color: '#64748b',
                }}
              />
              <InlineInput
                value={header.academy}
                onChange={(v) => update('academy', v)}
                placeholder="Học viện / Trường"
                style={{
                  fontSize: isSmall ? 14 : 16,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  margin: '4px 0',
                  textAlign: align,
                  color: '#0f172a',
                }}
              />
              <InlineInput
                value={header.address}
                onChange={(v) => update('address', v)}
                placeholder="Địa chỉ"
                style={{
                  fontSize: isSmall ? 11 : 12,
                  textAlign: align,
                  color: '#64748b',
                }}
              />
              <InlineInput
                value={header.phone}
                onChange={(v) => update('phone', v)}
                placeholder="Điện thoại"
                style={{
                  fontSize: isSmall ? 11 : 12,
                  textAlign: align,
                  color: '#64748b',
                }}
              />
              {/* <InlineInput
                value={header.fax ?? ''}
                onChange={(v) => update('fax', v)}
                placeholder="Fax"
                style={{
                  fontSize: isSmall ? 11 : 12,
                  textAlign: align,
                  color: '#64748b',
                  marginTop: 4,
                }}
              /> */}
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: isSmall ? 11 : 12,
                  fontWeight: 600,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  textAlign: align,
                }}
                
              >
                {ministryText}
              </div>
              <div
                style={{
                  fontSize: isSmall ? 14 : 16,
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  margin: '4px 0',
                  textAlign: align,
                }}
              >
                {academyText}
              </div>
              <div
                style={{
                  fontSize: isSmall ? 11 : 12,
                  color: '#64748b',
                  fontStyle: 'italic',
                  textAlign: align,
                }}
              >
                {header.address}
                {header.phone && (
                  <>
                    <br />
                    {header.phone}
                  </>
                )}
                {header.fax && <> — Fax: {header.fax}</>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}