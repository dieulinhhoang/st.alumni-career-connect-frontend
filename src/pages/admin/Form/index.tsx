import { useState, useEffect, useRef } from 'react'
import { MOCK_FORMS } from '../../../feature/form/constants'
import type { Form, Section, Question } from '../../../feature/form/types'
import { BuilderView } from './builder/BuilderView'
import PreviewView from './Preview'
import ListView from './Listview'
import { DeleteModal } from './Deletemodal'
import { AIView } from './Aiview'
import './survey.css'
import AdminLayout from '../../../components/layout/AdminLayout'

const DRAFT_KEY = 'survey_draftlist'

function loadDraft(): Form | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Form
  } catch { return null }
}
function saveDraft(forms: Form[]) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(forms)) } catch { }
}
function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY) } catch { }
}

//  DraftBanner 
function DraftBanner({ onRestore, onDiscard }: { onRestore: () => void; onDiscard: () => void }) {
  return (
    <div role="status" aria-live="polite" style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 500, background: '#1e293b', color: '#fff', borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 32px rgba(0,0,0,.25)', fontSize: 13, fontWeight: 500, animation: 'fade-in-up .3s ease', maxWidth: '90vw' }}>
      <span>Tìm thấy bản nháp chưa lưu</span>
      <button onClick={onRestore} style={{ background: '#3b82f6', border: 'none', color: '#fff', borderRadius: 7, padding: '5px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit' }}>Khôi phục</button>
      <button onClick={onDiscard} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,.3)', color: 'rgba(255,255,255,.8)', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Bỏ qua</button>
    </div>
  )
}

//  makeBlankForm helper 
function makeBlankForm(): Form {
  const sectionId = `section_${Date.now()}`
  const defaultSection: Section = { id: sectionId, title: 'Phần 1', order: 0 }
  const defaultQuestion: Question = {
    id: `q_${Date.now()}`, type: 'short', title: 'Câu hỏi 1',
    placeholder: 'Câu trả lời của bạn', required: false, sectionId, order: 0, options: [],
  }
  return {
    id: null as any, name: '', description: '',
    sections: [defaultSection], questions: [defaultQuestion],
    themeId: 'blue',
    header: { ministry: 'Bộ Nông nghiệp và Môi trường', academy: 'Học viện Nông nghiệp Việt Nam', address: 'Xã Gia Lâm, Thành phố Hà Nội', phone: '024.62617586', showDate: true },
    footer: { primaryText: 'Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!', secondaryText: 'Kính chúc Anh/Chị sức khỏe và thành công!' },
  } as any
}

//  SurveyPage 
type ViewType = 'list' | 'builder' | 'ai' | 'preview'

export default function SurveyPage() {
  const [forms, setForms] = useState<Form[]>(MOCK_FORMS)
  const [view, setView] = useState<ViewType>('list')
  const [activeForm, setActiveForm] = useState<Form | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Form | undefined>(undefined)
  const [draftAvailable, setDraftAvailable] = useState<Form[] | null>(loadDraft)
  const hasUserEdited = useRef(false)

  // Autosave with debounce + immediate save on tab close
  useEffect(() => {
    if (!hasUserEdited.current) return
    const timer = setTimeout(() => saveDraft(forms), 2000)
    return () => clearTimeout(timer)
  }, [forms])

  useEffect(() => {
    const handler = () => { if (hasUserEdited.current) saveDraft(forms) }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [forms])

  //  handlers 
  const handleSaveFromBuilder = (form: Form) => {
    hasUserEdited.current = true
    setForms((prev) => {
      const exists = prev.some((f) => f.id === form.id)
      if (exists) return prev.map((f) => (f.id === form.id ? form : f))
      return [{ ...form, id: Date.now(), createdat: new Date().toISOString().slice(0, 10) }, ...prev]
    })
    setView('list')
  }

  const handleSaveFromAI = (partial: Omit<Form, 'id' | 'createdat' | 'themeId'>) => {
    hasUserEdited.current = true
    const newForm = { ...partial, id: Date.now(), createdat: new Date().toISOString().slice(0, 10), themeId: 'blue' } as Form
    setForms((prev) => [newForm, ...prev])
    setActiveForm(newForm)
    setView('builder')
  }

  const handleDelete = (id: number) => setDeleteTarget(forms.find((f) => f.id === id))
  const confirmDelete = () => {
    if (deleteTarget?.id != null) {
      hasUserEdited.current = true
      setForms((prev) => prev.filter((f) => f.id !== deleteTarget.id))
    }
    setDeleteTarget(undefined)
  }

  const handleDup = (form: Form) => {
    hasUserEdited.current = true
    const copy = { ...form, id: Date.now(), name: `${form.name} (bản sao)`, createdat: new Date().toISOString().slice(0, 10) }
    setForms((prev) => [copy, ...prev])
  }

  //  routing 
  if (view === 'builder') return (
    <AdminLayout>
      <BuilderView form={activeForm} onSave={handleSaveFromBuilder} onBack={() => setView('list')} />
    </AdminLayout>
  )
  if (view === 'ai') return (
    <AdminLayout>
      <AIView onSave={handleSaveFromAI} onBack={() => setView('list')} />
    </AdminLayout>
  )
  if (view === 'preview') return (
    <AdminLayout>
      <PreviewView form={activeForm} onBack={() => setView('list')} />
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div className="">
        <ListView
          forms={forms}
          onCreate={() => { const blank = makeBlankForm(); setActiveForm(blank); setView('builder') }}
          onAI={() => setView('ai')}
          onEdit={(f) => { setActiveForm(f); setView('builder') }}
          onPreview={(f) => { setActiveForm(f); setView('preview') }}
          onDup={handleDup}
          onDelete={handleDelete}
        />

        {/* Delete confirmation */}
        {deleteTarget && (
          <DeleteModal form={deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(undefined)} />
        )}

        {/* Draft restore banner */}
        {draftAvailable && (
          <DraftBanner
            onRestore={() => { setForms(draftAvailable as any); setDraftAvailable(null) }}
            onDiscard={() => { clearDraft(); setDraftAvailable(null) }}
          />
        )}
      </div>
    </AdminLayout>
  )
}