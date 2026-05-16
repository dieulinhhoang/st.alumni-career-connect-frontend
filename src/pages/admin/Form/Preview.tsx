import { useState, useEffect, useCallback } from 'react'
import type { Form, Question, Section } from '../../../feature/form/types'

//  Utility 

function todayLabel() {
  const d = new Date()
  return `Ngày ${String(d.getDate()).padStart(2, '0')} / ${String(d.getMonth() + 1).padStart(2, '0')} / ${d.getFullYear()}`
}

function getAccent(themeId?: string): string {
  if (!themeId) return '#8b5cf6'
  if (themeId.startsWith('#')) return themeId
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

const errorBorder: React.CSSProperties = {
  borderColor: '#f87171',
  boxShadow: '0 0 0 3px #f8717122',
}

function applyFocus(e: React.FocusEvent<HTMLElement>, accent: string) {
  const el = e.target as HTMLElement
  el.style.borderColor = accent
  el.style.boxShadow = `0 0 0 3px ${accent}22`
}
function removeFocus(e: React.FocusEvent<HTMLElement>) {
  const el = e.target as HTMLElement
  el.style.borderColor = '#e9e4f0'
  el.style.boxShadow = 'none'
}

//  Question label 

function QLabel({ num, title, required, multi }: {
  num: number; title: string; required?: boolean; multi?: boolean
}) {
  return (
    <div style={{ fontSize: 14, fontWeight: 600, color: '#1f1b2e', marginBottom: 10, lineHeight: 1.6 }}>
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

function ErrorHint({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <div style={{ fontSize: 12, color: '#ef4444', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
      <span>⚠</span> {msg}
    </div>
  )
}

//  Controlled field components 

interface FieldProps {
  accent: string
  hasError?: boolean
  readOnly?: boolean
}

function ShortField({ placeholder, accent, value, onChange, hasError, readOnly }: FieldProps & {
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
      onFocus={e => applyFocus(e, accent)}
      onBlur={removeFocus}
    />
  )
}

function LongField({ accent, value, onChange, hasError, readOnly }: FieldProps & {
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
      onFocus={e => applyFocus(e, accent)}
      onBlur={removeFocus}
    />
  )
}

function EmailField({ accent, value, onChange, hasError, readOnly }: FieldProps & {
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <input type="email"
      readOnly={readOnly}
      placeholder="Nhập email"
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      style={{ ...baseInput, ...(hasError ? errorBorder : {}) }}
      onFocus={e => applyFocus(e, accent)}
      onBlur={removeFocus}
    />
  )
}

function TelField({ accent, value, onChange, hasError, readOnly }: FieldProps & {
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <input type="tel"
      readOnly={readOnly}
      placeholder="Nhập số điện thoại"
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      style={{ ...baseInput, ...(hasError ? errorBorder : {}) }}
      onFocus={e => applyFocus(e, accent)}
      onBlur={removeFocus}
    />
  )
}

function DateField({ accent, value, onChange, hasError, readOnly }: FieldProps & {
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <input type="date"
      readOnly={readOnly}
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      style={{ ...baseInput, cursor: readOnly ? 'default' : 'pointer', ...(hasError ? errorBorder : {}) }}
      onFocus={e => applyFocus(e, accent)}
      onBlur={removeFocus}
    />
  )
}

interface AddressValue { address?: string; city?: string }

function AddressField({ accent, value, onChange, hasError, readOnly }: FieldProps & {
  value?: AddressValue
  onChange?: (v: AddressValue) => void
}) {
  const v: AddressValue = value ?? {}
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <input
        type="text"
        readOnly={readOnly}
        placeholder="Địa chỉ"
        value={v.address ?? ''}
        onChange={e => onChange?.({ ...v, address: e.target.value })}
        style={{ ...baseInput, ...(hasError ? errorBorder : {}) }}
        onFocus={e => applyFocus(e, accent)}
        onBlur={removeFocus}
      />
      <input
        type="text"
        readOnly={readOnly}
        placeholder="Tỉnh / Thành phố"
        value={v.city ?? ''}
        onChange={e => onChange?.({ ...v, city: e.target.value })}
        style={{ ...baseInput }}
        onFocus={e => applyFocus(e, accent)}
        onBlur={removeFocus}
      />
    </div>
  )
}

function RadioField({ options, qId, accent, value, onChange, hasError, readOnly }: FieldProps & {
  options: string[]
  qId: string
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      ...(hasError ? { padding: '8px 10px', borderRadius: 7, border: '1px solid #f87171', background: '#fff5f5' } : {}),
    }}>
      {options.map((opt, i) => (
        <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: readOnly ? 'default' : 'pointer' }}>
          <input
            type="radio"
            name={qId}
            disabled={readOnly}
            checked={value === opt}
            onChange={() => onChange?.(opt)}
            style={{ marginTop: 3, accentColor: accent, cursor: readOnly ? 'default' : 'pointer', flexShrink: 0 }}
          />
          <span style={{ fontSize: 14, color: '#3c3752', lineHeight: 1.55 }}>{opt}</span>
        </label>
      ))}
    </div>
  )
}

