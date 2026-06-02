import { useState, useEffect, useCallback } from 'react'
import { getFormById, createForm, updateForm } from '../api'
import type { Form, Question, Section, SurveyHeader, SurveyFooter } from '../types'
import type { LogicRule } from '../../../pages/admin/Form/builder/BuilderView'

export type BuilderMode = 'create' | 'edit'

const _genId = () => Math.random().toString(36).slice(2, 8)

type QuestionOption = { id: string; label: string }

const _newQuestion = (sectionId?: string): Question => ({
  id: _genId(),
  type: 'short',
  title: '',
  required: false,
  options: [],
  sectionId: sectionId ?? '',
  order: 0,
})

const _defaultSection = (): Section => ({
  id: _genId(),
  title: 'Phần 1',
  order: 0,
})

export interface SaveExtras {
  header?: SurveyHeader
  footer?: SurveyFooter
  logoUrl?: string
  logoSize?: number
  logicRules?: LogicRule[]
  descriptionParagraphs?: string[]
}

export interface UseFormBuilderReturn {
  name: string
  desc: string
  setName: (v: string) => void
  setDesc: (v: string) => void

  questions: Question[]
  activeId: string | null
  setActiveId: (id: string | null) => void
  activeQuestion: Question | undefined

  sections: Section[]
  activeSectionId: string | null
  setActiveSectionId: (id: string | null) => void
  setSections: React.Dispatch<React.SetStateAction<Section[]>>

  addQuestion: (afterId?: string, patch?: Partial<Question>) => string
  duplicateQuestion: (id: string) => void
  removeQuestion: (id: string) => void
  updateQuestion: (id: string, patch: Partial<Question>) => void
  moveQuestion: (id: string, dir: 'up' | 'down') => void
  reorderQuestion: (dragId: string, overId: string) => void

  addSectionAfter: (afterQuestionId: string) => void
  deleteSection: (id: string) => void

  addOption: (questionId: string) => void
  updateOption: (questionId: string, optionId: string, label: string) => void
  removeOption: (questionId: string, optionId: string) => void

  loading: boolean
  loadError: string

  saving: boolean
  saved: boolean
  saveError: string
  handleSave: (extras?: SaveExtras) => Promise<Form | null>
}

