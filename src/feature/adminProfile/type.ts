export interface IAdminProfile {
  id: string
  userName: string
  fullName: string
  email: string
  isAdmin?: boolean
  facultyId?: number | null
  roles: string[]
  roleName: string
}

export interface IUpdateAdminProfileBody {
  fullName?: string
  email?: string
}
