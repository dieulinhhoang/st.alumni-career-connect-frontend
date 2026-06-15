import { useState, useRef } from 'react'
import type { Question, Section } from '../types'
import { newSection, defaultQuestions } from './formBuilderDefaults'
import { useQuestionActions, type QuestionActions } from './useQuestionActions'
import { useSectionActions, type SectionActions } from './useSectionActions'
import { useFormLoader } from './useFormLoader'
import { useFormPersistence, type FormPersistence } from './useFormPersistence'

export type BuilderMode = 'create' | 'edit'

export type { SaveExtras } from './useFormPersistence'

export interface UseFormBuilderReturn extends QuestionActions, SectionActions, Omit<FormPersistence, 'setFormStatus'> {
  name: string; desc: string; setName: (v: string) => void; setDesc: (v: string) => void
  questions: Question[]
  activeId: string | null; setActiveId: (id: string | null) => void; activeQuestion: Question | undefined
  sections: Section[]; activeSectionId: string | null; setActiveSectionId: (id: string | null) => void; setSections: React.Dispatch<React.SetStateAction<Section[]>>
  loading: boolean; loadError: string
}

// Hook tổng: ghép state cốt lõi (câu hỏi, section, ...) với các nhóm hành vi
// useQuestionActions / useSectionActions / useFormLoader / useFormPersistence
export function useFormBuilder(mode: BuilderMode, formId?: number): UseFormBuilderReturn {
  // Khởi tạo 1 lần (lazy) để id không bị sinh lại mỗi render
  const [initial] = useState(() => {
    const section = newSection()
    return { section, qs: mode === 'create' ? defaultQuestions(section.id) : [] }
  })

  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [questions, setQuestions] = useState<Question[]>(initial.qs)
  const [activeId, setActiveId] = useState<string | null>(initial.qs[0]?.id ?? null)
  const [sections, setSections] = useState<Section[]>([initial.section])
  const [activeSectionId, setActiveSectionId] = useState<string | null>(initial.section.id)

  // FIX: track real form id — tránh auto-save tạo bản mới mỗi lần
  const savedFormIdRef = useRef<number | null>(formId ?? null)

  const persistence = useFormPersistence({ name, desc, questions, sections, savedFormIdRef })
  const { setFormStatus, ...persistenceReturn } = persistence

  const { loading, loadError } = useFormLoader(mode, formId, {
    setName, setDesc, setSections, setActiveSectionId, setQuestions, setActiveId, setFormStatus,
  })

  const questionActions = useQuestionActions({ setQuestions, setActiveId, sections, activeSectionId })
  const sectionActions = useSectionActions({ questions, setQuestions, sections, setSections, setActiveSectionId, setActiveId })

  return {
    name, desc, setName, setDesc,
    questions,
    activeId, setActiveId,
    activeQuestion: questions.find(q => q.id === activeId),
    sections, activeSectionId, setActiveSectionId, setSections,
    ...questionActions,
    ...sectionActions,
    loading, loadError,
    ...persistenceReturn,
  }
}
