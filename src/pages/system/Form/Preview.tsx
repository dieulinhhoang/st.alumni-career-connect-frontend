import { useState, useEffect, useCallback } from 'react'
import type { Form, Question, Section } from '../../../feature/form/types'
import { groupByRow } from '../../../feature/form/hooks/Useformutils'


//  Utility 


function formatDate(dateStr?: string | null) {
  const d = dateStr ? new Date(dateStr) : null
  if (!d || isNaN(d.getTime())) return ''
  return `Ngày ${String(d.getDate()).padStart(2, '0')} / ${String(d.getMonth() + 1).padStart(2, '0')} / ${d.getFullYear()}`
}


//  Design tokens 
const C = {
  text:        '#111827',
  sub:         '#6b7280',
  muted:       '#9ca3af',
  border:      '#e5e7eb',
  bg:          '#f9fafb',
  surface:     '#ffffff',
  accent:      '#16a34a',
  accentHover: '#15803d',
  accentBg:    '#f0fdf4',
  accentBorder:'#bbf7d0',
  danger:      '#dc2626',
  dangerBg:    '#fef2f2',
}


const baseInput: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 6,
  border: `1px solid ${C.border}`,
  fontSize: 14,
  color: C.text,
  background: C.surface,
  fontFamily: 'inherit',
  outline: 'none',
  lineHeight: 1.55,
  boxSizing: 'border-box',
  transition: 'border-color .12s, box-shadow .12s',
}


const errorBorder: React.CSSProperties = {
  borderColor: C.danger,
  boxShadow: `0 0 0 3px ${C.danger}18`,
}


function applyFocus(e: React.FocusEvent<HTMLElement>) {
  const el = e.target as HTMLElement
  el.style.borderColor = '#6b7280'
  el.style.boxShadow = '0 0 0 3px rgba(107,114,128,0.12)'
}


function removeFocus(e: React.FocusEvent<HTMLElement>) {
  const el = e.target as HTMLElement
  el.style.borderColor = C.border
  el.style.boxShadow = 'none'
}


function QLabel({ num, title, required, multi }: {
  num: number; title: string; required?: boolean; multi?: boolean
}) {
  return (
    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10, lineHeight: 1.6 }}>
      <span style={{ marginRight: 5 }}>{num}.</span>
      <span>{title}</span>

      {required && <span style={{ color: C.danger, marginLeft: 3 }}>*</span>}
    </div>
  )
}


