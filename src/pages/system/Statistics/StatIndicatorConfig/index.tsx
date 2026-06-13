/**
 * StatIndicatorConfig.tsx
 * Màn hình cấu hình "Bộ chỉ tiêu thống kê"
 *
 * Admin định nghĩa các chỉ tiêu cần theo dõi:
 *  - Tên chỉ tiêu (hiển thị trên biểu đồ / báo cáo)
 *  - Key định danh (dùng để map với câu hỏi form)
 *  - Loại biểu đồ (pie / column)
 *  - Tên cột Excel tương ứng
 *  - Mô tả / ghi chú
 *
 */

import { useState, useRef } from 'react'
import {
  PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined,
  CloseOutlined, PieChartOutlined, BarChartOutlined,
  FileExcelOutlined, DragOutlined, InfoCircleOutlined,
  SearchOutlined, DownloadOutlined, UploadOutlined,
} from '@ant-design/icons'
import { Input, Select, Switch, Tooltip, Tag, Empty } from 'antd'
import AdminLayout from '../../../../components/layout/AdminLayout'

//  Types 

export type ChartType = 'pie' | 'column'

export interface StatIndicator {
  id: string
  key: string              // định danh duy nhất, map với reportFieldKey của Question
  label: string            // tên hiển thị (biểu đồ, báo cáo)
  chartType: ChartType
  excelColumn: string      // tên cột trong file Excel xuất
  description?: string
  active: boolean          // bật/tắt chỉ tiêu này
  order: number
}

//  Mock data 

const INITIAL_INDICATORS: StatIndicator[] = [
  { id: '1', key: 'employmentstatus',  label: 'Tình trạng việc làm',           chartType: 'pie',    excelColumn: 'Tình trạng việc làm',         active: true,  order: 1 },
  { id: '2', key: 'gender',            label: 'Giới tính',                      chartType: 'pie',    excelColumn: 'Giới tính',                    active: true,  order: 2 },
  { id: '3', key: 'workarea',          label: 'Khu vực làm việc',               chartType: 'column', excelColumn: 'Khu vực làm việc',             active: true,  order: 3 },
  { id: '4', key: 'averageincome',     label: 'Mức thu nhập bình quân/tháng',   chartType: 'column', excelColumn: 'Thu nhập bình quân',           active: true,  order: 4 },
  { id: '5', key: 'trainedfieldmatch', label: 'Mức độ phù hợp ngành đào tạo',  chartType: 'pie',    excelColumn: 'Phù hợp ngành đào tạo',       active: true,  order: 5 },
  { id: '6', key: 'timetogetjob',      label: 'Thời gian có việc làm sau TN',   chartType: 'column', excelColumn: 'Thời gian có việc làm',        active: false, order: 6 },
  { id: '7', key: 'softskills',        label: 'Kỹ năng mềm cần thiết',          chartType: 'column', excelColumn: 'Kỹ năng mềm',                 active: false, order: 7 },
]

//  Helpers 

const genId = () => Math.random().toString(36).slice(2, 8)

const EMPTY_INDICATOR = (): Omit<StatIndicator, 'id' | 'order'> => ({
  key: '', label: '', chartType: 'pie', excelColumn: '', description: '', active: true,
})

//  Sub-components 

function KeyBadge({ value }: { value: string }) {
  if (!value) return <span style={{ color: '#94a3b8', fontSize: 12, fontStyle: 'italic' }}>chưa có key</span>
  return (
    <code style={{
      fontSize: 11, background: '#f1f5f9', color: '#0f172a',
      padding: '2px 7px', borderRadius: 5, fontFamily: 'monospace',
      border: '1px solid #e2e8f0',
    }}>{value}</code>
  )
}

function ChartTypeBadge({ type }: { type: ChartType }) {
  const isPie = type === 'pie'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600,
      padding: '2px 8px', borderRadius: 20,
      background: isPie ? '#f0fdf4' : '#eff6ff',
      color: isPie ? '#15803d' : '#1d4ed8',
    }}>
      {isPie ? <PieChartOutlined style={{ fontSize: 11 }} /> : <BarChartOutlined style={{ fontSize: 11 }} />}
      {isPie ? 'Tròn' : 'Cột'}
    </span>
  )
}

