export interface IUser {
  id: number
  sso_id: string
  fullName?: string | null
  code?: string | null
  accessToken?: string | null
  status: string
  type: string
  createdAt: string
  updatedAt: string
}

export interface IUserListResponse {
  data: IUser[]
  page: {
    total_pages: number
    has_next: boolean
    has_previous: boolean
    current_page: number
    total_elements: number
  }
}

export interface IUserQuery {
  page: number
  size: number
  sso_id?: string
  fullName?: string
  code?: string
  status?: string
  type?: string
}

export interface ICreateUserBody {
  sso_id: string
  fullName: string
  code?: string
  status?: string
  type?: string
}

export interface IUpdateUserBody {
  fullName?: string
  code?: string
  status?: string
  type?: string
}

export interface IToggleSuspendUserBody {
  isSuspended: boolean
}