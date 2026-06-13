import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Spin, Result, Button } from 'antd'
import { useBatch } from '../../../feature/alumni/hooks/useBatch'
import { getFormById, updateForm } from '../../../feature/form/api'
import { updateBatch } from '../../../feature/alumni/api'
import type { Form } from '../../../feature/form/types'
import { BuilderView } from '../Form/builder/BuilderView'
import AdminLayout from '../../../components/layout/AdminLayout'

export default function BatchFormEditor() {
  const { id } = useParams<{ id: string }>()
  const batchId = Number(id)
  const navigate = useNavigate()

  const { batch, loading: batchLoading, error: batchError } = useBatch(batchId)

  const [form, setForm] = useState<Form | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Khi batch load xong, load form gốc theo formId
  useEffect(() => {
    if (!batch?.formId) return
    setFormLoading(true)
    getFormById(batch.formId)
      .then((f) => setForm(f))
      .catch(() => setFormError('Không thể tải form. Form có thể đã bị xóa.'))
      .finally(() => setFormLoading(false))
  }, [batch?.formId])

  const handleSave = async (updatedForm: Form) => {
    try {
      // 1. Lưu form gốc
      if (updatedForm.id != null) {
        await updateForm(updatedForm.id as number, {
          name: updatedForm.name,
          description: updatedForm.description,
          sections: updatedForm.sections,
          questions: updatedForm.questions,
          themeId: updatedForm.themeId,
          header: updatedForm.header,
          footer: updatedForm.footer,
        })
      }

      // 2. Cập nhật formSnapshot của batch để đồng bộ
      await updateBatch(batchId, { formSnapshot: updatedForm })

      navigate(`/admin/alumni/batches`)
    } catch (e) {
      console.error('Lưu form cho batch thất bại:', e)
    }
  }

  const loading = batchLoading || formLoading
  const error = batchError || formError

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Spin size="large" tip="Đang tải form..." />
        </div>
      </AdminLayout>
    )
  }

  if (error || !form) {
    return (
      <AdminLayout>
        <Result
          status="warning"
          title="Không thể tải form"
          subTitle={error ?? 'Form không tồn tại hoặc đã bị xóa'}
          extra={
            <Button type="primary" onClick={() => navigate('/admin/alumni/batches')}>
              Quay lại danh sách đợt
            </Button>
          }
        />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <BuilderView
        form={form}
        onSave={handleSave}
        onBack={() => navigate(`/admin/alumni/batches`)}
      />
    </AdminLayout>
  )
}