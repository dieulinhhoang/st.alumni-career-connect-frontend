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

/** Câu hỏi có show_in_chart = 1 trong formSnapshot của batch */
export interface StatisticalQuestion {
  questionKey: string   // key dùng để query thống kê
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