export interface IRole {
  id: number | string
  name: string
  code?: string
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
  code?: string
  description?: string
}

export interface IUpdateRoleBody {
  name?: string
  code?: string
  description?: string
}

//  Resource / Actions 

export interface IActionItem {
  action: string
  isGranted: boolean
}

export interface IRoleResource {
  id: number
  name: string
  code: string
  actions: IActionItem[]
}

// Assignment gửi lên backend
export interface IResourceAssignment {
  resourceId: number
  actions: string[]
}