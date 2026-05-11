import { useEffect, useMemo, useState } from 'react'
import {
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
  FilterOutlined,
  PieChartOutlined,
  ReloadOutlined,
  SendOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Badge,
  Button,
  Col,
  DatePicker,
  Dropdown,
  Empty,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AdminLayout from '../../../components/layout/AdminLayout'

const { RangePicker } = DatePicker
const { Title, Text } = Typography

type RoleScope = 'school' | 'faculty' | 'major'
type ViewMode = 'overview' | 'graduates' | 'responses' | 'charts' | 'submission-progress'
type SubmissionStatus = 'draft' | 'submitted' | 'returned' | 'approved'

type UserProfile = {
  role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'FACULTY_OFFICER' | 'MAJOR_OFFICER'
  scope: RoleScope
  facultyId?: string
  majorId?: string
  facultyName?: string
  majorName?: string
}

type Option = { label: string; value: string }

type FilterState = {
  surveyId?: string
  facultyId?: string
  majorId?: string
  graduationYear?: string
  responseStatus?: string
  employmentStatus?: string
  workArea?: string
  gender?: string
  contactMethod?: string
}

type MajorSummaryRow = {
  key: string
  majorCode: string
  majorName: string
  facultyName: string
  totalGraduates: number
  responses: number
  employed: number
  continuingStudy: number
  unemployed: number
  correctMajor: number
  relatedMajor: number
  unrelatedMajor: number
  publicArea: number
  privateArea: number
  selfEmployed: number
  workProvince: string
}

type GraduateRow = {
  key: string
  studentCode: string
  fullName: string
  gender: string
  citizenId: string
  majorCode: string
  majorName: string
  facultyName: string
  graduationDecision: string
  graduationDate: string
  phone: string
  email: string
  surveyMethod: string
  responseStatus: string
  note: string
}

type ResponseRow = {
  key: string
  studentCode: string
  fullName: string
  birthDate: string
  gender: string
  citizenId: string
  majorCode: string
  majorName: string
  facultyName: string
  phone: string
  employmentStatus: string
  workArea: string
  workProvince: string
  jobFoundTime: string
  knowledgeLevel: string
  startingSalary: string
  averageIncome: string
  jobSearchMethod: string
  recruitmentMethod: string
  softSkill: string
  extraCourse: string
  proposal: string
}

type FacultySubmissionRow = {
  key: string
  facultyCode: string
  facultyName: string
  submittedBy?: string
  submittedAt?: string
  deadline: string
  status: SubmissionStatus
  totalGraduates: number
  totalResponses: number
  note?: string
}

const surveys: Option[] = [
  { value: '2025-1', label: 'Khảo sát việc làm 2025 - Đợt 1' },
  { value: '2025-2', label: 'Khảo sát việc làm 2025 - Đợt 2' },
  { value: '2026-1', label: 'Khảo sát việc làm 2026 - Đợt 1' },
]

const faculties = [
  { value: 'cntt', label: 'Khoa Công nghệ thông tin' },
  { value: 'ktptnt', label: 'Khoa Kinh tế và PTNT' },
  { value: 'cokhi', label: 'Khoa Cơ khí' },
  { value: 'cntp', label: 'Khoa Công nghệ thực phẩm' },
]

const majorMap: Record<string, Option[]> = {
  cntt: [
    { value: 'cntt-khdl', label: 'Khoa học dữ liệu' },
    { value: 'cntt-httt', label: 'Hệ thống thông tin' },
  ],
  ktptnt: [
    { value: 'ktptnt-kt', label: 'Kinh tế nông nghiệp' },
    { value: 'ktptnt-qtkd', label: 'Quản trị kinh doanh' },
  ],
  cokhi: [
    { value: 'cokhi-ck', label: 'Cơ khí chế tạo' },
    { value: 'cokhi-dt', label: 'Điện tử cơ điện' },
  ],
  cntp: [{ value: 'cntp-cntp', label: 'Công nghệ thực phẩm' }],
}

const graduationYears: Option[] = [
  { value: '2023', label: 'Khóa 2023' },
  { value: '2024', label: 'Khóa 2024' },
  { value: '2025', label: 'Khóa 2025' },
]

const responseStatuses: Option[] = [
  { value: 'responded', label: 'Đã phản hồi' },
  { value: 'not_responded', label: 'Chưa phản hồi' },
]

const employmentStatuses: Option[] = [
  { value: 'employed', label: 'Có việc làm' },
  { value: 'study', label: 'Tiếp tục học' },
  { value: 'unemployed', label: 'Chưa có việc làm' },
]

const workAreas: Option[] = [
  { value: 'public', label: 'Nhà nước' },
  { value: 'private', label: 'Tư nhân' },
  { value: 'self', label: 'Tự tạo việc làm' },
  { value: 'foreign', label: 'Có yếu tố nước ngoài' },
]

const genders: Option[] = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
]

const contactMethods: Option[] = [
  { value: 'online', label: 'Online' },
  { value: 'phone', label: 'Điện thoại' },
  { value: 'email', label: 'Email' },
  { value: 'interview', label: 'Phỏng vấn' },
]

const mockUsers: UserProfile[] = [
  { role: 'SUPER_ADMIN', scope: 'school' },
  { role: 'SCHOOL_ADMIN', scope: 'school' },
  { role: 'FACULTY_OFFICER', scope: 'faculty', facultyId: 'cntt', facultyName: 'Khoa Công nghệ thông tin' },
  { role: 'MAJOR_OFFICER', scope: 'major', facultyId: 'cntt', facultyName: 'Khoa Công nghệ thông tin', majorId: 'cntt-khdl', majorName: 'Khoa học dữ liệu' },
]

const majorSummarySeed: MajorSummaryRow[] = [
  {
    key: '1',
    majorCode: '7480201',
    majorName: 'Khoa học dữ liệu',
    facultyName: 'Khoa Công nghệ thông tin',
    totalGraduates: 180,
    responses: 150,
    employed: 118,
    continuingStudy: 17,
    unemployed: 15,
    correctMajor: 92,
    relatedMajor: 19,
    unrelatedMajor: 7,
    publicArea: 15,
    privateArea: 92,
    selfEmployed: 11,
    workProvince: 'Hà Nội, Bắc Ninh, TP.HCM',
  },
  {
    key: '2',
    majorCode: '7480104',
    majorName: 'Hệ thống thông tin',
    facultyName: 'Khoa Công nghệ thông tin',
    totalGraduates: 160,
    responses: 132,
    employed: 101,
    continuingStudy: 14,
    unemployed: 17,
    correctMajor: 79,
    relatedMajor: 15,
    unrelatedMajor: 7,
    publicArea: 12,
    privateArea: 81,
    selfEmployed: 8,
    workProvince: 'Hà Nội, Đà Nẵng, Hải Phòng',
  },
  {
    key: '3',
    majorCode: '7620115',
    majorName: 'Kinh tế nông nghiệp',
    facultyName: 'Khoa Kinh tế và PTNT',
    totalGraduates: 145,
    responses: 117,
    employed: 83,
    continuingStudy: 18,
    unemployed: 16,
    correctMajor: 60,
    relatedMajor: 17,
    unrelatedMajor: 6,
    publicArea: 20,
    privateArea: 51,
    selfEmployed: 12,
    workProvince: 'Hà Nội, Hưng Yên, Nam Định',
  },
  {
    key: '4',
    majorCode: '7510201',
    majorName: 'Cơ khí chế tạo',
    facultyName: 'Khoa Cơ khí',
    totalGraduates: 125,
    responses: 96,
    employed: 70,
    continuingStudy: 10,
    unemployed: 16,
    correctMajor: 54,
    relatedMajor: 11,
    unrelatedMajor: 5,
    publicArea: 14,
    privateArea: 46,
    selfEmployed: 10,
    workProvince: 'Hà Nội, Hải Dương, Bắc Giang',
  },
]

