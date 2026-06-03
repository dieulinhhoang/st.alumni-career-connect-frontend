import type { Form, Question, Section } from '../types'

export interface LoadResult {
  name: string
  desc: string
  sections: Section[]
  questions: Question[]
  activeSectionId: string | null
  activeQuestionId: string | null
}

export function normalizeFormData(form: Form): LoadResult {
  const name = form.name ?? ''
  const desc = form.description ?? ''

  const formQuestions: Question[] = Array.isArray(form.questions)
    ? form.questions
    : []

  const rawSections = (form as any).sections
  const serverSections: Section[] = Array.isArray(rawSections)
    ? rawSections
    : []

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
      : [{
          id: 'default',
          title: 'Phần 1',
          order: 0,
        }]

  const questions = formQuestions.length > 0
    ? formQuestions
    : [{
        id: 'q_default',
        type: 'short',
        title: '',
        required: false,
        options: [],
        sectionId: loadedSections[0]?.id ?? '',
        order: 0,
      } as Question]

  return {
    name,
    desc,
    sections: loadedSections,
    questions,
    activeSectionId: loadedSections[0]?.id ?? null,
    activeQuestionId: questions[0]?.id ?? null,
  }
}