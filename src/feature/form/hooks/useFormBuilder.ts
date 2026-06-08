import { useState, useEffect, useCallback, useRef } from 'react'
import { getFormById, createForm, updateForm, publishForm, unpublishForm } from '../api'
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
  title: 'Phần I. Thông tin cá nhân',
  order: 0,
})

const _defaultQuestions = (sectionId: string): Question[] => [
  { id: _genId(), type: 'short', title: 'Mã sinh viên', required: true, options: [], sectionId, order: 0, reportFieldKey: 'student_code' },
  { id: _genId(), type: 'short', title: 'Họ và tên', required: true, options: [], sectionId, order: 1, reportFieldKey: 'fullname' },
  { id: _genId(), type: 'radio', title: 'Giới tính', required: true, options: [{ id: _genId(), label: 'Nam' }, { id: _genId(), label: 'Nữ' }, { id: _genId(), label: 'Khác' }], sectionId, order: 2, reportFieldKey: 'gender' },
  { id: _genId(), type: 'date', title: 'Ngày sinh', required: true, options: [], sectionId, order: 3, reportFieldKey: 'dob' },
  { id: _genId(), type: 'short', title: 'Mã ngành đào tạo', required: true, options: [], sectionId, order: 4, reportFieldKey: 'industrycode' },
  { id: _genId(), type: 'short', title: 'Số CCCD', required: true, options: [], sectionId, order: 5, reportFieldKey: 'citizen_identification' },
  { id: _genId(), type: 'short', title: 'Khóa học', required: true, options: [], sectionId, order: 6, reportFieldKey: 'courseyear' },
  { id: _genId(), type: 'short', title: 'Tên ngành được đào tạo', required: true, options: [], sectionId, order: 7, reportFieldKey: 'industryname' },
]

export interface SaveExtras {
  header?: SurveyHeader
  footer?: SurveyFooter
  logoUrl?: string
  logoSize?: number
  logicRules?: LogicRule[]
  descriptionParagraphs?: string[]
}

export interface UseFormBuilderReturn {
  name: string; desc: string; setName: (v: string) => void; setDesc: (v: string) => void
  questions: Question[]
  activeId: string | null; setActiveId: (id: string | null) => void; activeQuestion: Question | undefined
  sections: Section[]; activeSectionId: string | null; setActiveSectionId: (id: string | null) => void; setSections: React.Dispatch<React.SetStateAction<Section[]>>
  addQuestion: (afterId?: string, patch?: Partial<Question>) => string
  duplicateQuestion: (id: string) => void; removeQuestion: (id: string) => void; updateQuestion: (id: string, patch: Partial<Question>) => void
  moveQuestion: (id: string, dir: 'up' | 'down') => void; reorderQuestion: (dragId: string, overId: string) => void
  addSectionAfter: (afterQuestionId: string) => void; deleteSection: (id: string) => void
  addOption: (questionId: string) => void; updateOption: (questionId: string, optionId: string, label: string) => void; removeOption: (questionId: string, optionId: string) => void
  groupQuestions: (id: string, count: 2 | 3) => void; ungroupQuestion: (id: string) => void
  loading: boolean; loadError: string
  saving: boolean; saved: boolean; saveError: string; handleSave: (extras?: SaveExtras) => Promise<Form | null>
  publishing: boolean; published: boolean; publishError: string
  handlePublish: () => Promise<Form | null>; handleUnpublish: () => Promise<Form | null>; formStatus: 'draft' | 'published' | undefined
}

