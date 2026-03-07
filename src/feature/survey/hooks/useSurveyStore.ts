import { create } from "zustand"
import type { Question, Survey } from "../type"
import { v4 as uuid } from 'uuid'

interface Store {
  survey: Survey
  updateMeta: (patch: Partial<Pick<Survey, 'title' | 'description'>>) => void
  addSection: (title: string) => void
  updateSection: (id: string, title: string) => void
  deleteSection: (id: string) => void
  addQuestion: (sectionId: string, type: Question['type']) => void
  updateQuestion: (id: string, patch: Partial<Question>) => void
  deleteQuestion: (id: string) => void
}

export const useSurveyStore = create<Store>((set) => ({
  survey: {
    id: uuid(),
    title: '',
    description: '',
    sections: [],
    questions: []
  },

  updateMeta: (patch) => set((state) => ({
    survey: { ...state.survey, ...patch }
  })),

  addSection: (title) => set((state) => ({
    survey: {
      ...state.survey,
      sections: [
        ...state.survey.sections,
        { id: uuid(), title, order: state.survey.sections.length }
      ]
    }
  })),

  updateSection: (id, title) => set((state) => ({
    survey: {
      ...state.survey,
      sections: state.survey.sections.map((s) =>
        s.id === id ? { ...s, title } : s
      )
    }
  })),

  deleteSection: (id) => set((state) => ({
    survey: {
      ...state.survey,
      sections: state.survey.sections.filter((s) => s.id !== id),
      questions: state.survey.questions.filter((q) => q.sectionId !== id)
    }
  })),

  addQuestion: (sectionId, type) => set((state) => ({
    survey: {
      ...state.survey,
      questions: [
        ...state.survey.questions,
        {
          id: uuid(),
          sectionId,
          type,
          label: 'Câu hỏi mới',
          required: false,
          order: state.survey.questions.filter(q => q.sectionId === sectionId).length
        }
      ]
    }
  })),

  updateQuestion: (id, patch) => set((state) => ({
    survey: {
      ...state.survey,
      questions: state.survey.questions.map((q) =>
        q.id === id ? { ...q, ...patch } : q
      )
    }
  })),

  deleteQuestion: (id) => set((state) => ({
    survey: {
      ...state.survey,
      questions: state.survey.questions.filter((q) => q.id !== id)
    }
  }))
}))