const graduateSeed: GraduateRow[] = [
  {
    key: 'g1',
    studentCode: 'SV001',
    fullName: 'Nguyễn Minh Anh',
    gender: 'Nữ',
    citizenId: '001204000111',
    majorCode: '7480201',
    majorName: 'Khoa học dữ liệu',
    facultyName: 'Khoa Công nghệ thông tin',
    graduationDecision: 'QĐ-2025-11',
    graduationDate: '21/06/2025',
    phone: '0988123123',
    email: 'anhnm@demo.vn',
    surveyMethod: 'Online',
    responseStatus: 'Đã phản hồi',
    note: 'Đúng ngành',
  },
  {
    key: 'g2',
    studentCode: 'SV002',
    fullName: 'Trần Quang Huy',
    gender: 'Nam',
    citizenId: '001204000222',
    majorCode: '7480104',
    majorName: 'Hệ thống thông tin',
    facultyName: 'Khoa Công nghệ thông tin',
    graduationDecision: 'QĐ-2025-11',
    graduationDate: '21/06/2025',
    phone: '0977000111',
    email: 'huytq@demo.vn',
    surveyMethod: 'Điện thoại',
    responseStatus: 'Đã phản hồi',
    note: 'Làm tại doanh nghiệp tư nhân',
  },
  {
    key: 'g3',
    studentCode: 'SV003',
    fullName: 'Lê Thu Trang',
    gender: 'Nữ',
    citizenId: '001204000333',
    majorCode: '7620115',
    majorName: 'Kinh tế nông nghiệp',
    facultyName: 'Khoa Kinh tế và PTNT',
    graduationDecision: 'QĐ-2025-09',
    graduationDate: '18/06/2025',
    phone: '0911222333',
    email: 'tranglt@demo.vn',
    surveyMethod: 'Email',
    responseStatus: 'Chưa phản hồi',
    note: 'Chờ bổ sung số điện thoại',
  },
  {
    key: 'g4',
    studentCode: 'SV004',
    fullName: 'Phạm Văn Nam',
    gender: 'Nam',
    citizenId: '001204000444',
    majorCode: '7510201',
    majorName: 'Cơ khí chế tạo',
    facultyName: 'Khoa Cơ khí',
    graduationDecision: 'QĐ-2025-07',
    graduationDate: '15/06/2025',
    phone: '0933444555',
    email: 'nampv@demo.vn',
    surveyMethod: 'Phỏng vấn',
    responseStatus: 'Đã phản hồi',
    note: 'Tự tạo việc làm',
  },
]

const responseSeed: ResponseRow[] = [
  {
    key: 'r1',
    studentCode: 'SV001',
    fullName: 'Nguyễn Minh Anh',
    birthDate: '14/10/2003',
    gender: 'Nữ',
    citizenId: '001204000111',
    majorCode: '7480201',
    majorName: 'Khoa học dữ liệu',
    facultyName: 'Khoa Công nghệ thông tin',
    phone: '0988123123',
    employmentStatus: 'Có việc làm',
    workArea: 'Tư nhân',
    workProvince: 'Hà Nội',
    jobFoundTime: 'Dưới 3 tháng',
    knowledgeLevel: 'Đã học được',
    startingSalary: '11 triệu',
    averageIncome: 'Từ 10-15 triệu',
    jobSearchMethod: 'Bạn bè giới thiệu',
    recruitmentMethod: 'Phỏng vấn trực tiếp',
    softSkill: 'Giao tiếp, làm việc nhóm',
    extraCourse: 'Power BI, Dữ liệu',
    proposal: 'Tăng thực hành doanh nghiệp',
  },
  {
    key: 'r2',
    studentCode: 'SV002',
    fullName: 'Trần Quang Huy',
    birthDate: '08/05/2003',
    gender: 'Nam',
    citizenId: '001204000222',
    majorCode: '7480104',
    majorName: 'Hệ thống thông tin',
    facultyName: 'Khoa Công nghệ thông tin',
    phone: '0977000111',
    employmentStatus: 'Có việc làm',
    workArea: 'Tư nhân',
    workProvince: 'Đà Nẵng',
    jobFoundTime: '3-6 tháng',
    knowledgeLevel: 'Một phần',
    startingSalary: '9 triệu',
    averageIncome: 'Từ 5-10 triệu',
    jobSearchMethod: 'Online',
    recruitmentMethod: 'Thi tuyển',
    softSkill: 'Thuyết trình, quản lý',
    extraCourse: 'BA, SQL',
    proposal: 'Tăng kỹ năng nghề nghiệp',
  },
  {
    key: 'r3',
    studentCode: 'SV003',
    fullName: 'Lê Thu Trang',
    birthDate: '01/12/2002',
    gender: 'Nữ',
    citizenId: '001204000333',
    majorCode: '7620115',
    majorName: 'Kinh tế nông nghiệp',
    facultyName: 'Khoa Kinh tế và PTNT',
    phone: '0911222333',
    employmentStatus: 'Tiếp tục học',
    workArea: 'Nhà nước',
    workProvince: 'Hà Nội',
    jobFoundTime: '6-12 tháng',
    knowledgeLevel: 'Đã học được',
    startingSalary: '—',
    averageIncome: '—',
    jobSearchMethod: 'Khoa giới thiệu',
    recruitmentMethod: 'Xét hồ sơ',
    softSkill: 'Phân tích, nhóm',
    extraCourse: 'Nghiên cứu KH',
    proposal: 'Liên kết học sau TN',
  },
  {
    key: 'r4',
    studentCode: 'SV004',
    fullName: 'Phạm Văn Nam',
    birthDate: '24/03/2003',
    gender: 'Nam',
    citizenId: '001204000444',
    majorCode: '7510201',
    majorName: 'Cơ khí chế tạo',
    facultyName: 'Khoa Cơ khí',
    phone: '0933444555',
    employmentStatus: 'Có việc làm',
    workArea: 'Tự tạo việc làm',
    workProvince: 'Bắc Giang',
    jobFoundTime: '3-6 tháng',
    knowledgeLevel: 'Một phần',
    startingSalary: '13 triệu',
    averageIncome: 'Từ 10-15 triệu',
    jobSearchMethod: 'Người quen',
    recruitmentMethod: 'Tự tạo',
    softSkill: 'Đàm phán, tài chính',
    extraCourse: 'CAD/CAM',
    proposal: 'Kết nối xưởng TH',
  },
]

