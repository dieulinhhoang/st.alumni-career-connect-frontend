import { useState, useEffect } from 'react'
import type { Form, Question, Section } from '../../../feature/form/types'

//  Utility 

function todayLabel() {
  const d = new Date()
  return `Ngày ${String(d.getDate()).padStart(2, '0')} / ${String(d.getMonth() + 1).padStart(2, '0')} / ${d.getFullYear()}`
}

function getAccent(themeId?: string): string {
  if (!themeId) return '#8b5cf6'
  if (themeId.startsWith('#')) return themeId
  // Mirror THEMES lookup — fallback to purple
  const map: Record<string, string> = {
    academic: '#8b5cf6', modern: '#2563eb', nature: '#16a34a',
    sunset: '#ea580c', ocean: '#0d9488', rose: '#e11d48',
    slate: '#475569', midnight: '#4338ca',
  }
  return map[themeId] ?? '#8b5cf6'
}

//  Shared input style 

const baseInput: React.CSSProperties = {
  width: '100%',
  padding: '9px 13px',
  borderRadius: 7,
  border: '1px solid #e9e4f0',
  fontSize: 14,
  color: '#1f1b2e',
  background: '#fff',
  fontFamily: 'inherit',
  outline: 'none',
  lineHeight: 1.55,
  boxSizing: 'border-box',
  transition: 'border-color .13s, box-shadow .13s',
}

function onFocusIn(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, accent: string) {
  e.target.style.borderColor = accent
  e.target.style.boxShadow = `0 0 0 3px ${accent}22`
}
function onFocusOut(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = '#e9e4f0'
  e.target.style.boxShadow = 'none'
}

//  Question label 

function QLabel({ num, title, required, multi }: {
  num: number; title: string; required?: boolean; multi?: boolean
}) {
  return (
    <div style={{
      fontSize: 14, fontWeight: 600, color: '#1f1b2e',
      marginBottom: 10, lineHeight: 1.6,
    }}>
      <span style={{ marginRight: 5 }}>{num}.</span>
      <span>{title}</span>
      {multi && (
        <span style={{ fontWeight: 400, color: '#6b638c', marginLeft: 5, fontSize: 13 }}>
          (Có thể chọn nhiều lựa chọn)
        </span>
      )}
      {required && <span style={{ color: '#e87979', marginLeft: 3 }}>*</span>}
    </div>
  )
}

//  Field renderers 

function ShortField({ placeholder, accent }: { placeholder?: string; accent: string }) {
  return (
    <input
      type="text"
      placeholder={placeholder ?? 'Câu trả lời của bạn'}
      style={baseInput}
      onFocus={e => onFocusIn(e, accent)}
      onBlur={onFocusOut}
    />
  )
}

function LongField({ accent }: { accent: string }) {
  return (
    <textarea
      placeholder="Câu trả lời của bạn"
      rows={4}
      style={{ ...baseInput, resize: 'vertical' } as React.CSSProperties}
      onFocus={e => onFocusIn(e, accent)}
      onBlur={onFocusOut}
    />
  )
}

function EmailField({ accent }: { accent: string }) {
  return (
    <input type="email" placeholder="Nhập email" style={baseInput}
      onFocus={e => onFocusIn(e, accent)} onBlur={onFocusOut} />
  )
}

function TelField({ accent }: { accent: string }) {
  return (
    <input type="tel" placeholder="Nhập số điện thoại" style={baseInput}
      onFocus={e => onFocusIn(e, accent)} onBlur={onFocusOut} />
  )
}

function DateField({ accent }: { accent: string }) {
  return (
    <input type="date" style={{ ...baseInput, cursor: 'pointer' }}
      onFocus={e => onFocusIn(e, accent)} onBlur={onFocusOut} />
  )
}

function AddressField({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <input type="text" placeholder="Địa chỉ" style={baseInput}
        onFocus={e => onFocusIn(e, accent)} onBlur={onFocusOut} />
      <input type="text" placeholder="Tỉnh / Thành phố" style={baseInput}
        onFocus={e => onFocusIn(e, accent)} onBlur={onFocusOut} />
    </div>
  )
}

function RadioField({ options, qId, accent }: { options: string[]; qId: string; accent: string }) {
  const [val, setVal] = useState<number | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map((opt, i) => (
        <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
          <input
            type="radio"
            name={qId}
            checked={val === i}
            onChange={() => setVal(i)}
            style={{ marginTop: 3, accentColor: accent, cursor: 'pointer', flexShrink: 0 }}
          />
          <span style={{ fontSize: 14, color: '#3c3752', lineHeight: 1.55 }}>{opt}</span>
        </label>
      ))}
    </div>
  )
}