//  Inline edit row 

interface EditRowProps {
  indicator: StatIndicator
  accent: string
  onSave: (patch: Partial<StatIndicator>) => void
  onCancel: () => void
}

function EditRow({ indicator: ind, accent, onSave, onCancel }: EditRowProps) {
  const [form, setForm] = useState({
    label: ind.label,
    key: ind.key,
    chartType: ind.chartType,
    excelColumn: ind.excelColumn,
    description: ind.description ?? '',
  })
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  const valid = form.label.trim() && form.key.trim() && form.excelColumn.trim()

  return (
    <tr style={{ background: `${accent}06` }}>
      <td style={TD}></td>
      <td style={TD}>
        <Input
          size="small" value={form.label}
          onChange={(e) => set({ label: e.target.value })}
          placeholder="Tên chỉ tiêu..."
          style={{ fontSize: 13, fontWeight: 500 }}
        />
      </td>
      <td style={TD}>
        <Input
          size="small" value={form.key}
          onChange={(e) => set({ key: e.target.value.toLowerCase().replace(/\s+/g, '') })}
          placeholder="vd: employmentstatus"
          style={{ fontSize: 12, fontFamily: 'monospace' }}
        />
      </td>
      <td style={TD}>
        <Select
          size="small" value={form.chartType}
          onChange={(v) => set({ chartType: v as ChartType })}
          style={{ width: 120 }}
          options={[
            { value: 'pie',    label: <span><PieChartOutlined /> Tròn</span> },
            { value: 'column', label: <span><BarChartOutlined /> Cột</span> },
          ]}
        />
      </td>
      <td style={TD}>
        <Input
          size="small" value={form.excelColumn}
          onChange={(e) => set({ excelColumn: e.target.value })}
          placeholder="Tên cột Excel..."
          style={{ fontSize: 13 }}
        />
      </td>
      <td style={{ ...TD, textAlign: 'center' }}></td>
      <td style={{ ...TD }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            disabled={!valid}
            onClick={() => onSave(form)}
            style={{
              height: 28, padding: '0 12px', border: 'none', borderRadius: 6,
              background: valid ? accent : '#e2e8f0', color: valid ? '#fff' : '#94a3b8',
              cursor: valid ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <CheckOutlined style={{ fontSize: 11 }} /> Lưu
          </button>
          <button
            onClick={onCancel}
            style={{
              height: 28, padding: '0 10px', border: '1px solid #e2e8f0', borderRadius: 6,
              background: '#fff', color: '#64748b', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
            }}
          >
            <CloseOutlined style={{ fontSize: 10 }} />
          </button>
        </div>
      </td>
    </tr>
  )
}

//  Main component 

const ACCENT = '#0d7a7f'

const TH: React.CSSProperties = {
  padding: '10px 14px', fontSize: 11, fontWeight: 700, color: '#64748b',
  textTransform: 'uppercase', letterSpacing: '.06em',
  background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
  whiteSpace: 'nowrap',
}
const TD: React.CSSProperties = {
  padding: '11px 14px', fontSize: 13, color: '#1e293b',
  borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle',
}

export default function StatIndicatorConfigPage() {
  const [indicators, setIndicators] = useState<StatIndicator[]>(INITIAL_INDICATORS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [addingNew, setAddingNew] = useState(false)
  const [newForm, setNewForm] = useState(EMPTY_INDICATOR())
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'on' | 'off'>('all')
  const dragId = useRef<string | null>(null)

  //  Derived 
  const filtered = indicators
    .filter((ind) => {
      const matchSearch = !search ||
        ind.label.toLowerCase().includes(search.toLowerCase()) ||
        ind.key.toLowerCase().includes(search.toLowerCase()) ||
        ind.excelColumn.toLowerCase().includes(search.toLowerCase())
      const matchActive = filterActive === 'all' || (filterActive === 'on' ? ind.active : !ind.active)
      return matchSearch && matchActive
    })
    .sort((a, b) => a.order - b.order)

  const activeCount = indicators.filter((i) => i.active).length

  //  Handlers 
  const update = (id: string, patch: Partial<StatIndicator>) =>
    setIndicators((prev) => prev.map((i) => i.id === id ? { ...i, ...patch } : i))

  const remove = (id: string) =>
    setIndicators((prev) => prev.filter((i) => i.id !== id))

  const addNew = () => {
    const ind: StatIndicator = {
      id: genId(), ...newForm, order: indicators.length + 1,
    }
    setIndicators((prev) => [...prev, ind])
    setNewForm(EMPTY_INDICATOR())
    setAddingNew(false)
  }

  const setNew = (patch: Partial<typeof newForm>) =>
    setNewForm((f) => ({ ...f, ...patch }))

  const newValid = newForm.label.trim() && newForm.key.trim() && newForm.excelColumn.trim()

  // drag-reorder (simple swap)
  const handleDragStart = (id: string) => { dragId.current = id }
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!dragId.current || dragId.current === targetId) return
    setIndicators((prev) => {
      const from = prev.findIndex((i) => i.id === dragId.current)
      const to   = prev.findIndex((i) => i.id === targetId)
      if (from === -1 || to === -1) return prev
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next.map((i, idx) => ({ ...i, order: idx + 1 }))
    })
    dragId.current = targetId
  }

  return (
    <AdminLayout>
      <div style={{ padding: '28px 28px 48px', background: '#f5f7fa', minHeight: '100%' }}>

        {/*  Header  */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600,
              letterSpacing: '.06em', textTransform: 'uppercase', color: ACCENT,
              background: '#e6f4f5', padding: '3px 10px', borderRadius: 20, marginBottom: 8,
            }}>
              ⚙️ Cấu hình hệ thống
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', margin: '0 0 6px', lineHeight: 1.2 }}>
              Bộ chỉ tiêu thống kê
            </h1>
            <p style={{ fontSize: 14, color: '#475569', margin: 0, lineHeight: 1.55 }}>
              Định nghĩa các chỉ tiêu cần theo dõi — dùng để map câu hỏi form, vẽ biểu đồ và xuất Excel.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Tooltip title="Xuất cấu hình JSON">
              <button style={ghostBtn}>
                <DownloadOutlined /> Xuất
              </button>
            </Tooltip>
            <Tooltip title="Nhập cấu hình JSON">
              <button style={ghostBtn}>
                <UploadOutlined /> Nhập
              </button>
            </Tooltip>
            <button
              onClick={() => { setAddingNew(true); setEditingId(null) }}
              style={{
                height: 36, padding: '0 16px', border: 'none', borderRadius: 8,
                background: ACCENT, color: '#fff', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: `0 2px 8px ${ACCENT}40`,
              }}
            >
              <PlusOutlined /> Thêm chỉ tiêu
            </button>
          </div>
        </div>

        {/*  Summary cards  */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Tổng chỉ tiêu', value: indicators.length, icon: '📋', color: '#e6f4f5', textColor: ACCENT },
            { label: 'Đang hoạt động', value: activeCount, icon: '✅', color: '#f0fdf4', textColor: '#15803d' },
            { label: 'Tạm tắt', value: indicators.length - activeCount, icon: '⏸️', color: '#fff7ed', textColor: '#c2410c' },
          ].map((c) => (
            <div key={c.label} style={{
              background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: '0 1px 3px rgba(30,41,59,.06)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: c.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
              }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: c.textColor, lineHeight: 1 }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/*  Toolbar  */}
        <div style={{
          background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
          padding: '14px 18px', marginBottom: 16,
          display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
          boxShadow: '0 1px 3px rgba(30,41,59,.06)',
        }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8', fontSize: 13 }} />}
            placeholder="Tìm theo tên, key, cột Excel..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            allowClear size="small"
            style={{ width: 260, borderRadius: 8 }}
          />
          <div style={{ display: 'flex', gap: 6, marginLeft: 4 }}>
            {(['all', 'on', 'off'] as const).map((v) => (
              <button key={v}
                onClick={() => setFilterActive(v)}
                style={{
                  height: 28, padding: '0 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                  border: `1px solid ${filterActive === v ? ACCENT : '#e2e8f0'}`,
                  background: filterActive === v ? ACCENT : '#fff',
                  color: filterActive === v ? '#fff' : '#64748b',
                }}
              >
                {{ all: 'Tất cả', on: '✅ Đang bật', off: '⏸️ Đang tắt' }[v]}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>
            {filtered.length} chỉ tiêu
          </div>
        </div>

        {/*  Table  */}
        <div style={{
          background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(30,41,59,.06)', overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: 36 }}></th>
                <th style={TH}>Tên chỉ tiêu</th>
                <th style={TH}>
                  Key định danh
                  <Tooltip title="Phải khớp với reportFieldKey trong câu hỏi form">
                    <InfoCircleOutlined style={{ marginLeft: 5, fontSize: 11, color: '#94a3b8' }} />
                  </Tooltip>
                </th>
                <th style={TH}>Biểu đồ</th>
                <th style={TH}>
                  Cột Excel
                  <Tooltip title="Tên cột xuất hiện trong file Excel báo cáo">
                    <FileExcelOutlined style={{ marginLeft: 5, fontSize: 11, color: '#22c55e' }} />
                  </Tooltip>
                </th>
                <th style={{ ...TH, textAlign: 'center' }}>Bật/Tắt</th>
                <th style={{ ...TH, width: 100 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && !addingNew && (
                <tr>
                  <td colSpan={7} style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                      <span style={{ color: '#94a3b8', fontSize: 13 }}>Không có chỉ tiêu nào</span>
                    } />
                  </td>
                </tr>
              )}

              {filtered.map((ind) => {
                if (editingId === ind.id) {
                  return (
                    <EditRow key={ind.id} indicator={ind} accent={ACCENT}
                      onSave={(patch) => { update(ind.id, patch); setEditingId(null) }}
                      onCancel={() => setEditingId(null)}
                    />
                  )
                }
                return (
                  <tr key={ind.id}
                    draggable
                    onDragStart={() => handleDragStart(ind.id)}
                    onDragOver={(e) => handleDragOver(e, ind.id)}
                    style={{ opacity: ind.active ? 1 : 0.5, transition: 'opacity .15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* drag handle */}
                    <td style={{ ...TD, color: '#cbd5e1', cursor: 'grab', textAlign: 'center' }}>
                      <DragOutlined style={{ fontSize: 13 }} />
                    </td>

                    {/* label */}
                    <td style={TD}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{ind.label}</div>
                      {ind.description && (
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{ind.description}</div>
                      )}
                    </td>

                    {/* key */}
                    <td style={TD}><KeyBadge value={ind.key} /></td>

                    {/* chart type */}
                    <td style={TD}><ChartTypeBadge type={ind.chartType} /></td>

                    {/* excel column */}
                    <td style={TD}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FileExcelOutlined style={{ color: '#22c55e', fontSize: 13 }} />
                        <span style={{ fontSize: 13, color: '#374151' }}>{ind.excelColumn || '—'}</span>
                      </span>
                    </td>

                    {/* toggle */}
                    <td style={{ ...TD, textAlign: 'center' }}>
                      <Switch
                        size="small" checked={ind.active}
                        onChange={(v) => update(ind.id, { active: v })}
                        style={{ background: ind.active ? ACCENT : undefined }}
                      />
                    </td>

                    {/* actions */}
                    <td style={TD}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Tooltip title="Chỉnh sửa">
                          <button onClick={() => { setEditingId(ind.id); setAddingNew(false) }}
                            style={iconBtn('#3b82f6')}>
                            <EditOutlined style={{ fontSize: 12 }} />
                          </button>
                        </Tooltip>
                        <Tooltip title="Xoá chỉ tiêu">
                          <button onClick={() => remove(ind.id)} style={iconBtn('#ef4444')}>
                            <DeleteOutlined style={{ fontSize: 12 }} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {/*  Add new row  */}
              {addingNew && (
                <tr style={{ background: `${ACCENT}06` }}>
                  <td style={TD}></td>
                  <td style={TD}>
                    <Input size="small" value={newForm.label}
                      onChange={(e) => setNew({ label: e.target.value })}
                      placeholder="Tên chỉ tiêu..."
                      style={{ fontSize: 13, fontWeight: 500 }}
                      autoFocus
                    />
                  </td>
                  <td style={TD}>
                    <Input size="small" value={newForm.key}
                      onChange={(e) => setNew({ key: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                      placeholder="vd: employmentstatus"
                      style={{ fontSize: 12, fontFamily: 'monospace' }}
                    />
                  </td>
                  <td style={TD}>
                    <Select size="small" value={newForm.chartType}
                      onChange={(v) => setNew({ chartType: v as ChartType })}
                      style={{ width: 120 }}
                      options={[
                        { value: 'pie',    label: <span><PieChartOutlined /> Tròn</span> },
                        { value: 'column', label: <span><BarChartOutlined /> Cột</span> },
                      ]}
                    />
                  </td>
                  <td style={TD}>
                    <Input size="small" value={newForm.excelColumn}
                      onChange={(e) => setNew({ excelColumn: e.target.value })}
                      placeholder="Tên cột Excel..."
                      style={{ fontSize: 13 }}
                    />
                  </td>
                  <td style={{ ...TD, textAlign: 'center' }}>
                    <Switch size="small" checked={newForm.active}
                      onChange={(v) => setNew({ active: v })}
                      style={{ background: newForm.active ? ACCENT : undefined }}
                    />
                  </td>
                  <td style={TD}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button disabled={!newValid} onClick={addNew}
                        style={{
                          height: 28, padding: '0 12px', border: 'none', borderRadius: 6,
                          background: newValid ? ACCENT : '#e2e8f0',
                          color: newValid ? '#fff' : '#94a3b8',
                          cursor: newValid ? 'pointer' : 'not-allowed',
                          fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                        <CheckOutlined style={{ fontSize: 11 }} /> Lưu
                      </button>
                      <button onClick={() => { setAddingNew(false); setNewForm(EMPTY_INDICATOR()) }}
                        style={{
                          height: 28, padding: '0 10px', border: '1px solid #e2e8f0', borderRadius: 6,
                          background: '#fff', color: '#64748b', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                        }}>
                        <CloseOutlined style={{ fontSize: 10 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/*  Hướng dẫn  */}
        <div style={{
          marginTop: 20, padding: '16px 20px', borderRadius: 10,
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          fontSize: 13, color: '#166534', lineHeight: 1.7,
        }}>
          <strong>💡 Cách dùng:</strong> Sau khi định nghĩa chỉ tiêu ở đây, vào <strong>Builder form</strong> → chọn câu hỏi →
          trong popup chỉnh sửa sẽ có dropdown <em>"Chỉ tiêu thống kê"</em> để chọn chỉ tiêu tương ứng
          (thay vì nhập key thủ công). Hệ thống sẽ tự biết vẽ biểu đồ loại nào và xuất Excel cột nào.
        </div>

      </div>
    </AdminLayout>
  )
}

//  Style helpers 

const ghostBtn: React.CSSProperties = {
  height: 36, padding: '0 14px', border: '1px solid #e2e8f0', borderRadius: 8,
  background: '#fff', color: '#475569', cursor: 'pointer',
  fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
  display: 'inline-flex', alignItems: 'center', gap: 6,
}

function iconBtn(color: string): React.CSSProperties {
  return {
    width: 28, height: 28, border: `1px solid ${color}22`, borderRadius: 6,
    background: `${color}08`, color, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .12s',
  }
}