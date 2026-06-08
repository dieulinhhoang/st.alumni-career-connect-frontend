import { useState, useRef, useEffect } from 'react'
import type { Question, Section, SurveyFooter, SurveyHeader } from '../../../../../feature/form/types'
import { SurveyHeader as SurveyHeaderComp } from './SurveyHeader'
import { SurveyQuestion } from './SurveyQuestion'
import { FooterBlock } from './FooterBlock'
import { SectionManager } from './SectionManager'
import { RichTextDisplay } from '../shared/RichTextDisplay'
import { InlineInput } from '../shared/InlineInput'

interface LogicRule {
  id: string
  sourceQuestionId: string
  operator: 'equals' | 'notequals' | 'contains'
  value: string
  action: 'show' | 'hide' | 'skip' | 'require'
  targetQuestionId: string
}

interface PDFCanvasProps {
  surveyTitle: string
  descriptionParagraphs?: string[]
  sections?: Section[]
  questions: Question[]
  accent: string
  header: SurveyHeader
  footer?: SurveyFooter
  interactive?: boolean
  headerOnly?: boolean
  onHeaderChange?: (header: SurveyHeader) => void
  onFooterChange?: (footer: SurveyFooter) => void
  onTitleChange?: (title: string) => void
  onDescriptionParagraphsChange?: (paragraphs: string[]) => void
  onSectionsChange?: (sections: Section[]) => void
  logoUrl?: string
  logoSize?: number
  initialValues?: Record<string, any>
  onSubmit?: (answers: Record<string, any>) => void
  submitLabel?: string
  logicRules?: LogicRule[]
}

