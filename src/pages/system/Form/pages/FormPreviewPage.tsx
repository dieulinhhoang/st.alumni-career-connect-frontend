import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Modal, message } from 'antd'
import { useFormDetail } from '../../../../feature/form/hooks/useFormDetail'
import PreviewView from '../Preview'
import { DoneScreen } from '../../../client/Survey/DoneScreen'
import Loader from '../../../../components/common/loader'
import '../survey.css'
import AdminLayout from '../../../../components/layout/AdminLayout'

//  /admin/forms/:id/preview — luôn fetch bản mới nhất từ server
//  (autosave trong builder lưu thẳng DB nên dữ liệu trong list có thể stale)
export default function FormPreviewPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { form, loading, error } = useFormDetail(Number(id))
  const [showDone, setShowDone] = useState(false)

  if (loading) return <AdminLayout><Loader /></AdminLayout>
  if (error || !form) return (
    <AdminLayout>
      <div style={{ color: 'red', padding: '12px 16px', background: '#fff0f0', borderRadius: 8 }}>
        {error || `Không tìm thấy form #${id}.`}
      </div>
    </AdminLayout>
  )

  // Gửi thử (test) — không lưu vào dữ liệu thật, chỉ hiển thị đáp án rồi chuyển sang trang "done"
  const handleTestSubmit = async (answers: Record<string, any>) => {
    message.success('Gửi thử thành công! (dữ liệu test, không được lưu)')
    Modal.info({
      title: 'Dữ liệu gửi thử',
      width: 640,
      content: (
        <pre style={{ maxHeight: 360, overflow: 'auto', background: '#f8fafc', padding: 12, borderRadius: 8, fontSize: 12 }}>
          {JSON.stringify(answers, null, 2)}
        </pre>
      ),
      // Sau khi đóng modal → hiện trang hoàn thành ngay trong preview
      onOk: () => {
        sessionStorage.setItem(`survey_done_${id}`, '1')
        setShowDone(true)
      },
    })
  }

  // Sau khi gửi thử → hiện trang "done" full màn hình (giống trang done thật)
  if (showDone) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 2000, overflowY: 'auto' }}>
        <button
          onClick={() => setShowDone(false)}
          style={{
            position: 'fixed', top: 16, left: 16, zIndex: 2100,
            background: 'rgba(255,255,255,0.92)', border: '1px solid #e2e8f0',
            borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600,
            color: '#0f172a', cursor: 'pointer',
          }}
        >
          ← Quay lại phiếu
        </button>
        <DoneScreen />
      </div>
    )
  }

  return (
    <AdminLayout>
      <PreviewView
        form={form}
        onBack={() => navigate('/admin/forms')}
        onSubmit={handleTestSubmit}
        submitLabel="Gửi thử"
      />
    </AdminLayout>
  )
}
