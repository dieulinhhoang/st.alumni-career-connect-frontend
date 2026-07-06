import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Spin, Result, Button } from 'antd'
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useBatch } from '../../../feature/alumni/hooks/useBatch'
import { getFormById } from '../../../feature/form/api'
import type { Form } from '../../../feature/form/types'
import { SurveyPreview } from '../Form/Preview'
import AdminLayout from '../../../components/layout/AdminLayout'
import '../Form/survey.css'

export default function BatchFormEditor() {
  const { id } = useParams<{ id: string }>()
  const batchId = Number(id)
  const navigate = useNavigate()

  const { batch, loading: batchLoading, error: batchError } = useBatch(batchId)
  const [form, setForm] = useState<Form | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!batch?.formId) return
    setFormLoading(true)
    getFormById(batch.formId)
      .then((f) => setForm(f))
      .catch(() => setFormError('Không thể tải form. Form có thể đã bị xóa.'))
      .finally(() => setFormLoading(false))
  }, [batch?.formId])

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
          extra={<Button type="primary" onClick={() => navigate('/admin/alumni/batches')}>Quay lại</Button>}
        />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/alumni/batches')}>
          Quay lại
        </Button>
        {batch?.status === 'draft' && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/forms/${batch.formId}/edit`)}
          >
            Chỉnh sửa form
          </Button>
        )}
      </div>

      <SurveyPreview
        form={form}
        onBack={() => navigate('/admin/alumni/batches')}
      />
    </AdminLayout>
  )
}
