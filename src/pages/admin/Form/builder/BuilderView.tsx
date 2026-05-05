import { useState, useEffect, useCallback } from 'react'
import { Button } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, CheckOutlined, AppstoreOutlined } from '@ant-design/icons'
import { useFormBuilder } from '../../../../feature/form/hooks/useFormBuilder'
import type { Form, Section, SurveyFooter, SurveyHeader } from '../../../../feature/form/types'
import { ACCENT_COLORS } from '../../../../feature/form/constants'
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

  //  Tất cả state câu hỏi + section từ useFormBuilder 
  const {
    name, setName,
    questions,
    activeId, setActiveId,
    sections, setSections,
    addQuestion, duplicateQuestion, removeQuestion, updateQuestion, moveQuestion,
    addSectionAfter, deleteSection,
    addOption, updateOption, removeOption,
    saving, saved, handleSave,
  } = useFormBuilder(mode, form?.id)

  //  State ngoài hook 
  const [accent, setAccent] = useState(
    ACCENT_COLORS.includes(form?.themeId ?? '') ? (form?.themeId ?? ACCENT_COLORS[0]) : ACCENT_COLORS[0]
  )
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

  //  Rename section 
  const renameSection = useCallback((id: string, title: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, title } : s))
  }, [setSections])

  //  Reorder câu hỏi (dnd-kit gọi với dragId, overId) 
  const reorderQuestion = useCallback((dragId: string, overId: string) => {
    // dùng setQs functional update qua updateQuestion không đủ —
    // cần expose setQuestions từ hook hoặc dùng moveQuestion loop.
    // Cách sạch nhất: thêm reorderQuestion vào useFormBuilder (xem bên dưới).
    // Tạm thời dùng moveQuestion:
    const fromIdx = questions.findIndex(q => q.id === dragId)
    const toIdx   = questions.findIndex(q => q.id === overId)
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return
    const steps = Math.abs(fromIdx - toIdx)
    const dir: 'up' | 'down' = fromIdx > toIdx ? 'up' : 'down'
    for (let i = 0; i < steps; i++) moveQuestion(dragId, dir)
  }, [questions, moveQuestion])

  //  Drop từ bank (HTML drag API) 
  const handleDrop = useCallback((e: React.DragEvent, afterId?: string) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/x-bank-question')
    if (!raw) return
    try {
      const q = JSON.parse(raw)
      addQuestion(afterId)
      // activeId sẽ được set bởi addQuestion → dùng setTimeout để patch
      setTimeout(() => {
        setActiveId(prev => {
          if (prev) updateQuestion(prev, {
            type: q.type,
            title: q.title ?? '',
            options: q.options ?? [],
          })
          return prev
        })
      }, 0)
    } catch {}
  }, [addQuestion, updateQuestion, setActiveId])

  //  Thêm từ bank qua nút + 
  const handleDropFromBank = useCallback((q: any) => {
    addQuestion()
    setTimeout(() => {
      setActiveId(prev => {
        if (prev) updateQuestion(prev, {
          type: q.type,
          title: q.title ?? '',
          options: q.options ?? [],
        })
        return prev
      })
    }, 0)
  }, [addQuestion, updateQuestion, setActiveId])

  //  Save 
  const handleSaveAll = useCallback(async () => {
    const result = await handleSave()
    if (result) onSave(result)
  }, [handleSave, onSave])

  // Beforeunload
  useEffect(() => {
    const handler = () => handleSaveAll()
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [handleSaveAll])

  //  Mobile drawer 
  const RightDrawer = () => {
    if (!isMobile || !rightOpen) return null
    return (
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end' }}
        onClick={() => setRightOpen(false)}
      >
        <div
          style={{ width: 280, maxWidth: '85vw', height: '100%', background: '#fff', boxShadow: '-4px 0 28px rgba(0,0,0,.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          onClick={e => e.stopPropagation()}
        >
          <RightPanel
            questions={questions}
            sections={sections}
            accent={accent}
            activeTheme={accent}
            logoSize={logoSize}
            logicRules={logicRules}
            onAddBlank={type => { addQuestion(); setRightOpen(false) }}
            onDropFromBank={q => { handleDropFromBank(q); setRightOpen(false) }}
            onThemeChange={(_key, color) => setAccent(color)}
            onLogoSizeChange={setLogoSize}
            onLogicRulesChange={setLogicRules}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', background: '#fff' }}>

      {/*  Topbar  */}
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e8eaed', padding: '0 12px', height: 48, flexShrink: 0, gap: 8, background: '#fff' }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack}>
          {!isMobile && 'Quay lại'}
        </Button>

        <div style={{ width: 1, height: 18, background: '#e8eaed', flexShrink: 0 }} />

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tên form..."
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: isMobile ? 13 : 14, fontWeight: 600, color: '#111827', fontFamily: 'inherit', background: 'transparent', minWidth: 0, padding: '4px 6px', borderRadius: 6 }}
          onFocus={e => (e.currentTarget.style.background = '#f9fafb')}
          onBlur={e => (e.currentTarget.style.background = 'transparent')}
        />

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: `${accent}12`, border: `1px solid ${accent}30`, flexShrink: 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: accent, fontFamily: 'monospace' }}>{accent}</span>
          </div>
        )}

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

      {/*  Main layout  */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', position: 'relative' }}>

        {/* Center canvas */}
        <div style={{ flex: 1, height: '100%', overflow: 'hidden', minWidth: 0 }}>
          <CenterCanvas
            questions={questions}
            sections={sections}
            activeQuestionId={activeId}
            accent={accent}
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
            accent={accent}
            activeTheme={accent}
            logoSize={logoSize}
            logicRules={logicRules}
            onAddBlank={() => addQuestion()}
            onDropFromBank={handleDropFromBank}
            onThemeChange={(_key, color) => setAccent(color)}
            onLogoSizeChange={setLogoSize}
            onLogicRulesChange={setLogicRules}
          />
        )}
      </div>

      {/*  Mobile drawer + bottom bar  */}
      <RightDrawer />

      {isMobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 52, background: '#fff', borderTop: '1px solid #e8eaed', display: 'flex', alignItems: 'center', zIndex: 100, boxShadow: '0 -2px 12px rgba(0,0,0,.06)' }}>
          <button
            onClick={() => setRightOpen(o => !o)}
            style={{ flex: 1, height: '100%', border: 'none', background: rightOpen ? `${accent}12` : '#fff', color: rightOpen ? accent : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: rightOpen ? 700 : 500 }}
          >
            <AppstoreOutlined /> Thư viện / Giao diện
          </button>
        </div>
      )}
    </div>
  )
}