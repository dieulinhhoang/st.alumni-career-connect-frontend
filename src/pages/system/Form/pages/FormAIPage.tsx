import { useNavigate } from 'react-router-dom'
import { createForm } from '../../../../feature/form/api'
import type { Form } from '../../../../feature/form/types'
import { AIView } from '../Aiview'
import '../survey.css'
import AdminLayout from '../../../../components/layout/AdminLayout'

//  /admin/forms/ai — tạo form bằng AI, lưu xong chuyển sang trang edit
export default function FormAIPage() {
  const navigate = useNavigate()

  const handleSave = async (partial: Omit<Form, 'id' | 'createdat' | 'themeId'>) => {
    try {
      const newForm = await createForm({
        name: partial.name,
        description: partial.description,
        sections: partial.sections,
        questions: partial.questions,
        themeId: 'blue',
      })
      navigate(`/admin/forms/${newForm.id}/edit`)
    } catch (e) {
      console.error('Tạo form AI thất bại:', e)
    }
  }

  return (
    <AdminLayout>
      <AIView onSave={handleSave} onBack={() => navigate('/admin/forms')} />
    </AdminLayout>
  )
}
