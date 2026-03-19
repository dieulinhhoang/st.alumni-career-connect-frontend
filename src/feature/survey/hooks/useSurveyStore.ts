import { create } from "zustand"
import type { Question, Survey, SurveyFooter, SurveyHeader } from "../type"
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
  setHeader : (header: Partial<SurveyHeader>) => void
  setFooter : (footer: Partial<SurveyFooter>) => void
}

const default_SurveyHeader: SurveyHeader = {
  logoUrl: '',
  ministry: 'BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG',
  academy: 'HỌC VIỆN NÔNG NGHIỆP VIỆT NAM',
  address: 'Xã Gia Lâm, Thành phố Hà Nội',
  phone: '024.62617586',
  fax: '024.62617586',
  showDate: true
}
const default_SurveyFooter: SurveyFooter = {
  primaryText: 'Xin trân trọng cảm ơn Anh/Chị đã dành thời gian tham gia khảo sát này.',
  secondaryText: 'Kính chúc Anh/Chị sức khỏe, hạnh phúc và thành công.'
}

export const useSurveyStore = create<Store>((set) => ({
  survey: {
    defaultHeader: default_SurveyHeader,
    defaultFooter: default_SurveyFooter,
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
  })),

  setHeader: (header) => set((state) => ({
    survey: {
      ...state.survey,
      defaultHeader: { ...state.survey.defaultHeader, ...header }
    }
  })),

  setFooter: (footer) => set((state) => ({
    survey: {
      ...state.survey,
      defaultFooter: { ...state.survey.defaultFooter, ...footer }
    }
  }))
}))