import { useCallback } from 'react'
import type { Question, Section } from '../types'
import { genId } from './Useformutils'
import { newQuestion, reindex } from './formBuilderDefaults'

interface Params {
  questions: Question[]
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>
  sections: Section[]
  setSections: React.Dispatch<React.SetStateAction<Section[]>>
  setActiveSectionId: (id: string | null) => void
  setActiveId: (id: string | null) => void
}

export interface SectionActions {
  addSectionAfter: (afterQuestionId: string) => void
  deleteSection: (id: string) => void
}

// Thêm / xoá Section (Phần) trong canvas builder
export function useSectionActions({ questions, setQuestions, sections, setSections, setActiveSectionId, setActiveId }: Params): SectionActions {
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
    setQuestions(reindex(next))
    setSections(reindex([...sections.slice(0, insertAt), section, ...sections.slice(insertAt)]))
    setActiveSectionId(newSectionId)
    setActiveId(firstMovedId)
  }, [questions, sections, setQuestions, setSections, setActiveSectionId, setActiveId])

  const deleteSection = useCallback((id: string) => {
    setSections(prev => {
      if (prev.length <= 1) return prev
      const remaining = reindex(prev.filter(s => s.id !== id))
      const fallback = remaining[0]?.id
      setQuestions(qs => qs.map(q => q.sectionId === id ? { ...q, sectionId: fallback } : q))
      setActiveSectionId(fallback ?? null)
      return remaining
    })
  }, [setSections, setQuestions, setActiveSectionId])

  return { addSectionAfter, deleteSection }
}
