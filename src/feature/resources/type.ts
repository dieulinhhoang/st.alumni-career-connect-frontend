export interface IResource {
  id?: string | number
  _id?: string
  code?: string
  name?: string
  actions?: string[]
}

export interface IResourceQuery {
  page?: number
  size?: number
  code?: string
  action?: string
  name?: string
}

export interface ICreateResource {
  code: string
  name: string
  actions: string[]
}

export interface IUpdateResource {
  code: string
  name: string
  actions: string[]
}