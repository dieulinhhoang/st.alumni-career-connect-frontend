import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, CheckOutlined, AppstoreOutlined } from '@ant-design/icons'
import { useFormBuilder } from '../../../../feature/form/hooks/useFormBuilder'
import type { Form, Section, SurveyFooter, SurveyHeader } from '../../../../feature/form/types'
import { CenterCanvas } from './canvas/CenterCanvas'
import { RightPanel } from './panels/RightPanel'

const DEFAULT_HEADER: SurveyHeader = {
  ministry:  'Bộ Nông nghiệp và Môi trường',
  academy:   'Học viện Nông nghiệp Việt Nam',
  address:   'Xã Gia Lâm, Thành phố Hà Nội',
  phone:     'Điện thoại: 024.62617586  Fax: 024.62617586',
  showDate:  true,
}
const DEFAULT_FOOTER: SurveyFooter = {
  primaryText:   'Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!',
  secondaryText: 'Kính chúc Anh/Chị sức khỏe và thành công!',
}

// Fixed accent color
const ACCENT = '#279f2d'

export interface LogicRule {
  id: string
  sourceQuestionId: string
  operator: 'equals' | 'notequals' | 'contains'
  value: string
  action: 'show' | 'hide' | 'skip' | 'require'
  targetQuestionId: string
}

interface BuilderViewProps {
  form: Form | null
  onSave: (form: Form) => void
  onBack: () => void
}

