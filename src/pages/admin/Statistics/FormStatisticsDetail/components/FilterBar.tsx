import { Col, Row } from 'antd'
import { ReloadOutlined, FilterOutlined } from '@ant-design/icons'
import type { FormOption, StatisticalQuestion } from '../../../../../feature/statistics/types'

interface Props {
  forms: FormOption[]
  questions: StatisticalQuestion[]
  formId?: number
  questionId?: string
  onChangeForm: (value: number) => void
  onChangeQuestion: (value: string) => void
}

export function FilterBar({ forms, questions, formId, questionId, onChangeForm, onChangeQuestion }: Props) {
  return (
    <div className="stats-filter-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <FilterOutlined style={{ color: 'var(--st-teal)', fontSize: 13 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--st-slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Bộ lọc
        </span>
      </div>

      <Row gutter={[16, 12]} align="bottom">
        <Col xs={24} md={10}>
          <span className="stats-filter-label">Biểu mẫu khảo sát</span>
          <select
            value={formId ?? ''}
            onChange={(e) => onChangeForm(Number(e.target.value))}
            style={{
              width: '100%',
              height: 38,
              padding: '0 36px 0 12px',
              borderRadius: 8,
              border: '1px solid rgba(30,41,59,0.15)',
              fontSize: 14,
              color: formId ? '#1e293b' : '#94a3b8',
              background: 'white',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            <option value="" disabled>Chọn biểu mẫu</option>
            {forms.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </Col>

        <Col xs={24} md={10}>
          <span className="stats-filter-label">Câu hỏi thống kê</span>
          <select
            value={questionId ?? ''}
            onChange={(e) => onChangeQuestion(e.target.value)}
            disabled={!formId}
            style={{
              width: '100%',
              height: 38,
              padding: '0 36px 0 12px',
              borderRadius: 8,
              border: '1px solid rgba(30,41,59,0.15)',
              fontSize: 14,
              color: questionId ? '#1e293b' : '#94a3b8',
              background: !formId ? '#f8fafc' : 'white',
              outline: 'none',
              cursor: formId ? 'pointer' : 'not-allowed',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              opacity: formId ? 1 : 0.5,
            }}
          >
            <option value="" disabled>Chọn câu hỏi</option>
            {questions.map((q) => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </select>
        </Col>

        <Col xs={24} md={4}>
          <button
            style={{
              width: '100%',
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              borderRadius: 8,
              border: '1px solid rgba(30,41,59,0.15)',
              background: 'white',
              fontSize: 13,
              fontWeight: 500,
              color: '#475569',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget
              btn.style.color = 'var(--st-teal)'
              btn.style.borderColor = 'var(--st-teal)'
              btn.style.background = 'var(--st-teal-light)'
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget
              btn.style.color = '#475569'
              btn.style.borderColor = 'rgba(30,41,59,0.15)'
              btn.style.background = 'white'
            }}
            onClick={() => window.location.reload()}
          >
            <ReloadOutlined style={{ fontSize: 13 }} />
            Làm mới
          </button>
        </Col>
      </Row>
    </div>
  )
}
