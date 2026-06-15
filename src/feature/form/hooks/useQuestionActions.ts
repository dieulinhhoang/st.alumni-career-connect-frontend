import { useCallback } from 'react'
import type { Question, Section } from '../types'
import { genId } from './Useformutils'
import { newQuestion, reindex, type QuestionOption } from './formBuilderDefaults'

interface Params {
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>
  sections: Section[]
  activeSectionId: string | null
}

export interface QuestionActions {
  addQuestion: (afterId?: string, patch?: Partial<Question>) => string
  duplicateQuestion: (id: string) => void
  removeQuestion: (id: string) => void
  updateQuestion: (id: string, patch: Partial<Question>) => void
  moveQuestion: (id: string, dir: 'up' | 'down') => void
  reorderQuestion: (dragId: string, overId: string) => void
  addOption: (questionId: string) => void
  updateOption: (questionId: string, optionId: string, label: string) => void
  removeOption: (questionId: string, optionId: string) => void
  groupQuestions: (id: string, count: 2 | 3) => void
  ungroupQuestion: (id: string) => void
}

// CRUD câu hỏi, option và group hàng (2-3 câu / hàng) trong canvas builder
export function useQuestionActions({ setQuestions, setActiveId, sections, activeSectionId }: Params): QuestionActions {
  const addQuestion = useCallback((afterId?: string, patch?: Partial<Question>): string => {
    const newId = genId()
    setQuestions(qs => {
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
  }, [activeSectionId, sections, setQuestions, setActiveId])

  const duplicateQuestion = useCallback((id: string) => {
    setQuestions(qs => {
      const idx = qs.findIndex(q => q.id === id)
      if (idx === -1) return qs
      const copy: Question = { ...qs[idx], id: genId(), options: (qs[idx].options ?? []).map((o: QuestionOption) => ({ ...o, id: genId() })) }
      setActiveId(copy.id)
      return [...qs.slice(0, idx + 1), copy, ...qs.slice(idx + 1)]
    })
  }, [setQuestions, setActiveId])

  const removeQuestion = useCallback((id: string) => {
    setQuestions(qs => {
      const next = qs.filter(q => q.id !== id)
      setActiveId(prev => prev === id ? (next[0]?.id ?? null) : prev)
      return next
    })
  }, [setQuestions, setActiveId])

  const updateQuestion = useCallback((id: string, patch: Partial<Question>) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, ...patch } : q))
  }, [setQuestions])

  const moveQuestion = useCallback((id: string, dir: 'up' | 'down') => {
    setQuestions(qs => {
      const idx = qs.findIndex(q => q.id === id)
      const swap = dir === 'up' ? idx - 1 : idx + 1
      if (idx === -1 || swap < 0 || swap >= qs.length) return qs
      const next = [...qs]
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return next
    })
  }, [setQuestions])

  const reorderQuestion = useCallback((dragId: string, overId: string) => {
    setQuestions(qs => {
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
  }, [setQuestions])

  const patchOptions = useCallback((qid: string, fn: (opts: QuestionOption[]) => QuestionOption[]) =>
    setQuestions(qs => qs.map(q => q.id !== qid ? q : { ...q, options: fn(q.options ?? []) })), [setQuestions])

  const addOption = useCallback((qid: string) =>
    patchOptions(qid, opts => [...opts, { id: genId(), label: '' }]), [patchOptions])
  const updateOption = useCallback((qid: string, oid: string, label: string) =>
    patchOptions(qid, opts => opts.map(o => o.id === oid ? { ...o, label } : o)), [patchOptions])
  const removeOption = useCallback((qid: string, oid: string) =>
    patchOptions(qid, opts => opts.filter(o => o.id !== oid)), [patchOptions])

  // Group `count` câu liên tiếp cùng section, leader là câu đầu group hiện tại (giữ groupId ổn định)
  const groupQuestions = useCallback((id: string, count: 2 | 3) => {
    setQuestions(prev => {
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
  }, [setQuestions])

  // Tách 1 câu khỏi group; nếu group chỉ còn 2 câu thì giải tán cả group
  const ungroupQuestion = useCallback((id: string) => {
    setQuestions(prev => {
      const gid = prev.find(q => q.id === id)?.rowGroup
      if (!gid) return prev
      const dissolveAll = prev.filter(q => q.rowGroup === gid).length <= 2
      return prev.map(q =>
        (dissolveAll ? q.rowGroup === gid : q.id === id) ? { ...q, rowGroup: undefined } : q)
    })
  }, [setQuestions])

  return {
    addQuestion, duplicateQuestion, removeQuestion, updateQuestion, moveQuestion, reorderQuestion,
    addOption, updateOption, removeOption,
    groupQuestions, ungroupQuestion,
  }
}
