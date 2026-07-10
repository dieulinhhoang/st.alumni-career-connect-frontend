/**
 *
 * Logic:
 *  - Chỉ hiện với loại câu hỏi có options (radio, checkbox, select)
 *  - Toggle "Hiện trong biểu đồ" → chọn Tròn / Cột
 *  - Toggle "Xuất Excel"         → chọn Mẫu (1 hoặc 3) → chọn cột tương ứng
 *  - reportFieldKey tự sinh khi bật bất kỳ toggle nào, admin không nhìn thấy
 *
 */

import React from 'react'
import { Select, Checkbox, Tooltip, Switch } from 'antd'
import {
  CopyOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined,
  PieChartOutlined, BarChartOutlined, FileExcelOutlined, UserOutlined, LockOutlined,
} from '@ant-design/icons'
import type { Question, Section, QuestionType, StudentPrefillField } from '../../../../../feature/form/types'
import { GENDER_OPTIONS } from '../../../../../feature/form/constants'

//  Cột của từng mẫu 
//  Mau01Table.tsx và Mau03Table.tsx

export const MAU01_COLUMNS: { value: string; label: string }[] = [
  { value: 'coViecLam',     label: 'Có việc làm' },
  { value: 'tiepTucHoc',   label: 'Tiếp tục học' },
  { value: 'chuaCoViecLam',label: 'Chưa có việc làm' },
  { value: 'approved',     label: 'Tỷ lệ VL / Phản hồi' },
  { value: 'kvNhaNuoc',    label: 'Khu vực Nhà nước' },
  { value: 'kvTuNhan',     label: 'Khu vực Tư nhân' },
  { value: 'kvTuTao',      label: 'Tự tạo việc làm' },
  { value: 'kvYNuocNgoai', label: 'Có yếu tố nước ngoài' },
  { value: 'workLocation', label: 'Nơi làm việc (Tỉnh/TP)' },
]

export const MAU03_COLUMNS: { value: string; label: string }[] = [
  // ── Câu hỏi "gộp" (radio/checkbox nhiều lựa chọn) — 1 câu hỏi này quyết định
  // nhiều cột thống kê con bên dưới (xem FIELD_SOURCE/FIELD_MATCH_LABELS ở BE) ──
  { value: 'employmentStatus',     label: '[Gộp] Tình trạng việc làm (Đã có VL/Tiếp tục học/Chưa có VL...)' },
  { value: 'jobRelevance',         label: '[Gộp] Mức độ phù hợp ngành đào tạo (Đúng/Liên quan/Không liên quan)' },
  { value: 'workSector',           label: '[Gộp] Khu vực làm việc (Nhà nước/Tư nhân/Nước ngoài/Tự tạo)' },
  { value: 'jobSearchDuration',    label: '[Gộp] Thời gian có việc làm sau tốt nghiệp' },
  { value: 'trainingFit',          label: '[Gộp] Mức độ học được kiến thức/kỹ năng từ nhà trường' },
  { value: 'softSkills',           label: '[Gộp] Kỹ năng mềm cần cho công việc (chọn nhiều)' },

  { value: 'dungNganh',            label: 'Có VL - Đúng ngành' },
  { value: 'lienQuan',             label: 'Có VL - Liên quan' },
  { value: 'khongLienQuan',        label: 'Có VL - Không liên quan' },
  { value: 'tiepTucHoc',           label: 'Tiếp tục học' },
  { value: 'chuaCoVl',             label: 'Chưa có VL' },
  { value: 'kvNhaNuoc',            label: 'Khu vực nhà nước' },
  { value: 'kvTuNhan',             label: 'Khu vực tư nhân' },
  { value: 'kvTuTao',              label: 'Tự tạo việc làm' },
  { value: 'kvYNuocNgoai',         label: 'Có yếu tố nước ngoài' },
  { value: 'workLocation',         label: 'Nơi làm việc' },
  { value: 'thoiGianDuoi3Thang',   label: 'Thời gian có VL: dưới 3 tháng' },
  { value: 'thoiGian3Den6Thang',   label: 'Thời gian có VL: 3–6 tháng' },
  { value: 'thoiGian6Den12Thang',  label: 'Thời gian có VL: 6–12 tháng' },
  { value: 'thoiGian12ThangTroLen',label: 'Thời gian có VL: 12 tháng trở lên' },
  { value: 'hocDu',                label: 'Học được đủ kỹ năng' },
  { value: 'hocMotPhan',           label: 'Chỉ học được một phần' },
  { value: 'khôngHocDuoc',         label: 'Không học được' },
  { value: 'salary',               label: 'Lương khởi điểm (triệu)' },
  { value: 'avgIncome',            label: 'Thu nhập bình quân (triệu)' },
  { value: 'searchMethod',         label: 'Hình thức tìm việc' },
  { value: 'hiringMethod',         label: 'Hình thức tuyển dụng' },
  { value: 'knGiaoTiep',           label: 'KN giao tiếp' },
  { value: 'knThuyetTrinh',        label: 'KN thuyết trình' },
  { value: 'knLamViecNhom',        label: 'KN làm việc nhóm' },
  { value: 'knVietBaoCao',         label: 'KN viết báo cáo' },
  { value: 'knLanhDao',            label: 'KN lãnh đạo' },
  { value: 'knTiengAnh',           label: 'KN tiếng Anh' },
  { value: 'knTinHoc',             label: 'KN tin học' },
  { value: 'knHoiNhap',            label: 'KN hội nhập quốc tế' },
  { value: 'knKhac',               label: 'Kỹ năng khác' },
  { value: 'postGradCourse',       label: 'Khóa học sau tốt nghiệp' },
  { value: 'giaiPhap',             label: 'Đề xuất / Giải pháp' },
]

