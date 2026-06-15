import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { useFormList } from '../../../../feature/form/hooks/useFormList'
import { deleteForm, duplicateForm } from '../../../../feature/form/api'
import type { Form } from '../../../../feature/form/types'
import ListView from '../Listview'
import { DeleteModal } from '../Deletemodal'
import '../survey.css'
import AdminLayout from '../../../../components/layout/AdminLayout'

//  /admin/forms — danh sách form
export default function FormListPage() {
  const navigate = useNavigate()
  const { forms, loading, error, reload } = useFormList()
  const [deleteTarget, setDeleteTarget] = useState<Form | undefined>(undefined)

  const handleDelete = (id: number) => setDeleteTarget(forms.find((f) => f.id === id))
  const confirmDelete = async () => {
    if (deleteTarget?.id != null) {
      try {
        await deleteForm(deleteTarget.id as number)
        await reload()
      } catch (e: any) {
        message.error(e?.response?.data?.message ?? 'Xóa form thất bại')
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
          onCreate={() => navigate('/admin/forms/create')}
          onAI={() => navigate('/admin/forms/ai')}
          onEdit={(f) => navigate(`/admin/forms/${f.id}/edit`)}
          onPreview={(f) => navigate(`/admin/forms/${f.id}/preview`)}
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