function ErrorHint({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <div style={{ fontSize: 14, color: C.danger, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
      <span>⚠</span> {msg}
    </div>
  )
}


interface FieldProps {
  hasError?: boolean
  readOnly?: boolean
}


function textField({ placeholder, value, onChange, hasError, readOnly }: FieldProps & {
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <input
      type="text"
      readOnly={readOnly}
      placeholder={placeholder ?? 'Câu trả lời của bạn'}
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      style={{ ...baseInput, ...(hasError ? errorBorder : {}) }}
      onFocus={applyFocus}
      onBlur={removeFocus}
    />
  )
}


function LongField({ value, onChange, hasError, readOnly }: FieldProps & {
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <textarea
      readOnly={readOnly}
      placeholder="Câu trả lời của bạn"
      rows={4}
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      style={{ ...baseInput, resize: 'vertical', ...(hasError ? errorBorder : {}) } as React.CSSProperties}
      onFocus={applyFocus}
      onBlur={removeFocus}
    />
  )
}


function EmailField({ value, onChange, hasError, readOnly }: FieldProps & {
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <input type="email" readOnly={readOnly} placeholder="Nhập email"
      value={value ?? ''} onChange={e => onChange?.(e.target.value)}
      style={{ ...baseInput, ...(hasError ? errorBorder : {}) }}
      onFocus={applyFocus} onBlur={removeFocus}
    />
  )
}


function TelField({ value, onChange, hasError, readOnly }: FieldProps & {
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <input type="tel" readOnly={readOnly} placeholder="Nhập số điện thoại"
      value={value ?? ''} onChange={e => onChange?.(e.target.value)}
      style={{ ...baseInput, ...(hasError ? errorBorder : {}) }}
      onFocus={applyFocus} onBlur={removeFocus}
    />
  )
}


function DateField({ value, onChange, hasError, readOnly }: FieldProps & {
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <input type="date" readOnly={readOnly}
      value={value ?? ''} onChange={e => onChange?.(e.target.value)}
      style={{ ...baseInput, cursor: readOnly ? 'default' : 'pointer', ...(hasError ? errorBorder : {}) }}
      onFocus={applyFocus} onBlur={removeFocus}
    />
  )
}


interface AddressValue { address?: string; city?: string }


function AddressField({ value, onChange, hasError, readOnly }: FieldProps & {
  value?: AddressValue
  onChange?: (v: AddressValue) => void
}) {
  const v: AddressValue = value ?? {}
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <input type="text" readOnly={readOnly} placeholder="Địa chỉ"
        value={v.address ?? ''} onChange={e => onChange?.({ ...v, address: e.target.value })}
        style={{ ...baseInput, ...(hasError ? errorBorder : {}) }}
        onFocus={applyFocus} onBlur={removeFocus}
      />
      <input type="text" readOnly={readOnly} placeholder="Tỉnh / Thành phố"
        value={v.city ?? ''} onChange={e => onChange?.({ ...v, city: e.target.value })}
        style={{ ...baseInput }}
        onFocus={applyFocus} onBlur={removeFocus}
      />
    </div>
  )
}


function RadioField({ options, qId, value, onChange, hasError, readOnly, allowOther }: FieldProps & {
  options: string[]
  qId: string
  value?: string
  onChange?: (v: string) => void
  allowOther?: boolean
}) {
  const OTHER = '__other__'
  const isOther = typeof value === 'string' && value.startsWith(OTHER)
  const otherText = isOther ? value.slice(OTHER.length) : ''

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      ...(hasError ? { padding: '8px 10px', borderRadius: 6, border: `1px solid ${C.danger}`, background: C.dangerBg } : {}),
    }}>
      {options.map((opt, i) => (
        <label
          key={i}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: readOnly ? 'default' : 'pointer',
            padding: '6px 10px', borderRadius: 7,
          }}
        >
          <input
            type="radio" name={qId} disabled={readOnly}
            checked={value === opt} onChange={() => onChange?.(opt)}
            style={{ marginTop: 3, cursor: readOnly ? 'default' : 'pointer', flexShrink: 0 }}
          />
          <span style={{ fontSize: 14, color: C.text, lineHeight: 1.55 }}>{opt}</span>
        </label>
      ))}
      {allowOther && (
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: readOnly ? 'default' : 'pointer' }}>
          <input
            type="radio" name={qId} disabled={readOnly}
            checked={isOther} onChange={() => onChange?.(OTHER)}
            style={{ marginTop: 3, cursor: readOnly ? 'default' : 'pointer', flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 14, color: C.sub, lineHeight: 1.55, fontStyle: 'italic' }}>Khác</span>
            {isOther && (
              <input
                type="text" readOnly={readOnly}
                placeholder="Vui lòng ghi rõ..."
                value={otherText}
                onChange={(e) => onChange?.(OTHER + e.target.value)}
                style={{ ...baseInput, marginTop: 6 }}
                onFocus={applyFocus} onBlur={removeFocus}
              />
            )}
          </div>
        </label>
      )}
    </div>
  )
}


