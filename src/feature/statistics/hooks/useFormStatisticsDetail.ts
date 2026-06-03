import { useEffect, useMemo, useState } from 'react'
import {
  getEndedBatches,
  getStatisticalQuestions,
  getFormStatisticsDetail,
} from '../api'
import type {
  BatchOption,
  FormOption,
  StatisticalQuestion,
  FormStatisticsDetail,
} from '../types'

/**
 * Hook quản lý toàn bộ state cho trang thống kê:
 * 1. Load danh sách đợt khảo sát đã kết thúc → tự chọn đợt đầu tiên
 * 2. Khi batchId (formId) thay đổi → load danh sách câu hỏi showInChart=1 → tự chọn câu đầu tiên
 * 3. Khi questionKey (questionId) thay đổi → load chi tiết thống kê
 */
export function useFormStatisticsDetail(initialBatchId?: number) {
  const [batches, setBatches] = useState<BatchOption[]>([])
  const [questions, setQuestions] = useState<StatisticalQuestion[]>([])
  const [detail, setDetail] = useState<FormStatisticsDetail | null>(null)

  // Dùng tên `formId` và `questionId` để khớp với FilterBar props
  const [formId, setFormId] = useState<number | undefined>(initialBatchId)
  const [questionId, setQuestionId] = useState<string | undefined>()

  const [loadingBatches, setLoadingBatches] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Step 1: Load danh sách batch đã ended
  useEffect(() => {
    let mounted = true
    setLoadingBatches(true)

    getEndedBatches()
      .then((res) => {
        if (!mounted) return
        setBatches(res)
        if (!formId && res.length > 0) {
          setFormId(res[0].id)
        }
      })
      .finally(() => {
        if (mounted) setLoadingBatches(false)
      })

    return () => { mounted = false }
  }, [])

  // Step 2: Khi formId (batchId) thay đổi → load câu hỏi
  useEffect(() => {
    if (!formId) {
      setQuestions([])
      setQuestionId(undefined)
      setDetail(null)
      return
    }

    let mounted = true
    setLoadingQuestions(true)
    setQuestions([])
    setQuestionId(undefined)
    setDetail(null)

    getStatisticalQuestions(formId)
      .then((res) => {
        if (!mounted) return
        // Map questionKey → id để Select dùng được
        const mapped: StatisticalQuestion[] = res.map((q: any) => ({
          ...q,
          id: q.questionKey,
        }))
        setQuestions(mapped)
        setQuestionId(mapped[0]?.questionKey)
      })
      .finally(() => {
        if (mounted) setLoadingQuestions(false)
      })

    return () => { mounted = false }
  }, [formId])

  // Step 3: Khi questionId (questionKey) thay đổi → load detail
  useEffect(() => {
    if (!formId || !questionId) {
      setDetail(null)
      return
    }

    let mounted = true
    setLoadingDetail(true)

    getFormStatisticsDetail(formId, questionId)
      .then((res) => {
        if (!mounted) return
        setDetail(res)
      })
      .finally(() => {
        if (mounted) setLoadingDetail(false)
      })

    return () => { mounted = false }
  }, [formId, questionId])

  const loading = useMemo(
    () => loadingBatches || loadingQuestions || loadingDetail,
    [loadingBatches, loadingQuestions, loadingDetail],
  )

  // `forms` là BatchOption[] được map sang FormOption[] (field .name = .title)
  const forms: FormOption[] = useMemo(
    () => batches.map((b) => ({ id: b.id, name: b.title })),
    [batches],
  )

  return {
    forms,
    questions,
    detail,
    formId,
    questionId,
    setFormId,
    setQuestionId,
    loading,
  }
}