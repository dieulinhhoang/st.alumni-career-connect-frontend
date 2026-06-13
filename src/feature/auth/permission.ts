import { PermissionEnum } from "./type"

export type StoredUser = {
  id: string
  name: string
  isAdmin: boolean
  facultyId: string | null
}

/** Đọc thông tin tài khoản đăng nhập (lưu lúc login) từ localStorage. */
export const getCurrentUser = (): StoredUser => {
  try {
    const raw = localStorage.getItem('currentUser')
    if (!raw) return { id: '', name: '', isAdmin: false, facultyId: null }
    const parsed = JSON.parse(raw)
    return {
      id: parsed.id ?? '',
      name: parsed.name ?? '',
      isAdmin: !!parsed.isAdmin,
      facultyId: parsed.facultyId ?? null,
    }
  } catch {
    return { id: '', name: '', isAdmin: false, facultyId: null }
  }
}


export const havePermission = (permission: PermissionEnum | string): boolean => {
  try {
    const raw = localStorage.getItem('permissions')
    const permissions: string[] = raw ? JSON.parse(raw) : []

    // exact
    if (permissions.includes(permission)) return true

    // wildcard
    const resource = permission.split(':')[0]
    return permissions.includes(`${resource}:*`) || permissions.includes('*')
  } catch {
    return false
  }
}

export const haveAnyPermission = (
  permissions: (PermissionEnum | string)[]
) => permissions.some(p => havePermission(p))

export const haveAllPermissions = (
  permissions: (PermissionEnum | string)[]
) => permissions.every(p => havePermission(p))
