import { useMemo } from 'react'
import { Select } from 'antd'
import type { FormOption, StatisticalQuestion } from '../../../../../feature/statistics/types'

interface Props {
  forms: FormOption[]
  questions: StatisticalQuestion[]
  formId?: number
  questionId?: string
  onChangeForm: (value?: number) => void
  onChangeQuestion: (value?: string) => void
}

export function FilterBar({
  forms,
  questions,
  formId,
  questionId,
  onChangeForm,
  onChangeQuestion,
}: Props) {
  const safeForms = Array.isArray(forms) ? forms : []
  const safeQuestions = Array.isArray(questions) ? questions : []

  const formOptions = useMemo(
    () =>
      safeForms.map((f) => ({
        label: f.name,
        value: f.id,
        shortLabel: f.name.length > 24 ? `${f.name.slice(0, 24)}...` : f.name,
      })),
    [safeForms]
  )

  const questionOptions = useMemo(
    () =>
      safeQuestions.map((q) => ({
        label: q.title,
        value: q.id,
        shortLabel:
          q.title.length > 28 ? `${q.title.slice(0, 28)}...` : q.title,
      })),
    [safeQuestions]
  )

  const selectedForm = formOptions.find((item) => item.value === formId)
  const selectedQuestion = questionOptions.find((item) => item.value === questionId)

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <Select
        value={formId}
        options={formOptions}
        placeholder="Chọn biểu mẫu"
        onChange={onChangeForm}
        allowClear
        showSearch
        optionFilterProp="label"
        style={{ width: 220 }}
        labelRender={() => selectedForm?.shortLabel || ''}
      />

      <Select
        value={questionId}
        options={questionOptions}
        placeholder="Chọn câu hỏi"
        onChange={onChangeQuestion}
        allowClear
        showSearch
        optionFilterProp="label"
        style={{ width: 260 }}
        labelRender={() => selectedQuestion?.shortLabel || ''}
      />
    </div>
  )
}