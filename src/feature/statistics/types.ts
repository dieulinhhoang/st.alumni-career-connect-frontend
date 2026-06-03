export type ChartType = 'pie' | 'column'

/** Một đợt khảo sát đã kết thúc (dùng cho dropdown chọn đợt thống kê) */
export interface BatchOption {
  id: number
  title: string
  year?: number
  graduationPeriod?: string
  endDate?: string
  totalStudents?: number
}

/** Alias dùng cho FilterBar (để tương thích với prop `forms`) */
export type FormOption = {
  id: number
  /** FilterBar dùng field .name để hiển thị label */
  name: string
}

/** Câu hỏi có show_in_chart = 1 trong formSnapshot của batch */
export interface StatisticalQuestion {
  /** id = questionKey, dùng thống nhất cho value của Select */
  id: string
  questionKey: string
  title: string
  chartType: ChartType
  questionType: string
}

export interface ChartDatum {
  label: string
  value: number
  percent: number
}

export interface FormStatisticsDetail {
  batchId: number
  batchTitle: string
  questionKey: string
  questionTitle: string
  chartType: ChartType
  totalResponses: number
  answeredCount: number
  completionRate: number
  data: ChartDatum[]
}

export interface DetailTableRow {
  key: string
  label: string
  value: number
  percent: number
}