export function PDFCanvas({
  surveyTitle, descriptionParagraphs = [], sections = [], questions,
  accent, header, footer, interactive = true, headerOnly = false,
  onHeaderChange, onFooterChange, onTitleChange, onDescriptionParagraphsChange, onSectionsChange,
  logoUrl, logoSize = 120, initialValues = {}, onSubmit, submitLabel = 'Gửi', logicRules = [],
}: PDFCanvasProps) {
  // Answer state
  const [radios, setRadios] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    questions.forEach((q) => {
      if ((q.type === 'radio' || q.type === 'multiple-choice') && initialValues[q.id] != null)
        init[q.id] = initialValues[q.id]
    })
    return init
  })
  const [cbs, setCbs] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {}
    questions.forEach((q) => {
      if (q.type === 'checkbox' && initialValues[q.id] != null) {
        const vals = Array.isArray(initialValues[q.id]) ? initialValues[q.id] : [initialValues[q.id]]
        init[q.id] = Object.fromEntries(vals.map((v: string) => [v, true]))
      }
    })
    return init
  })
  const [textVals, setTextVals] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    questions.forEach((q) => {
      if (!['radio', 'multiple-choice', 'checkbox'].includes(q.type) && initialValues[q.id] != null)
        init[q.id] = String(initialValues[q.id])
    })
    return init
  })
  const [done, setDone] = useState(false)

  // Responsive
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  useEffect(() => {
    const el = containerRef.current; if (!el) return
    setContainerWidth(el.getBoundingClientRect().width)
    const ro = new ResizeObserver((entries) => { for (const e of entries) setContainerWidth(e.contentRect.width) })
    ro.observe(el); return () => ro.disconnect()
  }, [])
  const isSmall = containerWidth > 0 && containerWidth < 480
  const isMedium = containerWidth >= 480 && containerWidth < 640
  const isMobile = isSmall || isMedium
  const px = isSmall ? 16 : isMedium ? 20 : 36

  // Description inline edit — 3 fields: titleLine / bodyText / footerLine
  const parseDesc = (paras: string[]) => ({
    titleLine: paras[0] ?? '',
    bodyText: paras.length > 2 ? paras.slice(1, paras.length - 1).join('\n') : (paras[1] ?? ''),
    footerLine: paras.length > 2 ? (paras[paras.length - 1] ?? '') : '',
  })
  const [descDraft, setDescDraft] = useState(() => parseDesc(descriptionParagraphs))

  const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const editable = headerOnly || !!onHeaderChange
  const descIsEmpty = descriptionParagraphs.length === 0 || descriptionParagraphs.every((p) => !p.trim())

  // Logic visibility
  const hiddenQuestionIds = new Set<string>()
  const requiredOverrides = new Set<string>()
  if (interactive && logicRules.length > 0) {
    const getAnswer = (qId: string, qType: string) => {
      if (qType === 'radio' || qType === 'multiple-choice') return radios[qId] ?? ''
      if (qType === 'checkbox') return Object.entries(cbs[qId] ?? {}).filter(([, c]) => c).map(([v]) => v).join(',')
      return textVals[qId] ?? ''
    }
    const checkCondition = (rule: LogicRule) => {
      const srcQ = questions.find((q) => q.id === rule.sourceQuestionId); if (!srcQ) return false
      const ans = getAnswer(rule.sourceQuestionId, srcQ.type)
      if (rule.operator === 'equals') return ans === rule.value
      if (rule.operator === 'notequals') return ans !== rule.value
      if (rule.operator === 'contains') return ans.includes(rule.value)
      return false
    }
    for (const rule of logicRules) if (rule.action === 'show') hiddenQuestionIds.add(rule.targetQuestionId)
    for (const rule of logicRules) {
      if (!checkCondition(rule)) continue
      if (rule.action === 'hide') hiddenQuestionIds.add(rule.targetQuestionId)
      if (rule.action === 'show') hiddenQuestionIds.delete(rule.targetQuestionId)
      if (rule.action === 'require') requiredOverrides.add(rule.targetQuestionId)
      if (rule.action === 'skip') {
        const srcIdx = questions.findIndex((q) => q.id === rule.sourceQuestionId)
        const tgtIdx = questions.findIndex((q) => q.id === rule.targetQuestionId)
        if (srcIdx !== -1 && tgtIdx !== -1 && tgtIdx > srcIdx)
          for (let i = srcIdx + 1; i < tgtIdx; i++) hiddenQuestionIds.add(questions[i].id)
      }
    }
  }

  const handleSubmit = () => {
    const all: Record<string, any> = { ...textVals }
    Object.entries(radios).forEach(([k, v]) => { all[k] = v })
    Object.entries(cbs).forEach(([k, v]) => { all[k] = Object.entries(v).filter(([, c]) => c).map(([val]) => val) })
    if (onSubmit) onSubmit(all); else setDone(true)
  }

  if (done && interactive) return (
    <div style={{ background: '#f8fafc', textAlign: 'center', padding: '80px 20px', fontFamily: 'inherit' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>✓</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Phản hồi đã được ghi lại!</div>
      <div style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Cảm ơn bạn tham gia khảo sát.</div>
      <button onClick={() => { setDone(false); setRadios({}); setCbs({}); setTextVals({}) }}
        style={{ padding: '10px 28px', background: accent, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Xem lại</button>
    </div>
  )

  const questionsBySection = sections
    .map((section) => ({ ...section, questions: questions.filter((q) => q.sectionId === section.id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) }))
    .filter((sec) => sec.questions.length > 0)
  const unsectionedQuestions = questions.filter((q) => !sections.find((s) => s.id === q.sectionId))
  let globalIndex = 0

  return (
    <div ref={containerRef} style={{ background: '#f8fafc', fontFamily: 'Inter, Geist, system-ui, sans-serif', color: '#1e293b', width: '100%', boxSizing: 'border-box', minWidth: 0 }}>

      <SurveyHeaderComp header={header} editable={editable} logoUrl={logoUrl} logoSize={logoSize}
        isMobile={isMobile} isSmall={isSmall} isMedium={isMedium} today={today} onHeaderChange={onHeaderChange} />

      {/* {editable && onSectionsChange && (
        <div style={{ padding: `16px ${px}px`, background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
          <SectionManager sections={sections} accent={accent} onSectionsChange={onSectionsChange} />
        </div>
      )} */}

      {/* Title + Description */}
      <div style={{ background: '#fff', padding: `${isSmall ? 24 : 36}px ${px}px ${isSmall ? 20 : 28}px`, textAlign: 'center' }}>
        {editable && onTitleChange
          ? <InlineInput value={surveyTitle} onChange={onTitleChange} placeholder="TÊN FORM KHẢO SÁT" style={{ fontSize: isSmall ? 16 : 20, fontWeight: 700, textAlign: 'center', color: '#0f172a' }} />
          : <h2 style={{ margin: 0, fontSize: isSmall ? 18 : isMedium ? 20 : 22, fontWeight: 800, color: '#0f172a', wordBreak: 'break-word' }}>{surveyTitle || 'TÊN FORM KHẢO SÁT'}</h2>
        }

        {(descriptionParagraphs.length > 0 || (editable && onDescriptionParagraphsChange)) && (
          <div style={{ marginTop: 16, textAlign: 'left', maxWidth: 680, margin: '16px auto 0' }}>
            {editable && onDescriptionParagraphsChange ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Dòng đầu — bold italic căn giữa */}
                <input
                  value={descDraft.titleLine}
                  onChange={e => {
                    const d = { ...descDraft, titleLine: e.target.value }
                    setDescDraft(d)
                    const paras: string[] = []
                    if (d.titleLine.trim()) paras.push(d.titleLine.trim())
                    d.bodyText.split('\n').map((l: string) => l.trim()).filter(Boolean).forEach((l: string) => paras.push(l))
                    if (d.footerLine.trim()) paras.push(d.footerLine.trim())
                    onDescriptionParagraphsChange(paras.length ? paras : [''])
                  }}
                  placeholder="Dòng đầu: Thân gửi Anh/Chị cựu sinh viên..."
                  style={{
                    width: '100%', padding: '6px 10px', border: '1px dashed #cbd5e1',
                    borderRadius: 6, fontSize: 14, fontFamily: 'inherit',
                    fontWeight: 700, fontStyle: 'italic', textAlign: 'center',
                    color: '#0f172a', background: 'transparent', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.borderStyle = 'solid' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.borderStyle = 'dashed' }}
                />
                {/* Đoạn giữa — italic thụt lề */}
                <textarea
                  value={descDraft.bodyText}
                  onChange={e => {
                    const d = { ...descDraft, bodyText: e.target.value }
                    setDescDraft(d)
                    const paras: string[] = []
                    if (d.titleLine.trim()) paras.push(d.titleLine.trim())
                    e.target.value.split('\n').map((l: string) => l.trim()).filter(Boolean).forEach((l: string) => paras.push(l))
                    if (d.footerLine.trim()) paras.push(d.footerLine.trim())
                    onDescriptionParagraphsChange(paras.length ? paras : [''])
                  }}
                  placeholder="Đoạn giữa: nội dung giới thiệu / lời dẫn khảo sát..."
                  rows={5}
                  style={{
                    width: '100%', padding: '6px 10px 6px 28px', border: '1px dashed #cbd5e1',
                    borderRadius: 6, fontSize: 14, fontFamily: 'inherit',
                    fontStyle: 'italic', color: '#334155', background: 'transparent',
                    resize: 'vertical', outline: 'none', lineHeight: 1.75,
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.borderStyle = 'solid' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.borderStyle = 'dashed' }}
                />
                {/* Dòng cuối — italic căn giữa */}
                <input
                  value={descDraft.footerLine}
                  onChange={e => {
                    const d = { ...descDraft, footerLine: e.target.value }
                    setDescDraft(d)
                    const paras: string[] = []
                    if (d.titleLine.trim()) paras.push(d.titleLine.trim())
                    d.bodyText.split('\n').map((l: string) => l.trim()).filter(Boolean).forEach((l: string) => paras.push(l))
                    if (d.footerLine.trim()) paras.push(d.footerLine.trim())
                    onDescriptionParagraphsChange(paras.length ? paras : [''])
                  }}
                  placeholder="Dòng cuối: Trân trọng cảm ơn sự cộng tác..."
                  style={{
                    width: '100%', padding: '6px 10px', border: '1px dashed #cbd5e1',
                    borderRadius: 6, fontSize: 14, fontFamily: 'inherit',
                    fontStyle: 'italic', textAlign: 'center',
                    color: '#334155', background: 'transparent', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.borderStyle = 'solid' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.borderStyle = 'dashed' }}
                />
              </div>
            ) : (
              <div style={{ padding: '16px 20px', background: `${accent}08`, borderLeft: `3px solid ${accent}`, borderRadius: '0 8px 8px 0' }}>
                {descriptionParagraphs[0] && (
                  <div style={{ fontWeight: 700, fontStyle: 'italic', fontSize: 14, color: '#0f172a', textAlign: 'center', marginBottom: 10 }}>
                    {descriptionParagraphs[0]}
                  </div>
                )}
                {descriptionParagraphs.slice(1, descriptionParagraphs.length > 2 ? descriptionParagraphs.length - 1 : undefined).map((para, idx) => (
                  <div key={idx} style={{ fontSize: 14, fontStyle: 'italic', color: '#334155', lineHeight: 1.75, textAlign: 'justify', paddingLeft: 24, marginBottom: 6 }}>
                    {para}
                  </div>
                ))}
                {descriptionParagraphs.length > 2 && descriptionParagraphs[descriptionParagraphs.length - 1] && (
                  <div style={{ fontSize: 14, fontStyle: 'italic', color: '#334155', textAlign: 'center', marginTop: 6 }}>
                    {descriptionParagraphs[descriptionParagraphs.length - 1]}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Questions */}
      {!headerOnly && (
        questionsBySection.length === 0 && unsectionedQuestions.length === 0
          ? <div style={{ padding: '60px 24px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Chưa có câu hỏi nào</div>
          : (
            <div style={{ padding: `${isSmall ? 16 : 24}px ${px}px`, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {questionsBySection.map((section, sIdx) => (
                <div key={section.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 0 12px' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{sIdx + 1}</div>
                    <div style={{ fontSize: isSmall ? 14 : 16, fontWeight: 700, color: '#0f172a', flex: 1 }}>{section.title}</div>
                    <div style={{ height: 1, flex: 1, background: '#e2e8f0', maxWidth: 80 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {section.questions.filter((q) => !hiddenQuestionIds.has(q.id)).map((q) => {
                      globalIndex++
                      return <SurveyQuestion key={q.id} question={q} index={globalIndex} accent={accent}
                        interactive={interactive} isRequired={q.required || requiredOverrides.has(q.id)}
                        isSmall={isSmall} radios={radios} cbs={cbs} textVals={textVals}
                        setRadios={setRadios} setCbs={setCbs} setTextVals={setTextVals} />
                    })}
                  </div>
                </div>
              ))}
              {unsectionedQuestions.filter((q) => !hiddenQuestionIds.has(q.id)).map((q) => {
                globalIndex++
                return <SurveyQuestion key={q.id} question={q} index={globalIndex} accent={accent}
                  interactive={interactive} isRequired={q.required || requiredOverrides.has(q.id)}
                  isSmall={isSmall} radios={radios} cbs={cbs} textVals={textVals}
                  setRadios={setRadios} setCbs={setCbs} setTextVals={setTextVals} />
              })}
            </div>
          )
      )}

      {questions.length > 0 && interactive && (
        <div style={{ padding: `0 ${px}px 32px` }}>
          <button onClick={handleSubmit}
            style={{ padding: '11px 32px', background: accent, color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >{submitLabel}</button>
        </div>
      )}
      {!headerOnly && (
        <FooterBlock
          footer={footer}
          accent={accent}
          editable={editable}
          onFooterChange={onFooterChange}
        />
      )}
    </div>
  )
}