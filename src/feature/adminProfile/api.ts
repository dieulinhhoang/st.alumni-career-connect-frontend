import api from '../../libs/api'
import type { IAdminProfile, IUpdateAdminProfileBody } from './type'

export const getAdminProfileAPI = async (): Promise<IAdminProfile> => {
  const { data } = await api.get('/users/me')
  const user = data?.data ?? data
  const roles: string[] = Array.isArray(user?.userRoles)
    ? user.userRoles
        .map((ur: any) => ur.role?.name || ur.role?.code)
        .filter(Boolean)
    : []
  return {
    id: String(user.id),
    userName: user.code ?? user.sso_id ?? '',
    fullName: user.fullName ?? '',
    email: user.email ?? '',
    isAdmin: user.isAdmin,
    facultyId: user.facultyId,
    roles,
    roleName: roles[0] || 'Quản trị viên',
  }
}

export const updateAdminProfileAPI = async (
  body: IUpdateAdminProfileBody,
): Promise<void> => {
  await api.patch('/users/me', body)
}
