import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getBatchByIdPublic, getStudentFromGraduation, verifyStudentByFields } from '../../../feature/alumni/api'
import type { SurveyBatch } from '../../../feature/alumni/types'
import { SurveyPreview } from '../../system/Form/Preview'
import { IdentifyStep } from './IdentifyStep'
import type { Identity } from './IdentifyStep'
import { NotActiveScreen } from './NotActiveScreen'
import { LoadingScreen, ErrorScreen } from './StatusScreens'
import { submitResponse } from './submitResponse'
import type { StudentPrefillField } from '../../../feature/form/types'

type PageState = 'loading' | 'error' | 'not-active' | 'identify' | 'fill'

const LOCKED_COUNT = 0 // legacy, không còn dùng

const GENDER_MAP: Record<string, string> = { male: 'Nam', female: 'Nữ', other: 'Khác' }

/** Lấy giá trị prefill của một field sinh viên từ identity */
function getPrefillValue(field: StudentPrefillField, identity: Identity, qType?: string): any {
  const sd = identity.studentData
  switch (field) {
    case 'studentCode':   return identity.studentId
    case 'fullName':      return sd?.full_name || identity.studentName
    case 'gender':        return sd?.gender ? (GENDER_MAP[sd.gender] ?? sd.gender) : null
    case 'dob': {
      if (!sd?.dob) return null
      const d = new Date(sd.dob)
      return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10)
    }
    case 'majorCode':     return sd?.training_industry_code
    case 'cccd':
      if (!sd?.citizen_identification) return null
      return qType === 'cccd' ? { number: sd.citizen_identification } : sd.citizen_identification
    case 'schoolYearEnd': return sd?.school_year_end
    case 'majorName':     return sd?.training_industry_name
    case 'phone':         return sd?.phone
    case 'email':         return sd?.email || identity.studentEmail
    default:              return null
  }
}

/**
 * Xây dựng giá trị ban đầu cho form từ dữ liệu xác thực sinh viên.
 * Ưu tiên dùng prefillField trên từng câu hỏi; nếu form chưa cấu hình prefillField
 * thì fallback về mapping theo thứ tự câu hỏi (legacy).
 */
function buildInitialValues(
  formSnapshot: SurveyBatch['formSnapshot'],
  identity: Identity,
): Record<string, any> {
  if (!formSnapshot) return {}

  const sortedQs = [...(formSnapshot.questions ?? [])].sort(
    (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0),
  )

  const values: Record<string, any> = {}

  // ── Ưu tiên: dùng prefillField trên từng câu hỏi ──────────────────────────
  const hasPrefillConfig = sortedQs.some((q: any) => q.prefillField)

  if (hasPrefillConfig) {
    for (const q of sortedQs as any[]) {
      if (!q.prefillField) continue
      const val = getPrefillValue(q.prefillField as StudentPrefillField, identity, q.type)
      if (val !== null && val !== undefined && val !== '') {
        values[q.id] = val
      }
    }
    return values
  }

  // ── Fallback legacy: mapping theo thứ tự câu hỏi ─────────────────────────
  const sd = identity.studentData
  const set = (idx: number, val: any) => {
    if (sortedQs[idx] && val !== null && val !== undefined && val !== '') {
      values[(sortedQs[idx] as any).id] = val
    }
  }

  set(0, identity.studentId)
  set(1, sd?.full_name || identity.studentName)

  if (sd) {
    set(2, sd.gender ? (GENDER_MAP[sd.gender] ?? sd.gender) : null)
    if (sd.dob) {
      const d = new Date(sd.dob)
      if (!isNaN(d.getTime())) set(3, d.toISOString().slice(0, 10))
    }
    set(4, sd.training_industry_code)
    if (sd.citizen_identification) {
      const q6 = sortedQs[5] as any
      set(5, q6?.type === 'cccd' ? { number: sd.citizen_identification } : sd.citizen_identification)
    }
    set(6, sd.school_year_end)
    set(7, sd.training_industry_name)
    set(8, sd.phone)
  }
  set(9, sd?.email || identity.studentEmail)

  return values
}

/** Tập id các câu hỏi cần khoá (lockedWhenPrefilled = true và có giá trị prefill) */
function buildLockedIds(
  formSnapshot: SurveyBatch['formSnapshot'],
  initialValues: Record<string, any>,
): Set<string> {
  const locked = new Set<string>()
  for (const q of (formSnapshot?.questions ?? []) as any[]) {
    if (q.lockedWhenPrefilled && initialValues[q.id] !== undefined) {
      locked.add(q.id)
    }
  }
  return locked
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
    sessionStorage.setItem(`survey_done_${batch.id}`, '1')
    navigate(`/survey/${batch.id}/done`)
  }

  switch (pageState) {
    case 'loading': return <LoadingScreen />
    case 'error': return <ErrorScreen />
    case 'not-active': return <NotActiveScreen batch={batch} />
    case 'identify': return batch ? <IdentifyStep batch={batch} onContinue={handleIdentify} /> : null
    case 'fill': {
      const initVals = identity ? buildInitialValues(batch!.formSnapshot, identity) : undefined
      const lockedIds = initVals ? buildLockedIds(batch!.formSnapshot, initVals) : undefined
      return batch?.formSnapshot
        ? <SurveyPreview
          form={batch.formSnapshot}
          onSubmit={handleSubmit}
          submitLabel="Gửi phiếu khảo sát"
          lockedCount={LOCKED_COUNT}
          lockedIds={lockedIds}
          initialValues={initVals}
        />
        : null
    }
    default: return null
  }
}