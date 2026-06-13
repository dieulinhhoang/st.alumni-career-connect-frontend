/**
 * LogicPanel.tsx — Tab "Logic" trong RightPanel
 *
 * FIX (so với bản cũ):
 *  1. Operator align với ConditionalRule trong types.ts:
 *       'equals' | 'not_equals' | 'includes'  (bỏ 'notequals', 'contains')
 *  2. Mỗi rule ánh xạ trực tiếp sang question.visibleWhen — khi người dùng
 *     lưu / thay đổi rule, hàm onRulesChange ghi visibleWhen vào question
 *     thông qua callback onUpdateQuestion.
 *  3. Phân biệt action 'show' (visibleWhen) và 'require' (required=true);
 *     các action 'hide' / 'skip' chuyển thành visibleWhen với logic đảo.
 *  4. Giữ nguyên UI accordion expand/collapse.
 */

import { useState } from 'react'
import { Select, Button, Tooltip } from 'antd'
import { PlusOutlined, DeleteOutlined, DownOutlined, InfoCircleOutlined } from '@ant-design/icons'
import type { Question, ConditionalRule } from '../../../../../feature/form/types'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Cấu trúc một rule trong Logic Panel */
export interface LogicRule {
  id: string
  /** Câu hỏi điều kiện (nguồn) */
  sourceQuestionId: string
  /** Toán tử — align với ConditionalRule.operator */
  operator: ConditionalRule['operator']   // 'equals' | 'not_equals' | 'includes'
  /** Giá trị so sánh */
  value: string
  /**
   * Hành động khi điều kiện thỏa:
   *   show    → targetQuestion.visibleWhen = { questionId: source, operator, value }
   *   hide    → targetQuestion.visibleWhen = { questionId: source, operator: đảo ngược, value }
   *   require → targetQuestion.required = true + visibleWhen như 'show'
   *   skip    → bỏ qua (giữ tương thích, không ghi visibleWhen)
   */
  action: 'show' | 'hide' | 'require' | 'skip'
  /** Câu hỏi bị ảnh hưởng (đích) */
  targetQuestionId: string
}

