import { useState, useEffect, useCallback, useRef } from 'react'
import { getFormById, createForm, updateForm, publishForm, unpublishForm } from '../api'
import type { Form, Question, Section, SurveyHeader, SurveyFooter } from '../types'
import type { LogicRule } from '../../../pages/admin/Form/builder/BuilderView'
import { genId } from './Useformutils'

export type BuilderMode = 'create' | 'edit'

type QuestionOption = { id: string; label: string }

const newQuestion = (sectionId = '', patch: Partial<Question> = {}): Question => ({
  id: genId(), type: 'short', title: '', required: false, options: [], sectionId, order: 0, ...patch,
})

const newSection = (): Section => ({ id: genId(), title: 'Phần I. Thông tin cá nhân', order: 0 })

const reindex = <T extends { order?: number }>(arr: T[]): T[] => arr.map((x, i) => ({ ...x, order: i }))

// Câu hỏi mặc định khi tạo form mới: [tiêu đề, reportFieldKey, type?, options?]
const DEFAULT_FIELDS: [title: string, reportFieldKey: string, type?: Question['type'], optionLabels?: string[]][] = [
  ['Mã sinh viên', 'student_code'],
  ['Họ và tên', 'fullname'],
  ['Giới tính', 'gender', 'radio', ['Nam', 'Nữ', 'Khác']],
  ['Ngày sinh', 'dob', 'date', []],
  ['Mã ngành đào tạo', 'industrycode'],
  ['Số CCCD', 'citizen_identification'],
  ['Khóa học', 'courseyear'],
  ['Tên ngành được đào tạo', 'industryname'],
]

const defaultQuestions = (sectionId: string): Question[] =>
  DEFAULT_FIELDS.map(([title, reportFieldKey, type = 'short', optionLabels = []], order) =>
    newQuestion(sectionId, {
      title, reportFieldKey, type, order, required: true,
      options: optionLabels.map(label => ({ id: genId(), label })),
    }))

