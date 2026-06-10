import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getBatchByIdPublic, getStudentFromGraduation, verifyStudentByFields } from '../../../feature/alumni/api'
import type { SurveyBatch } from '../../../feature/alumni/types'
import { SurveyPreview } from '../../admin/Form/Preview'
import { IdentifyStep } from './IdentifyStep'
import type { Identity } from './IdentifyStep'
import { NotActiveScreen } from './NotActiveScreen'
import { LoadingScreen, ErrorScreen } from './StatusScreens'
import { submitResponse } from './submitResponse'

type PageState = 'loading' | 'error' | 'not-active' | 'identify' | 'fill'

/**
 * Số câu hỏi đầu tiên (theo thứ tự order) được tự động điền từ thông tin
 * xác thực SV và khoá lại, không cho phép chỉnh sửa.
 *
 * Câu 1–8 luôn bị khoá vì dữ liệu đến từ bước xác thực (IdentifyStep).
 * Câu 9–10 (SĐT, Email) chỉ được prefill nếu có studentData nhưng KHÔNG bị khoá
 * để SV có thể cập nhật nếu thông tin thay đổi.
 */
const LOCKED_COUNT = 8

/**
 * Mapping thứ tự câu hỏi → field của student (dựa theo form chuẩn VNUA):
 *  1 (index 0): Mã sinh viên
 *  2 (index 1): Họ và tên
 *  3 (index 2): Giới tính
 *  4 (index 3): Ngày sinh
 *  5 (index 4): Mã ngành đào tạo
 *  6 (index 5): Số CCCD
 *  7 (index 6): Khóa học (school_year_end)
 *  8 (index 7): Tên ngành được đào tạo
 *  9 (index 8): Số điện thoại  ← prefill nhưng không khoá
 * 10 (index 9): Email          ← prefill nhưng không khoá
 */
function buildInitialValues(
  formSnapshot: SurveyBatch['formSnapshot'],
  identity: Identity,
): Record<string, any> {
  if (!formSnapshot) return {}

  const sortedQs = [...(formSnapshot.questions ?? [])].sort(
    (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0),
  )

  const sd = identity.studentData
  const values: Record<string, any> = {}

  const set = (idx: number, val: any) => {
    if (sortedQs[idx] && val !== null && val !== undefined && val !== '') {
      values[sortedQs[idx].id] = val
    }
  }

  // ── Câu 1–2: luôn có từ IdentifyStep ──────────────────────────────────────

  // Câu 1: Mã sinh viên
  set(0, identity.studentId)

  // Câu 2: Họ và tên
  set(1, sd?.full_name || identity.studentName)

  // ── Câu 3–9: lấy từ studentData (có đợt tốt nghiệp) ──────────────────────

  if (sd) {
    // Câu 3: Giới tính — chuyển enum → tiếng Việt để hiển thị đúng trong form
    const genderMap: Record<string, string> = {
      male: 'Nam',
      female: 'Nữ',
      other: 'Khác',
    }
    set(2, sd.gender ? (genderMap[sd.gender] ?? sd.gender) : null)

    // Câu 4: Ngày sinh — format YYYY-MM-DD (date input chuẩn HTML)
    if (sd.dob) {
      const d = new Date(sd.dob)
      if (!isNaN(d.getTime())) {
        set(3, d.toISOString().slice(0, 10))
      }
    }

    // Câu 5: Mã ngành đào tạo
    set(4, sd.training_industry_code)

    // Câu 6: Số CCCD
    set(5, sd.citizen_identification)

    // Câu 7: Khóa học
    set(6, sd.school_year_end)

    // Câu 8: Tên ngành được đào tạo
    set(7, sd.training_industry_name)

    // Câu 9: Số điện thoại (prefill nhưng không khoá — SV có thể cập nhật)
    set(8, sd.phone)
  }

  // ── Câu 10: Email — ưu tiên studentData, fallback về IdentifyStep ──────────
  // (prefill nhưng không khoá)
  set(9, sd?.email || identity.studentEmail)

  return values
}

export default function SurveyFillPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [pageState, setPageState] = useState<PageState>('loading')
  const [batch, setBatch] = useState<SurveyBatch | null>(null)
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (!id) { setPageState('error'); return }
    getBatchByIdPublic(Number(id))
      .then(async b => {
        setBatch(b)
        const now = new Date()
        const start = new Date(b.startDate)
        const end = new Date(b.endDate)
        if (b.status !== 'active' || now < start || now > end) {
          setPageState('not-active')
        } else {
          const token = searchParams.get('token')
          // console.log('Token từ URL:', token)
          if (token) {
            // Nếu có token → bỏ qua bước xác thực, đi thẳng vào form
            try {
              // atob() giải mã base64 → chuỗi gốc
              // "ODoxMjM=" → "8:123"
              // (backend encode là batchId:studentId
              const decoded = atob(token)
              // console.log('Token đã giải mã:', decoded)
              // Tách chuỗi "8:123" theo dấu ":"
              // [0] = "8"   → batchId (bỏ qua, dùng dấu phẩy)
              // [1] = "123" → studentId → lấy cái này để xác định danh tính sinh viên
              const [, studentCode] = decoded.split(':')
 

              // const studentData = b.graduationId
              //   ? await verifyStudentByFields(b.graduationId, { studentCode })
              //   : null
              const studentData = b.graduationId
                ? await getStudentFromGraduation(b.graduationId, studentCode)
                : null
              setIdentity({
                studentId: studentData?.code ?? studentCode,
                studentName: studentData?.full_name ?? '',
                studentEmail: studentData?.email ?? '',
                studentData,
              })
              setPageState('fill')
              return
       
            } catch {
            }
          }
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
    navigate(`/survey/${batch.id}/done`)
  }

  switch (pageState) {
    case 'loading': return <LoadingScreen />
    case 'error': return <ErrorScreen />
    case 'not-active': return <NotActiveScreen batch={batch} />
    case 'identify': return batch ? <IdentifyStep batch={batch} onContinue={handleIdentify} /> : null
    case 'fill':
      return batch?.formSnapshot
        ? <SurveyPreview
          form={batch.formSnapshot}
          onSubmit={handleSubmit}
          submitLabel="Gửi phiếu khảo sát"
          lockedCount={8}
          initialValues={identity ? buildInitialValues(batch.formSnapshot, identity) : undefined}
        />
        : null
    default: return null
  }
}