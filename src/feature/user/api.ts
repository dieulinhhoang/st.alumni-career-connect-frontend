 import axios from 'axios'
import {
  IUser,
  IUserListResponse,
  IUserQuery,
  ICreateUserBody,
  IUpdateUserBody,
} from './type'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const getListUserAPI = async (params: IUserQuery): Promise<IUserListResponse> => {
  const { data } = await api.get('/users', { params })
  console.log('API Response:', data) // Debug log to check the response structure
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

export const updateUserSuspendAPI = async (id: string, isSuspended: boolean): Promise<IUser> => {
  const { data } = await api.patch(`/users/${id}/suspend`, { isSuspended })
  return data
}