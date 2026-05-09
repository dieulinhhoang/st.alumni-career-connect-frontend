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
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Row,
  Segmented,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AdminLayout from '../../../components/layout/AdminLayout'

const { RangePicker } = DatePicker
const { Title, Paragraph, Text } = Typography

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
  {
    role: 'FACULTY_OFFICER',
    scope: 'faculty',
    facultyId: 'cntt',
    facultyName: 'Khoa Công nghệ thông tin',
  },
  {
    role: 'MAJOR_OFFICER',
    scope: 'major',
    facultyId: 'cntt',
    facultyName: 'Khoa Công nghệ thông tin',
    majorId: 'cntt-khdl',
    majorName: 'Khoa học dữ liệu',
  },
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
    averageIncome: 'Từ 10 đến 15 triệu',
    jobSearchMethod: 'Bạn bè giới thiệu',
    recruitmentMethod: 'Phỏng vấn trực tiếp',
    softSkill: 'Giao tiếp, làm việc nhóm',
    extraCourse: 'Phân tích dữ liệu, Power BI',
    proposal: 'Tăng thời lượng thực hành doanh nghiệp',
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
    jobFoundTime: 'Từ 3 đến dưới 6 tháng',
    knowledgeLevel: 'Chỉ học được một phần',
    startingSalary: '9 triệu',
    averageIncome: 'Từ 5 đến 10 triệu',
    jobSearchMethod: 'Online',
    recruitmentMethod: 'Thi tuyển',
    softSkill: 'Thuyết trình, quản lý thời gian',
    extraCourse: 'BA, SQL nâng cao',
    proposal: 'Tăng học phần kỹ năng nghề nghiệp',
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
    jobFoundTime: 'Từ 6 đến dưới 12 tháng',
    knowledgeLevel: 'Đã học được',
    startingSalary: '—',
    averageIncome: '—',
    jobSearchMethod: 'Khoa giới thiệu',
    recruitmentMethod: 'Xét hồ sơ',
    softSkill: 'Phân tích, làm việc nhóm',
    extraCourse: 'Nghiên cứu khoa học',
    proposal: 'Liên kết học tiếp sau tốt nghiệp',
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
    jobFoundTime: 'Từ 3 đến dưới 6 tháng',
    knowledgeLevel: 'Chỉ học được một phần',
    startingSalary: '13 triệu',
    averageIncome: 'Từ 10 đến 15 triệu',
    jobSearchMethod: 'Người quen giới thiệu',
    recruitmentMethod: 'Tự tạo việc làm',
    softSkill: 'Đàm phán, quản lý tài chính',
    extraCourse: 'CAD/CAM',
    proposal: 'Tăng kết nối với xưởng thực hành',
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
}

function scopeLabel(user: UserProfile) {
  if (user.scope === 'school') return 'Toàn trường'
  if (user.scope === 'faculty') return user.facultyName || 'Theo khoa'
  return `${user.facultyName || ''} / ${user.majorName || ''}`
}

