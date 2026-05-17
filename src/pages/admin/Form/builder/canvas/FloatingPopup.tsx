/**
 * FloatingPopup.tsx — v2
 * Thay thế input reportFieldKey thủ công
 * bằng dropdown chọn từ bộ chỉ tiêu đã cấu hình.
 *
 * Thay đổi so với v1:
 *  - Nhận thêm prop `indicators: StatIndicator[]`
 *  - Phần "Khóa thống kê" → dropdown chọn chỉ tiêu
 *  - Loại biểu đồ tự điền từ chỉ tiêu, không cần chọn lại
 *  - Hiển thị badge preview (key + loại biểu đồ + cột Excel)
 */

import { useRef, useEffect, useCallback } from 'react'
import { CloseOutlined, PlusOutlined, PieChartOutlined, BarChartOutlined, FileExcelOutlined } from '@ant-design/icons'
import { Switch, Select, Input } from 'antd'
import type { Question, QuestionType, Section } from '../../../../../feature/form/types'
import { QTYPES } from '../../../../../feature/form/constants'
import type { StatIndicator } from '../../../Statistics/StatIndicatorConfig'

const LBL: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: '#6b7280',
  textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5,
}

// Loại câu hỏi có thể gán chỉ tiêu thống kê
const CHARTABLE_TYPES: Question['type'][] = ['radio', 'checkbox', 'multiple-choice', 'dropdown', 'select']

interface FloatingPopupProps {
  question: Question
  index: number
  accent: string
  sections: Section[]
  anchorEl: HTMLDivElement | null
  indicators: StatIndicator[]          // ← danh sách chỉ tiêu từ bộ cấu hình
  onClose: () => void
  onUpdate: (patch: Partial<Question>) => void
  onAddOption: () => void
  onUpdateOption: (oid: string, label: string) => void
  onRemoveOption: (oid: string) => void
}