const facultySubmissionSeed: FacultySubmissionRow[] = [
  {
    key: 'f1',
    facultyCode: 'CNTT',
    facultyName: 'Khoa Công nghệ thông tin',
    submittedBy: 'Nguyễn Thị Hà',
    submittedAt: '09/05/2026 15:20',
    deadline: '15/05/2026',
    status: 'submitted',
    totalGraduates: 340,
    totalResponses: 282,
    note: 'Chờ trường duyệt',
  },
  {
    key: 'f2',
    facultyCode: 'KTPTNT',
    facultyName: 'Khoa Kinh tế và PTNT',
    submittedBy: 'Trần Văn Khải',
    submittedAt: '08/05/2026 10:05',
    deadline: '15/05/2026',
    status: 'returned',
    totalGraduates: 145,
    totalResponses: 117,
    note: 'Thiếu ghi chú CCCD một số sinh viên',
  },
  {
    key: 'f3',
    facultyCode: 'CK',
    facultyName: 'Khoa Cơ khí',
    deadline: '15/05/2026',
    status: 'draft',
    totalGraduates: 125,
    totalResponses: 96,
    note: 'Chưa nộp lên trường',
  },
  {
    key: 'f4',
    facultyCode: 'CNTP',
    facultyName: 'Khoa Công nghệ thực phẩm',
    submittedBy: 'Lê Minh Đức',
    submittedAt: '07/05/2026 16:42',
    deadline: '15/05/2026',
    status: 'approved',
    totalGraduates: 188,
    totalResponses: 151,
    note: 'Đã duyệt',
  },
]

const majorNameToOption: Record<string, string> = {
  'Khoa học dữ liệu': 'cntt-khdl',
  'Hệ thống thông tin': 'cntt-httt',
  'Kinh tế nông nghiệp': 'ktptnt-kt',
  'Cơ khí chế tạo': 'cokhi-ck',
}

const facultyNameToOption: Record<string, string> = {
  'Khoa Công nghệ thông tin': 'cntt',
  'Khoa Kinh tế và PTNT': 'ktptnt',
  'Khoa Cơ khí': 'cokhi',
  'Khoa Công nghệ thực phẩm': 'cntp',
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  SCHOOL_ADMIN: 'Quản trị trường',
  FACULTY_OFFICER: 'Cán bộ khoa',
  MAJOR_OFFICER: 'Cán bộ ngành',
}

const ROLE_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  SUPER_ADMIN: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  SCHOOL_ADMIN: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  FACULTY_OFFICER: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  MAJOR_OFFICER: { bg: '#fefce8', text: '#a16207', border: '#fef08a' },
}

const SUBMISSION_META: Record<
  SubmissionStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  draft: {
    label: 'Nháp',
    color: '#475569',
    bg: '#f8fafc',
    border: '#e2e8f0',
    icon: <ClockCircleOutlined />,
  },
  submitted: {
    label: 'Đã nộp',
    color: '#1d4ed8',
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: <SendOutlined />,
  },
  returned: {
    label: 'Cần bổ sung',
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
    icon: <ExclamationCircleOutlined />,
  },
  approved: {
    label: 'Đã duyệt',
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    icon: <CheckCircleOutlined />,
  },
}

function scopeLabel(user: UserProfile) {
  if (user.scope === 'school') return 'Toàn trường'
  if (user.scope === 'faculty') return user.facultyName || 'Theo khoa'
  return `${user.majorName}`
}

function SubmissionPill({ status }: { status: SubmissionStatus }) {
  const m = SUBMISSION_META[status]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        color: m.color,
        background: m.bg,
        border: `1px solid ${m.border}`,
      }}
    >
      {m.icon}
      {m.label}
    </span>
  )
}

type StatCardProps = {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
  accent: string
  accentLight: string
  accentText: string
}

function StatCard({ label, value, sub, icon, accent, accentLight, accentText }: StatCardProps) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #f1f5f9',
        borderRadius: 12,
        padding: '20px 22px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: accentLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: accent,
          fontSize: 20,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            color: '#94a3b8',
            fontWeight: 500,
            marginBottom: 4,
            letterSpacing: '0.01em',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.2,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 12,
            color: accentText,
            fontWeight: 500,
            marginTop: 4,
            background: accentLight,
            display: 'inline-block',
            padding: '1px 8px',
            borderRadius: 20,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  )
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        color: '#64748b',
        fontWeight: 600,
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {children}
    </div>
  )
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: '#f1f5f9',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 3,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          color: '#475569',
          fontVariantNumeric: 'tabular-nums',
          minWidth: 28,
          textAlign: 'right',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function KpiRing({
  label,
  value,
  color,
  desc,
}: {
  label: string
  value: string
  color: string
  desc: string
}) {
  const num = parseFloat(value)
  const r = 36
  const circ = 2 * Math.PI * r
  const dash = circ * (num / 100)

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #f1f5f9',
        borderRadius: 12,
        padding: '24px 20px',
        textAlign: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <svg width={96} height={96} viewBox="0 0 96 96" style={{ display: 'block', margin: '0 auto 12px' }}>
        <circle cx={48} cy={48} r={r} fill="none" stroke="#f1f5f9" strokeWidth={8} />
        <circle
          cx={48}
          cy={48}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ * 0.25}
        />
        <text x={48} y={52} textAnchor="middle" fontSize={16} fontWeight={700} fill="#0f172a">
          {value}%
        </text>
      </svg>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>{desc}</div>
    </div>
  )
}

