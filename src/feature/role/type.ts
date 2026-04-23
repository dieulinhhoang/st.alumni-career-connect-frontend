import type { UserActionInfo } from "../../global/globalType"

 
export interface IRole {
  _id: string
  code: string
  name: string
  description?: string
  isDeleted: boolean
  createdBy?: UserActionInfo
  updatedBy?: UserActionInfo
  createdAt: string
  updatedAt: string
  permissions?: IPermissionView[]
}

export interface IRoleListResponse {
  data: IRole[]
  page: {
    total_pages: number
    has_next: boolean
    has_previous: boolean
    current_page: number
    total_elements: number
  }
}

// (param ?page=&size=&code=&name=)
export interface IRoleQuery {
  page: number
  size: number
  code?: string
  name?: string
}

 export interface IPermissionInput {
  resource: string
  action: string 
}

export interface ICreateRoleBody {
  code: string
  name: string
  description?: string
  permissions: IPermissionInput[]
}

// tree resource
export interface IResourceItem {
  code: string
  name: string
  actions: string[]
}

 export interface IPermissionView {
  resource: string
  action: string
}
