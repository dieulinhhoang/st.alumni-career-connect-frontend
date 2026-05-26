export interface IRole {
  id: number | string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface IRoleListResponse {
  items: IRole[]
  page: number
  size: number
  total: number
  totalPages: number
}

export interface IRoleQuery {
  page: number
  size: number
  name?: string
}

export interface ICreateRoleBody {
  name: string
  description?: string
}

export interface IUpdateRoleBody {
  name: string
  description?: string
}