interface LogicPanelProps {
  questions: Question[]
  logicRules: LogicRule[]
  onRulesChange: (rules: LogicRule[]) => void
  /** Callback để ghi visibleWhen / required vào từng question */
  onUpdateQuestion: (id: string, patch: Partial<Question>) => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const OPERATORS: { value: ConditionalRule['operator']; label: string }[] = [
  { value: 'equals',     label: 'bằng'       },
  { value: 'not_equals', label: 'khác'        },
  { value: 'includes',   label: 'bao gồm'     },
]

const ACTIONS: { value: LogicRule['action']; label: string }[] = [
  { value: 'show',    label: 'Hiện câu hỏi'     },
  { value: 'hide',    label: 'Ẩn câu hỏi'       },
  { value: 'require', label: 'Bắt buộc trả lời' },
  { value: 'skip',    label: 'Bỏ qua (skip)'    },
]

function uid() { return Math.random().toString(36).slice(2, 9) }

/** Đảo operator cho action 'hide' */
function invertOperator(op: ConditionalRule['operator']): ConditionalRule['operator'] {
  if (op === 'equals')     return 'not_equals'
  if (op === 'not_equals') return 'equals'
  return op  // 'includes' — không đảo, giữ nguyên
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LogicPanel({ questions, logicRules, onRulesChange, onUpdateQuestion }: LogicPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Thêm rule mới
  const addRule = () => {
    const newRule: LogicRule = {
      id: uid(),
      sourceQuestionId: '',
      operator: 'equals',
      value: '',
      action: 'show',
      targetQuestionId: '',
    }
    onRulesChange([...logicRules, newRule])
    setExpandedId(newRule.id)
  }

  // Cập nhật rule và đồng thời sync visibleWhen vào question đích
  const updateRule = (id: string, patch: Partial<LogicRule>) => {
    const updated = logicRules.map(r => r.id === id ? { ...r, ...patch } : r)
    onRulesChange(updated)

    // Sync ngay vào question đích nếu rule đã đủ thông tin
    const rule = updated.find(r => r.id === id)
    if (!rule) return
    applyRuleToQuestion(rule)
  }

  // Áp dụng rule vào question.visibleWhen / question.required
  const applyRuleToQuestion = (rule: LogicRule) => {
    if (!rule.targetQuestionId || !rule.sourceQuestionId || !rule.value) return

    if (rule.action === 'show') {
      onUpdateQuestion(rule.targetQuestionId, {
        visibleWhen: {
          questionId: rule.sourceQuestionId,
          operator:   rule.operator,
          value:      rule.value,
        },
      })
    } else if (rule.action === 'hide') {
      // Ẩn = hiện khi điều kiện đảo ngược
      onUpdateQuestion(rule.targetQuestionId, {
        visibleWhen: {
          questionId: rule.sourceQuestionId,
          operator:   invertOperator(rule.operator),
          value:      rule.value,
        },
      })
    } else if (rule.action === 'require') {
      onUpdateQuestion(rule.targetQuestionId, {
        required:    true,
        visibleWhen: {
          questionId: rule.sourceQuestionId,
          operator:   rule.operator,
          value:      rule.value,
        },
      })
    }
    // 'skip' — không ghi visibleWhen
  }

  // Xóa rule và xóa visibleWhen trên question đích
  const removeRule = (id: string) => {
    const rule = logicRules.find(r => r.id === id)
    if (rule?.targetQuestionId) {
      onUpdateQuestion(rule.targetQuestionId, { visibleWhen: undefined })
    }
    onRulesChange(logicRules.filter(r => r.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  // Options câu hỏi cho Select (loại trừ câu được chọn phía kia)
  const getQOptions = (excludeId?: string) =>
    questions
      .filter(q => q.id !== excludeId)
      .map((q, i) => ({
        value: q.id,
        label: `Q${i + 1}: ${q.title?.slice(0, 30) || '(Chưa có tiêu đề)'}`,
      }))

  // Options giá trị dựa trên loại câu hỏi nguồn
  const getValueOptions = (qId: string) => {
    const q = questions.find(x => x.id === qId)
    if (!q?.options?.length) return []
    return q.options.map(o => ({
      value: typeof o === 'string' ? o : o.label,
      label: typeof o === 'string' ? o : o.label,
    }))
  }

  const sel: React.CSSProperties = { width: '100%' }

  return (
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Logic điều kiện</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{logicRules.length} quy tắc</div>
        </div>
        <Tooltip title="Quy tắc logic điều khiển việc hiển thị / ẩn / bắt buộc câu hỏi dựa trên câu trả lời trước đó" placement="left">
          <InfoCircleOutlined style={{ color: '#94a3b8', fontSize: 13, cursor: 'help' }} />
        </Tooltip>
      </div>

      {logicRules.length === 0 ? (
        <div style={{ padding: '24px 12px', textAlign: 'center', borderRadius: 10, border: '1.5px dashed #e5e7eb', background: '#fafafa' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, lineHeight: 1.5 }}>
            Chưa có quy tắc logic nào.<br />Thêm để điều kiện hóa câu hỏi.
          </div>
          <Button size="small" icon={<PlusOutlined />} onClick={addRule} style={{ borderRadius: 7 }}>
            Thêm quy tắc
          </Button>
        </div>
      ) : (
        <>
          {logicRules.map((rule, idx) => {
            const srcQ      = questions.find(q => q.id === rule.sourceQuestionId)
            const tgtQ      = questions.find(q => q.id === rule.targetQuestionId)
            const isExpanded = expandedId === rule.id
            const hasOpts   = srcQ && (srcQ.type === 'radio' || srcQ.type === 'checkbox' || srcQ.type === 'dropdown' || srcQ.type === 'multiple-choice')
            const valueOpts = getValueOptions(rule.sourceQuestionId)
            const actionLabel = ACTIONS.find(a => a.value === rule.action)?.label ?? rule.action

            return (
              <div
                key={rule.id}
                style={{
                  borderRadius: 10,
                  border: `1.5px solid ${isExpanded ? '#cbd5e1' : '#e5e7eb'}`,
                  background: isExpanded ? '#f8fafc' : '#fff',
                  overflow: 'hidden',
                  transition: 'all .15s',
                }}
              >
                {/* Rule header — click to expand */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : rule.id)}
                  style={{ padding: '9px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Quy tắc {idx + 1}</div>
                    {!isExpanded && srcQ && tgtQ && (
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {srcQ.title?.slice(0, 18)} → {actionLabel} → {tgtQ.title?.slice(0, 18)}
                      </div>
                    )}
                    {!isExpanded && (!srcQ || !tgtQ) && (
                      <div style={{ fontSize: 11, color: '#fbbf24', marginTop: 2 }}>⚠ Chưa cấu hình đầy đủ</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Button
                      type="text" size="small" icon={<DeleteOutlined />} danger
                      onClick={e => { e.stopPropagation(); removeRule(rule.id) }}
                      aria-label="Xóa quy tắc"
                      style={{ width: 24, height: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    />
                    <DownOutlined style={{ fontSize: 10, color: '#94a3b8', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
                  </div>
                </div>

                {/* Expanded editor */}
                {isExpanded && (
                  <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #f0f4f8' }}>

                    {/* Câu hỏi nguồn */}
                    <div style={{ paddingTop: 10 }}>
                      <div style={labelStyle}>Nếu câu hỏi</div>
                      <Select
                        size="small" style={sel}
                        value={rule.sourceQuestionId || undefined}
                        placeholder="Chọn câu hỏi nguồn..."
                        onChange={v => updateRule(rule.id, { sourceQuestionId: v, value: '' })}
                        options={getQOptions(rule.targetQuestionId)}
                      />
                    </div>

                    {/* Operator + Value */}
                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 6 }}>
                      <div>
                        <div style={labelStyle}>Điều kiện</div>
                        <Select
                          size="small" style={sel}
                          value={rule.operator}
                          onChange={v => updateRule(rule.id, { operator: v as ConditionalRule['operator'] })}
                          options={OPERATORS}
                        />
                      </div>
                      <div>
                        <div style={labelStyle}>Giá trị</div>
                        {hasOpts && valueOpts.length > 0
                          ? (
                            <Select
                              size="small" style={sel}
                              value={rule.value || undefined}
                              placeholder="Chọn..."
                              onChange={v => updateRule(rule.id, { value: v })}
                              options={valueOpts}
                            />
                          ) : (
                            <input
                              value={rule.value}
                              onChange={e => updateRule(rule.id, { value: e.target.value })}
                              placeholder="Nhập giá trị..."
                              style={{
                                width: '100%', height: 24, padding: '0 8px',
                                border: '1px solid #d9d9d9', borderRadius: 6,
                                fontSize: 12, fontFamily: 'inherit', outline: 'none',
                                boxSizing: 'border-box',
                              }}
                              onFocus={e => (e.currentTarget.style.borderColor = '#475569')}
                              onBlur={e => (e.currentTarget.style.borderColor = '#d9d9d9')}
                            />
                          )}
                      </div>
                    </div>

                    {/* Action */}
                    <div>
                      <div style={labelStyle}>Hành động</div>
                      <Select
                        size="small" style={sel}
                        value={rule.action}
                        onChange={v => updateRule(rule.id, { action: v as LogicRule['action'] })}
                        options={ACTIONS}
                      />
                    </div>

                    {/* Câu hỏi đích */}
                    <div>
                      <div style={labelStyle}>Câu hỏi đích</div>
                      <Select
                        size="small" style={sel}
                        value={rule.targetQuestionId || undefined}
                        placeholder="Chọn câu hỏi đích..."
                        onChange={v => updateRule(rule.id, { targetQuestionId: v })}
                        options={getQOptions(rule.sourceQuestionId)}
                      />
                    </div>

                    {/* Preview visibleWhen được sinh ra */}
                    {rule.sourceQuestionId && rule.targetQuestionId && rule.value && (
                      <div style={{
                        marginTop: 4, padding: '6px 8px', borderRadius: 6,
                        background: '#f0fdf4', border: '1px solid #bbf7d0',
                        fontSize: 11, color: '#15803d', lineHeight: 1.6,
                      }}>
                        <strong>visibleWhen</strong> sẽ được ghi vào câu hỏi đích:<br />
                        <code style={{ fontSize: 10 }}>
                          {`{ questionId: "${rule.sourceQuestionId.slice(0,8)}…", operator: "${rule.action === 'hide' ? invertOperator(rule.operator) : rule.operator}", value: "${rule.value}" }`}
                        </code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          <Button
            block icon={<PlusOutlined />} onClick={addRule}
            style={{ borderRadius: 9, borderStyle: 'dashed', color: '#6b7280', borderColor: '#d1d5db' }}
          >
            Thêm quy tắc
          </Button>
        </>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: '#9ca3af',
  textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5,
}