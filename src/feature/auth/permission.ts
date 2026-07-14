import { PermissionEnum } from "./type"
import { getActingFacultyId } from "./actingFaculty"

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


/**
 * Phạm vi khoa hiệu lực của phiên hiện tại:
 * - Cán bộ khoa (không phải admin): luôn cố định theo khoa của họ.
 * - Admin: theo khoa đang "đóng vai" (nếu có), null = toàn trường.
 * Trả về string (id khoa) hoặc null.
 */
export const getEffectiveFacultyId = (): string | null => {
  const u = getCurrentUser()
  if (!u.isAdmin) return u.facultyId
  return getActingFacultyId()
}

/**
 * Phiên có đang ở "chế độ khoa" không (menu khoa, dashboard khoa, scope khoa):
 * - Cán bộ khoa: luôn đúng khi có khoa.
 * - Admin: đúng khi đang "đóng vai" một khoa (đã chọn khoa trên header).
 */
export const isFacultyMode = (): boolean => !!getEffectiveFacultyId()

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