export function FloatingPopup({
  question, index, accent, sections, anchorEl, indicators, onClose,
  onUpdate, onAddOption, onUpdateOption, onRemoveOption,
}: FloatingPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)

  const hasOpts = question.type === 'radio' || question.type === 'checkbox' ||
                  question.type === 'select' || question.type === 'dropdown' ||
                  question.type === 'multiple-choice'

  const isChartable = CHARTABLE_TYPES.includes(question.type)

  // Chỉ tiêu đang được chọn (nếu có)
  const selectedIndicator = indicators.find((ind) => ind.key === question.reportFieldKey)

  // ── Positioning ──
  const calcPos = useCallback(() => {
    if (!anchorEl || !popupRef.current) return
    const card = anchorEl.getBoundingClientRect()
    const popup = popupRef.current.getBoundingClientRect()
    const vw = window.innerWidth, vh = window.innerHeight
    let left = card.right + 10
    let top = card.top
    if (left + popup.width > vw - 12) left = card.left - popup.width - 10
    top = Math.max(12, Math.min(top, vh - popup.height - 12))
    popupRef.current.style.top = top + 'px'
    popupRef.current.style.left = left + 'px'
    popupRef.current.style.opacity = '1'
    popupRef.current.style.transform = 'scale(1) translateY(0)'
  }, [anchorEl])

  useEffect(() => { const t = setTimeout(calcPos, 10); return () => clearTimeout(t) }, [calcPos])
  useEffect(() => { window.addEventListener('resize', calcPos); return () => window.removeEventListener('resize', calcPos) }, [calcPos])
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler); return () => document.removeEventListener('keydown', handler)
  }, [onClose])
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node) &&
          anchorEl && !anchorEl.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler); return () => document.removeEventListener('mousedown', handler)
  }, [anchorEl, onClose])

  // ── Khi chọn chỉ tiêu → tự điền reportFieldKey ──
  const handleIndicatorChange = (key: string | undefined) => {
    onUpdate({ reportFieldKey: key || undefined })
  }

  return (
    <div
      ref={popupRef}
      role="dialog" aria-modal={false} aria-label="Chỉnh sửa câu hỏi"
      style={{
        position: 'fixed', top: 0, left: 0, width: 310, zIndex: 1000,
        background: '#fff', borderRadius: 14,
        boxShadow: `0 8px 40px rgba(0,0,0,.14), 0 0 0 1px rgba(0,0,0,.06), 0 4px 12px ${accent}20`,
        opacity: 0,
        transform: 'scale(.96) translateY(-6px)',
        transition: 'opacity .18s cubic-bezier(.16,1,.3,1), transform .18s cubic-bezier(.16,1,.3,1)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px 8px', borderBottom: '1px solid #f0f2f5',
        background: `linear-gradient(135deg, ${accent}08, transparent)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6, background: accent, color: '#fff',
            fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{index + 1}</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Chỉnh sửa câu hỏi</span>
        </div>
        <button onClick={onClose} aria-label="Đóng"
          style={{ width: 24, height: 24, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 12 }}
          onMouseEnter={(e) => { (e.currentTarget.style.background = '#fee2e2'); (e.currentTarget.style.color = '#dc2626') }}
          onMouseLeave={(e) => { (e.currentTarget.style.background = 'transparent'); (e.currentTarget.style.color = '#94a3b8') }}>
          <CloseOutlined />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px', maxHeight: 'calc(100vh - 180px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Type + Required */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'end' }}>
          <div>
            <div style={LBL}>Loại câu hỏi</div>
            <Select size="small" value={question.type} style={{ width: '100%' }}
              onChange={(val) => onUpdate({ type: val as QuestionType })}
              options={QTYPES.map((t) => ({ value: t.value, label: `${t.icon} ${t.label}` }))} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 2 }}>
            <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>Bắt buộc</span>
            <Switch size="small" checked={question.required} onChange={(v) => onUpdate({ required: v })}
              style={{ background: question.required ? accent : undefined }} />
          </div>
        </div>

        {/* Section */}
        {sections.length > 0 && (
          <div>
            <div style={LBL}>Thuộc phần</div>
            <Select size="small" value={question.sectionId} style={{ width: '100%' }}
              onChange={(val) => onUpdate({ sectionId: val })}
              options={[{ value: '', label: '— Chưa phân phần —' }, ...sections.map((s) => ({ value: s.id, label: s.title }))]} />
          </div>
        )}

        {/* Title */}
        <div>
          <div style={LBL}>Nội dung câu hỏi</div>
          <Input.TextArea rows={2} value={question.title} onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Nhập nội dung câu hỏi..." style={{ resize: 'none', fontSize: 13 }} />
        </div>

        {/* Options */}
        {hasOpts && (
          <div>
            <div style={LBL}>Lựa chọn</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(question.options ?? []).map((o, oi) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 13, height: 13, borderRadius: question.type === 'radio' ? '50%' : 3, border: '1.5px solid #d1d5db', flexShrink: 0 }} />
                  <Input value={o.label} onChange={(e) => onUpdateOption(o.id, e.target.value)}
                    placeholder={`Lựa chọn ${oi + 1}`} size="small" style={{ flex: 1, fontSize: 13 }} />
                  <button onClick={() => onRemoveOption(o.id)} aria-label={`Xóa lựa chọn ${oi + 1}`}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#d1d5db', fontSize: 12, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, padding: 0 }}
                    onMouseEnter={(e) => { (e.currentTarget.style.color = '#dc2626'); (e.currentTarget.style.background = '#fee2e2') }}
                    onMouseLeave={(e) => { (e.currentTarget.style.color = '#d1d5db'); (e.currentTarget.style.background = 'transparent') }}>
                    <CloseOutlined />
                  </button>
                </div>
              ))}
              <button onClick={onAddOption}
                style={{ marginTop: 6, width: '100%', height: 28, border: '1.5px dashed #e2e8f0', borderRadius: 6, background: 'transparent', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'inherit' }}
                onMouseEnter={(e) => { (e.currentTarget.style.borderColor = accent); (e.currentTarget.style.color = accent); (e.currentTarget.style.background = `${accent}08`) }}
                onMouseLeave={(e) => { (e.currentTarget.style.borderColor = '#e2e8f0'); (e.currentTarget.style.color = '#94a3b8'); (e.currentTarget.style.background = 'transparent') }}>
                <PlusOutlined style={{ fontSize: 10 }} /> Thêm lựa chọn
              </button>
            </div>
          </div>
        )}

        {/* ── Chỉ tiêu thống kê ── chỉ hiện với loại có thể thống kê */}
        {isChartable && (
          <div style={{ borderTop: '1px solid #f0f2f5', paddingTop: 12 }}>
            <div style={LBL}>Chỉ tiêu thống kê</div>

            <Select
              size="small"
              style={{ width: '100%' }}
              placeholder="Chọn chỉ tiêu để thống kê..."
              allowClear
              value={question.reportFieldKey || undefined}
              onChange={handleIndicatorChange}
              options={[
                // chỉ hiện chỉ tiêu đang active
                ...indicators
                  .filter((ind) => ind.active)
                  .map((ind) => ({
                    value: ind.key,
                    label: ind.label,
                  })),
              ]}
              optionRender={(opt) => {
                const ind = indicators.find((i) => i.key === opt.value)
                if (!ind) return opt.label
                return (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 13 }}>{ind.label}</span>
                    <span style={{
                      fontSize: 10, padding: '1px 6px', borderRadius: 10, fontWeight: 600,
                      background: ind.chartType === 'pie' ? '#f0fdf4' : '#eff6ff',
                      color: ind.chartType === 'pie' ? '#15803d' : '#1d4ed8',
                    }}>
                      {ind.chartType === 'pie' ? '🥧 Tròn' : '📊 Cột'}
                    </span>
                  </div>
                )
              }}
            />

            {/* Preview badge khi đã chọn */}
            {selectedIndicator && (
              <div style={{
                marginTop: 8, padding: '8px 10px', borderRadius: 8,
                background: '#f8fafc', border: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column', gap: 5,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  {selectedIndicator.chartType === 'pie'
                    ? <PieChartOutlined style={{ color: '#15803d' }} />
                    : <BarChartOutlined style={{ color: '#1d4ed8' }} />}
                  <span style={{ color: '#374151', fontWeight: 500 }}>
                    Biểu đồ {selectedIndicator.chartType === 'pie' ? 'tròn' : 'cột'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <FileExcelOutlined style={{ color: '#22c55e' }} />
                  <span style={{ color: '#374151' }}>
                    Cột Excel: <strong>{selectedIndicator.excelColumn}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                  <code style={{ background: '#e2e8f0', padding: '1px 5px', borderRadius: 4, fontFamily: 'monospace', color: '#475569' }}>
                    {selectedIndicator.key}
                  </code>
                </div>
              </div>
            )}

            {!question.reportFieldKey && (
              <div style={{ marginTop: 4, fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>
                Bỏ trống nếu không cần thống kê câu hỏi này
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}