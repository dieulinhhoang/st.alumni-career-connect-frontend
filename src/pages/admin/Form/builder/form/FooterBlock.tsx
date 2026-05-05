import { useEffect, useState, useRef } from 'react'
import type { SurveyFooter } from '../../../../../feature/form/types'
import { RichTextDisplay } from '../shared/RichTextDisplay'
import { ClickToEditBlock } from '../shared/ClickToEditBlock'
import { FloatingEditPopup } from '../shared/FloatingEditPopup'

interface FooterBlockProps {
  footer?: SurveyFooter
  accent: string
  editable: boolean
  onFooterChange?: (f: SurveyFooter) => void
}

export function FooterBlock({ footer, accent, editable, onFooterChange }: FooterBlockProps) {
  const [popupOpen, setPopupOpen] = useState(false)
  const [primaryDraft, setPrimaryDraft] = useState(footer?.primaryText ?? '')
  const [secondaryDraft, setSecondaryDraft] = useState(footer?.secondaryText ?? '')
  const blockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPrimaryDraft(footer?.primaryText ?? '')
    setSecondaryDraft(footer?.secondaryText ?? '')
  }, [footer?.primaryText, footer?.secondaryText])

  const hasContent = Boolean(
    footer?.primaryText?.trim() || footer?.secondaryText?.trim()
  )

  const taStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'none',
    lineHeight: 1.6,
    boxSizing: 'border-box',
    background: '#fafafa',
  }

  const renderTextarea = (val: string, setter: (v: string) => void, placeholder: string) => (
    <textarea
      value={val}
      onChange={(e) => setter(e.target.value)}
      rows={2}
      placeholder={placeholder}
      style={taStyle}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = accent
        e.currentTarget.style.background = '#fff'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0'
        e.currentTarget.style.background = '#fafafa'
      }}
    />
  )

  return (
    <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '28px 24px 40px' }}>
      {editable && onFooterChange ? (
        <>
          <div ref={blockRef}>
            <ClickToEditBlock
              accent={accent}
              label="Sửa footer"
              isEmpty={!hasContent}
              emptyLabel="Nhấn thêm lời cảm ơn"
              onClick={() => setPopupOpen(true)}
            >
              <div style={{ textAlign: 'center' }}>
                {footer?.primaryText && (
                  <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14, color: '#0f172a' }}>
                    <RichTextDisplay text={footer.primaryText} />
                  </div>
                )}
                {footer?.secondaryText && (
                  <div style={{ fontStyle: 'italic', color: '#64748b', fontSize: 13.5 }}>
                    <RichTextDisplay text={footer.secondaryText} />
                  </div>
                )}
              </div>
            </ClickToEditBlock>
          </div>

          <FloatingEditPopup
            open={popupOpen}
            anchorEl={blockRef.current}
            onClose={() => setPopupOpen(false)}
            title="Chân trang Footer"
            icon="📄"
            accent={accent}
            width={360}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>
                  Dòng cảm ơn (in đậm)
                </div>
                {renderTextarea(primaryDraft, setPrimaryDraft, 'Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!')}
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>
                  Lời chúc (in nghiêng)
                </div>
                {renderTextarea(secondaryDraft, setSecondaryDraft, 'Kính chúc Anh/Chị sức khỏe và thành công!')}
              </div>

              {(primaryDraft.trim() || secondaryDraft.trim()) && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: `${accent}08`,
                    border: `1px solid ${accent}20`,
                    textAlign: 'center',
                  }}
                >
                  {primaryDraft.trim() && (
                    <div style={{ fontWeight: 700, marginBottom: secondaryDraft.trim() ? 4 : 0, fontSize: 13, color: '#0f172a' }}>
                      <RichTextDisplay text={primaryDraft} />
                    </div>
                  )}
                  {secondaryDraft.trim() && (
                    <div style={{ fontStyle: 'italic', color: '#64748b', fontSize: 12.5 }}>
                      <RichTextDisplay text={secondaryDraft} />
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button
                  onClick={() => setPopupOpen(false)}
                  style={{ height: 32, padding: '0 14px', border: '1px solid #e2e8f0', borderRadius: 7, background: '#fff', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: '#6b7280', fontFamily: 'inherit' }}
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    onFooterChange({
                      primaryText: primaryDraft,
                      secondaryText: secondaryDraft,
                    })
                    setPopupOpen(false)
                  }}
                  style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 7, background: accent, cursor: 'pointer', fontSize: 12.5, fontWeight: 700, color: '#fff', fontFamily: 'inherit' }}
                >
                  Lưu
                </button>
              </div>
            </div>
          </FloatingEditPopup>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          {footer?.primaryText && (
            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14, color: '#0f172a' }}>
              <RichTextDisplay text={footer.primaryText} />
            </div>
          )}
          {footer?.secondaryText && (
            <div style={{ fontStyle: 'italic', color: '#64748b', fontSize: 13.5 }}>
              <RichTextDisplay text={footer.secondaryText} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}