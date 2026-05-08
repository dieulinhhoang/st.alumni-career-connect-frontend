export type ChartType = 'pie' | 'column'

export interface FormOption {
  id: number
  name: string
}

export interface StatisticalQuestion {
  id: string
  title: string
  chartType: ChartType
}

export interface ChartDatum {
  label: string
  value: number
  percent: number
}

export interface FormStatisticsDetail {
  totalResponses: number
  completionRate: number
  formName: string
  questionTitle: string
  chartType: ChartType
  data: ChartDatum[]
}

export interface DetailTableRow {
  key: string
  label: string
  value: number
  percent: number
}