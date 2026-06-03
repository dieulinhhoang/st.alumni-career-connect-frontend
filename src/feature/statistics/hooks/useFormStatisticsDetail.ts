import { useEffect, useMemo, useState } from 'react'
import {
  getEndedBatches,
  getStatisticalQuestions,
  getFormStatisticsDetail,
} from '../api'
import type {
  BatchOption,
  StatisticalQuestion,
  FormStatisticsDetail,
} from '../types'

/**
 * Hook quản lý toàn bộ state cho trang thống kê:
 * 1. Load danh sách đợt khảo sát đã kết thúc → tự chọn đợt đầu tiên
 * 2. Khi batchId thay đổi → load danh sách câu hỏi showInChart=1 → tự chọn câu đầu tiên
 * 3. Khi questionKey thay đổi → load chi tiết thống kê từ AlumniBatchResponse.answers
 */
export function useFormStatisticsDetail(initialBatchId?: number) {
  const [batches, setBatches] = useState<BatchOption[]>([])
  const [questions, setQuestions] = useState<StatisticalQuestion[]>([])
  const [detail, setDetail] = useState<FormStatisticsDetail | null>(null)

  const [batchId, setBatchId] = useState<number | undefined>(initialBatchId)
  const [questionKey, setQuestionKey] = useState<string | undefined>()

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
        if (!batchId && res.length > 0) {
          setBatchId(res[0].id)
        }
      })
      .finally(() => {
        if (mounted) setLoadingBatches(false)
      })

    return () => { mounted = false }
  }, [])

  // Step 2: Khi batchId thay đổi → load câu hỏi
  useEffect(() => {
    if (!batchId) {
      setQuestions([])
      setQuestionKey(undefined)
      setDetail(null)
      return
    }

    let mounted = true
    setLoadingQuestions(true)
    setQuestions([])
    setQuestionKey(undefined)
    setDetail(null)

    getStatisticalQuestions(batchId)
      .then((res) => {
        if (!mounted) return
        setQuestions(res)
        setQuestionKey(res[0]?.questionKey)
      })
      .finally(() => {
        if (mounted) setLoadingQuestions(false)
      })

    return () => { mounted = false }
  }, [batchId])

  // Step 3: Khi questionKey thay đổi → load detail
  useEffect(() => {
    if (!batchId || !questionKey) {
      setDetail(null)
      return
    }

    let mounted = true
    setLoadingDetail(true)

    getFormStatisticsDetail(batchId, questionKey)
      .then((res) => {
        if (!mounted) return
        setDetail(res)
      })
      .finally(() => {
        if (mounted) setLoadingDetail(false)
      })

    return () => { mounted = false }
  }, [batchId, questionKey])

  const loading = useMemo(
    () => loadingBatches || loadingQuestions || loadingDetail,
    [loadingBatches, loadingQuestions, loadingDetail],
  )

  return {
    // Thay thế `forms` bằng `batches` — tên đúng hơn với nghiệp vụ
    batches,
    questions,
    detail,
    batchId,
    questionKey,
    setBatchId,
    setQuestionKey,
    loading,
  }
}