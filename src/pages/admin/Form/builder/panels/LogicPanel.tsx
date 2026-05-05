import { useState } from 'react'
import { Select, Button, Tooltip } from 'antd'
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons'
import type { Question } from '../../../../../feature/form/types'

interface LogicRule {
  id: string
  sourceQuestionId: string
  operator: 'equals' | 'notequals' | 'contains'
  value: string
  action: 'show' | 'hide' | 'skip' | 'require'
  targetQuestionId: string
}

interface LogicPanelProps {
  questions: Question[]
  logicRules: LogicRule[]
  accent: string
  onRulesChange: (rules: LogicRule[]) => void
}

const OPERATORS = [
  { value: 'equals', label: 'bằng' },
  { value: 'notequals', label: 'khác' },
  { value: 'contains', label: 'chứa' },
]
const ACTIONS = [
  { value: 'show', label: '👁 Hiện câu hỏi' },
  { value: 'hide', label: '🙈 Ẩn câu hỏi' },
  { value: 'skip', label: '⏭ Bỏ qua đến' },
  { value: 'require', label: '⚠️ Bắt buộc trả lời' },
]

function uid() { return Math.random().toString(36).slice(2, 9) }

export function LogicPanel({ questions, logicRules, accent, onRulesChange }: LogicPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const addRule = () => {
    const newRule: LogicRule = { id: uid(), sourceQuestionId: '', operator: 'equals', value: '', action: 'show', targetQuestionId: '' }
    onRulesChange([...logicRules, newRule])
    setExpandedId(newRule.id)
  }

  const updateRule = (id: string, patch: Partial<LogicRule>) =>
    onRulesChange(logicRules.map((r) => r.id === id ? { ...r, ...patch } : r))

  const removeRule = (id: string) => {
    onRulesChange(logicRules.filter((r) => r.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const getQOptions = (excludeId?: string) =>
    questions.filter((q) => q.id !== excludeId).map((q, i) => ({ value: q.id, label: `Q${i + 1}: ${q.title?.slice(0, 30) || 'Không có tiêu đề'}` }))

  const getValueOptions = (qId: string) => {
    const q = questions.find((x) => x.id === qId)
    if (!q || !q.options?.length) return []
    return q.options.map((o) => ({ value: typeof o === 'string' ? o : o.label, label: typeof o === 'string' ? o : o.label }))
  }

  const sel: React.CSSProperties = { width: '100%' }

  return (
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Logic điều kiện</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{logicRules.length} quy tắc</div>
        </div>
        <Tooltip title="Quy tắc logic giúp hiển thị / ẩn câu hỏi dựa trên câu trả lời trước đó" placement="left">
          <InfoCircleOutlined style={{ color: '#94a3b8', fontSize: 13, cursor: 'help' }} />
        </Tooltip>
      </div>

      {logicRules.length === 0 ? (
        <div style={{ padding: '24px 12px', textAlign: 'center', borderRadius: 10, border: '1.5px dashed #e5e7eb', background: '#fafafa' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, lineHeight: 1.5 }}>Chưa có quy tắc logic nào. Thêm để điều kiện hóa câu hỏi.</div>
          <button onClick={addRule}
            style={{ height: 30, padding: '0 14px', border: 'none', borderRadius: 7, background: accent, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
            <PlusOutlined style={{ fontSize: 10 }} /> Thêm quy tắc
          </button>
        </div>
      ) : (
        <>
          {logicRules.map((rule, idx) => {
            const srcQ = questions.find((q) => q.id === rule.sourceQuestionId)
            const tgtQ = questions.find((q) => q.id === rule.targetQuestionId)
            const isExpanded = expandedId === rule.id
            const hasOpts = srcQ && (srcQ.type === 'radio' || srcQ.type === 'checkbox')
            const valueOpts = getValueOptions(rule.sourceQuestionId)

            return (
              <div key={rule.id} style={{ borderRadius: 10, border: `1.5px solid ${isExpanded ? accent : '#e5e7eb'}`, background: isExpanded ? `${accent}04` : '#fff', overflow: 'hidden', transition: 'all .15s' }}>
                {/* Rule header (collapsed summary) */}
                <div onClick={() => setExpandedId(isExpanded ? null : rule.id)}
                  style={{ padding: '9px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Quy tắc {idx + 1}</div>
                    {!isExpanded && srcQ && tgtQ && (
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {srcQ.title?.slice(0, 18)} → {ACTIONS.find((a) => a.value === rule.action)?.label?.slice(2)} → {tgtQ.title?.slice(0, 18)}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={(e) => { e.stopPropagation(); removeRule(rule.id) }} aria-label="Xóa quy tắc"
                      style={{ width: 22, height: 22, border: 'none', background: 'transparent', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db', fontSize: 12 }}
                      onMouseEnter={(e) => { (e.currentTarget.style.color = '#dc2626'); (e.currentTarget.style.background = '#fee2e2') }}
                      onMouseLeave={(e) => { (e.currentTarget.style.color = '#d1d5db'); (e.currentTarget.style.background = 'transparent') }}>
                      <DeleteOutlined />
                    </button>
                    <div style={{ fontSize: 10, color: '#94a3b8', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>▼</div>
                  </div>
                </div>

                {/* Expanded editor */}
                {isExpanded && (
                  <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #f0f4f8' }}>
                    <div style={{ paddingTop: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Nếu câu hỏi</div>
                      <Select size="small" style={sel} value={rule.sourceQuestionId || undefined}
                        placeholder="Chọn câu hỏi nguồn..."
                        onChange={(v) => updateRule(rule.id, { sourceQuestionId: v, value: '' })}
                        options={getQOptions(rule.targetQuestionId)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 6 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Điều kiện</div>
                        <Select size="small" style={sel} value={rule.operator}
                          onChange={(v) => updateRule(rule.id, { operator: v as any })}
                          options={OPERATORS} />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Giá trị</div>
                        {hasOpts && valueOpts.length > 0
                          ? <Select size="small" style={sel} value={rule.value || undefined} placeholder="Chọn..." onChange={(v) => updateRule(rule.id, { value: v })} options={valueOpts} />
                          : <input value={rule.value} onChange={(e) => updateRule(rule.id, { value: e.target.value })} placeholder="Nhập giá trị..."
                              style={{ width: '100%', height: 24, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                              onFocus={(e) => e.currentTarget.style.borderColor = accent}
                              onBlur={(e) => e.currentTarget.style.borderColor = '#d9d9d9'} />
                        }
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Hành động</div>
                      <Select size="small" style={sel} value={rule.action}
                        onChange={(v) => updateRule(rule.id, { action: v as any })}
                        options={ACTIONS} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Câu hỏi đích</div>
                      <Select size="small" style={sel} value={rule.targetQuestionId || undefined}
                        placeholder="Chọn câu hỏi đích..."
                        onChange={(v) => updateRule(rule.id, { targetQuestionId: v })}
                        options={getQOptions(rule.sourceQuestionId)} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          <button onClick={addRule}
            style={{ width: '100%', height: 34, border: `1.5px dashed ${accent}60`, borderRadius: 9, background: 'transparent', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'inherit', transition: 'all .13s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = `${accent}0c`)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
            <PlusOutlined style={{ fontSize: 10 }} /> Thêm quy tắc
          </button>
        </>
      )}
    </div>
  )
}
