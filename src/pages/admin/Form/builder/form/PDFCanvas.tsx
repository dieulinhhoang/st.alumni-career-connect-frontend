import { useState, useRef, useEffect } from 'react'
import type { Question, Section, SurveyFooter, SurveyHeader } from '../../../../../feature/form/types'
import { SurveyHeader as SurveyHeaderComp } from './SurveyHeader'
import { SurveyQuestion } from './SurveyQuestion'
import { FooterBlock } from './FooterBlock'
import { SectionManager } from './SectionManager'
import { ClickToEditBlock } from '../shared/ClickToEditBlock'
import { FloatingEditPopup } from '../shared/FloatingEditPopup'
import { RichTextEditor } from '../shared/RichTextEditor'
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

  // Description popup
  const [descPopupOpen, setDescPopupOpen] = useState(false)
  const [descDraft, setDescDraft] = useState(descriptionParagraphs.join('\n'))
  const descBlockRef = useRef<HTMLDivElement>(null)
  useEffect(() => setDescDraft(descriptionParagraphs.join('\n')), [descriptionParagraphs.join('\n')])

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
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: `${isSmall ? 24 : 36}px ${px}px ${isSmall ? 20 : 28}px`, textAlign: 'center' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: accent, margin: '0 auto 20px' }} />
        {editable && onTitleChange
          ? <InlineInput value={surveyTitle} onChange={onTitleChange} placeholder="TÊN FORM KHẢO SÁT" style={{ fontSize: isSmall ? 16 : 20, fontWeight: 700, textAlign: 'center', color: '#0f172a' }} />
          : <h2 style={{ margin: 0, fontSize: isSmall ? 18 : isMedium ? 20 : 22, fontWeight: 800, color: '#0f172a', wordBreak: 'break-word' }}>{surveyTitle || 'TÊN FORM KHẢO SÁT'}</h2>
        }

        {(descriptionParagraphs.length > 0 || (editable && onDescriptionParagraphsChange)) && (
          <div style={{ marginTop: 16, textAlign: 'left', maxWidth: 680, margin: '16px auto 0' }}>
            {editable && onDescriptionParagraphsChange ? (
              <>
                <div ref={descBlockRef}>
                  <ClickToEditBlock accent={accent} label="Sửa mô tả" isEmpty={descIsEmpty} emptyLabel="Nhấn thêm mô tả / lời dẫn"
                    onClick={() => { setDescDraft(descriptionParagraphs.join('\n')); setDescPopupOpen(true) }}>
                    {descriptionParagraphs.map((para, idx) => (
                      <div key={idx} style={{ marginBottom: idx < descriptionParagraphs.length - 1 ? 12 : 0 }}>
                        <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.65, textAlign: 'justify' }}><RichTextDisplay text={para} /></div>
                      </div>
                    ))}
                  </ClickToEditBlock>
                </div>
                <FloatingEditPopup open={descPopupOpen} anchorEl={descBlockRef.current} onClose={() => setDescPopupOpen(false)} title="Mô tả / Lời dẫn" accent={accent} width={400}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>Nội dung mô tả</div>
                  <RichTextEditor value={descDraft} onChange={setDescDraft} placeholder="Nhập mô tả cho khảo sát..." minHeight={180} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                    <button onClick={() => setDescPopupOpen(false)} style={{ height: 32, padding: '0 14px', border: '1px solid #e2e8f0', borderRadius: 7, background: '#fff', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: '#6b7280', fontFamily: 'inherit' }}>Hủy</button>
                    <button onClick={() => { onDescriptionParagraphsChange(descDraft.split('\n').filter(Boolean)); setDescPopupOpen(false) }}
                      style={{ height: 32, padding: '0 16px', border: 'none', borderRadius: 7, background: accent, cursor: 'pointer', fontSize: 12.5, fontWeight: 700, color: '#fff', fontFamily: 'inherit' }}>Lưu</button>
                  </div>
                </FloatingEditPopup>
              </>
            ) : descriptionParagraphs.map((para, idx) => (
              <div key={idx} style={{ marginBottom: idx < descriptionParagraphs.length - 1 ? 12 : 0, padding: '14px 16px', background: `${accent}08`, borderLeft: `3px solid ${accent}`, borderRadius: '0 8px 8px 0' }}>
                <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.75, textAlign: 'justify' }}><RichTextDisplay text={para} /></div>
              </div>
            ))}
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
  