export function useFormBuilder(
  mode: BuilderMode,
  formId?: number
): UseFormBuilderReturn {
  const defaultSection = _defaultSection()
  const initialQ = _newQuestion(defaultSection.id)

  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [questions, setQs] = useState<Question[]>([initialQ])
  const [activeId, setActiveId] = useState<string | null>(initialQ.id)
  const [sections, setSections] = useState<Section[]>([defaultSection])
  const [activeSectionId, setActiveSectionId] = useState<string | null>(defaultSection.id)

  const [loading, setLoading] = useState(mode === 'edit')
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  // =========================
  // LOAD FORM (EDIT MODE)
  // =========================
  useEffect(() => {
    if (mode !== 'edit' || !formId) return

    let cancelled = false
    setLoading(true)

    getFormById(formId)
      .then((form: Form) => {
        if (cancelled) return

        // set basic info
        setName(form.name)
        setDesc(form.description)

        // chuẩn hóa questions
        const formQuestions: Question[] = Array.isArray(form.questions)
          ? form.questions
          : []

        // chuẩn hóa sections từ backend
        const rawSections = (form as any).sections
        const serverSections: Section[] = Array.isArray(rawSections)
          ? rawSections
          : []

        // fallback: nếu không có sections thì dựng từ question.sectionId
        const loadedSections: Section[] =
          serverSections.length > 0
            ? serverSections
            : formQuestions.length > 0
            ? Array.from(
                new Set(formQuestions.map(q => q.sectionId).filter(Boolean))
              ).map((sectionId, index) => ({
                id: sectionId,
                title: `Phần ${index + 1}`,
                order: index,
              }))
            : [_defaultSection()]

        setSections(loadedSections)
        setActiveSectionId(loadedSections[0]?.id ?? null)

        // questions fallback
        const qs = formQuestions.length > 0
          ? formQuestions
          : [_newQuestion(loadedSections[0]?.id)]

        setQs(qs)
        setActiveId(qs[0]?.id ?? null)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : 'Không thể tải form.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [mode, formId])

  // =========================
  // QUESTION HELPERS
  // =========================

  const addQuestion = useCallback((afterId?: string, patch?: Partial<Question>): string => {
    const newId = _genId()

    setQs(qs => {
      const afterQ = afterId ? qs.find(q => q.id === afterId) : null
      const sid = afterQ?.sectionId || activeSectionId || sections[0]?.id || ''

      const q: Question = {
        ..._newQuestion(sid),
        ...patch,
        id: newId,
        sectionId: patch?.sectionId ?? sid,
      }

      let next: Question[]

      if (afterId) {
        const idx = qs.findIndex(q => q.id === afterId)
        if (idx === -1) {
          next = [...qs, q]
        } else {
          next = [
            ...qs.slice(0, idx + 1),
            q,
            ...qs.slice(idx + 1),
          ]
        }
      } else {
        let lastIdx = -1
        qs.forEach((cur, i) => {
          if (cur.sectionId === sid) lastIdx = i
        })
        const insertAt = lastIdx >= 0 ? lastIdx + 1 : qs.length
        next = [
          ...qs.slice(0, insertAt),
          q,
          ...qs.slice(insertAt),
        ]
      }

      return next.map((item, index) => ({
        ...item,
        order: index,
      }))
    })

    setActiveId(newId)
    return newId
  }, [activeSectionId, sections])

  const duplicateQuestion = useCallback((id: string) => {
    setQs(qs => {
      const idx = qs.findIndex(q => q.id === id)
      if (idx === -1) return qs
      const copy: Question = {
        ...qs[idx],
        id: _genId(),
        options: (qs[idx].options ?? []).map((o: QuestionOption) => ({ ...o, id: _genId() })),
      }
      setActiveId(copy.id)
      return [...qs.slice(0, idx + 1), copy, ...qs.slice(idx + 1)]
    })
  }, [])

  const removeQuestion = useCallback((id: string) => {
    setQs(qs => {
      const next = qs.filter(q => q.id !== id)
      setActiveId(prev => prev === id ? (next[0]?.id ?? null) : prev)
      return next
    })
  }, [])

  const updateQuestion = useCallback((id: string, patch: Partial<Question>) => {
    setQs(qs => qs.map(q => q.id === id ? { ...q, ...patch } : q))
  }, [])

  const moveQuestion = useCallback((id: string, dir: 'up' | 'down') => {
    setQs(qs => {
      const idx = qs.findIndex(q => q.id === id)
      if (idx === -1) return qs
      if (dir === 'up' && idx === 0) return qs
      if (dir === 'down' && idx === qs.length - 1) return qs
      const next = [...qs]
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1
      ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
      return next
    })
  }, [])

  const reorderQuestion = useCallback((dragId: string, overId: string) => {
    setQs(qs => {
      const from = qs.findIndex(q => q.id === dragId)
      const to   = qs.findIndex(q => q.id === overId)
      if (from === -1 || to === -1 || from === to) return qs
      const next = [...qs]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }, [])

  // =========================
  // SECTION HELPERS
  // =========================

  const addSectionAfter = useCallback((afterQuestionId: string) => {
    const afterIdx = questions.findIndex(q => q.id === afterQuestionId)
    if (afterIdx === -1) return

    const currentSectionId = questions[afterIdx].sectionId
    const newSectionId = _genId()

    let firstQuestionInNewSectionId: string | null = null
    let movedCount = 0

    const updatedQs = questions.map((q, i) => {
      if (i > afterIdx && q.sectionId === currentSectionId) {
        movedCount += 1
        if (!firstQuestionInNewSectionId) {
          firstQuestionInNewSectionId = q.id
        }
        return { ...q, sectionId: newSectionId }
      }
      return q
    })

    let finalQs = updatedQs
    if (movedCount === 0) {
      const newQuestion = _newQuestion(newSectionId)
      firstQuestionInNewSectionId = newQuestion.id
      finalQs = [
        ...updatedQs.slice(0, afterIdx + 1),
        newQuestion,
        ...updatedQs.slice(afterIdx + 1),
      ]
    }

    const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId)
    const insertAt = currentSectionIndex >= 0 ? currentSectionIndex + 1 : sections.length

    const newSection: Section = {
      id: newSectionId,
      title: `Phần ${sections.length + 1}`,
      order: insertAt,
    }

    setQs(finalQs.map((q, index) => ({ ...q, order: index })))
    setSections(
      [
        ...sections.slice(0, insertAt),
        newSection,
        ...sections.slice(insertAt),
      ].map((s, index) => ({ ...s, order: index }))
    )
    setActiveSectionId(newSectionId)
    setActiveId(firstQuestionInNewSectionId)
  }, [questions, sections])

  const deleteSection = useCallback((id: string) => {
    setSections(prev => {
      if (prev.length <= 1) return prev
      const remaining = prev.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i }))
      const fallback = remaining[0]?.id
      setQs(qs => qs.map(q => q.sectionId === id ? { ...q, sectionId: fallback } : q))
      setActiveSectionId(fallback ?? null)
      return remaining
    })
  }, [])

  // =========================
  // OPTION HELPERS
  // =========================

  const addOption = useCallback((qid: string) => {
    setQs(qs => qs.map(q => {
      if (q.id !== qid) return q
      return { ...q, options: [...(q.options ?? []), { id: _genId(), label: '' }] }
    }))
  }, [])

  const updateOption = useCallback((qid: string, oid: string, label: string) => {
    setQs(qs => qs.map(q => {
      if (q.id !== qid) return q
      return { ...q, options: (q.options ?? []).map((o: QuestionOption) => o.id === oid ? { ...o, label } : o) }
    }))
  }, [])

  const removeOption = useCallback((qid: string, oid: string) => {
    setQs(qs => qs.map(q => {
      if (q.id !== qid) return q
      return { ...q, options: (q.options ?? []).filter((o: QuestionOption) => o.id !== oid) }
    }))
  }, [])

  // =========================
  // SAVE
  // =========================

  const handleSave = useCallback(async (extras?: SaveExtras): Promise<Form | null> => {
    if (!name.trim()) return null
    setSaving(true)
    setSaveError('')
    setSaved(false)
    try {
      const payload = {
        name,
        description: desc,
        questions,
        sections,
        ...(extras ?? {}),
      }
      const result: Form = mode === 'create'
        ? await createForm(payload)
        : await updateForm(formId!, payload)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      return result
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Lưu thất bại.')
      return null
    } finally {
      setSaving(false)
    }
  }, [mode, formId, name, desc, questions, sections])

  return {
    name, desc, setName, setDesc,
    questions,
    activeId, setActiveId,
    activeQuestion: questions.find(q => q.id === activeId),
    sections, activeSectionId, setActiveSectionId, setSections,
    addQuestion, duplicateQuestion, removeQuestion, updateQuestion, moveQuestion, reorderQuestion,
    addSectionAfter, deleteSection,
    addOption, updateOption, removeOption,
    loading, loadError,
    saving, saved, saveError, handleSave,
  }
}