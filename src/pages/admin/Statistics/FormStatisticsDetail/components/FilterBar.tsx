import { useMemo } from 'react'
import { Select, Button, Form } from 'antd'
import type { FormOption, StatisticalQuestion } from '../../../../../feature/statistics/types'

interface Props {
  forms: FormOption[]
  questions: StatisticalQuestion[]
  formId?: number
  questionId?: string
  onChangeForm: (value: number) => void
  onChangeQuestion: (value: string) => void
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
  const formOptions = useMemo(
    () => forms.map((f) => ({ label: f.name, value: f.id })),
    [forms]
  )

  const questionOptions = useMemo(
    () => questions.map((q) => ({ label: q.title, value: q.id })),
    [questions]
  )

  const handleReset = () => {
    onReset?.()
  }

  return (
    <div className="stats-filter-card">
      <Form layout="inline">
        <Form.Item label="Survey form">
          <Select
            value={formId}
            options={formOptions}
            placeholder="Select form"
            onChange={onChangeForm}
            allowClear
            style={{ minWidth: 200 }}
          />
        </Form.Item>

        <Form.Item label="Question">
          <Select
            value={questionId}
            options={questionOptions}
            placeholder="Select question"
            onChange={onChangeQuestion}
            allowClear
            style={{ minWidth: 200 }}
          />
        </Form.Item>

        {/* <Form.Item>
          <Button onClick={handleReset}>Reset</Button>
        </Form.Item> */}
      </Form>
    </div>
  )
}