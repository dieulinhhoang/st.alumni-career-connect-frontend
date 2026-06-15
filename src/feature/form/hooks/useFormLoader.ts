import { useEffect, useState } from 'react'
import { getFormById } from '../api'
import type { Form, Question, Section } from '../types'
import type { BuilderMode } from './useFormBuilder'
import { normalizeFormData } from './formLoader'

interface Setters {
  setName: (v: string) => void
  setDesc: (v: string) => void
  setSections: (s: Section[]) => void
  setActiveSectionId: (id: string | null) => void
  setQuestions: (qs: Question[]) => void
  setActiveId: (id: string | null) => void
  setFormStatus: (s: 'draft' | 'published' | undefined) => void
}

// Load form khi ở chế độ edit, đổ dữ liệu vào state qua các setter được truyền vào
// Dùng chung normalizeFormData với useFormDetail (trang preview) để tránh lặp logic suy ra sections/questions
export function useFormLoader(mode: BuilderMode, formId: number | undefined, setters: Setters) {
  const [loading, setLoading] = useState(mode === 'edit')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (mode !== 'edit' || !formId) return
    let cancelled = false
    setLoading(true)
    getFormById(formId)
      .then((form: Form) => {
        if (cancelled) return
        const data = normalizeFormData(form)
        setters.setName(data.name)
        setters.setDesc(data.desc)
        setters.setFormStatus(form.status)
        setters.setSections(data.sections)
        setters.setActiveSectionId(data.activeSectionId)
        setters.setQuestions(data.questions)
        setters.setActiveId(data.activeQuestionId)
      })
      .catch((e: unknown) => { if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Không thể tải form.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, formId])

  return { loading, loadError }
}