function CheckboxField({ options, value, onChange, hasError, readOnly, allowOther }: FieldProps & {
  options: string[]
  value?: string[]
  onChange?: (v: string[]) => void
  allowOther?: boolean
}) {
  const OTHER_PREFIX = '__other__'
  const checked = new Set(value ?? [])
  const otherEntry = Array.from(checked).find(v => v.startsWith(OTHER_PREFIX))
  const isOtherChecked = !!otherEntry
  const otherText = otherEntry ? otherEntry.slice(OTHER_PREFIX.length) : ''

  const toggle = (opt: string) => {
    if (readOnly) return
    const next = new Set(checked)
    next.has(opt) ? next.delete(opt) : next.add(opt)
    onChange?.(Array.from(next))
  }
  const toggleOther = () => {
    if (readOnly) return
    const next = new Set(checked)
    if (isOtherChecked) { next.delete(otherEntry!); }
    else { next.add(OTHER_PREFIX) }
    onChange?.(Array.from(next))
  }
  const setOtherText = (txt: string) => {
    const next = new Set(checked)
    if (otherEntry) next.delete(otherEntry)
    next.add(OTHER_PREFIX + txt)
    onChange?.(Array.from(next))
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      ...(hasError ? { padding: '8px 10px', borderRadius: 6, border: `1px solid ${C.danger}`, background: C.dangerBg } : {}),
    }}>
      {options.map((opt, i) => (
        <label
          key={i}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: readOnly ? 'default' : 'pointer',
            padding: '6px 10px', borderRadius: 7,
          }}
        >
          <input
            type="checkbox" disabled={readOnly}
            checked={checked.has(opt)} onChange={() => toggle(opt)}
            style={{ marginTop: 3, cursor: readOnly ? 'default' : 'pointer', flexShrink: 0 }}
          />
          <span style={{ fontSize: 14, color: C.text, lineHeight: 1.55 }}>{opt}</span>
        </label>
      ))}
      {allowOther && (
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: readOnly ? 'default' : 'pointer' }}>
          <input
            type="checkbox" disabled={readOnly}
            checked={isOtherChecked} onChange={toggleOther}
            style={{ marginTop: 3, cursor: readOnly ? 'default' : 'pointer', flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 14, color: C.sub, lineHeight: 1.55, fontStyle: 'italic' }}>Khác</span>
            {isOtherChecked && (
              <input
                type="text" readOnly={readOnly}
                placeholder="Vui lòng ghi rõ..."
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                style={{ ...baseInput, marginTop: 6 }}
                onFocus={applyFocus} onBlur={removeFocus}
              />
            )}
          </div>
        </label>
      )}
    </div>
  )
}


function SelectField({ options, value, onChange, hasError, readOnly }: FieldProps & {
  options: string[]
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <select
      disabled={readOnly}
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      style={{ ...baseInput, cursor: readOnly ? 'default' : 'pointer', ...(hasError ? errorBorder : {}) } as React.CSSProperties}
      onFocus={applyFocus}
      onBlur={removeFocus}
    >
      <option value="">-- Chọn --</option>
      {options.map((o, i) => <option key={i} value={o}>{o}</option>)}
    </select>
  )
}


function QuestionItem({ q, num, value, onChange, hasError, readOnly }: {
  q: Question
  num: number
  value: any
  onChange: (v: any) => void
  hasError: boolean
  readOnly: boolean
}) {
  const opts = (q.options ?? []).map(o => (typeof o === 'string' ? o : (o as any).label)) as string[]
  const fp: FieldProps = { hasError, readOnly }

  const renderInput = () => {
    switch (q.type) {
      case 'text':    return <textField    {...fp} placeholder={q.placeholder} value={value} onChange={onChange} />
      case 'long':     return <LongField     {...fp} value={value} onChange={onChange} />
      case 'email':    return <EmailField    {...fp} value={value} onChange={onChange} />
      case 'tel':      return <TelField      {...fp} value={value} onChange={onChange} />
      case 'date':     return <DateField     {...fp} value={value} onChange={onChange} />
      case 'address':  return <AddressField  {...fp} value={value} onChange={onChange} />
      case 'radio':    return <RadioField    {...fp} options={opts} qId={q.id} value={value} onChange={onChange} allowOther={(q as any).allowOther} />
      case 'checkbox': return <CheckboxField {...fp} options={opts} value={value} onChange={onChange} allowOther={(q as any).allowOther} />
      case 'select':
      case 'dropdown': return <SelectField   {...fp} options={opts} value={value} onChange={onChange} />
      default:         return <textField    {...fp} value={value} onChange={onChange} />
    }
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <QLabel num={num} title={q.title} required={q.required} multi={q.type === 'checkbox'} />
      {renderInput()}
      {hasError && <ErrorHint msg="Vui lòng điền vào trường bắt buộc này" />}
    </div>
  )
}


