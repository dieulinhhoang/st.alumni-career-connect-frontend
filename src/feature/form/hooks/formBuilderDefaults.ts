import type { Question, Section } from '../types'
import { genId } from './Useformutils'

export type QuestionOption = { id: string; label: string }

export const newQuestion = (sectionId = '', patch: Partial<Question> = {}): Question => ({
  id: genId(), type: 'text', title: '', required: false, options: [], sectionId, order: 0, ...patch,
})

export const newSection = (): Section => ({ id: genId(), title: 'Phần I. Thông tin cá nhân', order: 0 })

export const reindex = <T extends { order?: number }>(arr: T[]): T[] => arr.map((x, i) => ({ ...x, order: i }))

// Câu hỏi mặc định khi tạo form mới: [tiêu đề, reportFieldKey, type?, options?]
const DEFAULT_FIELDS: [title: string, reportFieldKey: string, type?: Question['type'], optionLabels?: string[]][] = [
  ['Mã sinh viên', 'student_code'],
  ['Họ và tên', 'fullname'],
  ['Giới tính', 'gender', 'radio', ['Nam', 'Nữ']],
  ['Ngày sinh', 'dob', 'date', []],
  ['Mã ngành đào tạo', 'industrycode'],
  ['Số CCCD', 'citizen_identification', 'cccd', []],
  ['Khóa học', 'courseyear'],
  ['Tên ngành được đào tạo', 'industryname'],
]

export const defaultQuestions = (sectionId: string): Question[] =>
  DEFAULT_FIELDS.map(([title, reportFieldKey, type = 'text', optionLabels = []], order) =>
    newQuestion(sectionId, {
      title, reportFieldKey, type, order, required: true,
      options: optionLabels.map(label => ({ id: genId(), label })),
    }))
