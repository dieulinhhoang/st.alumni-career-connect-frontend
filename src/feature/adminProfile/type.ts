export interface IAdminProfile {
  _id: string
  userName: string
  fullName: string
  email: string
  mobile?: string
  address?: string
  sex?: 'MALE' | 'FEMALE' | 'OTHER'
  bod?: string
  isSupperAdmin?: boolean
  roles: string[]
  roleName: string
}

export interface IUpdateAdminProfileBody {
  fullName?: string
  email?: string
  mobile?: string
  address?: string
  sex?: 'MALE' | 'FEMALE' | 'OTHER'
  bod?: string
}