export default function ReportsPage() {
  const [messageApi, contextHolder] = message.useMessage()
  const [userIndex, setUserIndex] = useState(0)
  const [activeView, setActiveView] = useState<ViewMode>('overview')
  const [filters, setFilters] = useState<FilterState>({ surveyId: '2026-1' })
  const currentUser = mockUsers[userIndex]

  const facultyOptions = faculties

  const majorOptions = useMemo(() => {
    const facultyId =
      currentUser.scope === 'faculty' || currentUser.scope === 'major'
        ? currentUser.facultyId
        : filters.facultyId
    return facultyId ? majorMap[facultyId] || [] : Object.values(majorMap).flat()
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

  const filteredMajorSummary = useMemo(() => {
    return majorSummarySeed.filter((item) => {
      const facultyId = facultyNameToOption[item.facultyName]
      const majorId = majorNameToOption[item.majorName]

      if (effectiveFilters.facultyId && facultyId !== effectiveFilters.facultyId) return false
      if (effectiveFilters.majorId && majorId !== effectiveFilters.majorId) return false
      return true
    })
  }, [effectiveFilters])

  const filteredGraduates = useMemo(() => {
    return graduateSeed.filter((item) => {
      const facultyId = facultyNameToOption[item.facultyName]
      const majorId = majorNameToOption[item.majorName]

      if (effectiveFilters.facultyId && facultyId !== effectiveFilters.facultyId) return false
      if (effectiveFilters.majorId && majorId !== effectiveFilters.majorId) return false

      if (
        effectiveFilters.gender &&
        item.gender !== genders.find((g) => g.value === effectiveFilters.gender)?.label
      ) return false

      if (effectiveFilters.responseStatus) {
        const label = responseStatuses.find((s) => s.value === effectiveFilters.responseStatus)?.label
        if (item.responseStatus !== label) return false
      }

      if (effectiveFilters.contactMethod) {
        const label = contactMethods.find((s) => s.value === effectiveFilters.contactMethod)?.label
        if (item.surveyMethod !== label) return false
      }

      return true
    })
  }, [effectiveFilters])

  const filteredResponses = useMemo(() => {
    return responseSeed.filter((item) => {
      const facultyId = facultyNameToOption[item.facultyName]
      const majorId = majorNameToOption[item.majorName]

      if (effectiveFilters.facultyId && facultyId !== effectiveFilters.facultyId) return false
      if (effectiveFilters.majorId && majorId !== effectiveFilters.majorId) return false

      if (
        effectiveFilters.gender &&
        item.gender !== genders.find((g) => g.value === effectiveFilters.gender)?.label
      ) return false

      if (effectiveFilters.employmentStatus) {
        const label = employmentStatuses.find((s) => s.value === effectiveFilters.employmentStatus)?.label
        if (item.employmentStatus !== label) return false
      }

      if (effectiveFilters.workArea) {
        const label = workAreas.find((s) => s.value === effectiveFilters.workArea)?.label
        if (item.workArea !== label) return false
      }

      return true
    })
  }, [effectiveFilters])

  const stats = useMemo(() => {
    const totalGraduates = filteredMajorSummary.reduce((sum, item) => sum + item.totalGraduates, 0)
    const totalResponses = filteredMajorSummary.reduce((sum, item) => sum + item.responses, 0)
    const employed = filteredMajorSummary.reduce((sum, item) => sum + item.employed, 0)
    const correctMajor = filteredMajorSummary.reduce((sum, item) => sum + item.correctMajor, 0)

    return {
      totalGraduates,
      totalResponses,
      employed,
      correctMajorRate: totalResponses ? ((correctMajor / totalResponses) * 100).toFixed(1) : '0.0',
      responseRate: totalGraduates ? ((totalResponses / totalGraduates) * 100).toFixed(1) : '0.0',
      employmentRate: totalResponses ? ((employed / totalResponses) * 100).toFixed(1) : '0.0',
    }
  }, [filteredMajorSummary])

  const onFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({ surveyId: '2026-1' })
  }

  const exportReport = (type: string) => {
    messageApi.success(`Đã mô phỏng xuất ${type} theo phạm vi ${scopeLabel(currentUser)}`)
  }

  const overviewColumns: ColumnsType<MajorSummaryRow> = [
    { title: 'Mã ngành', dataIndex: 'majorCode', key: 'majorCode', fixed: 'left', width: 110 },
    { title: 'Tên ngành', dataIndex: 'majorName', key: 'majorName', fixed: 'left', width: 180 },
    { title: 'Khoa', dataIndex: 'facultyName', key: 'facultyName', width: 180 },
    { title: 'SV tốt nghiệp', dataIndex: 'totalGraduates', key: 'totalGraduates', align: 'right', width: 120 },
    { title: 'Phản hồi', dataIndex: 'responses', key: 'responses', align: 'right', width: 100 },
    { title: 'Có việc làm', dataIndex: 'employed', key: 'employed', align: 'right', width: 110 },
    { title: 'Tiếp tục học', dataIndex: 'continuingStudy', key: 'continuingStudy', align: 'right', width: 110 },
    { title: 'Chưa có việc làm', dataIndex: 'unemployed', key: 'unemployed', align: 'right', width: 130 },
    { title: 'Đúng ngành', dataIndex: 'correctMajor', key: 'correctMajor', align: 'right', width: 100 },
    { title: 'Liên quan', dataIndex: 'relatedMajor', key: 'relatedMajor', align: 'right', width: 100 },
    { title: 'Không liên quan', dataIndex: 'unrelatedMajor', key: 'unrelatedMajor', align: 'right', width: 130 },
    { title: 'Nhà nước', dataIndex: 'publicArea', key: 'publicArea', align: 'right', width: 100 },
    { title: 'Tư nhân', dataIndex: 'privateArea', key: 'privateArea', align: 'right', width: 100 },
    { title: 'Tự tạo việc làm', dataIndex: 'selfEmployed', key: 'selfEmployed', align: 'right', width: 130 },
    { title: 'Nơi làm việc', dataIndex: 'workProvince', key: 'workProvince', width: 220 },
  ]

  const graduateColumns: ColumnsType<GraduateRow> = [
    { title: 'Mã SV', dataIndex: 'studentCode', key: 'studentCode', fixed: 'left', width: 110 },
    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName', fixed: 'left', width: 180 },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender', width: 90 },
    { title: 'CCCD', dataIndex: 'citizenId', key: 'citizenId', width: 150 },
    { title: 'Mã ngành', dataIndex: 'majorCode', key: 'majorCode', width: 110 },
    { title: 'Ngành', dataIndex: 'majorName', key: 'majorName', width: 180 },
    { title: 'Khoa', dataIndex: 'facultyName', key: 'facultyName', width: 180 },
    { title: 'QĐ tốt nghiệp', dataIndex: 'graduationDecision', key: 'graduationDecision', width: 130 },
    { title: 'Ngày ký', dataIndex: 'graduationDate', key: 'graduationDate', width: 110 },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 180 },
    { title: 'Hình thức khảo sát', dataIndex: 'surveyMethod', key: 'surveyMethod', width: 150 },
    {
      title: 'Phản hồi',
      dataIndex: 'responseStatus',
      key: 'responseStatus',
      width: 120,
      render: (value: string) => (
        <Tag color={value === 'Đã phản hồi' ? 'green' : 'default'}>{value}</Tag>
      ),
    },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', width: 220 },
  ]

  const responseColumns: ColumnsType<ResponseRow> = [
    { title: 'Mã SV', dataIndex: 'studentCode', key: 'studentCode', fixed: 'left', width: 110 },
    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName', fixed: 'left', width: 180 },
    { title: 'Ngày sinh', dataIndex: 'birthDate', key: 'birthDate', width: 110 },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender', width: 90 },
    { title: 'CCCD', dataIndex: 'citizenId', key: 'citizenId', width: 150 },
    { title: 'Mã ngành', dataIndex: 'majorCode', key: 'majorCode', width: 110 },
    { title: 'Ngành', dataIndex: 'majorName', key: 'majorName', width: 180 },
    { title: 'Khoa', dataIndex: 'facultyName', key: 'facultyName', width: 180 },
    { title: 'Điện thoại', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: 'Tình trạng việc làm', dataIndex: 'employmentStatus', key: 'employmentStatus', width: 150 },
    { title: 'Khu vực làm việc', dataIndex: 'workArea', key: 'workArea', width: 140 },
    { title: 'Tỉnh/TP', dataIndex: 'workProvince', key: 'workProvince', width: 120 },
    { title: 'Thời gian tìm việc', dataIndex: 'jobFoundTime', key: 'jobFoundTime', width: 170 },
    { title: 'Mức độ đáp ứng kiến thức', dataIndex: 'knowledgeLevel', key: 'knowledgeLevel', width: 190 },
    { title: 'Lương khởi điểm', dataIndex: 'startingSalary', key: 'startingSalary', width: 130 },
    { title: 'Thu nhập bình quân', dataIndex: 'averageIncome', key: 'averageIncome', width: 150 },
    { title: 'Hình thức tìm việc', dataIndex: 'jobSearchMethod', key: 'jobSearchMethod', width: 160 },
    { title: 'Hình thức tuyển dụng', dataIndex: 'recruitmentMethod', key: 'recruitmentMethod', width: 160 },
    { title: 'Kỹ năng mềm', dataIndex: 'softSkill', key: 'softSkill', width: 200 },
    { title: 'Khóa học sau TN', dataIndex: 'extraCourse', key: 'extraCourse', width: 200 },
    { title: 'Giải pháp đề xuất', dataIndex: 'proposal', key: 'proposal', width: 220 },
  ]

  const chartCards = [
    {
      title: 'Tỷ lệ phản hồi',
      value: `${stats.responseRate}%`,
      color: '#1677ff',
      desc: 'Tính trên tổng số sinh viên tốt nghiệp trong phạm vi đang xem.',
    },
    {
      title: 'Tỷ lệ có việc làm',
      value: `${stats.employmentRate}%`,
      color: '#389e0d',
      desc: 'Tính trên số sinh viên đã phản hồi khảo sát.',
    },
    {
      title: 'Tỷ lệ đúng ngành',
      value: `${stats.correctMajorRate}%`,
      color: '#722ed1',
      desc: 'Ước tính từ số phản hồi đang nằm trong tab tổng hợp.',
    },
  ]

  return (
    <AdminLayout>
      {contextHolder}
      <div style={{ display: 'grid', gap: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>Báo cáo tổng hợp</Title>
            <Paragraph style={{ marginBottom: 8, color: '#64748b' }}>
              Màn báo cáo động cho toàn trường, có khóa phạm vi dữ liệu theo vai trò người dùng.
            </Paragraph>
            <Space wrap>
              <Tag color="blue">Mock API</Tag>
              <Tag color="purple">Role: {currentUser.role}</Tag>
              <Tag color="gold">Phạm vi: {scopeLabel(currentUser)}</Tag>
            </Space>
          </div>

          <Space wrap>
            <Segmented
              value={userIndex}
              onChange={(value) => setUserIndex(Number(value))}
              options={mockUsers.map((user, index) => ({
                label: user.role,
                value: index,
              }))}
            />
            <Button icon={<DownloadOutlined />} onClick={() => exportReport('Excel')}>
              Xuất Excel
            </Button>
            <Button icon={<DownloadOutlined />} onClick={() => exportReport('PDF')}>
              Xuất PDF
            </Button>
          </Space>
        </div>

        <Alert
          type="info"
          showIcon
          message="Phân quyền báo cáo"
          description={
            currentUser.scope === 'school'
              ? 'Người dùng cấp trường hoặc super admin được xem dữ liệu toàn trường và lọc xuống khoa/ngành.'
              : currentUser.scope === 'faculty'
                ? `Người dùng cấp khoa chỉ xem được dữ liệu của ${currentUser.facultyName}. Bộ lọc khoa được khóa theo quyền.`
                : `Người dùng cấp ngành chỉ xem được dữ liệu của ngành ${currentUser.majorName}. Bộ lọc khoa và ngành được khóa theo quyền.`
          }
        />

        <Card
          styles={{ body: { paddingBottom: 8 } }}
          title={
            <Space>
              <FilterOutlined />
              <span>Bộ lọc báo cáo</span>
            </Space>
          }
          extra={
            <Button type="text" icon={<ReloadOutlined />} onClick={resetFilters}>
              Đặt lại
            </Button>
          }
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} md={12} xl={6}>
              <Select
                value={filters.surveyId}
                options={surveys}
                style={{ width: '100%' }}
                placeholder="Đợt khảo sát"
                onChange={(value) => onFilterChange('surveyId', value)}
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Select
                value={effectiveFilters.facultyId}
                options={facultyOptions}
                style={{ width: '100%' }}
                placeholder="Khoa"
                disabled={currentUser.scope !== 'school'}
                onChange={(value) => {
                  onFilterChange('facultyId', value)
                  onFilterChange('majorId', undefined)
                }}
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Select
                value={effectiveFilters.majorId}
                options={majorOptions}
                style={{ width: '100%' }}
                placeholder="Ngành"
                disabled={currentUser.scope === 'major'}
                onChange={(value) => onFilterChange('majorId', value)}
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Select
                value={filters.graduationYear}
                options={graduationYears}
                style={{ width: '100%' }}
                placeholder="Khóa tốt nghiệp"
                onChange={(value) => onFilterChange('graduationYear', value)}
                allowClear
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Select
                value={filters.responseStatus}
                options={responseStatuses}
                style={{ width: '100%' }}
                placeholder="Trạng thái phản hồi"
                onChange={(value) => onFilterChange('responseStatus', value)}
                allowClear
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Select
                value={filters.employmentStatus}
                options={employmentStatuses}
                style={{ width: '100%' }}
                placeholder="Tình trạng việc làm"
                onChange={(value) => onFilterChange('employmentStatus', value)}
                allowClear
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Select
                value={filters.workArea}
                options={workAreas}
                style={{ width: '100%' }}
                placeholder="Khu vực làm việc"
                onChange={(value) => onFilterChange('workArea', value)}
                allowClear
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Select
                value={filters.gender}
                options={genders}
                style={{ width: '100%' }}
                placeholder="Giới tính"
                onChange={(value) => onFilterChange('gender', value)}
                allowClear
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Select
                value={filters.contactMethod}
                options={contactMethods}
                style={{ width: '100%' }}
                placeholder="Hình thức khảo sát"
                onChange={(value) => onFilterChange('contactMethod', value)}
                allowClear
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <RangePicker style={{ width: '100%' }} placeholder={['Từ ngày', 'Đến ngày']} />
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} xl={6}>
            <Card>
              <Statistic title="Tổng SV tốt nghiệp" value={stats.totalGraduates} prefix={<TeamOutlined />} />
            </Card>
          </Col>
          <Col xs={24} md={12} xl={6}>
            <Card>
              <Statistic title="Tổng phản hồi" value={stats.totalResponses} prefix={<FileSearchOutlined />} />
            </Card>
          </Col>
          <Col xs={24} md={12} xl={6}>
            <Card>
              <Statistic title="Tỷ lệ phản hồi" value={Number(stats.responseRate)} suffix="%" prefix={<PieChartOutlined />} precision={1} />
            </Card>
          </Col>
          <Col xs={24} md={12} xl={6}>
            <Card>
              <Statistic title="Tỷ lệ có việc làm" value={Number(stats.employmentRate)} suffix="%" prefix={<CheckCircleOutlined />} precision={1} />
            </Card>
          </Col>
        </Row>

        <Tabs
          activeKey={activeView}
          onChange={(key) => setActiveView(key as ViewMode)}
          items={[
            {
              key: 'overview',
              label: 'Tổng hợp',
              children: filteredMajorSummary.length ? (
                <Card>
                  <Table
                    rowKey="key"
                    columns={overviewColumns}
                    dataSource={filteredMajorSummary}
                    pagination={false}
                    scroll={{ x: 1800 }}
                    summary={() => (
                      <Table.Summary fixed>
                        <Table.Summary.Row style={{ background: '#f0fdf4', fontWeight: 700 }}>
                          <Table.Summary.Cell index={0}>TỔNG</Table.Summary.Cell>
                          <Table.Summary.Cell index={1} colSpan={2}>
                            {scopeLabel(currentUser)}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={3} align="right">{stats.totalGraduates}</Table.Summary.Cell>
                          <Table.Summary.Cell index={4} align="right">{stats.totalResponses}</Table.Summary.Cell>
                          <Table.Summary.Cell index={5} align="right">{stats.employed}</Table.Summary.Cell>
                          <Table.Summary.Cell index={6} />
                          <Table.Summary.Cell index={7} />
                          <Table.Summary.Cell index={8} />
                          <Table.Summary.Cell index={9} />
                          <Table.Summary.Cell index={10} />
                          <Table.Summary.Cell index={11} />
                          <Table.Summary.Cell index={12} />
                          <Table.Summary.Cell index={13} />
                          <Table.Summary.Cell index={14}>
                            {filteredMajorSummary.map((row) => row.workProvince).join('; ')}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                  />
                </Card>
              ) : (
                <Empty description="Không có dữ liệu tổng hợp phù hợp bộ lọc" />
              ),
            },
            {
              key: 'graduates',
              label: 'Danh sách sinh viên',
              children: filteredGraduates.length ? (
                <Card>
                  <Table rowKey="key" columns={graduateColumns} dataSource={filteredGraduates} scroll={{ x: 1800 }} />
                </Card>
              ) : (
                <Empty description="Không có sinh viên trong phạm vi đang chọn" />
              ),
            },
            {
              key: 'responses',
              label: 'Phản hồi chi tiết',
              children: filteredResponses.length ? (
                <Card>
                  <Table rowKey="key" columns={responseColumns} dataSource={filteredResponses} scroll={{ x: 2800 }} />
                </Card>
              ) : (
                <Empty description="Không có phản hồi chi tiết phù hợp" />
              ),
            },
            {
              key: 'charts',
              label: 'Biểu đồ',
              children: (
                <Row gutter={[16, 16]}>
                  {chartCards.map((item) => (
                    <Col xs={24} lg={8} key={item.title}>
                      <Card>
                        <Space direction="vertical" size={6}>
                          <Space>
                            <BarChartOutlined style={{ color: item.color }} />
                            <Text strong>{item.title}</Text>
                          </Space>
                          <Title level={3} style={{ margin: 0, color: item.color }}>{item.value}</Title>
                          <Text type="secondary">{item.desc}</Text>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                  <Col span={24}>
                    <Card>
                      <Paragraph style={{ marginBottom: 0 }}>
                        Khu vực biểu đồ đang để mock nhẹ cho phase frontend. Khi nối API thật, phần này có thể reuse chart pattern từ màn "Biểu đồ thống kê" hiện có để render cột, tròn và xu hướng theo đợt khảo sát.
                      </Paragraph>
                    </Card>
                  </Col>
                </Row>
              ),
            },
          ]}
        />

        <Card>
          <Space direction="vertical" size={6}>
            <Text strong>Payload mock gửi API</Text>
            <Text code>
              {JSON.stringify(
                { role: currentUser.role, scope: currentUser.scope, filters: effectiveFilters },
                null,
                2
              )}
            </Text>
          </Space>
        </Card>
      </div>
    </AdminLayout>
  )
}
