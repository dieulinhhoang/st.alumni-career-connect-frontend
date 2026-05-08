import type {
  FormOption,
  StatisticalQuestion,
  FormStatisticsDetail,
} from './types'

const MOCK_FORMS: FormOption[] = [
  { id: 1, name: 'Khảo sát tình hình việc làm sinh viên tốt nghiệp 2024' },
  { id: 2, name: 'Đánh giá chương trình đào tạo' },
  { id: 3, name: 'Khảo sát doanh nghiệp đối tác' },
]

const MOCK_QUESTIONS_BY_FORM: Record<number, StatisticalQuestion[]> = {
  1: [
    { id: 'q09', title: 'Tình trạng việc làm hiện tại', chartType: 'pie' },
    { id: 'q03', title: 'Giới tính', chartType: 'pie' },
    { id: 'q13', title: 'Khu vực làm việc', chartType: 'column' },
    { id: 'q19', title: 'Mức thu nhập bình quân/tháng hiện nay', chartType: 'column' },
  ],
  2: [
    { id: 'q1', title: 'Mức độ hài lòng về chương trình đào tạo', chartType: 'column' },
  ],
  3: [
    { id: 'q1', title: 'Mức độ hài lòng của doanh nghiệp đối tác', chartType: 'column' },
  ],
}

const MOCK_DETAIL_DATA: Record<string, FormStatisticsDetail> = {
  '1-q09': {
    totalResponses: 1248,
    completionRate: 92,
    formName: 'Khảo sát tình hình việc làm sinh viên tốt nghiệp 2024',
    questionTitle: 'Tình trạng việc làm hiện tại',
    chartType: 'pie',
    data: [
      { label: 'Đã có việc làm', value: 798, percent: 64 },
      { label: 'Đang tiếp tục học', value: 210, percent: 17 },
      { label: 'Chưa có việc làm', value: 165, percent: 13 },
      { label: 'Chưa đi tìm việc', value: 75, percent: 6 },
    ],
  },
  '1-q03': {
    totalResponses: 1248,
    completionRate: 96,
    formName: 'Khảo sát tình hình việc làm sinh viên tốt nghiệp 2024',
    questionTitle: 'Giới tính',
    chartType: 'pie',
    data: [
      { label: 'Nam', value: 620, percent: 50 },
      { label: 'Nữ', value: 600, percent: 48 },
      { label: 'Khác', value: 28, percent: 2 },
    ],
  },
  '1-q13': {
    totalResponses: 1248,
    completionRate: 88,
    formName: 'Khảo sát tình hình việc làm sinh viên tốt nghiệp 2024',
    questionTitle: 'Khu vực làm việc',
    chartType: 'column',
    data: [
      { label: 'Nhà nước', value: 220, percent: 28 },
      { label: 'Tư nhân', value: 340, percent: 43 },
      { label: 'Nước ngoài', value: 150, percent: 19 },
      { label: 'Tự tạo việc làm', value: 88, percent: 10 },
    ],
  },
  '1-q19': {
    totalResponses: 1248,
    completionRate: 90,
    formName: 'Khảo sát tình hình việc làm sinh viên tốt nghiệp 2024',
    questionTitle: 'Mức thu nhập bình quân/tháng hiện nay',
    chartType: 'column',
    data: [
      { label: 'Dưới 5 triệu', value: 130, percent: 16 },
      { label: '5-10 triệu', value: 320, percent: 40 },
      { label: '10-15 triệu', value: 250, percent: 31 },
      { label: 'Từ 15 triệu trở lên', value: 98, percent: 13 },
    ],
  },
}

function wait(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getForms(): Promise<FormOption[]> {
  await wait()
  return MOCK_FORMS
}

export async function getStatisticalQuestions(formId: number): Promise<StatisticalQuestion[]> {
  await wait()
  return MOCK_QUESTIONS_BY_FORM[formId] || []
}

export async function getFormStatisticsDetail(
  formId: number,
  questionId: string,
): Promise<FormStatisticsDetail | null> {
  await wait()
  return MOCK_DETAIL_DATA[`${formId}-${questionId}`] || null
}