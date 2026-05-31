import { useState } from 'react'
import { useFormList } from '../../../feature/form/hooks/useFormList'
import { createForm, updateForm, deleteForm, duplicateForm } from '../../../feature/form/api'
import type { Form, Section, Question } from '../../../feature/form/types'
import { BuilderView } from './builder/BuilderView'
import PreviewView from './Preview'
import ListView from './Listview'
import { DeleteModal } from './Deletemodal'
import { AIView } from './Aiview'
import './survey.css'
import AdminLayout from '../../../components/layout/AdminLayout'

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
  const { forms, loading, error, reload } = useFormList()
  const [view, setView] = useState<ViewType>('list')
  const [activeForm, setActiveForm] = useState<Form | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Form | undefined>(undefined)

  //  handlers 
  const handleSaveFromBuilder = async (form: Form) => {
    try {
      if (form.id == null) {
        await createForm({
          name: form.name,
          description: form.description,
          sections: form.sections,
          questions: form.questions,
          themeId: form.themeId,
          header: form.header,
          footer: form.footer,
        })
      } else {
        await updateForm(form.id as number, {
          name: form.name,
          description: form.description,
          sections: form.sections,
          questions: form.questions,
          themeId: form.themeId,
          header: form.header,
          footer: form.footer,
        })
      }
      await reload()
    } catch (e) {
      console.error('Lưu form thất bại:', e)
    }
    setView('list')
  }

  const handleSaveFromAI = async (partial: Omit<Form, 'id' | 'createdat' | 'themeId'>) => {
    try {
      const newForm = await createForm({
        name: partial.name,
        description: partial.description,
        sections: partial.sections,
        questions: partial.questions,
        themeId: 'blue',
      })
      await reload()
      setActiveForm(newForm)
      setView('builder')
    } catch (e) {
      console.error('Tạo form AI thất bại:', e)
    }
  }

  const handleDelete = (id: number) => setDeleteTarget(forms.find((f) => f.id === id))
  const confirmDelete = async () => {
    if (deleteTarget?.id != null) {
      try {
        await deleteForm(deleteTarget.id as number)
        await reload()
      } catch (e) {
        console.error('Xóa form thất bại:', e)
      }
    }
    setDeleteTarget(undefined)
  }

  const handleDup = async (form: Form) => {
    try {
      await duplicateForm(form.id as number)
      await reload()
    } catch (e) {
      console.error('Nhân bản form thất bại:', e)
    }
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
        {error && (
          <div style={{ color: 'red', padding: '12px 16px', background: '#fff0f0', borderRadius: 8, marginBottom: 12 }}>
            {error}
          </div>
        )}
        <ListView
          forms={loading ? [] : forms}
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
      </div>
    </AdminLayout>
  )
}