//  Helpers 

const CHARTABLE_TYPES: QuestionType[] = ['radio', 'checkbox', 'select', 'multiple-choice', 'dropdown', 'gender']

const genKey = (qid: string) => `rk_${qid}`

//  Sub-component: StatConfig 

interface StatConfigProps {
  question: Question
  accent: string
  onUpdate: (patch: Partial<Question>) => void
}

function StatConfig({ question: q, accent, onUpdate }: StatConfigProps) {
  const colList = q.reportTemplate === 'mau01' ? MAU01_COLUMNS : MAU03_COLUMNS

  // Các câu hỏi thông tin cá nhân (Giới tính, Mã SV...) đã có reportFieldKey
  // đặc biệt (vd 'gender') được report-export dùng để loại khỏi cột động Mẫu 3.
  // Không được ghi đè key này bằng rk_<id> khi bật/tắt toggle.
  const isPersonalKey = !!q.reportFieldKey && !q.reportFieldKey.startsWith('rk_')

  const handleChartToggle = (on: boolean) => {
    onUpdate({
      showInChart: on,
      chartType: on ? (q.chartType ?? 'pie') : undefined,
      reportFieldKey: isPersonalKey
        ? q.reportFieldKey
        : (on || q.excelColumn) ? genKey(q.id) : undefined,
    })
  }

  const handleExcelToggle = (on: boolean) => {
    onUpdate({
      reportTemplate: on ? (q.reportTemplate ?? 'mau03') : undefined,
      excelColumn: on ? q.excelColumn : undefined,
      reportFieldKey: isPersonalKey
        ? q.reportFieldKey
        : (on || q.showInChart) ? genKey(q.id) : undefined,
    })
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        marginTop: 12,
        padding: '12px 14px',
        borderRadius: 10,
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        Thống kê &amp; Báo cáo
      </div>

      {/*  Biểu đồ  */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Switch
          size="small"
          checked={!!q.showInChart}
          onChange={handleChartToggle}
          style={{ background: q.showInChart ? accent : undefined }}
        />
        <span style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
          <PieChartOutlined style={{ color: q.showInChart ? accent : '#94a3b8' }} />
          Hiện trong biểu đồ
        </span>

        {q.showInChart && (
          <Select
            size="small"
            value={q.chartType ?? 'pie'}
            onChange={(v) => onUpdate({ chartType: v as 'pie' | 'column' })}
            style={{ width: 130, marginLeft: 4 }}
            options={[
              { value: 'pie',    label: <span><PieChartOutlined />  Biểu đồ tròn</span> },
              { value: 'column', label: <span><BarChartOutlined />  Biểu đồ cột</span> },
            ]}
          />
        )}
      </div>

      {/*  Excel  */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Switch
          size="small"
          checked={!!q.reportTemplate}
          onChange={handleExcelToggle}
          style={{ background: q.reportTemplate ? '#16a34a' : undefined }}
        />
        <span style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
          <FileExcelOutlined style={{ color: q.reportTemplate ? '#16a34a' : '#94a3b8' }} />
          Xuất Excel
        </span>

        {q.reportTemplate && (
          <>
            {/* Chọn mẫu */}
            {/* <Select
              size="small"
              value={q.reportTemplate}
              onChange={(v) => onUpdate({ reportTemplate: v as 'mau01' | 'mau03', excelColumn: undefined })}
              style={{ width: 90 }}
              options={[
                { value: 'mau01', label: 'Mẫu 1' },
                { value: 'mau03', label: 'Mẫu 3' },
              ]}
            /> */}

            {/* Chọn cột */}
            <Select
              size="small"
              value={q.excelColumn}
              placeholder="Chọn cột..."
              onChange={(v) => onUpdate({ excelColumn: v })}
              style={{ width: 210 }}
              showSearch
              optionFilterProp="label"
              options={colList}
            />
          </>
        )}
      </div>

      {/* Gợi ý nếu chưa cấu hình */}
      {!q.showInChart && !q.reportTemplate && (
        <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>
          Bật để đưa câu hỏi này vào biểu đồ hoặc file Excel báo cáo
        </div>
      )}

      {/* Preview key nội bộ — nhỏ, mờ, chỉ để dev trace */}
      {q.reportFieldKey && (
        <div style={{ fontSize: 10, color: '#cbd5e1' }}>
          key: <code style={{ fontFamily: 'monospace' }}>{q.reportFieldKey}</code>
        </div>
      )}
    </div>
  )
}

//  Prefill config

const PREFILL_FIELD_OPTIONS: { value: StudentPrefillField; label: string }[] = [
  { value: 'studentCode',   label: 'Mã sinh viên' },
  { value: 'fullName',      label: 'Họ và tên' },
  { value: 'gender',        label: 'Giới tính' },
  { value: 'dob',           label: 'Ngày sinh' },
  { value: 'majorCode',     label: 'Mã ngành đào tạo' },
  { value: 'cccd',          label: 'Số CCCD' },
  { value: 'schoolYearEnd', label: 'Khóa học' },
  { value: 'majorName',     label: 'Tên ngành đào tạo' },
  { value: 'phone',         label: 'Số điện thoại' },
  { value: 'email',         label: 'Email' },
]

interface PrefillConfigProps {
  question: Question
  accent: string
  onUpdate: (patch: Partial<Question>) => void
}

function PrefillConfig({ question: q, accent, onUpdate }: PrefillConfigProps) {
  const hasPrefill = !!q.prefillField

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        marginTop: 12,
        padding: '12px 14px',
        borderRadius: 10,
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
        <UserOutlined /> Tự điền từ dữ liệu sinh viên
      </div>

      {/* Chọn field sinh viên */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Select
          size="small"
          allowClear
          placeholder="Chọn thông tin SV..."
          value={q.prefillField ?? undefined}
          onChange={(v) => onUpdate({
            prefillField: v as StudentPrefillField | undefined,
            lockedWhenPrefilled: v ? q.lockedWhenPrefilled : false,
          })}
          style={{ width: 200 }}
          options={PREFILL_FIELD_OPTIONS}
        />
        {!hasPrefill && (
          <span style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>
            Không tự điền
          </span>
        )}
      </div>

      {/* Toggle khoá sau khi prefill */}
      {hasPrefill && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Switch
            size="small"
            checked={!!q.lockedWhenPrefilled}
            onChange={(on) => onUpdate({ lockedWhenPrefilled: on })}
            style={{ background: q.lockedWhenPrefilled ? accent : undefined }}
          />
          <span style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
            <LockOutlined style={{ color: q.lockedWhenPrefilled ? accent : '#94a3b8' }} />
            Khoá câu hỏi sau khi tự điền
          </span>
        </div>
      )}
    </div>
  )
}

//  Types

interface EditableQuestionCardProps {
  question: Question
  index: number
  total: number
  isActive: boolean
  accent: string
  sections: Section[]
  onActivate: () => void
  onDeactivate: () => void
  onUpdate: (patch: Partial<Question>) => void
  onDuplicate: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onAddQuestion: () => void
  onAddOption: () => void
  onUpdateOption: (oid: string, label: string) => void
  onRemoveOption: (oid: string) => void
}

const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'text',    label: 'Văn  bản ngắn' },
  { value: 'long',     label: 'Đoạn văn' },
  { value: 'radio',    label: 'Trắc nghiệm' },
  { value: 'checkbox', label: 'Hộp kiểm' },
  { value: 'gender',   label: 'Giới tính' },
  { value: 'select',   label: 'Danh sách thả xuống' },
  { value: 'date',     label: 'Ngày' },
  { value: 'email',    label: 'Email' },
  { value: 'tel',      label: 'Số điện thoại' },
  { value: 'address',  label: 'Địa chỉ' },
  { value: 'address-province', label: 'Địa chỉ + Tỉnh/TP (chọn)' },
  { value: 'cccd',     label: 'Số CCCD (Số/Ngày cấp/Nơi cấp)' },
  { value: 'dob',      label: 'Ngày sinh' },
  { value: 'number',   label: 'Số nguyên' },
]

