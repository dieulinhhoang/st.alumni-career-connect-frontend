import { useState } from 'react'
import { Input, Tooltip } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import type { Question } from '../../../../../feature/form/types'
import { QTYPES } from '../../../../../feature/form/constants'
import { QUESTION_BANK } from '../../../../../feature/form/api'

interface BankPanelProps {
  accent: string
  onAddBlank: (type: string) => void
  onDropFromBank: (question: Question) => void
}

export function BankPanel({ accent, onAddBlank, onDropFromBank }: BankPanelProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = QUESTION_BANK.filter((q) => {
    const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = !activeCategory || q.category === activeCategory
    return matchSearch && matchCat
  })

  const categories = Array.from(new Set(QUESTION_BANK.map((q) => q.category).filter(Boolean)))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Quick add buttons */}
      <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid #f0f4f8' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>Thêm nhanh</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
          {QTYPES.slice(0, 6).map((t) => (
            <Tooltip key={t.value} title={t.label} placement="top">
              <button onClick={() => onAddBlank(t.value)}
                style={{ height: 40, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#374151', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, fontFamily: 'inherit', transition: 'all .14s', padding: 0 }}
                onMouseEnter={(e) => { (e.currentTarget.style.borderColor = accent); (e.currentTarget.style.color = accent); (e.currentTarget.style.background = `${accent}08`) }}
                onMouseLeave={(e) => { (e.currentTarget.style.borderColor = '#e5e7eb'); (e.currentTarget.style.color = '#374151'); (e.currentTarget.style.background = '#fff') }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>{t.icon}</span>
                <span style={{ fontSize: 9.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 56, textAlign: 'center' }}>{t.label}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '10px 14px 8px' }}>
        <Input prefix={<SearchOutlined style={{ color: '#94a3b8', fontSize: 12 }} />}
          placeholder="Tìm câu hỏi mẫu..." size="small" value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ borderRadius: 8 }} allowClear />
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div style={{ padding: '0 14px 8px', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <button onClick={() => setActiveCategory(null)}
            style={{ height: 22, padding: '0 9px', border: `1px solid ${!activeCategory ? accent : '#e5e7eb'}`, borderRadius: 20, background: !activeCategory ? accent : '#fff', color: !activeCategory ? '#fff' : '#64748b', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Tất cả
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              style={{ height: 22, padding: '0 9px', border: `1px solid ${activeCategory === cat ? accent : '#e5e7eb'}`, borderRadius: 20, background: activeCategory === cat ? accent : '#fff', color: activeCategory === cat ? '#fff' : '#64748b', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Question bank list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px 14px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Không tìm thấy kết quả</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {filtered.map((q, i) => (
              <div key={i}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('application/x-bank-question', JSON.stringify(q))}
                style={{ padding: '9px 12px', borderRadius: 9, border: '1px solid #e5e7eb', background: '#fff', cursor: 'grab', transition: 'all .14s', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}
                onMouseEnter={(e) => { (e.currentTarget.style.borderColor = accent); (e.currentTarget.style.boxShadow = `0 2px 8px ${accent}15`) }}
                onMouseLeave={(e) => { (e.currentTarget.style.borderColor = '#e5e7eb'); (e.currentTarget.style.boxShadow = 'none') }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: '#1e293b', fontWeight: 500, lineHeight: 1.4 }}>{q.title}</div>
                  {q.category && <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 3 }}>{q.category}</div>}
                </div>
                <button onClick={() => onDropFromBank(q)}
                  aria-label={`Thêm câu hỏi: ${q.title}`}
                  style={{ width: 22, height: 22, border: `1px solid ${accent}`, borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, flexShrink: 0, transition: 'all .12s' }}
                  onMouseEnter={(e) => { (e.currentTarget.style.background = accent); (e.currentTarget.style.color = '#fff') }}
                  onMouseLeave={(e) => { (e.currentTarget.style.background = 'transparent'); (e.currentTarget.style.color = accent) }}>
                  <PlusOutlined style={{ fontSize: 10 }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