function CheckboxField({ options, accent, value, onChange, hasError, readOnly }: FieldProps & {
  options: string[]
  value?: string[]
  onChange?: (v: string[]) => void
}) {
  const checked = new Set(value ?? [])
  const toggle = (opt: string) => {
    if (readOnly) return
    const next = new Set(checked)
    next.has(opt) ? next.delete(opt) : next.add(opt)
    onChange?.(Array.from(next))
  }
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      ...(hasError ? { padding: '8px 10px', borderRadius: 7, border: '1px solid #f87171', background: '#fff5f5' } : {}),
    }}>
      {options.map((opt, i) => (
        <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: readOnly ? 'default' : 'pointer' }}>
          <input
            type="checkbox"
            disabled={readOnly}
            checked={checked.has(opt)}
            onChange={() => toggle(opt)}
            style={{ marginTop: 3, accentColor: accent, cursor: readOnly ? 'default' : 'pointer', flexShrink: 0 }}
          />
          <span style={{ fontSize: 14, color: '#3c3752', lineHeight: 1.55 }}>{opt}</span>
        </label>
      ))}
    </div>
  )
}

function SelectField({ options, accent, value, onChange, hasError, readOnly }: FieldProps & {
  options: string[]
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <select
      disabled={readOnly}
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      style={{
        ...baseInput, cursor: readOnly ? 'default' : 'pointer',
        ...(hasError ? errorBorder : {}),
      } as React.CSSProperties}
      onFocus={e => applyFocus(e, accent)}
      onBlur={removeFocus}
    >
      <option value="">-- Chọn --</option>
      {options.map((o, i) => <option key={i} value={o}>{o}</option>)}
    </select>
  )
}

//  Single question 

