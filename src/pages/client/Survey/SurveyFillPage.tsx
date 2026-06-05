import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getBatchByIdPublic } from '../../../feature/alumni/api'
import type { SurveyBatch } from '../../../feature/alumni/types'
import { SurveyPreview } from '../../admin/Form/Preview'
import { IdentifyStep } from './IdentifyStep'
import type { Identity } from './IdentifyStep'
import { DoneScreen } from './DoneScreen'
import { NotActiveScreen } from './NotActiveScreen'
import { LoadingScreen, ErrorScreen } from './StatusScreens'
import { submitResponse } from './submitResponse'

type PageState = 'loading' | 'error' | 'not-active' | 'identify' | 'fill' | 'done'

/**
 * Số câu hỏi đầu tiên (theo thứ tự order) được tự động điền từ thông tin
 * xác thực SV và khoá lại, không cho phép chỉnh sửa.
 */
const LOCKED_COUNT = 8

/**
 * Map identity → initialValues cho 8 câu đầu của form.
 * Câu 1: Mã sinh viên
 * Câu 2: Họ và tên
 * Câu 9: Số điện thoại  (nếu identity có)
 * Câu 10: Email
 * Các câu còn lại trong LOCKED_COUNT giữ nguyên (rỗng, locked).
 *
 * Mapping dựa theo thứ tự (order) của question trong formSnapshot.
 */
function buildInitialValues(
  formSnapshot: SurveyBatch['formSnapshot'],
  identity: Identity
): Record<string, any> {
  if (!formSnapshot) return {}

  // Sắp xếp câu hỏi theo order
  const sortedQs = [...(formSnapshot.questions ?? [])].sort(
    (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)
  )

  const values: Record<string, any> = {}

  // Điền theo thứ tự câu hỏi (câu 1 = index 0, ...)
  // Câu 1 (index 0) = Mã sinh viên
  if (sortedQs[0]) values[sortedQs[0].id] = identity.studentId
  // Câu 2 (index 1) = Họ và tên
  if (sortedQs[1]) values[sortedQs[1].id] = identity.studentName
  // Câu 9 (index 8, nếu có) = Số điện thoại – để trống, đã locked
  // Câu 10 (index 9, nếu có) = Email
  if (sortedQs[9]) values[sortedQs[9].id] = identity.studentEmail

  return values
}

export default function SurveyFillPage() {
  const { id } = useParams<{ id: string }>()

  const [pageState, setPageState] = useState<PageState>('loading')
  const [batch,     setBatch]     = useState<SurveyBatch | null>(null)
  const [identity,  setIdentity]  = useState<Identity | null>(null)

  useEffect(() => {
    if (!id) { setPageState('error'); return }
    getBatchByIdPublic(Number(id))
      .then(b => {
        setBatch(b)
        const now   = new Date()
        const start = new Date(b.startDate)
        const end   = new Date(b.endDate)
        if (b.status !== 'active' || now < start || now > end) {
          setPageState('not-active')
        } else {
          setPageState('identify')
        }
      })
      .catch(() => setPageState('error'))
  }, [id])

  const handleIdentify = (info: Identity) => {
    setIdentity(info)
    setPageState('fill')
  }

  const handleSubmit = async (answers: Record<string, any>) => {
    if (!batch || !identity) return
    await submitResponse(batch.id, identity, answers)
    setPageState('done')
  }

  switch (pageState) {
    case 'loading':    return <LoadingScreen />
    case 'error':      return <ErrorScreen />
    case 'not-active': return <NotActiveScreen batch={batch} />
    case 'done':       return <DoneScreen batch={batch} />
    case 'identify':   return batch ? <IdentifyStep batch={batch} onContinue={handleIdentify} /> : null
    case 'fill':
      return batch?.formSnapshot
        ? <SurveyPreview
            form={batch.formSnapshot}
            onSubmit={handleSubmit}
            submitLabel="Gửi phiếu khảo sát"
            lockedCount={LOCKED_COUNT}
            initialValues={identity ? buildInitialValues(batch.formSnapshot, identity) : undefined}
          />
        : null
    default: return null
  }
}