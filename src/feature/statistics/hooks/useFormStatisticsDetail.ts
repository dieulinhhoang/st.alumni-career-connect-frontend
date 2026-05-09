import { useEffect, useMemo, useState } from 'react'
import {
  getForms,
  getStatisticalQuestions,
  getFormStatisticsDetail,
} from '../api'
import type {
  FormOption,
  StatisticalQuestion,
  FormStatisticsDetail,
} from '../types'

// mount  gọi get forms, sau đó tự động chọn form đầu tiên (nếu có) và gọi getStatisticalQuestions
// khi formId thay đổi, gọi getStatisticalQuestions, sau đó tự động chọn question đầu tiên (nếu có) và gọi getFormStatisticsDetail
// khi questionId thay đổi, gọi getFormStatisticsDetail
export function useFormStatisticsDetail(initialFormId?: number) {
    // ds fomr
  const [forms, setForms] = useState<FormOption[]>([])
  // form đang chọn
  const [questions, setQuestions] = useState<StatisticalQuestion[]>([])
  // data render
  const [detail, setDetail] = useState<FormStatisticsDetail | null>(null)

  // id form đang chọn, giữ state đang chọn để khi ds form load xong sẽ tự động chọn form đầu tiên
  const [formId, setFormId] = useState<number | undefined>(initialFormId)
  const [questionId, setQuestionId] = useState<string | undefined>()

  const [loadingForms, setLoadingForms] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoadingForms(true)

    getForms()
      .then((res) => {
        if (!mounted) return
        setForms(res)
        if (!formId && res.length > 0) {
          setFormId(res[0].id)
        }
      })
      .finally(() => {
        if (mounted) setLoadingForms(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!formId) {
      setQuestions([])
      setQuestionId(undefined)
      return
    }

    let mounted = true
    setLoadingQuestions(true)

    getStatisticalQuestions(formId)
      .then((res) => {
        if (!mounted) return
        setQuestions(res)
        setQuestionId(res[0]?.id)
      })
      .finally(() => {
        if (mounted) setLoadingQuestions(false)
      })

    return () => {
      mounted = false
    }
  }, [formId])

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

    return () => {
      mounted = false
    }
  }, [formId, questionId])

  const loading = useMemo(
    () => loadingForms || loadingQuestions || loadingDetail,
    [loadingForms, loadingQuestions, loadingDetail],
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