function CheckboxField({ options, accent }: { options: string[]; accent: string }) {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const toggle = (i: number) => setChecked(prev => {
    const next = new Set(prev)
    next.has(i) ? next.delete(i) : next.add(i)
    return next
  })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map((opt, i) => (
        <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={checked.has(i)}
            onChange={() => toggle(i)}
            style={{ marginTop: 3, accentColor: accent, cursor: 'pointer', flexShrink: 0 }}
          />
          <span style={{ fontSize: 14, color: '#3c3752', lineHeight: 1.55 }}>{opt}</span>
        </label>
      ))}
    </div>
  )
}

function SelectField({ options, accent }: { options: string[]; accent: string }) {
  return (
    <select
      style={{ ...baseInput, cursor: 'pointer' } as React.CSSProperties}
      onFocus={e => onFocusIn(e, accent)}
      onBlur={onFocusOut}
    >
      <option value="">-- Chọn --</option>
      {options.map((o, i) => <option key={i} value={o}>{o}</option>)}
    </select>
  )
}

//  Single question 

function QuestionItem({ q, num, accent }: { q: Question; num: number; accent: string }) {
  const opts = (q.options ?? []) as string[]
  const isMulti = q.type === 'checkbox'

  const renderInput = () => {
    switch (q.type) {
      case 'short':    return <ShortField placeholder={q.placeholder} accent={accent} />
      case 'long':     return <LongField accent={accent} />
      case 'email':    return <EmailField accent={accent} />
      case 'tel':      return <TelField accent={accent} />
      case 'date':     return <DateField accent={accent} />
      case 'address':  return <AddressField accent={accent} />
      case 'radio':    return <RadioField options={opts} qId={q.id} accent={accent} />
      case 'checkbox': return <CheckboxField options={opts} accent={accent} />
      case 'select':   return <SelectField options={opts} accent={accent} />
      default:         return <ShortField accent={accent} />
    }
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <QLabel num={num} title={q.title} required={q.required} multi={isMulti} />
      {renderInput()}
    </div>
  )
}

//  Section header 

function SectionHeader({ title, accent }: { title: string; accent: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      margin: '32px 0 20px',
      paddingBottom: 10,
      borderBottom: `2px solid ${accent}33`,
    }}>
      <div style={{ width: 4, height: 22, borderRadius: 2, background: accent, flexShrink: 0 }} />
      <span style={{ fontSize: 13.5, fontWeight: 800, color: '#1f1b2e', letterSpacing: '-.01em' }}>
        {title}
      </span>
    </div>
  )
}

//  Map form → render data 

function mapForm(form: Form) {
  const sections: Section[] =
    (form as any).sections?.length > 0
      ? (form as any).sections
      : [{ id: 'default-section', title: 'Nội dung khảo sát', order: 0 }]

  const defaultSectionId = sections[0].id
  const typeMap: Record<string, Question['type']> = {
    short: 'short', long: 'long', radio: 'radio', checkbox: 'checkbox',
    dropdown: 'select', select: 'select', date: 'date',
    address: 'address', email: 'email', tel: 'tel',
  }

  let order = 0
  const questions: Question[] = form.questions.map((q: any) => ({
    id: q.id,
    type: typeMap[q.type] ?? 'short',
    title: q.title,
    placeholder: q.placeholder ?? (q.type === 'short' ? 'Câu trả lời của bạn' : undefined),
    options: q.options?.map((o: any) => (typeof o === 'string' ? o : o.label)),
    required: q.required,
    sectionId: q.sectionId ?? defaultSectionId,
    order: order++,
  }))

  const header = {
    logoUrl:  (form as any).logoUrl   ?? 'https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png',
    ministry: (form as any).header?.ministry ?? 'BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG',
    academy:  (form as any).header?.academy  ?? 'HỌC VIỆN NÔNG NGHIỆP VIỆT NAM',
    address:  (form as any).header?.address  ?? 'Xã Gia Lâm, Thành phố Hà Nội',
    phone:    (form as any).header?.phone    ?? '024.62617586',
  }

  const footer = {
    primaryText:   (form as any).footer?.primaryText   ?? 'Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!',
    secondaryText: (form as any).footer?.secondaryText ?? 'Kính chúc Anh/Chị sức khỏe và thành công!',
  }

  const descParagraphs: string[] = form.description
    ? form.description.split('\n').filter(Boolean)
    : []

  return { sections, questions, header, footer, descParagraphs }
}

//  SurveyPreview 

interface SurveyPreviewProps {
  form: Form | null
  onBack?: () => void
}