function QuestionItem({
  q, num, accent, value, onChange, hasError, readOnly,
}: {
  q: Question
  num: number
  accent: string
  value: any
  onChange: (v: any) => void
  hasError: boolean
  readOnly: boolean
}) {
  const opts = (q.options ?? []).map(o => (typeof o === 'string' ? o : (o as any).label)) as string[]
  const isMulti = q.type === 'checkbox'
  const fp: FieldProps = { accent, hasError, readOnly }

  const renderInput = () => {
    switch (q.type) {
      case 'short':    return <ShortField {...fp} placeholder={q.placeholder} value={value as string} onChange={onChange} />
      case 'long':     return <LongField  {...fp} value={value as string} onChange={onChange} />
      case 'email':    return <EmailField {...fp} value={value as string} onChange={onChange} />
      case 'tel':      return <TelField   {...fp} value={value as string} onChange={onChange} />
      case 'date':     return <DateField  {...fp} value={value as string} onChange={onChange} />
      case 'address':  return <AddressField {...fp} value={value as AddressValue} onChange={onChange} />
      case 'radio':    return <RadioField  {...fp} options={opts} qId={q.id} value={value as string} onChange={onChange} />
      case 'checkbox': return <CheckboxField {...fp} options={opts} value={value as string[]} onChange={onChange} />
      case 'select':
      case 'dropdown': return <SelectField {...fp} options={opts} value={value as string} onChange={onChange} />
      default:         return <ShortField {...fp} value={value as string} onChange={onChange} />
    }
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <QLabel num={num} title={q.title} required={q.required} multi={isMulti} />
      {renderInput()}
      {hasError && <ErrorHint msg="Vui lòng điền vào trường bắt buộc này" />}
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
  
//  Map Form → render data 

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
    options: q.options?.map((o: any) => (typeof o === 'string' ? { id: o, label: o } : o)),
    required: q.required,
    sectionId: q.sectionId ?? defaultSectionId,
    order: order++,
    reportFieldKey: q.reportFieldKey,
    visibleWhen: q.visibleWhen,
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

//  Visibility evaluation 

function isVisible(q: Question, answers: Record<string, any>): boolean {
  if (!q.visibleWhen) return true
  const { questionId, operator, value } = q.visibleWhen
  const current = answers[questionId]
  switch (operator) {
    case 'equals':
      return String(current) === String(value)
    case 'not_equals':
      return String(current) !== String(value)
    case 'includes':
      if (Array.isArray(current)) return current.includes(value as string)
      return String(current).includes(String(value))
    default:
      return true
  }
}

//  Validation 

function isEmpty(val: any): boolean {
  if (val === undefined || val === null) return true
  if (typeof val === 'string') return val.trim() === ''
  if (Array.isArray(val)) return val.length === 0
  if (typeof val === 'object') {
    // AddressValue
    return !val.address?.trim() && !val.city?.trim()
  }
  return false
}

//  SurveyPreview 

export interface SurveyPreviewProps {
  form: Form | null
  onBack?: () => void
  /** Pre-fill answers (view/edit mode) */
  initialValues?: Record<string, any>
  /** If provided, submit button is active and calls this with collected answers */
  onSubmit?: (answers: Record<string, any>) => void | Promise<void>
  /** Override submit button label, default "Gửi" */
  submitLabel?: string
  /** Hide the sticky "Xem trước" top bar (used when embedded in admin page) */
  compact?: boolean
}

export function SurveyPreview({
  form,
  onBack,
  initialValues,
  onSubmit,
  submitLabel = 'Gửi',
  compact = false,
}: SurveyPreviewProps) {
  //  Font injection 
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

  //  Answer state 
  const [answers, setAnswers] = useState<Record<string, any>>(initialValues ?? {})
  const [errors,  setErrors]  = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Sync when initialValues changes (e.g. parent loads data async)
  useEffect(() => {
    if (initialValues) setAnswers(initialValues)
  }, [initialValues])

  const setAnswer = useCallback((qId: string, val: any) => {
    setAnswers(prev => ({ ...prev, [qId]: val }))
    setErrors(prev => {
      if (!prev.has(qId)) return prev
      const next = new Set(prev)
      next.delete(qId)
      return next
    })
  }, [])

  //  Early returns 
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

  //  Visibility-filtered questions 
  const visibleQuestionIds = new Set(
    questions.filter(q => isVisible(q, answers)).map(q => q.id)
  )

  // Group by section, keep only visible questions
  const bySection = sections
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(sec => ({
      section: sec,
      qs: questions
        .filter(q => q.sectionId === sec.id && visibleQuestionIds.has(q.id))
        .sort((a, b) => a.order - b.order),
    }))
    .filter(g => g.qs.length > 0)

  const showSectionHeaders = bySection.length > 1

  // Is this read-only (no onSubmit) — but NOT in preview mode (onBack only)
  const isViewOnly = !onSubmit

  //  Submit handler 
  const handleSubmit = async () => {
    if (!onSubmit || submitting) return

    // Validate required visible questions
    const errs = new Set<string>()
    questions.forEach(q => {
      if (q.required && visibleQuestionIds.has(q.id) && isEmpty(answers[q.id])) {
        errs.add(q.id)
      }
    })

    if (errs.size > 0) {
      setErrors(errs)
      // Scroll to first error
      const firstId = questions.find(q => errs.has(q.id))?.id
      if (firstId) {
        document.getElementById(`q-${firstId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(answers)
      setSubmitSuccess(true)
    } finally {
      setSubmitting(false)
    }
  }

  // Global question counter
  let num = 0

  return (
    <div style={{
      minHeight: '100vh',
      background: compact ? 'transparent' : '#f5f2fa',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/* Sticky top bar — hidden in compact mode */}
      {!compact && (
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
            ✦ CHẾ ĐỘ XEM TRƯỚC
          </div>
        </div>
      )}

      {/* Form card */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: compact ? '0' : '32px 16px 80px' }}>
        <div style={{
          background: '#fff',
          borderRadius: compact ? 0 : 16,
          boxShadow: compact ? 'none' : '0 6px 28px rgba(31,27,46,.09), 0 2px 6px rgba(31,27,46,.04)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: compact ? '28px 32px 36px' : '36px 52px 44px' }}>

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

            {/* Description */}
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

            {/* Error banner */}
            {errors.size > 0 && (
              <div style={{
                background: '#fff5f5', border: '1px solid #fca5a5',
                borderRadius: 8, padding: '10px 16px', marginBottom: 20,
                fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>⚠</span>
                Vui lòng điền vào {errors.size} trường bắt buộc còn thiếu.
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
                  return (
                    <div key={q.id} id={`q-${q.id}`}>
                      <QuestionItem
                        q={q}
                        num={num}
                        accent={accent}
                        value={answers[q.id]}
                        onChange={v => setAnswer(q.id, v)}
                        hasError={errors.has(q.id)}
                        readOnly={isViewOnly}
                      />
                    </div>
                  )
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

            {/* Action buttons */}
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

              {/* Submit button — only shown when onSubmit is provided */}
              {onSubmit && (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || submitSuccess}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    height: 38, padding: '0 22px', borderRadius: 8,
                    border: 'none',
                    background: submitSuccess
                      ? '#16a34a'
                      : submitting
                        ? `${accent}99`
                        : accent,
                    color: '#fff',
                    fontSize: 13.5, fontWeight: 700, cursor: submitting || submitSuccess ? 'default' : 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: `0 4px 16px ${accent}55`,
                    transition: 'all .15s',
                    opacity: submitting ? 0.8 : 1,
                  }}
                  onMouseEnter={e => {
                    if (!submitting && !submitSuccess) e.currentTarget.style.opacity = '0.85'
                  }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  {submitSuccess
                    ? '✓ Đã lưu'
                    : submitting
                      ? '⏳ Đang gửi…'
                      : `✉ ${submitLabel}`
                  }
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