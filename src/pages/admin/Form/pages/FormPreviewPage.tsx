import { useNavigate, useParams } from 'react-router-dom'
import { useFormDetail } from '../../../../feature/form/hooks/useFormDetail'
import PreviewView from '../Preview'
import Loader from '../../../../components/common/loader'
import '../survey.css'
import AdminLayout from '../../../../components/layout/AdminLayout'

//  /admin/forms/:id/preview — luôn fetch bản mới nhất từ server
//  (autosave trong builder lưu thẳng DB nên dữ liệu trong list có thể stale)
export default function FormPreviewPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { form, loading, error } = useFormDetail(Number(id))

  if (loading) return <AdminLayout><Loader /></AdminLayout>
  if (error || !form) return (
    <AdminLayout>
      <div style={{ color: 'red', padding: '12px 16px', background: '#fff0f0', borderRadius: 8 }}>
        {error || `Không tìm thấy form #${id}.`}
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <PreviewView form={form} onBack={() => navigate('/admin/forms')} />
    </AdminLayout>
  )
}