export function BuilderView({ form, onSave, onBack }: BuilderViewProps) {
  const mode = form?.id ? 'edit' : 'create'

  const {
    name, setName,
    questions,
    activeId, setActiveId,
    sections, setSections,
    addQuestion, duplicateQuestion, removeQuestion, updateQuestion, moveQuestion,
    addSectionAfter, deleteSection,
    addOption, updateOption, removeOption,
    saving, saved, handleSave,
  } = useFormBuilder(mode, form?.id ?? undefined)

  // State ngoài hook
  const [header,  setHeader]  = useState<SurveyHeader>((form as any)?.header  ?? DEFAULT_HEADER)
  const [footer,  setFooter]  = useState<SurveyFooter>((form as any)?.footer  ?? DEFAULT_FOOTER)
  const [logoUrl, setLogoUrl] = useState<string>((form as any)?.logoUrl ?? '')
  const [logoSize, setLogoSize] = useState<number>((form as any)?.logoSize ?? 120)
  const [logicRules, setLogicRules] = useState<LogicRule[]>((form as any)?.logicRules ?? [])
  const [descParagraphs, setDescParagraphs] = useState<string[]>((form as any)?.descriptionParagraphs ?? [])

  // Mobile
  const [winWidth, setWinWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [rightOpen, setRightOpen] = useState(false)
  useEffect(() => {
    const h = () => setWinWidth(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  const isMobile = winWidth < 768

  // Rename section
  const renameSection = useCallback((id: string, title: string) => {
    setSections(prev => prev.map((s: Section) => s.id === id ? { ...s, title } : s))
  }, [setSections])

  // Reorder câu hỏi
  const reorderQuestion = useCallback((dragId: string, overId: string) => {
    const fromIdx = questions.findIndex(q => q.id === dragId)
    const toIdx   = questions.findIndex(q => q.id === overId)
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return
    const steps = Math.abs(fromIdx - toIdx)
    const dir: 'up' | 'down' = fromIdx > toIdx ? 'up' : 'down'
    for (let i = 0; i < steps; i++) moveQuestion(dragId, dir)
  }, [questions, moveQuestion])

  // Drop từ bank (HTML drag API)
  const handleDrop = useCallback((e: React.DragEvent, afterId?: string) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/x-bank-question')
    if (!raw) return
    try {
      const q = JSON.parse(raw)
      const newId = addQuestion(afterId)
      updateQuestion(newId, {
        type: q.type,
        title: q.title ?? '',
        options: q.options ?? [],
      })
    } catch {}
  }, [addQuestion, updateQuestion])

  // Thêm từ bank qua nút +
  const handleDropFromBank = useCallback((q: any) => {
    const newId = addQuestion()
    updateQuestion(newId, {
      type: q.type,
      title: q.title ?? '',
      options: q.options ?? [],
    })
  }, [addQuestion, updateQuestion])

  // Save — truyền toàn bộ extras vào handleSave
  const extrasRef = useRef({ header, footer, logoUrl, logoSize, logicRules, descriptionParagraphs: descParagraphs })
  useEffect(() => {
    extrasRef.current = { header, footer, logoUrl, logoSize, logicRules, descriptionParagraphs: descParagraphs }
  }, [header, footer, logoUrl, logoSize, logicRules, descParagraphs])

  // handleSaveAll: chỉ lưu API, KHÔNG navigate (dùng cho auto-save và nút Lưu thủ công)
  const handleSaveOnly = useCallback(async () => {
    await handleSave(extrasRef.current)
  }, [handleSave])

  // handleSaveAndBack: lưu xong mới gọi onSave để navigate (chỉ dùng khi user bấm nút Lưu rồi muốn quay lại)
  const handleSaveAll = useCallback(async () => {
    const result = await handleSave(extrasRef.current)
    if (result) onSave(result)
  }, [handleSave, onSave])

  // Auto-save debounce — chỉ gọi handleSaveOnly, KHÔNG navigate
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      handleSaveOnly()
    }, 3000)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, sections, name, header, footer, logoUrl, logoSize, logicRules, descParagraphs])

  // Mobile drawer
  const RightDrawer = () => {
    if (!isMobile || !rightOpen) return null
    return (
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end' }}
        onClick={() => setRightOpen(false)}
      >
        <div
          style={{ width: 300, maxWidth: '90vw', height: '100%', background: '#fff', boxShadow: '-4px 0 28px rgba(0,0,0,.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          onClick={e => e.stopPropagation()}
        >
          <RightPanel
            questions={questions}
            sections={sections}
            logoSize={logoSize}
            logicRules={logicRules}
            onAddBlank={_type => { addQuestion(); setRightOpen(false) }}
            onDropFromBank={q => { handleDropFromBank(q); setRightOpen(false) }}
            onLogoSizeChange={setLogoSize}
            onLogicRulesChange={setLogicRules}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', background: '#fff' }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e8eaed', padding: '0 12px', height: 48, flexShrink: 0, gap: 8, background: '#fff' }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} />

        <div style={{ width: 1, height: 18, background: '#e8eaed', flexShrink: 0 }} />

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tên form..."
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: isMobile ? 13 : 14, fontWeight: 600, color: '#111827', fontFamily: 'inherit', background: 'transparent', minWidth: 0, padding: '4px 6px', borderRadius: 6 }}
          onFocus={e => (e.currentTarget.style.background = '#f9fafb')}
          onBlur={e => (e.currentTarget.style.background = 'transparent')}
        />

        <Button
          type={saved ? 'default' : 'primary'}
          icon={saved ? <CheckOutlined /> : <SaveOutlined />}
          onClick={handleSaveAll}
          loading={saving}
          style={{ background: saved ? '#f0fdf4' : undefined, color: saved ? '#16a34a' : undefined, borderColor: saved ? '#bbf7d0' : undefined, flexShrink: 0 }}
        >
          {!isMobile && (saved ? 'Đã lưu' : 'Lưu')}
        </Button>
      </div>

      {/* Main layout */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', position: 'relative' }}>

        {/* Center canvas */}
        <div style={{ flex: 1, height: '100%', overflow: 'hidden', minWidth: 0 }}>
          <CenterCanvas
            questions={questions}
            sections={sections}
            activeQuestionId={activeId}
            accent={ACCENT}
            surveyTitle={name}
            descriptionParagraphs={descParagraphs}
            header={header}
            footer={footer}
            logoUrl={logoUrl}
            logoSize={logoSize}
            onActivate={setActiveId}
            onDeactivate={() => setActiveId(null)}
            onUpdate={updateQuestion}
            onDuplicate={duplicateQuestion}
            onRemove={removeQuestion}
            onMoveUp={id => moveQuestion(id, 'up')}
            onMoveDown={id => moveQuestion(id, 'down')}
            onAddQuestion={addQuestion}
            onAddSectionAfter={addSectionAfter}
            onAddOption={addOption}
            onUpdateOption={updateOption}
            onRemoveOption={removeOption}
            onTitleChange={setName}
            onDescriptionParagraphsChange={setDescParagraphs}
            onHeaderChange={setHeader}
            onFooterChange={setFooter}
            onSectionsChange={setSections}
            onDrop={handleDrop}
            onReorder={reorderQuestion}
            onRenameSection={renameSection}
            onDeleteSection={deleteSection}
          />
        </div>

        {/* Right panel (desktop) */}
        {!isMobile && (
          <RightPanel
            questions={questions}
            sections={sections}
            logoSize={logoSize}
            logicRules={logicRules}
            onAddBlank={() => addQuestion()}
            onDropFromBank={handleDropFromBank}
            onLogoSizeChange={setLogoSize}
            onLogicRulesChange={setLogicRules}
          />
        )}
      </div>

      {/* Mobile drawer + bottom bar */}
      <RightDrawer />

      {isMobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 52, background: '#fff', borderTop: '1px solid #e8eaed', display: 'flex', alignItems: 'center', zIndex: 100, boxShadow: '0 -2px 12px rgba(0,0,0,.06)' }}>
          <button
            onClick={() => setRightOpen(o => !o)}
            style={{ flex: 1, height: '100%', border: 'none', background: rightOpen ? '#f1f5f9' : '#fff', color: rightOpen ? '#334155' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: rightOpen ? 700 : 500 }}
          >
            <AppstoreOutlined /> Thư viện / Giao diện
          </button>
        </div>
      )}
    </div>
  )
}