export  function SurveyPreview({ form, onBack }: SurveyPreviewProps) {
  // Inject DM Sans font if not already loaded
  useEffect(() => {
    const id = 'dm-sans-font'
    if (!document.getElementById(id)) {
      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap'
      document.head.appendChild(link)
    }
  }, [])
  if (!form) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh', color: '#9ca3af', gap: 12,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ fontSize: 13, fontWeight: 500 }}>Chưa có nội dung xem trước</span>
    </div>
  )

  const accent = getAccent(form.themeId)
  const { sections, questions, header, footer, descParagraphs } = mapForm(form)

  // Group questions by section, preserve order
  const bySection = sections
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(sec => ({
      section: sec,
      qs: questions
        .filter(q => q.sectionId === sec.id)
        .sort((a, b) => a.order - b.order),
    }))
    .filter(g => g.qs.length > 0)

  const showSectionHeaders = bySection.length > 1

  // Global question counter
  let num = 0

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f2fa',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/*  Sticky top bar  */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: '#fff', borderBottom: '1px solid #e9e4f0',
        height: 50, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 20px',
        boxShadow: '0 1px 3px rgba(31,27,46,.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9ca3af' }}>
            Xem trước
          </span>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: `linear-gradient(135deg, ${accent} 0%, #a78bfa 100%)`,
          color: '#fff', padding: '5px 14px', borderRadius: 20,
          fontSize: 11.5, fontWeight: 700, letterSpacing: '.05em',
          boxShadow: `0 4px 14px ${accent}55`,
        }}>
           CHẾ ĐỘ XEM TRƯỚC
        </div>
      </div>

      {/*  Form card  */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px 80px' }}>
        <div style={{
          background: '#fff', borderRadius: 16,
          boxShadow: '0 6px 28px rgba(31,27,46,.09), 0 2px 6px rgba(31,27,46,.04)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '36px 52px 44px' }}>

            {/* Institutional header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 24,
              marginBottom: 28, paddingBottom: 24,
            }}>
              <img
                src={header.logoUrl}
                alt="Logo"
                style={{ width: 110, height: 110, objectFit: 'contain', flexShrink: 0 }}
              />
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontStyle: 'italic', color: '#6b638c', marginBottom: 8 }}>
                  {todayLabel()}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, textTransform: 'uppercase', color: '#1f1b2e', letterSpacing: '.04em', marginBottom: 4 }}>
                  {header.ministry}
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: '#1f1b2e', letterSpacing: '.03em', marginBottom: 8 }}>
                  {header.academy}
                </div>
                <div style={{ fontSize: 12, fontStyle: 'italic', color: '#6b638c', lineHeight: 1.7 }}>
                  <div>{header.address}</div>
                  <div>Điện thoại: {header.phone} – Fax: {header.phone}</div>
                </div>
              </div>
            </div>

            {/* Survey title */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h2 style={{
                fontSize: 20, fontWeight: 800, color: '#1f1b2e',
                letterSpacing: '-.01em', lineHeight: 1.5, margin: 0,
                textTransform: 'uppercase',
              }}>
                {form.name}
              </h2>
            </div>

            {/* Description — plain, no box */}
            {descParagraphs.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 15, fontStyle: 'italic', fontWeight: 700, color: '#1f1b2e', lineHeight: 1.8, marginBottom: 12 }}>
                  Thân gửi Anh/Chị cựu sinh viên của {header.academy}!
                </p>
                {descParagraphs.map((p, i) => (
                  <p key={i} style={{ fontSize: 15, fontStyle: 'italic', color: '#1f1b2e', lineHeight: 1.85, textIndent: 36, marginBottom: 10 }}>
                    {p}
                  </p>
                ))}
                <p style={{ fontSize: 14.5, fontStyle: 'italic', color: '#3c3752', marginTop: 10 }}>
                  Trân trọng cảm ơn sự cộng tác của các Anh/Chị!
                </p>
              </div>
            )}

            {/* Questions */}
            {bySection.map(({ section, qs }) => (
              <div key={section.id}>
                {showSectionHeaders && (
                  <SectionHeader title={section.title} accent={accent} />
                )}
                {qs.map(q => {
                  num++
                  return <QuestionItem key={q.id} q={q} num={num} accent={accent} />
                })}
              </div>
            ))}

            {/* Footer */}
            <div style={{ textAlign: 'center', padding: '28px 0 20px', marginTop: 16, borderTop: '1px solid #e9e4f0' }}>
              <p style={{ fontWeight: 700, color: '#1f1b2e', marginBottom: 5, fontSize: 14 }}>
                {footer.primaryText}
              </p>
              <p style={{ fontStyle: 'italic', color: '#6b638c', fontSize: 13 }}>
                {footer.secondaryText}
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              {onBack && (
                <button onClick={onBack} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  height: 38, padding: '0 18px', borderRadius: 8,
                  border: '1px solid #e9e4f0', background: '#fff', color: '#3c3752',
                  fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 2px 8px rgba(31,27,46,.06)',
                }}>
                  ← Quay lại
                </button>
              )}
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                height: 38, padding: '0 22px', borderRadius: 8,
                border: 'none', background: accent, color: '#fff',
                fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: `0 4px 16px ${accent}55`, transition: 'opacity .13s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                ✉ Gửi
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}