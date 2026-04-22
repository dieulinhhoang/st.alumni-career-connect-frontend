export type ListBaseResponse<T> = {
  data: T[]
  page: Page
  message: 'SUCCESS' | 'ERROR'
  extended_data?: any
}

export type Page = {
  total_pages: number
  has_next: boolean
  has_previous: boolean
  current_page: number
  total_elements: number
}

export type UserActionInfo = {
  _id: string
  fullName: string
}

export type BaseResponse<T> = {
  data: T
  message: 'SUCCESS' | 'ERROR'
}


export type IdAndName = {
  _id: string
  name: string
}
