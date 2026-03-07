import { useState } from 'react'
import { Input, Select, Switch, Button } from 'antd'
import { DeleteOutlined, HolderOutlined } from '@ant-design/icons'
import type { Question, QuestionType } from '../../../feature/survey/type'
import { useSurveyStore } from '../../../feature/survey/hooks/useSurveyStore'

const TYPE_OPTIONS = [
  { label: 'Text',            value: 'text' },
  { label: 'Multiple choice', value: 'multiple-choice' },
  { label: 'Checkbox',        value: 'checkbox' },
  { label: 'Select',          value: 'select' },
  { label: 'Date',            value: 'date' },
]

interface Props { question: Question }

export function QuestionEditor({ question: q }: Props) {
  const { updateQuestion, deleteQuestion } = useSurveyStore()
  const [expanded, setExpanded] = useState(false)
  const needsOptions = ['multiple-choice', 'checkbox', 'select'].includes(q.type)

  const updateOption = (i: number, val: string) => {
    const opts = [...(q.options ?? [])]
    opts[i] = val
    updateQuestion(q.id, { options: opts })
  }

  return (
    <div className="question-card">
      {/* Header */}
      <div className="question-header" onClick={() => setExpanded(e => !e)}>
        <HolderOutlined className="question-drag-handle" />
        <span className="question-label">
          {q.label || 'Câu hỏi chưa có tiêu đề'}
        </span>
        <span className="question-type-badge">{q.type}</span>
        {q.required && (
          <span className="question-required-badge">BẮT BUỘC</span>
        )}
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={e => { e.stopPropagation(); deleteQuestion(q.id) }}
        />
        <span style={{ fontSize: 11, color: '#bfbfbf' }}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {/* Body */}
      {expanded && (
        <div className="question-body">
          {/* Tiêu đề */}
          <div>
            <p className="question-field-label">Tiêu đề câu hỏi</p>
            <Input
              value={q.label}
              placeholder="Nhập tiêu đề câu hỏi..."
              onChange={e => updateQuestion(q.id, { label: e.target.value })}
            />
          </div>

          {/* Loại */}
          <div>
            <p className="question-field-label">Loại câu hỏi</p>
            <Select
              value={q.type}
              options={TYPE_OPTIONS}
              style={{ width: '100%' }}
              onChange={v => updateQuestion(q.id, { type: v as QuestionType })}
            />
          </div>

          {/* Placeholder */}
          {q.type === 'text' && (
            <div>
              <p className="question-field-label">Placeholder</p>
              <Input
                value={q.placeholder ?? ''}
                placeholder="VD: Nhập họ và tên..."
                onChange={e => updateQuestion(q.id, { placeholder: e.target.value })}
              />
            </div>
          )}

          {/* Options */}
          {needsOptions && (
            <div>
              <p className="question-field-label">Lựa chọn</p>
              <div className="option-list">
                {q.options?.map((opt, i) => (
                  <div key={i} className="option-item">
                    <Input
                      value={opt}
                      onChange={e => updateOption(i, e.target.value)}
                    />
                    <Button
                      type="text"
                      size="small"
                      className="option-delete-btn"
                      onClick={() => updateQuestion(q.id, {
                        options: q.options?.filter((_, idx) => idx !== i)
                      })}
                    >×</Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  block
                  size="small"
                  onClick={() => updateQuestion(q.id, {
                    options: [...(q.options ?? []), `Lựa chọn ${(q.options?.length ?? 0) + 1}`]
                  })}
                >
                  + Thêm lựa chọn
                </Button>
              </div>
            </div>
          )}

          {/* Bắt buộc */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch
              size="small"
              checked={q.required}
              onChange={v => updateQuestion(q.id, { required: v })}
            />
            <span style={{ fontSize: 13, color: '#595959' }}>Bắt buộc trả lời</span>
          </div>
        </div>
      )}
    </div>
  )
}