export default function ReportsPage() {
  const [messageApi, contextHolder] = message.useMessage()
  const [userIndex, setUserIndex] = useState(0)
  const [activeView, setActiveView] = useState<ViewMode>('overview')
  const [filters, setFilters] = useState<FilterState>({ surveyId: '2026-1' })
  const [filterOpen, setFilterOpen] = useState(true)
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('draft')
  const [facultySubmissionRows, setFacultySubmissionRows] = useState<FacultySubmissionRow[]>(facultySubmissionSeed)

  const currentUser = mockUsers[userIndex]
  const isSchoolView = currentUser.scope === 'school'
  const isFacultyLikeView = currentUser.scope === 'faculty' || currentUser.scope === 'major'

  useEffect(() => {
    if (currentUser.scope === 'school') return
    if (currentUser.scope === 'faculty') setSubmissionStatus('returned')
    if (currentUser.scope === 'major') setSubmissionStatus('draft')
  }, [currentUser])

  const majorOptions = useMemo(() => {
    const fid = currentUser.scope !== 'school' ? currentUser.facultyId : filters.facultyId
    return fid ? majorMap[fid] || [] : Object.values(majorMap).flat()
  }, [currentUser, filters.facultyId])

  const effectiveFilters = useMemo(() => {
    const next = { ...filters }
    if (currentUser.scope === 'faculty') {
      next.facultyId = currentUser.facultyId
      next.majorId = undefined
    }
    if (currentUser.scope === 'major') {
      next.facultyId = currentUser.facultyId
      next.majorId = currentUser.majorId
    }
    return next
  }, [currentUser, filters])

  const filteredMajorSummary = useMemo(
    () =>
      majorSummarySeed.filter((item) => {
        const fid = facultyNameToOption[item.facultyName]
        const mid = majorNameToOption[item.majorName]
        if (effectiveFilters.facultyId && fid !== effectiveFilters.facultyId) return false
        if (effectiveFilters.majorId && mid !== effectiveFilters.majorId) return false
        return true
      }),
    [effectiveFilters]
  )

  const filteredGraduates = useMemo(
    () =>
      graduateSeed.filter((item) => {
        const fid = facultyNameToOption[item.facultyName]
        const mid = majorNameToOption[item.majorName]
        if (effectiveFilters.facultyId && fid !== effectiveFilters.facultyId) return false
        if (effectiveFilters.majorId && mid !== effectiveFilters.majorId) return false
        if (effectiveFilters.gender && item.gender !== genders.find((g) => g.value === effectiveFilters.gender)?.label)
          return false
        if (effectiveFilters.responseStatus) {
          const lbl = responseStatuses.find((s) => s.value === effectiveFilters.responseStatus)?.label
          if (item.responseStatus !== lbl) return false
        }
        if (effectiveFilters.contactMethod) {
          const lbl = contactMethods.find((s) => s.value === effectiveFilters.contactMethod)?.label
          if (item.surveyMethod !== lbl) return false
        }
        return true
      }),
    [effectiveFilters]
  )

  const filteredResponses = useMemo(
    () =>
      responseSeed.filter((item) => {
        const fid = facultyNameToOption[item.facultyName]
        const mid = majorNameToOption[item.majorName]
        if (effectiveFilters.facultyId && fid !== effectiveFilters.facultyId) return false
        if (effectiveFilters.majorId && mid !== effectiveFilters.majorId) return false
        if (effectiveFilters.gender && item.gender !== genders.find((g) => g.value === effectiveFilters.gender)?.label)
          return false
        if (effectiveFilters.employmentStatus) {
          const lbl = employmentStatuses.find((s) => s.value === effectiveFilters.employmentStatus)?.label
          if (item.employmentStatus !== lbl) return false
        }
        if (effectiveFilters.workArea) {
          const lbl = workAreas.find((s) => s.value === effectiveFilters.workArea)?.label
          if (item.workArea !== lbl) return false
        }
        return true
      }),
    [effectiveFilters]
  )

  const stats = useMemo(() => {
    const tg = filteredMajorSummary.reduce((s, i) => s + i.totalGraduates, 0)
    const tr = filteredMajorSummary.reduce((s, i) => s + i.responses, 0)
    const emp = filteredMajorSummary.reduce((s, i) => s + i.employed, 0)
    const cm = filteredMajorSummary.reduce((s, i) => s + i.correctMajor, 0)
    return {
      totalGraduates: tg,
      totalResponses: tr,
      employed: emp,
      correctMajorRate: tr ? ((cm / tr) * 100).toFixed(1) : '0.0',
      responseRate: tg ? ((tr / tg) * 100).toFixed(1) : '0.0',
      employmentRate: tr ? ((emp / tr) * 100).toFixed(1) : '0.0',
    }
  }, [filteredMajorSummary])

  const submissionStats = useMemo(
    () => ({
      total: facultySubmissionRows.length,
      submitted: facultySubmissionRows.filter((i) => i.status === 'submitted').length,
      returned: facultySubmissionRows.filter((i) => i.status === 'returned').length,
      approved: facultySubmissionRows.filter((i) => i.status === 'approved').length,
      draft: facultySubmissionRows.filter((i) => i.status === 'draft').length,
    }),
    [facultySubmissionRows]
  )

  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) => setFilters((prev) => ({ ...prev, [k]: v }))
  const activeFilterCount = Object.values(effectiveFilters).filter(Boolean).length

  const handleSubmitToSchool = () => {
    setSubmissionStatus('submitted')
    messageApi.success('Đã nộp báo cáo lên trường')
  }

  const handleWithdrawSubmission = () => {
    setSubmissionStatus('draft')
    messageApi.info('Đã thu hồi báo cáo về trạng thái nháp')
  }

  const updateFacultyStatus = (key: string, status: SubmissionStatus, note?: string) => {
    setFacultySubmissionRows((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              status,
              note: note ?? item.note,
              submittedAt: status === 'draft' ? undefined : item.submittedAt || '10/05/2026 12:30',
            }
          : item
      )
    )
  }

  // ── Table columns ──────────────────────────────────────────────────────────

  const overviewColumns: ColumnsType<MajorSummaryRow> = [
    {
      title: 'Ngành',
      key: 'major',
      fixed: 'left',
      width: 220,
      render: (_: unknown, r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{r.majorName}</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            <Text code style={{ fontSize: 11, background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0 4px', borderRadius: 4 }}>
              {r.majorCode}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Khoa',
      dataIndex: 'facultyName',
      key: 'facultyName',
      width: 180,
      render: (v) => <span style={{ fontSize: 12, color: '#475569' }}>{v}</span>,
    },
    {
      title: 'SV tốt nghiệp',
      key: 'graduates_bar',
      width: 160,
      render: (_: unknown, r) => (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{r.totalGraduates}</div>
          <MiniBar value={r.responses} max={r.totalGraduates} color="#3b82f6" />
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Phản hồi: {r.responses} ({((r.responses / r.totalGraduates) * 100).toFixed(0)}%)
          </div>
        </div>
      ),
    },
    {
      title: 'Tình trạng việc làm',
      key: 'employment',
      width: 200,
      render: (_: unknown, r) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: '#475569', flex: 1 }}>Có việc làm</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#15803d' }}>{r.employed}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: '#475569', flex: 1 }}>Tiếp tục học</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1d4ed8' }}>{r.continuingStudy}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: '#475569', flex: 1 }}>Chưa có việc</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#b45309' }}>{r.unemployed}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Mức độ phù hợp ngành',
      key: 'relevance',
      width: 180,
      render: (_: unknown, r) => {
        const total = r.correctMajor + r.relatedMajor + r.unrelatedMajor
        return (
          <div>
            <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex', marginBottom: 6 }}>
              <div style={{ width: `${(r.correctMajor / total) * 100}%`, background: '#22c55e' }} />
              <div style={{ width: `${(r.relatedMajor / total) * 100}%`, background: '#93c5fd' }} />
              <div style={{ width: `${(r.unrelatedMajor / total) * 100}%`, background: '#fcd34d' }} />
            </div>
            <div style={{ fontSize: 11, color: '#64748b', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span>✓ Đúng: <b>{r.correctMajor}</b></span>
              <span>~ LQ: <b>{r.relatedMajor}</b></span>
              <span>✗ KLQ: <b>{r.unrelatedMajor}</b></span>
            </div>
          </div>
        )
      },
    },
    {
      title: 'Khu vực làm việc',
      key: 'workArea',
      width: 160,
      render: (_: unknown, r) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 12, color: '#475569' }}>
            NN: <b>{r.publicArea}</b> · TN: <b>{r.privateArea}</b> · TT: <b>{r.selfEmployed}</b>
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.workProvince}</div>
        </div>
      ),
    },
  ]

  const graduateColumns: ColumnsType<GraduateRow> = [
    {
      title: 'Sinh viên',
      key: 'student',
      fixed: 'left',
      width: 200,
      render: (_: unknown, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: r.gender === 'Nữ' ? '#fce7f3' : '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: r.gender === 'Nữ' ? '#be185d' : '#1d4ed8',
              fontSize: 14,
            }}
          >
            <UserOutlined />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{r.fullName}</div>
            <Text code style={{ fontSize: 11 }}>{r.studentCode}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'GT',
      dataIndex: 'gender',
      key: 'gender',
      width: 70,
      render: (v) => (
        <Tag color={v === 'Nam' ? 'blue' : 'pink'} style={{ borderRadius: 20, fontSize: 11, margin: 0 }}>
          {v}
        </Tag>
      ),
    },
    { title: 'Ngành', dataIndex: 'majorName', key: 'majorName', width: 160 },
    {
      title: 'Khoa',
      dataIndex: 'facultyName',
      key: 'facultyName',
      width: 170,
      render: (v) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>,
    },
    {
      title: 'QĐ tốt nghiệp',
      dataIndex: 'graduationDecision',
      key: 'graduationDecision',
      width: 130,
      render: (v) => <Text code style={{ fontSize: 12 }}>{v}</Text>,
    },
    { title: 'Ngày ký', dataIndex: 'graduationDate', key: 'graduationDate', width: 100 },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 170 },
    {
      title: 'H.thức KS',
      dataIndex: 'surveyMethod',
      key: 'surveyMethod',
      width: 120,
      render: (v) => {
        const colorMap: Record<string, string> = {
          Online: 'cyan',
          'Điện thoại': 'blue',
          Email: 'geekblue',
          'Phỏng vấn': 'purple',
        }
        return (
          <Tag color={colorMap[v] || 'default'} style={{ borderRadius: 20, fontSize: 11, margin: 0 }}>
            {v}
          </Tag>
        )
      },
    },
    {
      title: 'Phản hồi',
      dataIndex: 'responseStatus',
      key: 'responseStatus',
      width: 120,
      render: (v) => <Badge status={v === 'Đã phản hồi' ? 'success' : 'default'} text={<span style={{ fontSize: 12 }}>{v}</span>} />,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 200,
      render: (v) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>,
    },
  ]

  const responseColumns: ColumnsType<ResponseRow> = [
    {
      title: 'Sinh viên',
      key: 'student',
      fixed: 'left',
      width: 190,
      render: (_: unknown, r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{r.fullName}</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 2, alignItems: 'center' }}>
            <Text code style={{ fontSize: 11 }}>{r.studentCode}</Text>
            <Tag color={r.gender === 'Nam' ? 'blue' : 'pink'} style={{ borderRadius: 20, fontSize: 10, margin: 0, lineHeight: '16px', padding: '0 6px' }}>
              {r.gender}
            </Tag>
          </div>
        </div>
      ),
    },
    { title: 'Ngày sinh', dataIndex: 'birthDate', key: 'birthDate', width: 100 },
    { title: 'Ngành', dataIndex: 'majorName', key: 'majorName', width: 160 },
    {
      title: 'Khoa',
      dataIndex: 'facultyName',
      key: 'facultyName',
      width: 170,
      render: (v) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>,
    },
    {
      title: 'Việc làm',
      dataIndex: 'employmentStatus',
      key: 'employmentStatus',
      width: 140,
      render: (v) => {
        const cfg: Record<string, { color: string; bg: string; border: string }> = {
          'Có việc làm': { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
          'Tiếp tục học': { color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
          'Chưa có việc làm': { color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
        }
        const s = cfg[v] || { color: '#475569', bg: '#f8fafc', border: '#e2e8f0' }
        return (
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: s.color,
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: 20,
              padding: '2px 10px',
              display: 'inline-block',
            }}
          >
            {v}
          </span>
        )
      },
    },
    { title: 'Khu vực', dataIndex: 'workArea', key: 'workArea', width: 130 },
    { title: 'Tỉnh/TP', dataIndex: 'workProvince', key: 'workProvince', width: 100 },
    { title: 'TG tìm việc', dataIndex: 'jobFoundTime', key: 'jobFoundTime', width: 120 },
    { title: 'Kiến thức', dataIndex: 'knowledgeLevel', key: 'knowledgeLevel', width: 120 },
    {
      title: 'Lương KĐ',
      dataIndex: 'startingSalary',
      key: 'startingSalary',
      width: 110,
      render: (v) => <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{v}</span>,
    },
    { title: 'Thu nhập TB', dataIndex: 'averageIncome', key: 'averageIncome', width: 130 },
    { title: 'Tìm việc qua', dataIndex: 'jobSearchMethod', key: 'jobSearchMethod', width: 150 },
    { title: 'Tuyển dụng', dataIndex: 'recruitmentMethod', key: 'recruitmentMethod', width: 140 },
    {
      title: 'Kỹ năng mềm',
      dataIndex: 'softSkill',
      key: 'softSkill',
      width: 190,
      render: (v) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>,
    },
    {
      title: 'Khóa học thêm',
      dataIndex: 'extraCourse',
      key: 'extraCourse',
      width: 150,
      render: (v) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>,
    },
    {
      title: 'Đề xuất',
      dataIndex: 'proposal',
      key: 'proposal',
      width: 200,
      render: (v) => <span style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>{v}</span>,
    },
  ]

  const facultySubmissionColumns: ColumnsType<FacultySubmissionRow> = [
    {
      title: 'Khoa',
      key: 'faculty',
      fixed: 'left',
      width: 220,
      render: (_: unknown, row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{row.facultyName}</div>
          <div style={{ marginTop: 3 }}>
            <Text code style={{ fontSize: 11 }}>{row.facultyCode}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status) => <SubmissionPill status={status} />,
    },
    {
      title: 'Người nộp',
      dataIndex: 'submittedBy',
      key: 'submittedBy',
      width: 140,
      render: (v) => <span style={{ fontSize: 12, color: '#475569' }}>{v || '—'}</span>,
    },
    {
      title: 'Thời gian nộp',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      width: 140,
      render: (v) => <span style={{ fontSize: 12, color: '#475569' }}>{v || '—'}</span>,
    },
    { title: 'Hạn nộp', dataIndex: 'deadline', key: 'deadline', width: 110 },
    {
      title: 'SV TN',
      dataIndex: 'totalGraduates',
      key: 'totalGraduates',
      width: 90,
      render: (v) => <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{v}</span>,
    },
    {
      title: 'Phản hồi',
      dataIndex: 'totalResponses',
      key: 'totalResponses',
      width: 90,
      render: (v) => <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{v}</span>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 220,
      render: (v) => <span style={{ fontSize: 12, color: '#64748b' }}>{v || '—'}</span>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 220,
      render: (_: unknown, row) => (
        <Space wrap size={6}>
          <Button size="small">Xem báo cáo</Button>
          {row.status === 'submitted' && (
            <>
              <Button size="small" type="primary" onClick={() => updateFacultyStatus(row.key, 'approved', 'Đã duyệt')}>
                Duyệt
              </Button>
              <Button size="small" onClick={() => updateFacultyStatus(row.key, 'returned', 'Bổ sung ghi chú và dữ liệu thiếu')}>
                Trả bổ sung
              </Button>
            </>
          )}
          {row.status === 'returned' && (
            <Button size="small" onClick={() => updateFacultyStatus(row.key, 'submitted', 'Đã nộp lại sau bổ sung')}>
              Đánh dấu đã nộp lại
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const roleColor = ROLE_COLOR[currentUser.role]

  const exportMenu = {
    items: [
      { key: 'excel', label: 'Xuất Excel (.xlsx)', icon: <DownloadOutlined /> },
      { key: 'pdf', label: 'Xuất PDF', icon: <DownloadOutlined /> },
      { key: 'csv', label: 'Xuất CSV', icon: <DownloadOutlined /> },
    ],
    onClick: ({ key }: { key: string }) => messageApi.success(`Đã xuất ${key.toUpperCase()} — phạm vi: ${scopeLabel(currentUser)}`),
  }

  return (
    <AdminLayout>
      {contextHolder}

      <style>{`
        .rp-table .ant-table-thead > tr > th {
          background: #f8fafc !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          color: #64748b !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          border-bottom: 1px solid #e2e8f0 !important;
          padding: 10px 14px !important;
        }

        .rp-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9 !important;
          padding: 12px 14px !important;
          vertical-align: top !important;
        }

        .rp-table .ant-table-tbody > tr:hover > td {
          background: #f8fafc !important;
        }

        .rp-tabs .ant-tabs-tab {
          font-size: 13px !important;
          font-weight: 500 !important;
          padding: 10px 0 !important;
          color: #64748b !important;
        }

        .rp-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #0f172a !important;
          font-weight: 700 !important;
        }

        .rp-tabs .ant-tabs-ink-bar {
          background: #0f172a !important;
          height: 2px !important;
        }

        .rp-tabs .ant-tabs-nav {
          margin-bottom: 0 !important;
        }

        .rp-filter .ant-select-selector {
          border-radius: 8px !important;
          border-color: #e2e8f0 !important;
          font-size: 13px !important;
        }

        .rp-filter .ant-picker {
          border-radius: 8px !important;
          border-color: #e2e8f0 !important;
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #f1f5f9',
            borderRadius: 12,
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                fontSize: 20,
              }}
            >
              <BarChartOutlined />
            </div>

            <div>
              <Title level={4} style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>
                {isSchoolView ? 'Tổng hợp báo cáo cấp trường' : 'Báo cáo việc làm đơn vị'}
              </Title>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: roleColor.text,
                    background: roleColor.bg,
                    border: `1px solid ${roleColor.border}`,
                    borderRadius: 20,
                    padding: '1px 10px',
                  }}
                >
                  {ROLE_LABEL[currentUser.role]}
                </span>

                <span style={{ fontSize: 12, color: '#94a3b8' }}>·</span>

                <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <BankOutlined style={{ fontSize: 11 }} />
                  {scopeLabel(currentUser)}
                </span>

                <span style={{ fontSize: 12, color: '#94a3b8' }}>·</span>

                <span style={{ fontSize: 12, color: '#64748b' }}>
                  {isSchoolView ? 'Theo dõi các khoa nộp báo cáo lên trường' : 'Rà soát dữ liệu và nộp báo cáo lên trường'}
                </span>
              </div>
            </div>
          </div>

          <Space wrap size={8}>
            {isFacultyLikeView &&
              (submissionStatus === 'submitted' ? (
                <>
                  <SubmissionPill status={submissionStatus} />
                  <Button onClick={handleWithdrawSubmission} style={{ borderRadius: 8 }}>
                    Thu hồi
                  </Button>
                </>
              ) : submissionStatus === 'returned' ? (
                <>
                  <SubmissionPill status={submissionStatus} />
                  <Button type="primary" icon={<SendOutlined />} onClick={handleSubmitToSchool} style={{ borderRadius: 8 }}>
                    Nộp lại lên trường
                  </Button>
                </>
              ) : (
                <>
                  <SubmissionPill status={submissionStatus} />
                  <Button type="primary" icon={<SendOutlined />} onClick={handleSubmitToSchool} style={{ borderRadius: 8 }}>
                    Nộp báo cáo lên trường
                  </Button>
                </>
              ))}

            <Select
              value={userIndex}
              onChange={(v) => setUserIndex(Number(v))}
              style={{ width: 160 }}
              options={mockUsers.map((u, i) => ({ label: ROLE_LABEL[u.role], value: i }))}
            />

            <Select value={filters.surveyId} onChange={(v) => set('surveyId', v)} options={surveys} style={{ width: 230 }} />

            <Dropdown menu={exportMenu} placement="bottomRight">
              <Button icon={<DownloadOutlined />} style={{ borderRadius: 8, fontWeight: 500 }}>
                Xuất báo cáo
              </Button>
            </Dropdown>
          </Space>
        </div>

        {/* ── SUBMISSION KPI (school only) ─────────────────────────────── */}
        {isSchoolView && (
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} xl={6}>
              <StatCard
                label="Tổng số khoa"
                value={String(submissionStats.total)}
                sub="Đơn vị phải nộp"
                icon={<AuditOutlined />}
                accent="#2563eb"
                accentLight="#eff6ff"
                accentText="#1d4ed8"
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <StatCard
                label="Đã nộp"
                value={String(submissionStats.submitted)}
                sub="Đang chờ duyệt"
                icon={<SendOutlined />}
                accent="#7c3aed"
                accentLight="#f5f3ff"
                accentText="#6d28d9"
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <StatCard
                label="Cần bổ sung"
                value={String(submissionStats.returned)}
                sub="Cần khoa cập nhật"
                icon={<ExclamationCircleOutlined />}
                accent="#d97706"
                accentLight="#fffbeb"
                accentText="#b45309"
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <StatCard
                label="Đã duyệt"
                value={String(submissionStats.approved)}
                sub="Sẵn sàng tổng hợp"
                icon={<CheckCircleOutlined />}
                accent="#059669"
                accentLight="#f0fdf4"
                accentText="#15803d"
              />
            </Col>
          </Row>
        )}

        {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
        <Row gutter={[12, 12]}>
          {[
            {
              label: 'Tổng sinh viên TN',
              value: stats.totalGraduates.toLocaleString('vi-VN'),
              sub: 'Đợt khảo sát hiện tại',
              icon: <TeamOutlined />,
              accent: '#2563eb',
              accentLight: '#eff6ff',
              accentText: '#1d4ed8',
            },
            {
              label: 'Tổng phản hồi',
              value: stats.totalResponses.toLocaleString('vi-VN'),
              sub: `Tỷ lệ ${stats.responseRate}%`,
              icon: <FileSearchOutlined />,
              accent: '#7c3aed',
              accentLight: '#f5f3ff',
              accentText: '#6d28d9',
            },
            {
              label: 'Đã có việc làm',
              value: stats.employed.toLocaleString('vi-VN'),
              sub: `${stats.employmentRate}% trên phản hồi`,
              icon: <CheckCircleOutlined />,
              accent: '#059669',
              accentLight: '#f0fdf4',
              accentText: '#15803d',
            },
            {
              label: 'Làm đúng ngành',
              value: `${stats.correctMajorRate}%`,
              sub: 'Trên tổng phản hồi',
              icon: <PieChartOutlined />,
              accent: '#d97706',
              accentLight: '#fffbeb',
              accentText: '#b45309',
            },
          ].map((card) => (
            <Col xs={24} sm={12} xl={6} key={card.label}>
              <StatCard {...card} />
            </Col>
          ))}
        </Row>

        {/* ── FILTER PANEL ────────────────────────────────────────────────── */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #f1f5f9',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              cursor: 'pointer',
              borderBottom: filterOpen ? '1px solid #f1f5f9' : 'none',
            }}
            onClick={() => setFilterOpen((o) => !o)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FilterOutlined style={{ color: '#64748b', fontSize: 14 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Bộ lọc</span>
              {activeFilterCount > 1 && (
                <span
                  style={{
                    background: '#dbeafe',
                    color: '#1d4ed8',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '1px 8px',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  {activeFilterCount} đang hoạt động
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button
                size="small"
                type="text"
                icon={<ReloadOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  setFilters({ surveyId: '2026-1' })
                }}
                style={{ color: '#94a3b8', fontSize: 12 }}
              >
                Đặt lại
              </Button>

              {filterOpen ? <CaretUpOutlined style={{ color: '#94a3b8', fontSize: 11 }} /> : <CaretDownOutlined style={{ color: '#94a3b8', fontSize: 11 }} />}
            </div>
          </div>

          {filterOpen && (
            <div className="rp-filter" style={{ padding: '16px 20px' }}>
              <Row gutter={[10, 12]}>
                {[
                  {
                    label: 'Khoa',
                    node: (
                      <Select
                        value={effectiveFilters.facultyId}
                        options={faculties}
                        style={{ width: '100%' }}
                        placeholder="Tất cả khoa"
                        disabled={currentUser.scope !== 'school'}
                        allowClear
                        onChange={(v) => {
                          set('facultyId', v)
                          set('majorId', undefined)
                        }}
                      />
                    ),
                  },
                  {
                    label: 'Ngành',
                    node: (
                      <Select
                        value={effectiveFilters.majorId}
                        options={majorOptions}
                        style={{ width: '100%' }}
                        placeholder="Tất cả ngành"
                        disabled={currentUser.scope === 'major'}
                        allowClear
                        onChange={(v) => set('majorId', v)}
                      />
                    ),
                  },
                  {
                    label: 'Khóa tốt nghiệp',
                    node: (
                      <Select
                        value={filters.graduationYear}
                        options={graduationYears}
                        style={{ width: '100%' }}
                        placeholder="Tất cả"
                        allowClear
                        onChange={(v) => set('graduationYear', v)}
                      />
                    ),
                  },
                  {
                    label: 'Trạng thái phản hồi',
                    node: (
                      <Select
                        value={filters.responseStatus}
                        options={responseStatuses}
                        style={{ width: '100%' }}
                        placeholder="Tất cả"
                        allowClear
                        onChange={(v) => set('responseStatus', v)}
                      />
                    ),
                  },
                  {
                    label: 'Tình trạng việc làm',
                    node: (
                      <Select
                        value={filters.employmentStatus}
                        options={employmentStatuses}
                        style={{ width: '100%' }}
                        placeholder="Tất cả"
                        allowClear
                        onChange={(v) => set('employmentStatus', v)}
                      />
                    ),
                  },
                  {
                    label: 'Khu vực làm việc',
                    node: (
                      <Select
                        value={filters.workArea}
                        options={workAreas}
                        style={{ width: '100%' }}
                        placeholder="Tất cả"
                        allowClear
                        onChange={(v) => set('workArea', v)}
                      />
                    ),
                  },
                  {
                    label: 'Giới tính',
                    node: (
                      <Select
                        value={filters.gender}
                        options={genders}
                        style={{ width: '100%' }}
                        placeholder="Tất cả"
                        allowClear
                        onChange={(v) => set('gender', v)}
                      />
                    ),
                  },
                  {
                    label: 'Hình thức khảo sát',
                    node: (
                      <Select
                        value={filters.contactMethod}
                        options={contactMethods}
                        style={{ width: '100%' }}
                        placeholder="Tất cả"
                        allowClear
                        onChange={(v) => set('contactMethod', v)}
                      />
                    ),
                  },
                  {
                    label: 'Khoảng thời gian',
                    node: <RangePicker style={{ width: '100%' }} placeholder={['Từ ngày', 'Đến ngày']} />,
                  },
                ].map((f) => (
                  <Col xs={24} sm={12} md={8} xl={6} key={f.label}>
                    <FilterLabel>{f.label}</FilterLabel>
                    {f.node}
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>

        {/* ── DATA TABS ───────────────────────────────────────────────────── */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #f1f5f9',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <Tabs
            className="rp-tabs"
            activeKey={activeView}
            onChange={(k) => setActiveView(k as ViewMode)}
            style={{ padding: '0 20px' }}
            tabBarExtraContent={
              <Text style={{ fontSize: 12, color: '#94a3b8', paddingRight: 4 }}>
                Phạm vi: <Text strong style={{ color: '#374151', fontSize: 12 }}>{scopeLabel(currentUser)}</Text>
              </Text>
            }
            items={[
              ...(isSchoolView
                ? [
                    {
                      key: 'submission-progress',
                      label: (
                        <Space size={6}>
                          <AuditOutlined />
                          Tiến độ nộp khoa
                          <span
                            style={{
                              background: '#f1f5f9',
                              color: '#475569',
                              borderRadius: 20,
                              fontSize: 11,
                              padding: '0 7px',
                              fontWeight: 600,
                            }}
                          >
                            {facultySubmissionRows.length}
                          </span>
                        </Space>
                      ),
                      children: (
                        <div style={{ padding: '0 0 20px' }}>
                          <Table
                            className="rp-table"
                            rowKey="key"
                            columns={facultySubmissionColumns}
                            dataSource={facultySubmissionRows}
                            scroll={{ x: 1450 }}
                            pagination={false}
                          />
                        </div>
                      ),
                    },
                  ]
                : []),
              {
                key: 'overview',
                label: (
                  <Space size={6}>
                    <BarChartOutlined />
                    Tổng hợp theo ngành
                    <span
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        borderRadius: 20,
                        fontSize: 11,
                        padding: '0 7px',
                        fontWeight: 600,
                      }}
                    >
                      {filteredMajorSummary.length}
                    </span>
                  </Space>
                ),
                children: filteredMajorSummary.length ? (
                  <div style={{ padding: '0 0 20px' }}>
                    <Table
                      className="rp-table"
                      rowKey="key"
                      columns={overviewColumns}
                      dataSource={filteredMajorSummary}
                      pagination={false}
                      scroll={{ x: 1100 }}
                    />
                  </div>
                ) : (
                  <div style={{ padding: '48px 0' }}>
                    <Empty description={<span style={{ color: '#94a3b8', fontSize: 13 }}>Không có dữ liệu phù hợp bộ lọc</span>} />
                  </div>
                ),
              },
              {
                key: 'graduates',
                label: (
                  <Space size={6}>
                    <TeamOutlined />
                    Danh sách sinh viên
                    <span
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        borderRadius: 20,
                        fontSize: 11,
                        padding: '0 7px',
                        fontWeight: 600,
                      }}
                    >
                      {filteredGraduates.length}
                    </span>
                  </Space>
                ),
                children: filteredGraduates.length ? (
                  <div style={{ padding: '0 0 20px' }}>
                    <Table className="rp-table" rowKey="key" columns={graduateColumns} dataSource={filteredGraduates} scroll={{ x: 1600 }} />
                  </div>
                ) : (
                  <div style={{ padding: '48px 0' }}>
                    <Empty description={<span style={{ color: '#94a3b8', fontSize: 13 }}>Không có sinh viên phù hợp</span>} />
                  </div>
                ),
              },
              {
                key: 'responses',
                label: (
                  <Space size={6}>
                    <FileSearchOutlined />
                    Chi tiết phản hồi
                    <span
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        borderRadius: 20,
                        fontSize: 11,
                        padding: '0 7px',
                        fontWeight: 600,
                      }}
                    >
                      {filteredResponses.length}
                    </span>
                  </Space>
                ),
                children: filteredResponses.length ? (
                  <div style={{ padding: '0 0 20px' }}>
                    <Table className="rp-table" rowKey="key" columns={responseColumns} dataSource={filteredResponses} scroll={{ x: 2400 }} />
                  </div>
                ) : (
                  <div style={{ padding: '48px 0' }}>
                    <Empty description={<span style={{ color: '#94a3b8', fontSize: 13 }}>Không có phản hồi phù hợp</span>} />
                  </div>
                ),
              },
              {
                key: 'charts',
                label: (
                  <Space size={6}>
                    <PieChartOutlined />
                    Biểu đồ
                  </Space>
                ),
                children: (
                  <div style={{ padding: '20px 0 24px' }}>
                    <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
                      <Col xs={24} sm={8}>
                        <KpiRing label="Tỷ lệ phản hồi" value={stats.responseRate} color="#3b82f6" desc="Trên tổng sinh viên TN" />
                      </Col>
                      <Col xs={24} sm={8}>
                        <KpiRing label="Tỷ lệ có việc làm" value={stats.employmentRate} color="#22c55e" desc="Trên số đã phản hồi" />
                      </Col>
                      <Col xs={24} sm={8}>
                        <KpiRing label="Làm đúng ngành" value={stats.correctMajorRate} color="#f59e0b" desc="Trên tổng phản hồi" />
                      </Col>
                    </Row>

                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #f1f5f9',
                        borderRadius: 12,
                        padding: '20px 22px',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
                        Phân bổ tình trạng việc làm theo ngành
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {filteredMajorSummary.map((row) => (
                          <div key={row.key}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                marginBottom: 6,
                              }}
                            >
                              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{row.majorName}</span>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>{row.totalGraduates} SV</span>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                height: 10,
                                borderRadius: 5,
                                overflow: 'hidden',
                                background: '#f1f5f9',
                              }}
                            >
                              <Tooltip title={`Có việc làm: ${row.employed}`}>
                                <div style={{ width: `${(row.employed / row.totalGraduates) * 100}%`, background: '#22c55e', cursor: 'default' }} />
                              </Tooltip>
                              <Tooltip title={`Tiếp tục học: ${row.continuingStudy}`}>
                                <div style={{ width: `${(row.continuingStudy / row.totalGraduates) * 100}%`, background: '#60a5fa', cursor: 'default' }} />
                              </Tooltip>
                              <Tooltip title={`Chưa có việc: ${row.unemployed}`}>
                                <div style={{ width: `${(row.unemployed / row.totalGraduates) * 100}%`, background: '#fbbf24', cursor: 'default' }} />
                              </Tooltip>
                            </div>

                            <div style={{ display: 'flex', gap: 16, marginTop: 5, fontSize: 11, color: '#64748b' }}>
                              <span style={{ color: '#15803d' }}>● Việc làm {((row.employed / row.totalGraduates) * 100).toFixed(0)}%</span>
                              <span style={{ color: '#2563eb' }}>● HT {((row.continuingStudy / row.totalGraduates) * 100).toFixed(0)}%</span>
                              <span style={{ color: '#b45309' }}>● Chưa có {((row.unemployed / row.totalGraduates) * 100).toFixed(0)}%</span>
                              <span style={{ color: '#94a3b8', marginLeft: 'auto' }}>
                                Chưa PH: {row.totalGraduates - row.responses} (
                                {(((row.totalGraduates - row.responses) / row.totalGraduates) * 100).toFixed(0)}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
