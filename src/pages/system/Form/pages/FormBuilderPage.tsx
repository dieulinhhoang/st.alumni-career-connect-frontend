import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createForm, updateForm } from '../../../../feature/form/api'
import { useFormDetail } from '../../../../feature/form/hooks/useFormDetail'
import type { Form, Section, Question } from '../../../../feature/form/types'
import { BuilderView } from '../builder/BuilderView'
import Loader from '../../../../components/common/loader'
import '../survey.css'
import AdminLayout from '../../../../components/layout/AdminLayout'

//  makeBlankForm helper
function makeBlankForm(): Form {
  const sectionId = `section_${Date.now()}`
  const defaultSection: Section = { id: sectionId, title: 'Phần 1', order: 0 }
  const defaultQuestion: Question = {
    id: `q_${Date.now()}`, type: 'text', title: 'Câu hỏi 1',
    placeholder: 'Câu trả lời của bạn', required: false, sectionId, order: 0, options: [],
  }
  return {
    id: null as any, name: '', description: '',
    sections: [defaultSection], questions: [defaultQuestion],
    themeId: 'classic',
    header: { ministry: 'Bộ Nông nghiệp và Môi trường', academy: 'Học viện Nông nghiệp Việt Nam', address: 'Xã Gia Lâm, Thành phố Hà Nội', phone: '024.62617586', showDate: true },
    footer: { primaryText: 'Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!', secondaryText: 'Kính chúc Anh/Chị sức khỏe và thành công!' },
  } as any
}

function BuilderScreen({ form }: { form: Form }) {
  const navigate = useNavigate()

  const handleSave = async (f: Form) => {
    try {
      const payload = {
        name: f.name,
        description: f.description,
        sections: f.sections,
        questions: f.questions,
        themeId: f.themeId,
        header: f.header,
        footer: f.footer,
      }
      if (f.id == null) {
        await createForm(payload)
      } else {
        await updateForm(f.id as number, payload)
      }
    } catch (e) {
      console.error('Lưu form thất bại:', e)
    }
    navigate('/admin/forms')
  }

  return (
    <AdminLayout>
      <BuilderView form={form} onSave={handleSave} onBack={() => navigate('/admin/forms')} />
    </AdminLayout>
  )
}

// /admin/forms/create — form trắng
function CreateScreen() {
  const [blank] = useState<Form>(() => makeBlankForm())
  return <BuilderScreen form={blank} />
}

// /admin/forms/:id/edit — load form theo id từ server
function EditScreen({ id }: { id: number }) {
  const { form, loading, error } = useFormDetail(id)

  if (loading) return <AdminLayout><Loader /></AdminLayout>
  if (error || !form) return (
    <AdminLayout>
      <div style={{ color: 'red', padding: '12px 16px', background: '#fff0f0', borderRadius: 8 }}>
        {error || `Không tìm thấy form #${id}.`}
      </div>
    </AdminLayout>
  )

  return <BuilderScreen form={form} />
}

//  FormBuilderPage — dùng chung cho cả /create và /:id/edit
export default function FormBuilderPage() {
  const { id } = useParams()
  return id != null ? <EditScreen id={Number(id)} /> : <CreateScreen />
}
