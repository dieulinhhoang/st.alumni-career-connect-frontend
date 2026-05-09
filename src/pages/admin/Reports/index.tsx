import { useMemo, useState } from 'react'
import {
  BarChartOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  FileSearchOutlined,
  FilterOutlined,
  PieChartOutlined,
  ReloadOutlined,
  TeamOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Row,
  Segmented,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
  Tooltip,
  Divider,
  Badge,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AdminLayout from '../../../components/layout/AdminLayout'

const { RangePicker } = DatePicker
const { Title, Text, Paragraph } = Typography

type RoleScope = 'school' | 'faculty' | 'major'
type ViewMode = 'overview' | 'graduates' | 'responses' | 'charts'

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

const surveys: Option[] = [
  { value: '2025-1', label: 'Khảo sát việc làm 2025 - Đợt 1' },
  { value: '2025-2', label: 'Khảo sát việc làm 2025 - Đợt 2' },
  { value: '2026-1', label: 'Khảo sát việc làm 2026 - Đợt 1' },
]

const faculties = [
  { value: 'cntt', label: 'Khoa Công nghệ thông tin' },
  { value: 'ktptnt', label: 'Khoa Kinh tế và PTNT' },
  { value: 'cokhi', label: 'Khoa Cơ khí' },
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
  { key: '1', majorCode: '7480201', majorName: 'Khoa học dữ liệu', facultyName: 'Khoa Công nghệ thông tin', totalGraduates: 180, responses: 150, employed: 118, continuingStudy: 17, unemployed: 15, correctMajor: 92, relatedMajor: 19, unrelatedMajor: 7, publicArea: 15, privateArea: 92, selfEmployed: 11, workProvince: 'Hà Nội, Bắc Ninh, TP.HCM' },
  { key: '2', majorCode: '7480104', majorName: 'Hệ thống thông tin', facultyName: 'Khoa Công nghệ thông tin', totalGraduates: 160, responses: 132, employed: 101, continuingStudy: 14, unemployed: 17, correctMajor: 79, relatedMajor: 15, unrelatedMajor: 7, publicArea: 12, privateArea: 81, selfEmployed: 8, workProvince: 'Hà Nội, Đà Nẵng, Hải Phòng' },
  { key: '3', majorCode: '7620115', majorName: 'Kinh tế nông nghiệp', facultyName: 'Khoa Kinh tế và PTNT', totalGraduates: 145, responses: 117, employed: 83, continuingStudy: 18, unemployed: 16, correctMajor: 60, relatedMajor: 17, unrelatedMajor: 6, publicArea: 20, privateArea: 51, selfEmployed: 12, workProvince: 'Hà Nội, Hưng Yên, Nam Định' },
  { key: '4', majorCode: '7510201', majorName: 'Cơ khí chế tạo', facultyName: 'Khoa Cơ khí', totalGraduates: 125, responses: 96, employed: 70, continuingStudy: 10, unemployed: 16, correctMajor: 54, relatedMajor: 11, unrelatedMajor: 5, publicArea: 14, privateArea: 46, selfEmployed: 10, workProvince: 'Hà Nội, Hải Dương, Bắc Giang' },
]

const graduateSeed: GraduateRow[] = [
  { key: 'g1', studentCode: 'SV001', fullName: 'Nguyễn Minh Anh', gender: 'Nữ', citizenId: '001204000111', majorCode: '7480201', majorName: 'Khoa học dữ liệu', facultyName: 'Khoa Công nghệ thông tin', graduationDecision: 'QĐ-2025-11', graduationDate: '21/06/2025', phone: '0988123123', email: 'anhnm@demo.vn', surveyMethod: 'Online', responseStatus: 'Đã phản hồi', note: 'Đúng ngành' },
  { key: 'g2', studentCode: 'SV002', fullName: 'Trần Quang Huy', gender: 'Nam', citizenId: '001204000222', majorCode: '7480104', majorName: 'Hệ thống thông tin', facultyName: 'Khoa Công nghệ thông tin', graduationDecision: 'QĐ-2025-11', graduationDate: '21/06/2025', phone: '0977000111', email: 'huytq@demo.vn', surveyMethod: 'Điện thoại', responseStatus: 'Đã phản hồi', note: 'Làm tại doanh nghiệp tư nhân' },
  { key: 'g3', studentCode: 'SV003', fullName: 'Lê Thu Trang', gender: 'Nữ', citizenId: '001204000333', majorCode: '7620115', majorName: 'Kinh tế nông nghiệp', facultyName: 'Khoa Kinh tế và PTNT', graduationDecision: 'QĐ-2025-09', graduationDate: '18/06/2025', phone: '0911222333', email: 'tranglt@demo.vn', surveyMethod: 'Email', responseStatus: 'Chưa phản hồi', note: 'Chờ bổ sung số điện thoại' },
  { key: 'g4', studentCode: 'SV004', fullName: 'Phạm Văn Nam', gender: 'Nam', citizenId: '001204000444', majorCode: '7510201', majorName: 'Cơ khí chế tạo', facultyName: 'Khoa Cơ khí', graduationDecision: 'QĐ-2025-07', graduationDate: '15/06/2025', phone: '0933444555', email: 'nampv@demo.vn', surveyMethod: 'Phỏng vấn', responseStatus: 'Đã phản hồi', note: 'Tự tạo việc làm' },
]

const responseSeed: ResponseRow[] = [
  { key: 'r1', studentCode: 'SV001', fullName: 'Nguyễn Minh Anh', birthDate: '14/10/2003', gender: 'Nữ', citizenId: '001204000111', majorCode: '7480201', majorName: 'Khoa học dữ liệu', facultyName: 'Khoa Công nghệ thông tin', phone: '0988123123', employmentStatus: 'Có việc làm', workArea: 'Tư nhân', workProvince: 'Hà Nội', jobFoundTime: 'Dưới 3 tháng', knowledgeLevel: 'Đã học được', startingSalary: '11 triệu', averageIncome: 'Từ 10-15 triệu', jobSearchMethod: 'Bạn bè giới thiệu', recruitmentMethod: 'Phỏng vấn trực tiếp', softSkill: 'Giao tiếp, làm việc nhóm', extraCourse: 'Power BI, Dữ liệu', proposal: 'Tăng thực hành doanh nghiệp' },
  { key: 'r2', studentCode: 'SV002', fullName: 'Trần Quang Huy', birthDate: '08/05/2003', gender: 'Nam', citizenId: '001204000222', majorCode: '7480104', majorName: 'Hệ thống thông tin', facultyName: 'Khoa Công nghệ thông tin', phone: '0977000111', employmentStatus: 'Có việc làm', workArea: 'Tư nhân', workProvince: 'Đà Nẵng', jobFoundTime: '3-6 tháng', knowledgeLevel: 'Một phần', startingSalary: '9 triệu', averageIncome: 'Từ 5-10 triệu', jobSearchMethod: 'Online', recruitmentMethod: 'Thi tuyển', softSkill: 'Thuyết trình, quản lý', extraCourse: 'BA, SQL', proposal: 'Tăng kỹ năng nghề nghiệp' },
  { key: 'r3', studentCode: 'SV003', fullName: 'Lê Thu Trang', birthDate: '01/12/2002', gender: 'Nữ', citizenId: '001204000333', majorCode: '7620115', majorName: 'Kinh tế nông nghiệp', facultyName: 'Khoa Kinh tế và PTNT', phone: '0911222333', employmentStatus: 'Tiếp tục học', workArea: 'Nhà nước', workProvince: 'Hà Nội', jobFoundTime: '6-12 tháng', knowledgeLevel: 'Đã học được', startingSalary: '—', averageIncome: '—', jobSearchMethod: 'Khoa giới thiệu', recruitmentMethod: 'Xét hồ sơ', softSkill: 'Phân tích, nhóm', extraCourse: 'Nghiên cứu KH', proposal: 'Liên kết học sau TN' },
  { key: 'r4', studentCode: 'SV004', fullName: 'Phạm Văn Nam', birthDate: '24/03/2003', gender: 'Nam', citizenId: '001204000444', majorCode: '7510201', majorName: 'Cơ khí chế tạo', facultyName: 'Khoa Cơ khí', phone: '0933444555', employmentStatus: 'Có việc làm', workArea: 'Tự tạo việc làm', workProvince: 'Bắc Giang', jobFoundTime: '3-6 tháng', knowledgeLevel: 'Một phần', startingSalary: '13 triệu', averageIncome: 'Từ 10-15 triệu', jobSearchMethod: 'Người quen', recruitmentMethod: 'Tự tạo', softSkill: 'Đàm phán, tài chính', extraCourse: 'CAD/CAM', proposal: 'Kết nối xưởng TH' },
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
}

function scopeLabel(user: UserProfile) {
  if (user.scope === 'school') return 'Toàn trường'
  if (user.scope === 'faculty') return user.facultyName || 'Theo khoa'
  return `${user.facultyName} / ${user.majorName}`
}

const ROLE_COLOR: Record<string, string> = {
  SUPER_ADMIN: '#7f5af0',
  SCHOOL_ADMIN: '#3b82f6',
  FACULTY_OFFICER: '#10b981',
  MAJOR_OFFICER: '#f59e0b',
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  SCHOOL_ADMIN: 'Quản trị trường',
  FACULTY_OFFICER: 'Cán bộ khoa',
  MAJOR_OFFICER: 'Cán bộ ngành',
}

const statCards = (
  totalGraduates: number,
  totalResponses: number,
  responseRate: string,
  employmentRate: string
) => [
  {
    label: 'Tổng sinh viên TN',
    value: totalGraduates.toLocaleString(),
    icon: <TeamOutlined />,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    sub: 'Đợt khảo sát hiện tại',
  },
  {
    label: 'Tổng phản hồi',
    value: totalResponses.toLocaleString(),
    icon: <FileSearchOutlined />,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    sub: 'Số phiếu hợp lệ',
  },
  {
    label: 'Tỷ lệ phản hồi',
    value: `${responseRate}%`,
    icon: <PieChartOutlined />,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    sub: 'Trên tổng sinh viên',
  },
  {
    label: 'Tỷ lệ có việc làm',
    value: `${employmentRate}%`,
    icon: <CheckCircleOutlined />,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    sub: 'Trên số phản hồi',
  },
]

export default function ReportsPage() {
  const [messageApi, contextHolder] = message.useMessage()
  const [userIndex, setUserIndex] = useState(0)
  const [activeView, setActiveView] = useState<ViewMode>('overview')
  const [filters, setFilters] = useState<FilterState>({ surveyId: '2026-1' })
  const [filterOpen, setFilterOpen] = useState(true)
  const currentUser = mockUsers[userIndex]

  const majorOptions = useMemo(() => {
    const fid = currentUser.scope !== 'school' ? currentUser.facultyId : filters.facultyId
    return fid ? majorMap[fid] || [] : Object.values(majorMap).flat()
  }, [currentUser, filters.facultyId])

  const effectiveFilters = useMemo(() => {
    const next = { ...filters }
    if (currentUser.scope === 'faculty') { next.facultyId = currentUser.facultyId; next.majorId = undefined }
    if (currentUser.scope === 'major') { next.facultyId = currentUser.facultyId; next.majorId = currentUser.majorId }
    return next
  }, [currentUser, filters])

  const filteredMajorSummary = useMemo(() =>
    majorSummarySeed.filter((item) => {
      const fid = facultyNameToOption[item.facultyName]
      const mid = majorNameToOption[item.majorName]
      if (effectiveFilters.facultyId && fid !== effectiveFilters.facultyId) return false
      if (effectiveFilters.majorId && mid !== effectiveFilters.majorId) return false
      return true
    }), [effectiveFilters])

  const filteredGraduates = useMemo(() =>
    graduateSeed.filter((item) => {
      const fid = facultyNameToOption[item.facultyName]
      const mid = majorNameToOption[item.majorName]
      if (effectiveFilters.facultyId && fid !== effectiveFilters.facultyId) return false
      if (effectiveFilters.majorId && mid !== effectiveFilters.majorId) return false
      if (effectiveFilters.gender && item.gender !== genders.find(g => g.value === effectiveFilters.gender)?.label) return false
      if (effectiveFilters.responseStatus) {
        const lbl = responseStatuses.find(s => s.value === effectiveFilters.responseStatus)?.label
        if (item.responseStatus !== lbl) return false
      }
      if (effectiveFilters.contactMethod) {
        const lbl = contactMethods.find(s => s.value === effectiveFilters.contactMethod)?.label
        if (item.surveyMethod !== lbl) return false
      }
      return true
    }), [effectiveFilters])

  const filteredResponses = useMemo(() =>
    responseSeed.filter((item) => {
      const fid = facultyNameToOption[item.facultyName]
      const mid = majorNameToOption[item.majorName]
      if (effectiveFilters.facultyId && fid !== effectiveFilters.facultyId) return false
      if (effectiveFilters.majorId && mid !== effectiveFilters.majorId) return false
      if (effectiveFilters.gender && item.gender !== genders.find(g => g.value === effectiveFilters.gender)?.label) return false
      if (effectiveFilters.employmentStatus) {
        const lbl = employmentStatuses.find(s => s.value === effectiveFilters.employmentStatus)?.label
        if (item.employmentStatus !== lbl) return false
      }
      if (effectiveFilters.workArea) {
        const lbl = workAreas.find(s => s.value === effectiveFilters.workArea)?.label
        if (item.workArea !== lbl) return false
      }
      return true
    }), [effectiveFilters])

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

  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) =>
    setFilters(prev => ({ ...prev, [k]: v }))

  const overviewColumns: ColumnsType<MajorSummaryRow> = [
    { title: 'Mã ngành', dataIndex: 'majorCode', key: 'majorCode', fixed: 'left', width: 110, render: (v: string) => <Text code style={{ fontSize: 12 }}>{v}</Text> },
    { title: 'Tên ngành', dataIndex: 'majorName', key: 'majorName', fixed: 'left', width: 180, render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Khoa', dataIndex: 'facultyName', key: 'facultyName', width: 180 },
    { title: 'SV TN', dataIndex: 'totalGraduates', key: 'totalGraduates', align: 'right', width: 90, render: (v: number) => <Text strong>{v}</Text> },
    { title: 'Phản hồi', dataIndex: 'responses', key: 'responses', align: 'right', width: 90, render: (v: number, r: MajorSummaryRow) => <><Text>{v}</Text><br/><Text type="secondary" style={{fontSize:11}}>{((v/r.totalGraduates)*100).toFixed(0)}%</Text></> },
    { title: 'Việc làm', dataIndex: 'employed', key: 'employed', align: 'right', width: 90, render: (v: number) => <Tag color="green">{v}</Tag> },
    { title: 'Tiếp tục HT', dataIndex: 'continuingStudy', key: 'continuingStudy', align: 'right', width: 100, render: (v: number) => <Tag color="blue">{v}</Tag> },
    { title: 'Chưa có VL', dataIndex: 'unemployed', key: 'unemployed', align: 'right', width: 100, render: (v: number) => <Tag color="orange">{v}</Tag> },
    { title: 'Đúng ngành', dataIndex: 'correctMajor', key: 'correctMajor', align: 'right', width: 100 },
    { title: 'Liên quan', dataIndex: 'relatedMajor', key: 'relatedMajor', align: 'right', width: 90 },
    { title: 'Không LQ', dataIndex: 'unrelatedMajor', key: 'unrelatedMajor', align: 'right', width: 90 },
    { title: 'Nhà nước', dataIndex: 'publicArea', key: 'publicArea', align: 'right', width: 90 },
    { title: 'Tư nhân', dataIndex: 'privateArea', key: 'privateArea', align: 'right', width: 90 },
    { title: 'Tự tạo', dataIndex: 'selfEmployed', key: 'selfEmployed', align: 'right', width: 80 },
    { title: 'Nơi làm việc', dataIndex: 'workProvince', key: 'workProvince', width: 200 },
  ]

  const graduateColumns: ColumnsType<GraduateRow> = [
    { title: 'Mã SV', dataIndex: 'studentCode', key: 'studentCode', fixed: 'left', width: 100, render: (v: string) => <Text code style={{fontSize:12}}>{v}</Text> },
    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName', fixed: 'left', width: 160, render: (v: string) => <Text strong>{v}</Text> },
    { title: 'GT', dataIndex: 'gender', key: 'gender', width: 60, render: (v: string) => <Tag color={v === 'Nam' ? 'blue' : 'pink'} style={{fontSize:11}}>{v}</Tag> },
    { title: 'CCCD', dataIndex: 'citizenId', key: 'citizenId', width: 140 },
    { title: 'Ngành', dataIndex: 'majorName', key: 'majorName', width: 170 },
    { title: 'Khoa', dataIndex: 'facultyName', key: 'facultyName', width: 170 },
    { title: 'QĐ TN', dataIndex: 'graduationDecision', key: 'graduationDecision', width: 120 },
    { title: 'Ngày ký', dataIndex: 'graduationDate', key: 'graduationDate', width: 100 },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 170 },
    { title: 'H.thức KS', dataIndex: 'surveyMethod', key: 'surveyMethod', width: 120 },
    { title: 'Phản hồi', dataIndex: 'responseStatus', key: 'responseStatus', width: 120, render: (v: string) => <Badge status={v === 'Đã phản hồi' ? 'success' : 'default'} text={v} /> },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', width: 200 },
  ]

  const responseColumns: ColumnsType<ResponseRow> = [
    { title: 'Mã SV', dataIndex: 'studentCode', key: 'studentCode', fixed: 'left', width: 100, render: (v: string) => <Text code style={{fontSize:12}}>{v}</Text> },
    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName', fixed: 'left', width: 160, render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Ngày sinh', dataIndex: 'birthDate', key: 'birthDate', width: 100 },
    { title: 'GT', dataIndex: 'gender', key: 'gender', width: 60, render: (v: string) => <Tag color={v === 'Nam' ? 'blue' : 'pink'} style={{fontSize:11}}>{v}</Tag> },
    { title: 'Ngành', dataIndex: 'majorName', key: 'majorName', width: 170 },
    { title: 'Khoa', dataIndex: 'facultyName', key: 'facultyName', width: 170 },
    { title: 'Việc làm', dataIndex: 'employmentStatus', key: 'employmentStatus', width: 130,
      render: (v: string) => {
        const map: Record<string, string> = { 'Có việc làm': 'green', 'Tiếp tục học': 'blue', 'Chưa có việc làm': 'orange' }
        return <Tag color={map[v] || 'default'}>{v}</Tag>
      }
    },
    { title: 'Khu vực', dataIndex: 'workArea', key: 'workArea', width: 130 },
    { title: 'Tỉnh/TP', dataIndex: 'workProvince', key: 'workProvince', width: 110 },
    { title: 'TG tìm việc', dataIndex: 'jobFoundTime', key: 'jobFoundTime', width: 130 },
    { title: 'Kiến thức', dataIndex: 'knowledgeLevel', key: 'knowledgeLevel', width: 130 },
    { title: 'Lương KĐ', dataIndex: 'startingSalary', key: 'startingSalary', width: 110 },
    { title: 'Thu nhập', dataIndex: 'averageIncome', key: 'averageIncome', width: 130 },
    { title: 'Tìm việc', dataIndex: 'jobSearchMethod', key: 'jobSearchMethod', width: 150 },
    { title: 'Tuyển dụng', dataIndex: 'recruitmentMethod', key: 'recruitmentMethod', width: 140 },
    { title: 'Kỹ năng mềm', dataIndex: 'softSkill', key: 'softSkill', width: 190 },
    { title: 'Khóa học', dataIndex: 'extraCourse', key: 'extraCourse', width: 150 },
    { title: 'Đề xuất', dataIndex: 'proposal', key: 'proposal', width: 200 },
  ]

  const cards = statCards(stats.totalGraduates, stats.totalResponses, stats.responseRate, stats.employmentRate)

  return (
    <AdminLayout>
      {contextHolder}

      <style>{`
        .reports-page .stat-card {
          border-radius: 16px;
          border: none;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .reports-page .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important;
        }
        .reports-page .filter-card .ant-card-body { padding: 16px 20px; }
        .reports-page .ant-tabs-nav { margin-bottom: 0; }
        .reports-page .ant-tabs-tab { font-weight: 600; padding: 10px 16px; }
        .reports-page .ant-table-thead > tr > th {
          background: #f8fafc !important;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .reports-page .ant-table-tbody > tr:hover > td { background: #f5f3ff !important; }
        .reports-page .role-switcher .ant-segmented-item-selected {
          background: #7f5af0 !important;
          color: #fff !important;
          border-radius: 8px !important;
        }
        .reports-page .ant-table-summary > tr > td { background: #f0fdf4 !important; font-weight: 700; }
      `}</style>

      <div className="reports-page" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── PAGE HEADER ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4c1d95 100%)',
          borderRadius: 16,
          padding: '28px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BarChartOutlined style={{ fontSize: 18, color: '#fff' }} />
              </div>
              <Title level={3} style={{ margin: 0, color: '#fff', fontWeight: 800 }}>
                Báo cáo việc làm sau tốt nghiệp
              </Title>
            </div>
            <Paragraph style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
              Dữ liệu được lọc theo phạm vi phân quyền — cập nhật thời gian thực khi nối API
            </Paragraph>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Tag style={{ background: 'rgba(255,255,255,0.12)', border: 'none', color: '#c4b5fd', borderRadius: 20, fontSize: 12, padding: '2px 10px' }}>
                Mock API
              </Tag>
              <Tag style={{ background: `${ROLE_COLOR[currentUser.role]}33`, border: `1px solid ${ROLE_COLOR[currentUser.role]}66`, color: '#e9d5ff', borderRadius: 20, fontSize: 12, padding: '2px 10px' }}>
                {ROLE_LABEL[currentUser.role]}
              </Tag>
              <Tag style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: 20, fontSize: 12, padding: '2px 10px' }}>
                {scopeLabel(currentUser)}
              </Tag>
            </div>
          </div>

          <Space wrap>
            <Segmented
              className="role-switcher"
              value={userIndex}
              onChange={v => setUserIndex(Number(v))}
              style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10 }}
              options={mockUsers.map((u, i) => ({ label: <span style={{ fontSize: 12, color: '#e0e7ff' }}>{ROLE_LABEL[u.role]}</span>, value: i }))}
            />
            <Tooltip title="Xuất báo cáo Excel">
              <Button
                icon={<DownloadOutlined />}
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: 8 }}
                onClick={() => messageApi.success(`Đã xuất Excel — phạm vi: ${scopeLabel(currentUser)}`)}
              >
                Excel
              </Button>
            </Tooltip>
            <Tooltip title="Xuất báo cáo PDF">
              <Button
                icon={<DownloadOutlined />}
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: 8 }}
                onClick={() => messageApi.success(`Đã xuất PDF — phạm vi: ${scopeLabel(currentUser)}`)}
              >
                PDF
              </Button>
            </Tooltip>
          </Space>
        </div>

        {/* ── STAT CARDS ── */}
        <Row gutter={[16, 16]}>
          {cards.map((c) => (
            <Col xs={24} sm={12} xl={6} key={c.label}>
              <Card className="stat-card" bodyStyle={{ padding: 0 }} style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                <div style={{ background: c.gradient, padding: '20px 22px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {c.label}
                      </Text>
                      <div style={{ fontSize: 34, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginTop: 6 }}>
                        {c.value}
                      </div>
                    </div>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 20, color: '#fff' }}>{c.icon}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12 }}>
                    <RiseOutlined style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }} />
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{c.sub}</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ── FILTER PANEL ── */}
        <Card
          className="filter-card"
          style={{ borderRadius: 12, border: '1px solid #e8e8f0' }}
          title={
            <Space>
              <FilterOutlined style={{ color: '#7f5af0' }} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>Bộ lọc</span>
              {Object.values(effectiveFilters).filter(Boolean).length > 1 && (
                <Tag color="purple" style={{ borderRadius: 20, fontSize: 11 }}>
                  {Object.values(effectiveFilters).filter(Boolean).length} đang hoạt động
                </Tag>
              )}
            </Space>
          }
          extra={
            <Space size={6}>
              <Button
                size="small"
                type="text"
                icon={filterOpen ? <span style={{fontSize:10}}>▲</span> : <span style={{fontSize:10}}>▼</span>}
                onClick={() => setFilterOpen(o => !o)}
                style={{ color: '#9ca3af' }}
              >
                {filterOpen ? 'Ẩn' : 'Mở'}
              </Button>
              <Divider type="vertical" />
              <Button
                size="small" type="text"
                icon={<ReloadOutlined />}
                onClick={() => setFilters({ surveyId: '2026-1' })}
                style={{ color: '#7f5af0' }}
              >
                Đặt lại
              </Button>
            </Space>
          }
        >
          {filterOpen && (
            <Row gutter={[10, 10]}>
              <Col xs={24} sm={12} md={8} xl={6}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Đợt khảo sát</div>
                <Select value={filters.surveyId} options={surveys} style={{ width: '100%' }} onChange={v => set('surveyId', v)} />
              </Col>
              <Col xs={24} sm={12} md={8} xl={6}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Khoa</div>
                <Select value={effectiveFilters.facultyId} options={faculties} style={{ width: '100%' }} placeholder="Tất cả khoa" disabled={currentUser.scope !== 'school'} allowClear onChange={v => { set('facultyId', v); set('majorId', undefined) }} />
              </Col>
              <Col xs={24} sm={12} md={8} xl={6}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ngành</div>
                <Select value={effectiveFilters.majorId} options={majorOptions} style={{ width: '100%' }} placeholder="Tất cả ngành" disabled={currentUser.scope === 'major'} allowClear onChange={v => set('majorId', v)} />
              </Col>
              <Col xs={24} sm={12} md={8} xl={6}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Khóa TN</div>
                <Select value={filters.graduationYear} options={graduationYears} style={{ width: '100%' }} placeholder="Tất cả" allowClear onChange={v => set('graduationYear', v)} />
              </Col>
              <Col xs={24} sm={12} md={8} xl={6}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phản hồi</div>
                <Select value={filters.responseStatus} options={responseStatuses} style={{ width: '100%' }} placeholder="Tất cả" allowClear onChange={v => set('responseStatus', v)} />
              </Col>
              <Col xs={24} sm={12} md={8} xl={6}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Việc làm</div>
                <Select value={filters.employmentStatus} options={employmentStatuses} style={{ width: '100%' }} placeholder="Tất cả" allowClear onChange={v => set('employmentStatus', v)} />
              </Col>
              <Col xs={24} sm={12} md={8} xl={6}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Khu vực</div>
                <Select value={filters.workArea} options={workAreas} style={{ width: '100%' }} placeholder="Tất cả" allowClear onChange={v => set('workArea', v)} />
              </Col>
              <Col xs={24} sm={12} md={8} xl={6}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Giới tính</div>
                <Select value={filters.gender} options={genders} style={{ width: '100%' }} placeholder="Tất cả" allowClear onChange={v => set('gender', v)} />
              </Col>
              <Col xs={24} sm={12} md={8} xl={6}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>H.thức KS</div>
                <Select value={filters.contactMethod} options={contactMethods} style={{ width: '100%' }} placeholder="Tất cả" allowClear onChange={v => set('contactMethod', v)} />
              </Col>
              <Col xs={24} sm={12} md={8} xl={6}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Khoảng thời gian</div>
                <RangePicker style={{ width: '100%' }} placeholder={['Từ ngày', 'Đến ngày']} />
              </Col>
            </Row>
          )}
        </Card>

        {/* ── DATA TABS ── */}
        <Card style={{ borderRadius: 12, border: '1px solid #e8e8f0', padding: 0 }} bodyStyle={{ padding: '0 0 0 0' }}>
          <Tabs
            activeKey={activeView}
            onChange={k => setActiveView(k as ViewMode)}
            style={{ padding: '0 20px' }}
            tabBarExtraContent={
              <Text type="secondary" style={{ fontSize: 12, paddingRight: 4 }}>
                Phạm vi: <Text strong style={{ color: '#7f5af0' }}>{scopeLabel(currentUser)}</Text>
              </Text>
            }
            items={[
              {
                key: 'overview',
                label: (
                  <Space size={5}>
                    <BarChartOutlined />
                    Tổng hợp
                    <Tag style={{ margin: 0, borderRadius: 20, fontSize: 11 }}>{filteredMajorSummary.length}</Tag>
                  </Space>
                ),
                children: filteredMajorSummary.length ? (
                  <div style={{ padding: '0 0 16px' }}>
                    <Table
                      rowKey="key"
                      columns={overviewColumns}
                      dataSource={filteredMajorSummary}
                      pagination={false}
                      scroll={{ x: 1700 }}
                      rowClassName={() => 'report-row'}
                      summary={() => (
                        <Table.Summary fixed>
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><Text strong>TỔNG</Text></Table.Summary.Cell>
                            <Table.Summary.Cell index={1} colSpan={2}><Text type="secondary">{scopeLabel(currentUser)}</Text></Table.Summary.Cell>
                            <Table.Summary.Cell index={3} align="right"><Text strong>{stats.totalGraduates}</Text></Table.Summary.Cell>
                            <Table.Summary.Cell index={4} align="right"><Text strong>{stats.totalResponses}</Text></Table.Summary.Cell>
                            <Table.Summary.Cell index={5} align="right"><Tag color="green">{stats.employed}</Tag></Table.Summary.Cell>
                            <Table.Summary.Cell index={6} />
                            <Table.Summary.Cell index={7} />
                            <Table.Summary.Cell index={8} />
                            <Table.Summary.Cell index={9} />
                            <Table.Summary.Cell index={10} />
                            <Table.Summary.Cell index={11} />
                            <Table.Summary.Cell index={12} />
                            <Table.Summary.Cell index={13} />
                            <Table.Summary.Cell index={14} />
                          </Table.Summary.Row>
                        </Table.Summary>
                      )}
                    />
                  </div>
                ) : <div style={{ padding: 32 }}><Empty description="Không có dữ liệu phù hợp bộ lọc" /></div>,
              },
              {
                key: 'graduates',
                label: (
                  <Space size={5}>
                    <TeamOutlined />
                    Sinh viên
                    <Tag style={{ margin: 0, borderRadius: 20, fontSize: 11 }}>{filteredGraduates.length}</Tag>
                  </Space>
                ),
                children: filteredGraduates.length ? (
                  <div style={{ padding: '0 0 16px' }}>
                    <Table rowKey="key" columns={graduateColumns} dataSource={filteredGraduates} scroll={{ x: 1600 }} />
                  </div>
                ) : <div style={{ padding: 32 }}><Empty description="Không có sinh viên phù hợp" /></div>,
              },
              {
                key: 'responses',
                label: (
                  <Space size={5}>
                    <FileSearchOutlined />
                    Phản hồi
                    <Tag style={{ margin: 0, borderRadius: 20, fontSize: 11 }}>{filteredResponses.length}</Tag>
                  </Space>
                ),
                children: filteredResponses.length ? (
                  <div style={{ padding: '0 0 16px' }}>
                    <Table rowKey="key" columns={responseColumns} dataSource={filteredResponses} scroll={{ x: 2600 }} />
                  </div>
                ) : <div style={{ padding: 32 }}><Empty description="Không có phản hồi phù hợp" /></div>,
              },
              {
                key: 'charts',
                label: (
                  <Space size={5}>
                    <PieChartOutlined />
                    Biểu đồ
                  </Space>
                ),
                children: (
                  <div style={{ padding: '16px 0 24px' }}>
                    <Row gutter={[16, 16]}>
                      {[
                        { label: 'Tỷ lệ phản hồi', value: `${stats.responseRate}%`, color: '#4facfe', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', desc: 'Trên tổng sinh viên TN' },
                        { label: 'Tỷ lệ việc làm', value: `${stats.employmentRate}%`, color: '#43e97b', bg: 'linear-gradient(135deg,#43e97b,#38f9d7)', desc: 'Trên số đã phản hồi' },
                        { label: 'Tỷ lệ đúng ngành', value: `${stats.correctMajorRate}%`, color: '#a78bfa', bg: 'linear-gradient(135deg,#a78bfa,#7c3aed)', desc: 'Ưm tính từ tổng hợp' },
                      ].map(item => (
                        <Col xs={24} md={8} key={item.label}>
                          <Card style={{ borderRadius: 14, border: 'none', background: item.bg, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} bodyStyle={{ padding: '24px 28px' }}>
                            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</Text>
                            <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '10px 0 6px' }}>{item.value}</div>
                            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>{item.desc}</Text>
                          </Card>
                        </Col>
                      ))}
                      <Col span={24}>
                        <Card style={{ borderRadius: 12, border: '1px dashed #d1d5db', background: '#fafafa' }} bodyStyle={{ padding: '20px 24px' }}>
                          <Space align="start">
                            <BarChartOutlined style={{ fontSize: 22, color: '#9ca3af', marginTop: 2 }} />
                            <div>
                              <Text strong style={{ color: '#374151' }}>Biểu đồ đầy đủ sẽ được cài ở phase tới</Text>
                              <Paragraph style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: 13 }}>
                                Reuse chart pattern từ màn Thống kê hiện có — cột phân phối việc làm, biểu đồ tròn khu vực, xu hướng theo đợt khảo sát.
                              </Paragraph>
                            </div>
                          </Space>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                ),
              },
            ]}
          />
        </Card>

        {/* ── DEBUG PAYLOAD ── */}
        <Card
          style={{ borderRadius: 12, border: '1px solid #e8e8f0', background: '#1e1b4b' }}
          bodyStyle={{ padding: '14px 18px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Payload mock → API</Text>
            <Tag style={{ background: '#312e81', border: '1px solid #4c1d95', color: '#c4b5fd', borderRadius: 20, fontSize: 10 }}>dev only</Tag>
          </div>
          <pre style={{ margin: 0, fontSize: 12, color: '#e0e7ff', fontFamily: 'ui-monospace, monospace', lineHeight: 1.6, overflowX: 'auto' }}>
            {JSON.stringify({ role: currentUser.role, scope: currentUser.scope, filters: effectiveFilters }, null, 2)}
          </pre>
        </Card>

      </div>
    </AdminLayout>
  )
}
