import { useMemo } from 'react'
import { Select, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import type { FormOption, StatisticalQuestion } from '../../../../../feature/statistics/types'

interface Props {
  forms: FormOption[]
  questions: StatisticalQuestion[]
  formId?: number
  questionId?: string
  onChangeForm: (value?: number) => void
  onChangeQuestion: (value?: string) => void
  onReset?: () => void
}

export function FilterBar({
  forms,
  questions,
  formId,
  questionId,
  onChangeForm,
  onChangeQuestion,
  onReset,
}: Props) {
  const safeForms = Array.isArray(forms) ? forms : []
  const safeQuestions = Array.isArray(questions) ? questions : []

  const formOptions = useMemo(
    () =>
      safeForms.map((f) => ({
        label: f.name,
        value: f.id,
        textLabel: f.name.length > 24 ? `${f.name.slice(0, 24)}...` : f.name,
      })),
    [safeForms]
  )

  const questionOptions = useMemo(
    () =>
      safeQuestions.map((q) => ({
        label: q.title,
        value: q.id,
        textLabel:
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
        labelRender={() => selectedForm?.textLabel || ''}
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
        labelRender={() => selectedQuestion?.textLabel || ''}
      />

      {onReset && (
        <Button
          icon={<ReloadOutlined />}
          onClick={onReset}
          type="default"
        >
          Đặt lại
        </Button>
      )}
    </div>
  )
}