const iconBtnBase: React.CSSProperties = {
  width: 36, height: 36, border: 'none', borderRadius: 10,
  background: '#f8fafc', color: '#64748b',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'all .15s ease',
}

function ActionIcon({ title, icon, onClick, danger = false, disabled = false }: {
  title: string; icon: React.ReactNode; onClick: () => void; danger?: boolean; disabled?: boolean
}) {
  return (
    <Tooltip title={title}>
      <button type="button" aria-label={title} onClick={onClick} disabled={disabled}
        style={{ ...iconBtnBase, opacity: disabled ? 0.45 : 1, color: danger ? '#ef4444' : '#64748b', cursor: disabled ? 'not-allowed' : 'pointer' }}
        onMouseEnter={(e) => { if (disabled) return; e.currentTarget.style.background = danger ? '#fef2f2' : '#f1f5f9' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc' }}>
        {icon}
      </button>
    </Tooltip>
  )
}

//  Main 

export function EditableQuestionCard({
  question, index, total, isActive, accent, sections,
  onActivate, onDeactivate, onUpdate, onDuplicate, onRemove,
  onMoveUp, onMoveDown, onAddQuestion, onAddOption, onUpdateOption, onRemoveOption,
}: EditableQuestionCardProps) {
  const [editingPlaceholder, setEditingPlaceholder] = React.useState(false)
  const [cardHovered, setCardHovered] = React.useState(false)
  const qType = (question.type ?? 'text') as QuestionType
  const options = Array.isArray(question.options) ? question.options : []
  const isChoiceType = ['radio', 'checkbox', 'select'].includes(qType)
  const isChartable  = CHARTABLE_TYPES.includes(qType)

  // Enter / click "Thêm tùy chọn" → thêm option mới rồi focus vào ô vừa thêm
  const optionListRef = React.useRef<HTMLDivElement>(null)
  const focusNewOptionRef = React.useRef(false)
  React.useEffect(() => {
    if (!focusNewOptionRef.current) return
    focusNewOptionRef.current = false
    const inputs = optionListRef.current?.querySelectorAll<HTMLInputElement>('input[data-option-input]')
    inputs?.[inputs.length - 1]?.focus()
  }, [options.length])
  const handleAddOption = () => {
    focusNewOptionRef.current = true
    onAddOption()
  }

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onActivate() }}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
      style={{
        background: '#fff', borderRadius: 6,
        border: isActive ? `1px solid ${accent}30` : cardHovered ? '1px solid #e2e8f0' : '1px solid transparent',
        borderLeft: isActive ? `4px solid ${accent}` : cardHovered ? '4px solid #e2e8f0' : '4px solid transparent',
        boxShadow: isActive ? '0 2px 8px rgba(0,0,0,.08)' : 'none',
        padding: '16px 18px 16px 14px',
        marginBottom: 0, transition: 'border-color .15s, box-shadow .2s',
        position: 'relative', cursor: 'pointer',
      }}
    >


      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Title + type dropdown (dropdown chỉ hiện khi active) */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ minWidth: 20, color: '#64748b', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>{index + 1}.</div>
                <input
                  value={question.title ?? ''}
                  onClick={(e) => { e.stopPropagation(); onActivate() }}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  placeholder="Câu hỏi"
                  style={{ flex: 1, border: 'none', borderBottom: isActive ? '2px solid #d1d5db' : 'none', outline: 'none', padding: '4px 0 6px', fontSize: 16, fontWeight: 600, background: 'transparent', color: '#0f172a', cursor: isActive ? 'text' : 'default' }}
                  readOnly={!isActive}
                />
              </div>
            </div>
            {isActive && (
              <div style={{ width: 220, maxWidth: '100%', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                <Select
                  value={qType}
                  onChange={(val) => onUpdate({
                    type: val,
                    options: val === 'gender'
                      ? GENDER_OPTIONS.map((o) => ({ ...o }))
                      : ['radio', 'checkbox', 'select'].includes(val)
                        ? options.length ? options : [{ id: crypto.randomUUID(), label: 'Tùy chọn 1' }]
                        : [],
                    ...(CHARTABLE_TYPES.includes(val) ? {} : { showInChart: false, reportTemplate: undefined, excelColumn: undefined, reportFieldKey: undefined }),
                  })}
                  style={{ width: '100%' }}
                  options={QUESTION_TYPE_OPTIONS}
                />
              </div>
            )}
          </div>

          {/* Input preview — mặc định giống preview, focus mới edit placeholder */}
          <div style={{ marginTop: 14 }}>
            {(qType === 'text' || qType === 'email' || qType === 'tel' || qType === 'number') && (
              <input
                value={editingPlaceholder ? (question.placeholder ?? '') : ''}
                placeholder={editingPlaceholder ? 'Nhập gợi ý...' : (question.placeholder || 'Câu trả lời của bạn')}
                onClick={(e) => { e.stopPropagation(); onActivate() }}
                onFocus={() => setEditingPlaceholder(true)}
                onBlur={() => setEditingPlaceholder(false)}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16, outline: 'none', color: editingPlaceholder ? '#334155' : '#9ca3af', background: '#fff', fontFamily: 'inherit' }}
              />
            )}
            {qType === 'long' && (
              <textarea
                value={editingPlaceholder ? (question.placeholder ?? '') : ''}
                placeholder={editingPlaceholder ? 'Nhập gợi ý...' : (question.placeholder || 'Câu trả lời của bạn')}
                onClick={(e) => { e.stopPropagation(); onActivate() }}
                onFocus={() => setEditingPlaceholder(true)}
                onBlur={() => setEditingPlaceholder(false)}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                rows={4}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16, outline: 'none', color: editingPlaceholder ? '#334155' : '#9ca3af', background: '#fff', fontFamily: 'inherit', resize: 'vertical' }}
              />
            )}
            {qType === 'date' && (
              <input
                value={editingPlaceholder ? (question.placeholder ?? '') : ''}
                placeholder={editingPlaceholder ? 'Nhập gợi ý...' : (question.placeholder || 'dd/mm/yyyy')}
                onClick={(e) => { e.stopPropagation(); onActivate() }}
                onFocus={() => setEditingPlaceholder(true)}
                onBlur={() => setEditingPlaceholder(false)}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                style={{ width: 220, maxWidth: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16, outline: 'none', color: '#9ca3af', background: '#fff', fontFamily: 'inherit' }}
              />
            )}
            {qType === 'dob' && (
              <div style={{ padding: '10px 14px', border: '1px dashed #cbd5e1', borderRadius: 10, color: '#9ca3af', fontSize: 14, fontStyle: 'italic', background: '#f8fafc', width: 220, maxWidth: '100%' }}>
                Ngày sinh (dd/mm/yyyy)
              </div>
            )}
            {qType === 'address' && (
              <div style={{ padding: '12px 14px', border: '1px dashed #cbd5e1', borderRadius: 10, color: '#64748b', fontSize: 14, background: '#f8fafc' }}>
                Trường địa chỉ sẽ hiển thị ở chế độ điền biểu mẫu
              </div>
            )}
            {qType === 'address-province' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ padding: '10px 14px', border: '1px dashed #cbd5e1', borderRadius: 10, color: '#9ca3af', fontSize: 14, fontStyle: 'italic', background: '#f8fafc' }}>
                  Địa chỉ (người dùng tự nhập)...
                </div>
                <div style={{ padding: '10px 14px', border: '1px dashed #cbd5e1', borderRadius: 10, color: '#9ca3af', fontSize: 14, background: '#f8fafc' }}>
                  -- Chọn Tỉnh / Thành phố (34 tỉnh + Nước ngoài) --
                </div>
              </div>
            )}
            {qType === 'cccd' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ padding: '10px 14px', border: '1px dashed #cbd5e1', borderRadius: 10, color: '#9ca3af', fontSize: 14, fontStyle: 'italic', background: '#f8fafc' }}>
                  Số CCCD...
                </div>
                <div style={{ padding: '10px 14px', border: '1px dashed #cbd5e1', borderRadius: 10, color: '#9ca3af', fontSize: 13, background: '#f8fafc' }}>
                  Cấp ngày: <span>dd / mm / yyyy</span>
                </div>
                <div style={{ padding: '10px 14px', border: '1px dashed #cbd5e1', borderRadius: 10, color: '#9ca3af', fontSize: 14, fontStyle: 'italic', background: '#f8fafc' }}>
                  Tại...
                </div>
              </div>
            )}
            {qType === 'gender' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {GENDER_OPTIONS.map((opt) => (
                  <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 999, border: '2px solid #cbd5e1', flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: '#334155' }}>{opt.label}</span>
                  </div>
                ))}
              </div>
            )}
            {isChoiceType && (
              <div ref={optionListRef} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {options.map((opt) => (
                  <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={(e) => { e.stopPropagation(); onActivate() }}>
                    <div style={{ width: 18, display: 'flex', justifyContent: 'center', color: '#94a3b8', flexShrink: 0, fontSize: 14 }}>
                      {qType === 'checkbox'
                        ? <Checkbox disabled />
                        : <div style={{ width: 14, height: 14, borderRadius: 999, border: '2px solid #cbd5e1' }} />}
                    </div>
                    <input value={opt.label} data-option-input onChange={(e) => onUpdateOption(opt.id, e.target.value)} placeholder="Tùy chọn"
                      onKeyDown={(e) => {
                        if (e.nativeEvent.isComposing) return
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddOption()
                          return
                        }
                        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                          const inputs = optionListRef.current?.querySelectorAll<HTMLInputElement>('input[data-option-input]')
                          if (!inputs) return
                          const curIdx = Array.from(inputs).indexOf(e.currentTarget)
                          const nextIdx = e.key === 'ArrowDown' ? curIdx + 1 : curIdx - 1
                          if (nextIdx >= 0 && nextIdx < inputs.length) {
                            e.preventDefault()
                            inputs[nextIdx].focus()
                          }
                          return
                        }
                        if ((e.key === 'Backspace' || e.key === 'Delete') && opt.label === '' && options.length > 1) {
                          e.preventDefault()
                          const idx = options.findIndex(o => o.id === opt.id)
                          const targetIdx = idx > 0 ? idx - 1 : 1
                          onRemoveOption(opt.id)
                          requestAnimationFrame(() => {
                            const inputs = optionListRef.current?.querySelectorAll<HTMLInputElement>('input[data-option-input]')
                            inputs?.[Math.min(targetIdx, (inputs?.length ?? 1) - 1)]?.focus()
                          })
                        }
                      }}
                      style={{ flex: 1, border: 'none', borderBottom: '1px solid #dbe2ea', outline: 'none', padding: '8px 0', fontSize: 14, color: '#334155', background: 'transparent' }} />
                    {isActive && options.length > 1 && (
                      <button type="button" onClick={() => onRemoveOption(opt.id)}
                        style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4 }}>×</button>
                    )}
                  </div>
                ))}

                {/* Hàng "Khác" khi đã bật allowOther */}
                {(qType === 'radio' || qType === 'checkbox') && question.allowOther && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={(e) => { e.stopPropagation(); onActivate() }}>
                    <div style={{ width: 18, display: 'flex', justifyContent: 'center', color: '#94a3b8', flexShrink: 0 }}>
                      {qType === 'checkbox'
                        ? <Checkbox disabled />
                        : <div style={{ width: 14, height: 14, borderRadius: 999, border: '2px solid #d1d5db' }} />}
                    </div>
                    <span style={{ fontSize: 14, color: '#94a3b8', fontStyle: 'italic', flex: 1, padding: '8px 0', borderBottom: '1px dotted #dbe2ea' }}>Khác...</span>
                    {isActive && (
                      <button type="button" onClick={() => onUpdate({ allowOther: false })}
                        style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4 }}>×</button>
                    )}
                  </div>
                )}

                {/* Hàng thêm tùy chọn — kiểu Google Forms */}
                {isActive && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ width: 18, display: 'flex', justifyContent: 'center', color: '#94a3b8', flexShrink: 0, fontSize: 14 }}>
                      {qType === 'checkbox'
                        ? <Checkbox disabled />
                        : <div style={{ width: 14, height: 14, borderRadius: 999, border: '2px solid #d1d5db' }} />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap', fontSize: 14 }}>
                      <button type="button" onClick={handleAddOption}
                        style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'text', fontSize: 14, padding: '8px 0', borderBottom: '1px solid transparent' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = '#dbe2ea' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = 'transparent' }}>
                        Thêm tùy chọn
                      </button>
                      {(qType === 'radio' || qType === 'checkbox') && !question.allowOther && (
                        <>
                          <span style={{ color: '#334155' }}>hoặc</span>
                          <button type="button" onClick={() => onUpdate({ allowOther: true })}
                            style={{ border: 'none', background: 'transparent', color: 'rgb(22, 119, 255)', cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: 0 }}>
                            thêm "Câu trả lời khác"
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer + configs — grid trick để animate height 0→auto */}
          <div style={{
            display: 'grid',
            gridTemplateRows: isActive ? '1fr' : '0fr',
            transition: 'grid-template-rows .22s cubic-bezier(.4,0,.2,1)',
          }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                marginTop: 16, paddingTop: 14, borderTop: '1px solid #eef2f7',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
                opacity: isActive ? 1 : 0, transition: 'opacity .18s',
              }} onClick={(e) => e.stopPropagation()}>
                <Checkbox checked={!!question.required} onChange={(e) => onUpdate({ required: e.target.checked })}>
                  Bắt buộc
                </Checkbox>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ActionIcon title="Nhân bản" icon={<CopyOutlined />}   onClick={onDuplicate} />
                  <ActionIcon title="Xóa"      icon={<DeleteOutlined />} onClick={onRemove} danger />
                </div>
              </div>
              {isChartable && <StatConfig question={question} accent={accent} onUpdate={onUpdate} />}
              <PrefillConfig question={question} accent={accent} onUpdate={onUpdate} />
            </div>
          </div>

          {/* Badge nhỏ khi không active nhưng đã cấu hình prefill */}
          {!isActive && question.prefillField && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                marginTop: 8,
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 10px', borderRadius: 99,
                background: '#e0f2fe', color: '#0284c7',
                fontSize: 12, fontWeight: 500,
              }}
            >
              <UserOutlined style={{ fontSize: 11 }} />
              {PREFILL_FIELD_OPTIONS.find(o => o.value === question.prefillField)?.label ?? question.prefillField}
              {question.lockedWhenPrefilled && <LockOutlined style={{ fontSize: 11, marginLeft: 2 }} />}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}