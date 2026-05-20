import type { SurveyHeader as SurveyHeaderType } from '../../../../../feature/form/types'
import { LogoUpload } from './LogoUpload'
import { InlineInput } from '../shared/InlineInput'

interface SurveyHeaderProps {
  header: SurveyHeaderType
  editable: boolean
  logoUrl?: string
  logoSize: number
  isMobile: boolean
  isSmall: boolean
  isMedium: boolean
  today: string
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
  onHeaderChange,
}: SurveyHeaderProps) {
  const update = (key: keyof SurveyHeaderType, value: string | boolean) =>
    onHeaderChange?.({ ...header, [key]: value })

  const effectiveSize = isSmall ? 72 : isMedium ? 88 : logoSize
  const logoSrc =
    logoUrl ||
    header.logoUrl ||
    'https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png'

  const ministryText = header.ministry?.trim() || (editable ? '' : 'Bộ/ngành')
  const academyText = header.academy?.trim() || (editable ? '' : 'Học viện / Trường')

  return (
    <div
      style={{
        background: '#fff',
        padding: `${isSmall ? 16 : 24}px ${isSmall ? 14 : 20}px`,
      }}
    >
      {header.showDate !== false && (
        <div
          style={{
            textAlign: 'right',
            fontSize: 12,
            color: '#94a3b8',
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
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: isMobile ? 14 : 20,
        }}
      >
        <LogoUpload
          src={logoSrc}
          size={effectiveSize}
          editable={editable}
          onUpload={(dataUrl) => update('logoUrl', dataUrl)}
        />

        <div style={{ flex: 1, minWidth: 0, width: isMobile ? '100%' : undefined }}>
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
                  textAlign: isMobile ? 'center' : 'right',
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
                  textAlign: isMobile ? 'center' : 'right',
                  color: '#0f172a',
                }}
              />
              <InlineInput
                value={header.address}
                onChange={(v) => update('address', v)}
                placeholder="Địa chỉ"
                style={{
                  fontSize: isSmall ? 11 : 12,
                  textAlign: isMobile ? 'center' : 'right',
                  color: '#64748b',
                }}
              />
              <InlineInput
                value={header.phone}
                onChange={(v) => update('phone', v)}
                placeholder="Điện thoại"
                style={{
                  fontSize: isSmall ? 11 : 12,
                  textAlign: isMobile ? 'center' : 'right',
                  color: '#64748b',
                }}
              />
              {/* <InlineInput
                value={header.fax ?? ''}
                onChange={(v) => update('fax', v)}
                placeholder="Fax"
                style={{
                  fontSize: isSmall ? 11 : 12,
                  textAlign: isMobile ? 'center' : 'right',
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
                  textAlign: isMobile ? 'center' : 'right',
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
                  textAlign: isMobile ? 'center' : 'right',
                }}
              >
                {academyText}
              </div>
              <div
                style={{
                  fontSize: isSmall ? 11 : 12,
                  color: '#64748b',
                  fontStyle: 'italic',
                  textAlign: isMobile ? 'center' : 'right',
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