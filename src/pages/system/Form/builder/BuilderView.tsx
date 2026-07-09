import { useState, useEffect, useCallback, useRef } from 'react'
import { Button, Input, Drawer, Flex, Tooltip, Tag, message } from 'antd'
import { ArrowLeftOutlined, CheckOutlined, AppstoreOutlined, CloudUploadOutlined, StopOutlined } from '@ant-design/icons'
import { useFormBuilder } from '../../../../feature/form/hooks/useFormBuilder'
import type { Form, Section, SurveyFooter, SurveyHeader } from '../../../../feature/form/types'
import { CenterCanvas } from './canvas/CenterCanvas'
import { RightPanel } from './panels/RightPanel'
import type { LogicRule } from './panels/LogicPanel'

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

const ACCENT = '#279f2d'

// Re-export để useFormPersistence import không vỡ — nguồn chuẩn là LogicPanel
export type { LogicRule } from './panels/LogicPanel'

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
    groupQuestions, ungroupQuestion,
    saving, saved, saveError, handleSave,
    publishing, publishError, formStatus, handlePublish, handleUnpublish,
    loading,
  } = useFormBuilder(mode, form?.id ?? undefined, form?.name)

  // FIX: hiện lỗi lưu/xuất bản từ server — trước đây lỗi bị nuốt, user không biết vì sao không lưu được
  useEffect(() => {
    if (saveError) message.error({ content: saveError, key: 'form-save-error', duration: 5 })
  }, [saveError])
  useEffect(() => {
    if (publishError) message.error({ content: publishError, key: 'form-publish-error', duration: 5 })
  }, [publishError])

  const [header,  setHeader]  = useState<SurveyHeader>((form as any)?.header  ?? DEFAULT_HEADER)
  const [footer,  setFooter]  = useState<SurveyFooter>((form as any)?.footer  ?? DEFAULT_FOOTER)
  const [logoUrl, setLogoUrl] = useState<string>((form as any)?.logoUrl ?? '')
  const [logoSize, setLogoSize] = useState<number>((form as any)?.logoSize ?? 120)
  const [logicRules, setLogicRules] = useState<LogicRule[]>((form as any)?.logicRules ?? [])
  // themeId = bố cục header: 'classic' (logo trái) | 'centered' (logo giữa) | 'right' (logo phải)
  const [themeId, setThemeId] = useState<string>(
    ['classic', 'centered', 'right'].includes(form?.themeId as string) ? form!.themeId : 'classic'
  )
  const [descParagraphs, setDescParagraphs] = useState<string[]>(() => {
    const desc: string = (form as any)?.description ?? ''
    return desc ? desc.split('\n').filter(Boolean) : []
  })

  const [winWidth, setWinWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [rightOpen, setRightOpen] = useState(false)
  useEffect(() => {
    const h = () => setWinWidth(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  const isMobile = winWidth < 768

  const extrasRef = useRef({ header, footer, logoUrl, logoSize, logicRules, themeId, descriptionParagraphs: descParagraphs })
  useEffect(() => { extrasRef.current = { header, footer, logoUrl, logoSize, logicRules, themeId, descriptionParagraphs: descParagraphs } }, [header, footer, logoUrl, logoSize, logicRules, themeId, descParagraphs])

  const renameSection = useCallback((id: string, title: string) => {
    setSections(prev => prev.map((s: Section) => s.id === id ? { ...s, title } : s))
  }, [setSections])

  const reorderQuestion = useCallback((dragId: string, overId: string) => {
    const fromIdx = questions.findIndex(q => q.id === dragId)
    const toIdx   = questions.findIndex(q => q.id === overId)
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return
    const steps = Math.abs(fromIdx - toIdx)
    const dir: 'up' | 'down' = fromIdx > toIdx ? 'up' : 'down'
    for (let i = 0; i < steps; i++) moveQuestion(dragId, dir)
  }, [questions, moveQuestion])

  const handleAddQuestion = useCallback((afterId?: string, patch?: Partial<import('../../../../feature/form/types').Question>) => {
    const newId = addQuestion(afterId)
    if (patch && Object.keys(patch).length > 0) updateQuestion(newId, patch)
    return newId
  }, [addQuestion, updateQuestion])

  const handleDrop = useCallback((e: React.DragEvent, afterId?: string) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/x-bank-question')
    if (!raw) return
    try {
      const q = JSON.parse(raw)
      const newId = addQuestion(afterId)
      updateQuestion(newId, { type: q.type, title: q.title ?? '', options: q.options ?? [] })
    } catch {}
  }, [addQuestion, updateQuestion])

  const handleDropFromBank = useCallback((q: any) => {
    const newId = addQuestion()
    updateQuestion(newId, { type: q.type, title: q.title ?? '', options: q.options ?? [] })
  }, [addQuestion, updateQuestion])

  const handleSaveOnly = useCallback(async () => {
    const result = await handleSave(extrasRef.current)
    if (result && formStatus === 'published') {
      await handleUnpublish()
      message.info('Form đã được tự động hủy xuất bản do có thay đổi.')
    }
  }, [handleSave, formStatus, handleUnpublish])

  const handlePublishClick = useCallback(async () => {
    if (!name.trim()) {
      message.error('Vui lòng nhập tên form trước khi xuất bản.')
      return
    }
    const savedForm = await handleSave(extrasRef.current)
    if (!savedForm) {
      message.error('Lưu form thất bại, vui lòng thử lại.')
      return
    }
    const result = await handlePublish()
    if (result) {
      message.success('Đã xuất bản form!')
      onSave(result)
    }
  }, [name, handleSave, handlePublish, onSave])

  const handleUnpublishClick = useCallback(async () => {
    const result = await handleUnpublish()
    if (result) message.info('Đã hủy xuất bản.')
  }, [handleUnpublish])

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipCountRef = useRef(mode === 'edit' ? 2 : 1)
  const unmountingRef = useRef(false)
  const handleSaveOnlyRef = useRef(handleSaveOnly)
  handleSaveOnlyRef.current = handleSaveOnly
  useEffect(() => {
    if (loading) return
    if (skipCountRef.current > 0) {
      skipCountRef.current--
      return
    }
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => { handleSaveOnlyRef.current() }, 3000)
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
        if (unmountingRef.current) handleSaveOnlyRef.current()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, sections, name, header, footer, logoUrl, logoSize, logicRules, themeId, descParagraphs, loading])
  // Khai báo SAU effect debounce: cleanup chạy theo thứ tự LIFO nên cờ này
  // được set TRƯỚC khi cleanup của effect debounce chạy lúc unmount.
  useEffect(() => {
    return () => { unmountingRef.current = true }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', background: '#fff' }}>

      {/* Topbar */}
      <Flex align="center" gap={8} style={{ borderBottom: '1px solid #e8eaed', padding: '0 12px', height: 48, flexShrink: 0, background: '#fff' }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} />
        <div style={{ width: 1, height: 18, background: '#e8eaed', flexShrink: 0 }} />

        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tên form..."
          variant="borderless"
          style={{ flex: 1, fontSize: isMobile ? 13 : 14, fontWeight: 600, minWidth: 0 }}
        />

        {saving && (
          <span style={{ fontSize: 14, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            {!isMobile && 'Đang lưu...'}
          </span>
        )}
        {!saving && saved && (
          <span style={{ fontSize: 14, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckOutlined style={{ fontSize: 13 }} />
            {!isMobile && 'Đã lưu'}
          </span>
        )}
        {!saving && !saved && saveError && (
          <Tooltip title={saveError}>
            <span style={{ fontSize: 14, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4, cursor: 'help' }}>
              <StopOutlined style={{ fontSize: 13 }} />
              {!isMobile && 'Lưu thất bại'}
            </span>
          </Tooltip>
        )}

        {formStatus === 'published' ? (
          <Button
            loading={publishing}
            onClick={handleUnpublishClick}
            style={{ background: '#f0fdf4', borderColor: '#86efac', color: '#16a34a', fontWeight: 600 }}
          >
            {!isMobile && 'Đã xuất bản'}
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<CloudUploadOutlined />}
            loading={publishing}
            onClick={handlePublishClick}
            style={{ background: '#16a34a', borderColor: '#16a34a', fontWeight: 600 }}
          >
            {!isMobile && 'Xuất bản'}
          </Button>
        )}
      </Flex>

      {/* Main layout */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', position: 'relative' }}>
        <div style={{ flex: 1, height: '100%', overflow: 'hidden', minWidth: 0 }}>
          <CenterCanvas
            questions={questions} sections={sections} activeQuestionId={activeId}
            accent={ACCENT} surveyTitle={name} descriptionParagraphs={descParagraphs}
            header={header} footer={footer} logoUrl={logoUrl} logoSize={logoSize} themeId={themeId}
            onActivate={setActiveId} onDeactivate={() => setActiveId(null)}
            onUpdate={updateQuestion} onDuplicate={duplicateQuestion} onRemove={removeQuestion}
            onMoveUp={id => moveQuestion(id, 'up')} onMoveDown={id => moveQuestion(id, 'down')}
            onAddQuestion={handleAddQuestion} onAddSectionAfter={addSectionAfter}
            onAddOption={addOption} onUpdateOption={updateOption} onRemoveOption={removeOption}
            onGroupQuestions={groupQuestions} onUngroupQuestion={ungroupQuestion}
            onTitleChange={setName} onDescriptionParagraphsChange={setDescParagraphs}
            onHeaderChange={setHeader} onFooterChange={setFooter} onSectionsChange={setSections}
            onDrop={handleDrop} onReorder={reorderQuestion}
            onRenameSection={renameSection} onDeleteSection={deleteSection}
          />
        </div>

        {!isMobile && (
          <RightPanel
            questions={questions} sections={sections} logoSize={logoSize} logicRules={logicRules}
            themeId={themeId}
            onAddBlank={() => addQuestion()} onDropFromBank={handleDropFromBank}
            onLogoSizeChange={setLogoSize} onLogicRulesChange={setLogicRules}
            onThemeChange={setThemeId}
            onUpdateQuestion={updateQuestion}
          />
        )}
      </div>

      {isMobile && (
        <>
          <Drawer open={rightOpen} onClose={() => setRightOpen(false)} placement="right" width={300}
            styles={{ body: { padding: 0 } }} title="Thư viện / Giao diện">
            <RightPanel
              questions={questions} sections={sections} logoSize={logoSize} logicRules={logicRules}
              themeId={themeId}
              onAddBlank={_type => { addQuestion(); setRightOpen(false) }}
              onDropFromBank={q => { handleDropFromBank(q); setRightOpen(false) }}
              onLogoSizeChange={setLogoSize} onLogicRulesChange={setLogicRules}
              onThemeChange={setThemeId}
              onUpdateQuestion={updateQuestion}
            />
          </Drawer>
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 52, background: '#fff', borderTop: '1px solid #e8eaed', display: 'flex', alignItems: 'center', zIndex: 100, boxShadow: '0 -2px 12px rgba(0,0,0,.06)' }}>
            <Button type="text" icon={<AppstoreOutlined />} onClick={() => setRightOpen(o => !o)} block
              style={{ height: '100%', fontSize: 12.5, fontWeight: rightOpen ? 700 : 500, color: rightOpen ? '#334155' : '#6b7280', background: rightOpen ? '#f1f5f9' : '#fff' }}>
              Thư viện / Giao diện
            </Button>
          </div>
        </>
      )}
    </div>
  )
}