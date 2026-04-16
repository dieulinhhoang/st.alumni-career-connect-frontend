import { PermissionEnum } from '../../feature/Auth/type'

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

export const usePermission = () => {
  return {
    havePermission,
    haveAnyPermission,
    haveAllPermissions,
  }
}