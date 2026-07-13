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
import { Input, Select, Switch, Tooltip, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AdminLayout from '../../../../components/layout/AdminLayout'
import CustomTable from '../../../../components/common/customTable'

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

const CHART_OPTIONS = [
  { value: 'pie',    label: <span><PieChartOutlined /> Tròn</span> },
  { value: 'column', label: <span><BarChartOutlined /> Cột</span> },
]

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

//  Main component

const ACCENT = '#0d7a7f'

type EditForm = Pick<StatIndicator, 'label' | 'key' | 'chartType' | 'excelColumn'> & { description: string }

const BLANK_EDIT: EditForm = { label: '', key: '', chartType: 'pie', excelColumn: '', description: '' }

export default function StatIndicatorConfigPage() {
  const [indicators, setIndicators] = useState<StatIndicator[]>(INITIAL_INDICATORS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditForm>(BLANK_EDIT)
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

  const newValid = !!(newForm.label.trim() && newForm.key.trim() && newForm.excelColumn.trim())

  //  Inline edit
  const setEdit = (patch: Partial<EditForm>) => setEditForm((f) => ({ ...f, ...patch }))
  const editValid = !!(editForm.label.trim() && editForm.key.trim() && editForm.excelColumn.trim())

  const startEdit = (ind: StatIndicator) => {
    setEditingId(ind.id)
    setAddingNew(false)
    setEditForm({
      label: ind.label, key: ind.key, chartType: ind.chartType,
      excelColumn: ind.excelColumn, description: ind.description ?? '',
    })
  }
  const saveEdit = () => {
    if (!editingId || !editValid) return
    update(editingId, editForm)
    setEditingId(null)
  }

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

  //  Columns
  const columns: ColumnsType<StatIndicator> = [
    {
      key: 'sort', width: 36, align: 'center',
      render: (_v, rec) =>
        editingId === rec.id
          ? null
          : <DragOutlined style={{ fontSize: 13, color: '#cbd5e1' }} />,
    },
    {
      title: 'Tên chỉ tiêu', dataIndex: 'label',
      render: (_v, rec) =>
        editingId === rec.id ? (
          <Input
            size="small" value={editForm.label}
            onChange={(e) => setEdit({ label: e.target.value })}
            placeholder="Tên chỉ tiêu..."
            style={{ fontSize: 13, fontWeight: 500 }}
          />
        ) : (
          <>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{rec.label}</div>
            {rec.description && (
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{rec.description}</div>
            )}
          </>
        ),
    },
    {
      title: (
        <>
          Key định danh
          <Tooltip title="Phải khớp với reportFieldKey trong câu hỏi form">
            <InfoCircleOutlined style={{ marginLeft: 5, fontSize: 11, color: '#94a3b8' }} />
          </Tooltip>
        </>
      ),
      dataIndex: 'key',
      render: (_v, rec) =>
        editingId === rec.id ? (
          <Input
            size="small" value={editForm.key}
            onChange={(e) => setEdit({ key: e.target.value.toLowerCase().replace(/\s+/g, '') })}
            placeholder="vd: employmentstatus"
            style={{ fontSize: 12, fontFamily: 'monospace' }}
          />
        ) : (
          <KeyBadge value={rec.key} />
        ),
    },
    {
      title: 'Biểu đồ', dataIndex: 'chartType',
      render: (_v, rec) =>
        editingId === rec.id ? (
          <Select
            size="small" value={editForm.chartType}
            onChange={(v) => setEdit({ chartType: v as ChartType })}
            style={{ width: 120 }}
            options={CHART_OPTIONS}
          />
        ) : (
          <ChartTypeBadge type={rec.chartType} />
        ),
    },
    {
      title: (
        <>
          Cột Excel
          <Tooltip title="Tên cột xuất hiện trong file Excel báo cáo">
            <FileExcelOutlined style={{ marginLeft: 5, fontSize: 11, color: '#22c55e' }} />
          </Tooltip>
        </>
      ),
      dataIndex: 'excelColumn',
      render: (_v, rec) =>
        editingId === rec.id ? (
          <Input
            size="small" value={editForm.excelColumn}
            onChange={(e) => setEdit({ excelColumn: e.target.value })}
            placeholder="Tên cột Excel..."
            style={{ fontSize: 13 }}
          />
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileExcelOutlined style={{ color: '#22c55e', fontSize: 13 }} />
            <span style={{ fontSize: 13, color: '#374151' }}>{rec.excelColumn || '—'}</span>
          </span>
        ),
    },
    {
      title: 'Bật/Tắt', align: 'center', width: 90,
      render: (_v, rec) =>
        editingId === rec.id ? null : (
          <Switch
            size="small" checked={rec.active}
            onChange={(v) => update(rec.id, { active: v })}
            style={{ background: rec.active ? ACCENT : undefined }}
          />
        ),
    },
    {
      title: 'Thao tác', width: 100,
      render: (_v, rec) =>
        editingId === rec.id ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <button disabled={!editValid} onClick={saveEdit} style={saveBtn(editValid)}>
              <CheckOutlined style={{ fontSize: 11 }} /> Lưu
            </button>
            <button onClick={() => setEditingId(null)} style={cancelBtn}>
              <CloseOutlined style={{ fontSize: 10 }} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 4 }}>
            <Tooltip title="Chỉnh sửa">
              <button onClick={() => startEdit(rec)} style={iconBtn('#3b82f6')}>
                <EditOutlined style={{ fontSize: 12 }} />
              </button>
            </Tooltip>
            <Tooltip title="Xoá chỉ tiêu">
              <button onClick={() => remove(rec.id)} style={iconBtn('#ef4444')}>
                <DeleteOutlined style={{ fontSize: 12 }} />
              </button>
            </Tooltip>
          </div>
        ),
    },
  ]

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
          <CustomTable<StatIndicator>
            rowKey="id"
            size="small"
            striped={false}
            pagination={false}
            columns={columns}
            data={filtered}
            minHeight={0}
            scroll={{ x: 'max-content' }}
            onRow={(rec) => ({
              draggable: editingId !== rec.id && !addingNew,
              onDragStart: () => handleDragStart(rec.id),
              onDragOver: (e: React.DragEvent) => handleDragOver(e, rec.id),
              style: {
                opacity: rec.active ? 1 : 0.5,
                transition: 'opacity .15s',
                cursor: editingId === rec.id ? 'default' : 'grab',
              },
            })}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span style={{ color: '#94a3b8', fontSize: 13 }}>Không có chỉ tiêu nào</span>}
                />
              ),
            }}
          />
        </div>

        {/*  Add new row  */}
        {addingNew && (
          <div style={{
            marginTop: 12, padding: '14px 16px', borderRadius: 10,
            background: `${ACCENT}0a`, border: `1px solid ${ACCENT}33`,
            display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
          }}>
            <Input
              size="small" value={newForm.label}
              onChange={(e) => setNew({ label: e.target.value })}
              placeholder="Tên chỉ tiêu..."
              style={{ width: 200, fontSize: 13, fontWeight: 500 }}
              autoFocus
            />
            <Input
              size="small" value={newForm.key}
              onChange={(e) => setNew({ key: e.target.value.toLowerCase().replace(/\s+/g, '') })}
              placeholder="vd: employmentstatus"
              style={{ width: 180, fontSize: 12, fontFamily: 'monospace' }}
            />
            <Select
              size="small" value={newForm.chartType}
              onChange={(v) => setNew({ chartType: v as ChartType })}
              style={{ width: 120 }}
              options={CHART_OPTIONS}
            />
            <Input
              size="small" value={newForm.excelColumn}
              onChange={(e) => setNew({ excelColumn: e.target.value })}
              placeholder="Tên cột Excel..."
              style={{ width: 180, fontSize: 13 }}
            />
            <Switch
              size="small" checked={newForm.active}
              onChange={(v) => setNew({ active: v })}
              style={{ background: newForm.active ? ACCENT : undefined }}
            />
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
              <button disabled={!newValid} onClick={addNew} style={saveBtn(newValid)}>
                <CheckOutlined style={{ fontSize: 11 }} /> Lưu
              </button>
              <button
                onClick={() => { setAddingNew(false); setNewForm(EMPTY_INDICATOR()) }}
                style={cancelBtn}
              >
                <CloseOutlined style={{ fontSize: 10 }} />
              </button>
            </div>
          </div>
        )}

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

const cancelBtn: React.CSSProperties = {
  height: 28, padding: '0 10px', border: '1px solid #e2e8f0', borderRadius: 6,
  background: '#fff', color: '#64748b', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
}

function saveBtn(valid: boolean): React.CSSProperties {
  return {
    height: 28, padding: '0 12px', border: 'none', borderRadius: 6,
    background: valid ? ACCENT : '#e2e8f0', color: valid ? '#fff' : '#94a3b8',
    cursor: valid ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', gap: 4,
  }
}

function iconBtn(color: string): React.CSSProperties {
  return {
    width: 28, height: 28, border: `1px solid ${color}22`, borderRadius: 6,
    background: `${color}08`, color, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .12s',
  }
}
