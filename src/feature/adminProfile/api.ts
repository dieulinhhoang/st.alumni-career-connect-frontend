import { api } from '../../libs/api'
import type { IAdminProfile, IUpdateAdminProfileBody } from './type'
// ban tam: Lay user id = 1 lam admin
export const getAdminProfileAPI = async (): Promise<IAdminProfile> => {
  const { data } = await api.get('/users/1')
  const user = data?.data ?? data
  const roles = Array.isArray(user?.roles)
    ? user.roles
        .map((role: any) =>
          typeof role === 'string' ? role : role?.name || role?._id,
        )
        .filter(Boolean)
    : []
  return {
    _id: user._id,
    userName: user.userName,
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile,
    address: user.address,
    sex: user.sex,
    bod: user.bod,
    isSupperAdmin: user.isSupperAdmin,
    roles,
    roleName: roles[0] || 'Quan tri vien',
  }
}
export const updateAdminProfileAPI = async (
  body: IUpdateAdminProfileBody,
): Promise<void> => {
  await api.put('/users/1', body)
}