//  Section header 


function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      margin: '32px 0 20px',
    }}>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text, letterSpacing: '-0.01em' }}>
        {title}
      </span>
    </div>
  )
}


function mapForm(form: Form) {
  const sections: Section[] =
    (form as any).sections?.length > 0
      ? (form as any).sections
      : [{ id: 'default-section', title: 'Nội dung khảo sát', order: 0 }]

  const defaultSectionId = sections[0].id
  const sectionIds = new Set(sections.map((s: Section) => s.id))

  const typeMap: Record<string, Question['type']> = {
    text: 'text', long: 'long', radio: 'radio', checkbox: 'checkbox',
    dropdown: 'select', select: 'select', date: 'date',
    address: 'address', email: 'email', tel: 'tel',
  }

  let order = 0
  const questions: Question[] = form.questions.map((q: any) => {
    // Keep existing sectionId if it matches a real section, otherwise assign to default
    const sectionId = q.sectionId && sectionIds.has(q.sectionId) ? q.sectionId : defaultSectionId
    return {
      id: q.id,
      type: typeMap[q.type] ?? 'text',
      title: q.title,
      placeholder: q.placeholder ?? (q.type === 'text' ? 'Câu trả lời của bạn' : undefined),
      options: q.options?.map((o: any) => (typeof o === 'string' ? { id: o, label: o } : o)),
      required: q.required,
      sectionId,
      order: q.order ?? order++,
      rowGroup: q.rowGroup,
      reportFieldKey: q.reportFieldKey,
      visibleWhen: q.visibleWhen,
    }
  })

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


function isVisible(q: Question, answers: Record<string, any>): boolean {
  if (!q.visibleWhen) return true
  const { questionId, operator, value } = q.visibleWhen
  const current = answers[questionId]
  switch (operator) {
    case 'equals':     return String(current) === String(value)
    case 'not_equals': return String(current) !== String(value)
    case 'includes':
      if (Array.isArray(current)) return current.includes(value as string)
      return String(current).includes(String(value))
    default: return true
  }
}


function isEmpty(val: any): boolean {
  if (val === undefined || val === null) return true
  if (typeof val === 'string') {
    if (val.startsWith('__other__')) return false  // "Khác" đã chọn = không rỗng
    return val.trim() === ''
  }
  if (Array.isArray(val)) return val.length === 0
  if (typeof val === 'object') return !val.address?.trim() && !val.city?.trim()
  return false
}


export interface SurveyPreviewProps {
  form: Form | null
  onBack?: () => void
  initialValues?: Record<string, any>
  /** Số câu hỏi đầu tiên bị khoá (auto-fill từ xác thực, không cho sửa) */
  lockedCount?: number
  onSubmit?: (answers: Record<string, any>) => void | Promise<void>
  submitLabel?: string
  compact?: boolean
}


export function SurveyPreview({
  form,
  onBack,
  initialValues,
  lockedCount = 0,
  onSubmit,
  submitLabel = 'Gửi',
  compact = false,
}: SurveyPreviewProps) {
  const [answers,       setAnswers]       = useState<Record<string, any>>(initialValues ?? {})
  const [errors,        setErrors]        = useState<Set<string>>(new Set())
  const [submitting,    setSubmitting]    = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => { if (initialValues) setAnswers(initialValues) }, [initialValues])

  const setAnswer = useCallback((qId: string, val: any) => {
    setAnswers(prev => ({ ...prev, [qId]: val }))
    setErrors(prev => {
      if (!prev.has(qId)) return prev
      const next = new Set(prev); next.delete(qId); return next
    })
  }, [])

  if (!form) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', color: C.muted, fontSize: 13, fontFamily: 'inherit',
    }}>
      Chưa có nội dung xem trước
    </div>
  )

  const { sections, questions, header, footer, descParagraphs } = mapForm(form)

  const visibleIds = new Set(questions.filter(q => isVisible(q, answers)).map(q => q.id))

  const bySection = sections
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((sec, idx) => ({
      section: sec,
      qs: questions
        .filter(q => {
          if (idx === 0) {
            // First section also catches any orphaned questions
            const matchesThisSection = q.sectionId === sec.id
            const isOrphan = !sections.find(s => s.id === q.sectionId)
            return (matchesThisSection || isOrphan) && visibleIds.has(q.id)
          }
          return q.sectionId === sec.id && visibleIds.has(q.id)
        })
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }))
    .filter(g => g.qs.length > 0)

  const showSectionHeaders = bySection.length > 1
  const isViewOnly = !onSubmit

  const handleSubmit = async () => {
    if (!onSubmit || submitting) return
    const errs = new Set<string>()
    questions.forEach(q => {
      if (q.required && visibleIds.has(q.id) && isEmpty(answers[q.id])) errs.add(q.id)
    })
    if (errs.size > 0) {
      setErrors(errs)
      const firstId = questions.find(q => errs.has(q.id))?.id
      if (firstId) document.getElementById(`q-${firstId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    try { await onSubmit(answers); setSubmitSuccess(true) }
    finally { setSubmitting(false) }
  }

  let num = 0

  // Collect locked question ids (first lockedCount questions by order)
  const lockedQIds = new Set<string>(
    lockedCount > 0
      ? questions
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .slice(0, lockedCount)
          .map(q => q.id)
      : []
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: compact ? 'transparent' : C.bg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: 14,
      color: C.text,
    }}>

      {/* {onBack && !compact && (
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: '#fff',
          borderBottom: `1px solid ${C.border}`,
          padding: '10px 24px',
          display: 'flex', alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 34, padding: '0 14px', borderRadius: 7,
              border: `1px solid ${C.border}`, background: C.surface,
              color: C.sub, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.bg }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.surface }}
          >
            ← Quay lại
          </button>
        </div>
      )} */}

      {/* Form card */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: compact ? '0' : '28px 16px 72px' }}>
        <div style={{
          background: C.surface,
          borderRadius: compact ? 0 : 10,
          border: compact ? 'none' : `1px solid ${C.border}`,
          boxShadow: compact ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: compact ? '24px 28px 32px' : '36px 48px 44px' }}>

            {/* Institutional header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 20,
              marginBottom: 24, paddingBottom: 24,
            }}>
              <img
                src={header.logoUrl}
                alt="Logo"
                style={{ width: 90, height: 90, objectFit: 'contain', flexShrink: 0 }}
              />
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 6, fontStyle: 'italic' }}>
                  {formatDate((form as any).createdat ?? (form as any).createdAt)}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', color: C.text, letterSpacing: '0.04em', marginBottom: 3 }}>
                  {header.ministry}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 800, textTransform: 'uppercase', color: C.text, letterSpacing: '0.03em', marginBottom: 6 }}>
                  {header.academy}
                </div>
                <div style={{ fontSize: 11.5, color: C.sub, lineHeight: 1.7, fontStyle: 'italic' }}>
                  <div>{header.address}</div>
                  <div>Điện thoại: {header.phone} – Fax: {header.phone}</div>
                </div>
              </div>
            </div>

            {/* Survey title */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{
                fontSize: 18, fontWeight: 700, color: C.text,
                letterSpacing: '-0.01em', lineHeight: 1.5, margin: 0,
                textTransform: 'uppercase',
              }}>
                {form.name}
              </h2>
            </div>

            {/* Description */}
            {descParagraphs.length > 0 && (
              <div style={{ marginBottom: 28, paddingLeft: 16 }}>
                <p style={{ fontSize: 14, fontStyle: 'italic', fontWeight: 600, color: C.text, lineHeight: 1.7, marginBottom: 10 }}>
                  Thân gửi Anh/Chị cựu sinh viên của {header.academy}!
                </p>
                {descParagraphs.map((p, i) => (
                  <p key={i} style={{ fontSize: 14, fontStyle: 'italic', color: C.sub, lineHeight: 1.85, textIndent: 28, marginBottom: 8 }}>
                    {p}
                  </p>
                ))}
                <p style={{ fontSize: 13.5, fontStyle: 'italic', color: C.sub, marginTop: 8 }}>
                  Trân trọng cảm ơn sự cộng tác của các Anh/Chị!
                </p>
              </div>
            )}

            {/* Error banner */}
            {errors.size > 0 && (
              <div style={{
                background: C.dangerBg, border: `1px solid #fca5a5`,
                borderRadius: 6, padding: '10px 14px', marginBottom: 20,
                fontSize: 13, color: C.danger, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                Vui lòng điền vào {errors.size} trường bắt buộc còn thiếu.
              </div>
            )}

            {/* Questions */}
            {bySection.map(({ section, qs }) => (
              <div key={section.id}>
                {showSectionHeaders && <SectionHeader title={section.title} />}
                {groupByRow(qs).map(item => {
                  if (Array.isArray(item)) {
                    // Nhóm 2-3 câu trên cùng 1 hàng
                    return (
                      <div
                        key={item[0].id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: `repeat(${item.length}, 1fr)`,
                          gap: 16,
                          marginBottom: 24,
                        }}
                      >
                        {item.map(q => {
                          num++
                          const isLocked = lockedQIds.has(q.id)
                          return (
                            <div key={q.id} id={`q-${q.id}`} style={{ marginBottom: 0 }}>
                              <QuestionItem
                                q={q} num={num}
                                value={answers[q.id]}
                                onChange={v => setAnswer(q.id, v)}
                                hasError={errors.has(q.id)}
                                readOnly={isViewOnly || isLocked}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )
                  }
                  // Câu hỏi đơn
                  num++
                  const isLocked = lockedQIds.has(item.id)
                  return (
                    <div key={item.id} id={`q-${item.id}`}>
                      <QuestionItem
                        q={item} num={num}
                        value={answers[item.id]}
                        onChange={v => setAnswer(item.id, v)}
                        hasError={errors.has(item.id)}
                        readOnly={isViewOnly || isLocked}
                      />
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Footer */}
            <div style={{
              textAlign: 'center', padding: '24px 0 16px',
              marginTop: 16,
            }}>
              <p style={{ fontWeight: 600, color: C.text, marginBottom: 4, fontSize: 14 }}>
                {footer.primaryText}
              </p>
              <p style={{ fontStyle: 'italic', color: C.sub, fontSize: 13 }}>
                {footer.secondaryText}
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              {onBack && compact && (
                <button onClick={onBack} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  height: 36, padding: '0 16px', borderRadius: 6,
                  border: `1px solid ${C.border}`, background: C.surface,
                  color: C.sub, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  ←
                </button>
              )}

              {onSubmit && (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || submitSuccess}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    height: 36, padding: '0 20px', borderRadius: 6,
                    border: 'none',
                    background: submitSuccess ? '#15803d' : submitting ? '#9ca3af' : '#16a34a',
                    color: '#fff',
                    fontSize: 13.5, fontWeight: 600,
                    cursor: submitting || submitSuccess ? 'default' : 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background .15s, opacity .15s',
                  }}
                  onMouseEnter={e => { if (!submitting && !submitSuccess) e.currentTarget.style.background = '#15803d' }}
                  onMouseLeave={e => { if (!submitting && !submitSuccess) e.currentTarget.style.background = '#16a34a' }}
                >
                  {submitSuccess ? '✓ Đã lưu' : submitting ? 'Đang gửi…' : submitLabel}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default SurveyPreview