async function runAsync<T>(
  fn: () => Promise<T>,
  setBusy: (b: boolean) => void,
  setError: (s: string) => void,
  fallbackMsg: string,
): Promise<T | null> {
  setBusy(true)
  setError('')
  try {
    return await fn()
  } catch (e) {
    setError(e instanceof Error ? e.message : fallbackMsg)
    return null
  } finally {
    setBusy(false)
  }
}

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
  // Khởi tạo 1 lần (lazy) để id không bị sinh lại mỗi render
  const [initial] = useState(() => {
    const section = newSection()
    return { section, qs: mode === 'create' ? defaultQuestions(section.id) : [] }
  })

  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [questions, setQs] = useState<Question[]>(initial.qs)
  const [activeId, setActiveId] = useState<string | null>(initial.qs[0]?.id ?? null)
  const [sections, setSections] = useState<Section[]>([initial.section])
  const [activeSectionId, setActiveSectionId] = useState<string | null>(initial.section.id)

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

  //  Load form khi edit
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
        const serverSections: Section[] = Array.isArray((form as any).sections) ? (form as any).sections : []
        // Ưu tiên sections từ server; nếu không có thì suy ra từ sectionId của câu hỏi
        const loadedSections: Section[] = serverSections.length > 0
          ? serverSections
          : formQuestions.length > 0
          ? Array.from(new Set(formQuestions.map(q => q.sectionId).filter(Boolean)))
              .map((sectionId, index) => ({ id: sectionId, title: `Phần ${index + 1}`, order: index }))
          : [newSection()]
        setSections(loadedSections)
        setActiveSectionId(loadedSections[0]?.id ?? null)
        const qs = formQuestions.length > 0 ? formQuestions : [newQuestion(loadedSections[0]?.id)]
        setQs(qs)
        setActiveId(qs[0]?.id ?? null)
      })
      .catch((e: unknown) => { if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Không thể tải form.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [mode, formId])

  //  Question CRUD
  const addQuestion = useCallback((afterId?: string, patch?: Partial<Question>): string => {
    const newId = genId()
    setQs(qs => {
      const afterQ = afterId ? qs.find(q => q.id === afterId) : null
      const sid = afterQ?.sectionId || activeSectionId || sections[0]?.id || ''
      const q: Question = { ...newQuestion(sid), ...patch, id: newId, sectionId: patch?.sectionId ?? sid }
      // Chèn sau câu chỉ định, hoặc sau câu cuối cùng của section đang active
      let at: number
      if (afterId) {
        const idx = qs.findIndex(x => x.id === afterId)
        at = idx === -1 ? qs.length : idx + 1
      } else {
        const lastInSection = qs.reduce((last, cur, i) => (cur.sectionId === sid ? i : last), -1)
        at = lastInSection >= 0 ? lastInSection + 1 : qs.length
      }
      return reindex([...qs.slice(0, at), q, ...qs.slice(at)])
    })
    setActiveId(newId)
    return newId
  }, [activeSectionId, sections])

  const duplicateQuestion = useCallback((id: string) => {
    setQs(qs => {
      const idx = qs.findIndex(q => q.id === id)
      if (idx === -1) return qs
      const copy: Question = { ...qs[idx], id: genId(), options: (qs[idx].options ?? []).map((o: QuestionOption) => ({ ...o, id: genId() })) }
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
      const swap = dir === 'up' ? idx - 1 : idx + 1
      if (idx === -1 || swap < 0 || swap >= qs.length) return qs
      const next = [...qs]
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
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

      // Group bị đứt sau khi reorder (member không còn liền kề / khác section) → tách cả group
      const byGroup = new Map<string, number[]>()
      next.forEach((q, i) => {
        if (q.rowGroup) byGroup.set(q.rowGroup, [...(byGroup.get(q.rowGroup) ?? []), i])
      })
      const broken = new Set(
        [...byGroup].filter(([, idxs]) =>
          idxs.some((v, j) => j > 0 && v !== idxs[j - 1] + 1) ||
          new Set(idxs.map(i => next[i].sectionId)).size > 1
        ).map(([gid]) => gid)
      )
      return broken.size === 0 ? next
        : next.map(q => broken.has(q.rowGroup ?? '') ? { ...q, rowGroup: undefined } : q)
    })
  }, [])

  //  Sections
  const addSectionAfter = useCallback((afterQuestionId: string) => {
    const afterIdx = questions.findIndex(q => q.id === afterQuestionId)
    if (afterIdx === -1) return
    const currentSectionId = questions[afterIdx].sectionId
    const newSectionId = genId()

    // Chuyển các câu phía sau (cùng section) vào section mới
    let firstMovedId: string | null = null
    let next = questions.map((q, i) => {
      if (i > afterIdx && q.sectionId === currentSectionId) {
        firstMovedId ??= q.id
        return { ...q, sectionId: newSectionId }
      }
      return q
    })
    // Không có câu nào để chuyển và đây là câu cuối → tạo câu trống cho section mới
    if (!firstMovedId && afterIdx === questions.length - 1) {
      const blank = newQuestion(newSectionId)
      firstMovedId = blank.id
      next = [...next.slice(0, afterIdx + 1), blank, ...next.slice(afterIdx + 1)]
    }

    const curIdx = sections.findIndex(s => s.id === currentSectionId)
    const insertAt = curIdx >= 0 ? curIdx + 1 : sections.length
    const section: Section = { id: newSectionId, title: `Phần ${sections.length + 1}`, order: insertAt }
    setQs(reindex(next))
    setSections(reindex([...sections.slice(0, insertAt), section, ...sections.slice(insertAt)]))
    setActiveSectionId(newSectionId)
    setActiveId(firstMovedId)
  }, [questions, sections])

  const deleteSection = useCallback((id: string) => {
    setSections(prev => {
      if (prev.length <= 1) return prev
      const remaining = reindex(prev.filter(s => s.id !== id))
      const fallback = remaining[0]?.id
      setQs(qs => qs.map(q => q.sectionId === id ? { ...q, sectionId: fallback } : q))
      setActiveSectionId(fallback ?? null)
      return remaining
    })
  }, [])

  //  Options
  const patchOptions = (qid: string, fn: (opts: QuestionOption[]) => QuestionOption[]) =>
    setQs(qs => qs.map(q => q.id !== qid ? q : { ...q, options: fn(q.options ?? []) }))

  const addOption = useCallback((qid: string) =>
    patchOptions(qid, opts => [...opts, { id: genId(), label: '' }]), [])
  const updateOption = useCallback((qid: string, oid: string, label: string) =>
    patchOptions(qid, opts => opts.map(o => o.id === oid ? { ...o, label } : o)), [])
  const removeOption = useCallback((qid: string, oid: string) =>
    patchOptions(qid, opts => opts.filter(o => o.id !== oid)), [])

  //  Row group (2-3 câu / hàng)
  // Group `count` câu liên tiếp cùng section, leader là câu đầu group hiện tại (giữ groupId ổn định)
  const groupQuestions = useCallback((id: string, count: 2 | 3) => {
    setQs(prev => {
      const idx = prev.findIndex(q => q.id === id)
      if (idx < 0) return prev

      const currentGroup = prev[idx].rowGroup
      const leaderIdx = currentGroup ? prev.findIndex(q => q.rowGroup === currentGroup) : idx
      const leader = prev[leaderIdx] ?? prev[idx]
      const groupId = `rg_${leader.id}`

      // Thu thập đúng `count` câu liên tiếp cùng section, bắt đầu từ leader
      const targetIds = new Set<string>()
      for (let i = leaderIdx; i < prev.length && targetIds.size < count; i++) {
        if (prev[i].sectionId !== leader.sectionId) break
        targetIds.add(prev[i].id)
      }

      // Mọi group cũ dính tới range mới (kể cả group hiện tại của leader) đều bị giải tán
      const dissolve = new Set<string>()
      if (currentGroup) dissolve.add(currentGroup)
      prev.forEach(q => { if (targetIds.has(q.id) && q.rowGroup) dissolve.add(q.rowGroup) })

      return prev.map(q =>
        targetIds.has(q.id) ? { ...q, rowGroup: groupId }
        : dissolve.has(q.rowGroup ?? '') ? { ...q, rowGroup: undefined }
        : q)
    })
  }, [])

  // Tách 1 câu khỏi group; nếu group chỉ còn 2 câu thì giải tán cả group
  const ungroupQuestion = useCallback((id: string) => {
    setQs(prev => {
      const gid = prev.find(q => q.id === id)?.rowGroup
      if (!gid) return prev
      const dissolveAll = prev.filter(q => q.rowGroup === gid).length <= 2
      return prev.map(q =>
        (dissolveAll ? q.rowGroup === gid : q.id === id) ? { ...q, rowGroup: undefined } : q)
    })
  }, [])

  //  Save / publish
  // FIX: dùng savedFormIdRef thay vì mode+formId — tránh createForm bị gọi nhiều lần
  const handleSave = useCallback(async (extras?: SaveExtras): Promise<Form | null> => {
    if (!name.trim()) return null
    setSaved(false)
    const { descriptionParagraphs, ...rest } = extras ?? {}
    const payload = {
      name,
      description: descriptionParagraphs ? descriptionParagraphs.join('\n') : desc,
      questions, sections, ...rest,
    }
    const result = await runAsync(async () => {
      const id = savedFormIdRef.current
      const form = id != null ? await updateForm(id, payload) : await createForm(payload)
      savedFormIdRef.current = form.id as number
      return form
    }, setSaving, setSaveError, 'Lưu thất bại.')
    if (result) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
    return result
  }, [name, desc, questions, sections])

  const setPublishStatus = useCallback(async (publish: boolean): Promise<Form | null> => {
    const id = savedFormIdRef.current
    if (!id) return null
    const result = await runAsync(
      () => (publish ? publishForm(id) : unpublishForm(id)),
      setPublishing, setPublishError,
      publish ? 'Xuất bản thất bại.' : 'Hủy xuất bản thất bại.',
    )
    if (result) {
      setFormStatus(publish ? 'published' : 'draft')
      setPublished(publish)
      if (publish) setTimeout(() => setPublished(false), 2500)
    }
    return result
  }, [])

  const handlePublish = useCallback(() => setPublishStatus(true), [setPublishStatus])
  const handleUnpublish = useCallback(() => setPublishStatus(false), [setPublishStatus])

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
