import axios from 'axios'
import {
  IRole,
  IRoleListResponse,
  IRoleQuery,
  ICreateRoleBody,
  IUpdateRoleBody,
} from './type'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const getListRoleAPI = async (
  params: IRoleQuery,
): Promise<IRoleListResponse> => {
  const { data } = await api.get('/role', { params })
  return data
}

export const createRoleAPI = async (body: ICreateRoleBody): Promise<IRole> => {
  const { data } = await api.post('/role', body)
  return data
}

export const deleteRoleAPI = async (id: string): Promise<void> => {
  await api.delete(`/role/${id}`)
}

export const updateRoleAPI = async (
  id: string,
  body: IUpdateRoleBody,
): Promise<IRole> => {
  const { data } = await api.put(`/role/${id}`, body)
  return data
}

export const getRoleDetailAPI = async (id: string): Promise<IRole> => {
  const { data } = await api.get(`/role/${id}`)
  return data
}