import api from '../../libs/api'
import type {
  IUser,
  IUserListResponse,
  IUserQuery,
  ICreateUserBody,
  IUpdateUserBody,
} from './type'

export const getListUserAPI = async (params: IUserQuery): Promise<IUserListResponse> => {
  const { data } = await api.get('/users', { params })
  return data
}

export const getUserDetailAPI = async (id: string): Promise<IUser> => {
  const { data } = await api.get(`/users/${id}`)
  return data
}

export const createUserAPI = async (body: ICreateUserBody): Promise<IUser> => {
  const { data } = await api.post('/users', body)
  return data
}

export const updateUserAPI = async (id: string, body: IUpdateUserBody): Promise<IUser> => {
  const { data } = await api.patch(`/users/${id}`, body)
  return data
}

export const deleteUserAPI = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`)
}

export const updateUserSuspendAPI = async (id: string): Promise<IUser> => {
  const { data } = await api.patch(`/users/${id}/suspend`)
  return data
}

//  Roles 

/**
 * GET /users/:id/roles
 * Response: { assignedRoleIds: number[], roles: IRole[] }
 */
export const getUserRolesAPI = async (id: string) => {
  const { data } = await api.get(`/users/${id}/roles`)
  return data
}

/**
 * POST /users/:id/roles
 * Body: { roleIds: number[] }
 */
export const assignUserRolesAPI = async (
  id: string,
  roleIds: number[],
) => {
  const { data } = await api.post(`/users/${id}/roles`, { roleIds })
  return data
}