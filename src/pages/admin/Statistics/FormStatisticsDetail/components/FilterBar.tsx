import { useMemo } from 'react'
import FilterComponent from '../../../../../components/common/FilterCustom'
import type { FilterColumn } from '../../../../../components/common/FilterCustom'
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
  const filterColumns = useMemo<FilterColumn[]>(() => [
    {
      title: 'Survey form',
      dataIndex: 'formId',
      type: 'select',
      options: forms.map((f) => ({ label: f.name, value: f.id })),
      placeholder: 'Select form',
    },
    {
      title: 'Question',
      dataIndex: 'questionId',
      type: 'select',
      options: questions.map((q) => ({ label: q.title, value: q.id })),
      placeholder: 'Select question',
    },
  ], [forms, questions])

  // Build current values so FilterComponent reflects external state changes
  // (e.g. auto-selection of first form/question by the hook).
  const currentValues = useMemo(() => {
    const vals: Record<string, any> = {}
    if (formId !== undefined) vals['formId'] = [formId]
    if (questionId !== undefined) vals['questionId'] = [questionId]
    return vals
  }, [formId, questionId])

  const handleFilterChange = (values: Record<string, any>) => {
    const newFormId = Array.isArray(values['formId'])
      ? (values['formId'][0] as number)
      : (values['formId'] as number | undefined)

    const newQuestionId = Array.isArray(values['questionId'])
      ? (values['questionId'][0] as string)
      : (values['questionId'] as string | undefined)

    if (newFormId !== undefined && newFormId !== formId) {
      onChangeForm(newFormId)
    }
    if (newQuestionId !== undefined && newQuestionId !== questionId) {
      onChangeQuestion(newQuestionId)
    }
  }

  const handleReset = () => {
    onReset?.()
  }

  return (
    <div className="stats-filter-card">
      <FilterComponent
        columns={filterColumns}
        initialValues={currentValues}
        onFilterChange={handleFilterChange}
        onResetFields={handleReset}
        className=""
      />
    </div>
  )
}