export function useFormBuilder(mode: BuilderMode, formId?: number): UseFormBuilderReturn {
  const defaultSection = _defaultSection()
  const initialQs = mode === 'create' ? _defaultQuestions(defaultSection.id) : []

  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [questions, setQs] = useState<Question[]>(initialQs)
  const [activeId, setActiveId] = useState<string | null>(initialQs[0]?.id ?? null)
  const [sections, setSections] = useState<Section[]>([defaultSection])
  const [activeSectionId, setActiveSectionId] = useState<string | null>(defaultSection.id)

  const [loading, setLoading] = useState(mode === 'edit')
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [formStatus, setFormStatus] = useState<'draft' | 'published' | undefined>(undefined)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [publishError, setPublishError] = useState('')

  // FIX: track real form id — tránh auto-save tạo bản mới mỗi lần
  const savedFormIdRef = useRef<number | null>(formId ?? null)

  useEffect(() => {
    if (mode !== 'edit' || !formId) return
    let cancelled = false
    setLoading(true)
    getFormById(formId)
      .then((form: Form) => {
        if (cancelled) return
        setName(form.name)
        setDesc(form.description)
        setFormStatus(form.status)
        const formQuestions: Question[] = Array.isArray(form.questions) ? form.questions : []
        const rawSections = (form as any).sections
        const serverSections: Section[] = Array.isArray(rawSections) ? rawSections : []
        const loadedSections: Section[] = serverSections.length > 0
          ? serverSections
          : formQuestions.length > 0
          ? Array.from(new Set(formQuestions.map(q => q.sectionId).filter(Boolean))).map((sectionId, index) => ({ id: sectionId, title: `Phần ${index + 1}`, order: index }))
          : [_defaultSection()]
        setSections(loadedSections)
        setActiveSectionId(loadedSections[0]?.id ?? null)
        const qs = formQuestions.length > 0 ? formQuestions : [_newQuestion(loadedSections[0]?.id)]
        setQs(qs)
        setActiveId(qs[0]?.id ?? null)
      })
      .catch((e: unknown) => { if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Không thể tải form.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [mode, formId])

  const addQuestion = useCallback((afterId?: string, patch?: Partial<Question>): string => {
    const newId = _genId()
    setQs(qs => {
      const afterQ = afterId ? qs.find(q => q.id === afterId) : null
      const sid = afterQ?.sectionId || activeSectionId || sections[0]?.id || ''
      const q: Question = { ..._newQuestion(sid), ...patch, id: newId, sectionId: patch?.sectionId ?? sid }
      let next: Question[]
      if (afterId) {
        const idx = qs.findIndex(q => q.id === afterId)
        next = idx === -1 ? [...qs, q] : [...qs.slice(0, idx + 1), q, ...qs.slice(idx + 1)]
      } else {
        let lastIdx = -1
        qs.forEach((cur, i) => { if (cur.sectionId === sid) lastIdx = i })
        const insertAt = lastIdx >= 0 ? lastIdx + 1 : qs.length
        next = [...qs.slice(0, insertAt), q, ...qs.slice(insertAt)]
      }
      return next.map((item, index) => ({ ...item, order: index }))
    })
    setActiveId(newId)
    return newId
  }, [activeSectionId, sections])

  const duplicateQuestion = useCallback((id: string) => {
    setQs(qs => {
      const idx = qs.findIndex(q => q.id === id)
      if (idx === -1) return qs
      const copy: Question = { ...qs[idx], id: _genId(), options: (qs[idx].options ?? []).map((o: QuestionOption) => ({ ...o, id: _genId() })) }
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
      const to = qs.findIndex(q => q.id === overId)
      if (from === -1 || to === -1 || from === to) return qs
      const next = [...qs]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }, [])

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
        if (!firstQuestionInNewSectionId) firstQuestionInNewSectionId = q.id
        return { ...q, sectionId: newSectionId }
      }
      return q
    })
    let finalQs = updatedQs
    const hasQuestionAfter = afterIdx < questions.length - 1
    if (movedCount === 0 && !hasQuestionAfter) {
      const newQuestion = _newQuestion(newSectionId)
      firstQuestionInNewSectionId = newQuestion.id
      finalQs = [...updatedQs.slice(0, afterIdx + 1), newQuestion, ...updatedQs.slice(afterIdx + 1)]
    }
    const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId)
    const insertAt = currentSectionIndex >= 0 ? currentSectionIndex + 1 : sections.length
    const newSection: Section = { id: newSectionId, title: `Phần ${sections.length + 1}`, order: insertAt }
    setQs(finalQs.map((q, index) => ({ ...q, order: index })))
    setSections([...sections.slice(0, insertAt), newSection, ...sections.slice(insertAt)].map((s, index) => ({ ...s, order: index })))
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

  const addOption = useCallback((qid: string) => {
    setQs(qs => qs.map(q => q.id !== qid ? q : { ...q, options: [...(q.options ?? []), { id: _genId(), label: '' }] }))
  }, [])

  const updateOption = useCallback((qid: string, oid: string, label: string) => {
    setQs(qs => qs.map(q => q.id !== qid ? q : { ...q, options: (q.options ?? []).map((o: QuestionOption) => o.id === oid ? { ...o, label } : o) }))
  }, [])

  const removeOption = useCallback((qid: string, oid: string) => {
    setQs(qs => qs.map(q => q.id !== qid ? q : { ...q, options: (q.options ?? []).filter((o: QuestionOption) => o.id !== oid) }))
  }, [])

  // Group N câu liên tiếp (bắt đầu từ id) vào 1 hàng
  const groupQuestions = useCallback((id: string, count: 2 | 3) => {
    setQs(prev => {
      const idx = prev.findIndex(q => q.id === id)
      if (idx < 0) return prev
      const groupId = `rg_${id}`
      const end = Math.min(idx + count, prev.length)
      // xóa group cũ nếu câu này đang trong group khác
      const oldGroup = prev[idx].rowGroup
      return prev.map((q, i) => {
        if (i >= idx && i < end) return { ...q, rowGroup: groupId }
        if (oldGroup && q.rowGroup === oldGroup) return { ...q, rowGroup: undefined }
        return q
      })
    })
  }, [])

  // Tách câu hỏi ra khỏi group
  const ungroupQuestion = useCallback((id: string) => {
    setQs(prev => {
      const q = prev.find(q => q.id === id)
      if (!q?.rowGroup) return prev
      const gid = q.rowGroup
      const members = prev.filter(q => q.rowGroup === gid)
      if (members.length <= 2) {
        // chỉ còn 1–2 câu → tách toàn bộ group
        return prev.map(q => q.rowGroup === gid ? { ...q, rowGroup: undefined } : q)
      }
      return prev.map(q => q.id === id ? { ...q, rowGroup: undefined } : q)
    })
  }, [])

  // FIX: dùng savedFormIdRef thay vì mode+formId — tránh createForm bị gọi nhiều lần
  const handleSave = useCallback(async (extras?: SaveExtras): Promise<Form | null> => {
    if (!name.trim()) return null
    setSaving(true)
    setSaveError('')
    setSaved(false)
    try {
      const payload = {
        name,
        description: extras?.descriptionParagraphs
          ? extras.descriptionParagraphs.join('\n')
          : desc,
        questions,
        sections,
        ...(extras ? (({ descriptionParagraphs: _dp, ...rest }) => rest)(extras) : {}),
      }
      const currentId = savedFormIdRef.current
      let result: Form
      if (currentId != null) {
        result = await updateForm(currentId, payload)
      } else {
        result = await createForm(payload)
        savedFormIdRef.current = result.id as number
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      return result
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Lưu thất bại.')
      return null
    } finally {
      setSaving(false)
    }
  }, [name, desc, questions, sections])

  const handlePublish = useCallback(async (): Promise<Form | null> => {
    const id = savedFormIdRef.current
    if (!id) return null
    setPublishing(true)
    setPublishError('')
    try {
      const result = await publishForm(id)
      setFormStatus('published')
      setPublished(true)
      setTimeout(() => setPublished(false), 2500)
      return result
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : 'Xuất bản thất bại.')
      return null
    } finally {
      setPublishing(false)
    }
  }, [])

  const handleUnpublish = useCallback(async (): Promise<Form | null> => {
    const id = savedFormIdRef.current
    if (!id) return null
    setPublishing(true)
    setPublishError('')
    try {
      const result = await unpublishForm(id)
      setFormStatus('draft')
      setPublished(false)
      return result
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : 'Hủy xuất bản thất bại.')
      return null
    } finally {
      setPublishing(false)
    }
  }, [])

  return {
    name, desc, setName, setDesc,
    questions,
    activeId, setActiveId,
    activeQuestion: questions.find(q => q.id === activeId),
    sections, activeSectionId, setActiveSectionId, setSections,
    addQuestion, duplicateQuestion, removeQuestion, updateQuestion, moveQuestion, reorderQuestion,
    addSectionAfter, deleteSection,
    addOption, updateOption, removeOption,
    groupQuestions, ungroupQuestion,
    loading, loadError,
    saving, saved, saveError, handleSave,
    publishing, published, publishError, handlePublish, handleUnpublish, formStatus,
  }
}