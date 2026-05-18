import { api } from '../../libs/api'
import { IUser, IUserListResponse, IUserQuery, ICreateUserBody, IUpdateUserBody } from './type';

export const getListUserAPI = async (params: IUserQuery): Promise<IUserListResponse> => {
  const { data } = await api.get(`/users`, { params });
  return data;
}

export const createUserAPI = async (body: ICreateUserBody): Promise<IUser> => {
  const { data } = await api.post(`/users/`, body)
  return data.data;
}

export const deleteUserAPI = async (id: string): Promise<any> => {
  const { data } = await api.delete(`/users/${id}`)
  return data;
}

export const updateUserAPI = async (id: string, body: IUpdateUserBody): Promise<void> => {
  await api.put(`/users/${id}`, body);
}

export const getUserDetailAPI = async (id: string): Promise<any> => {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export const changeUserPasswordAPI = async (id: string, newPassword: string): Promise<void> => {
  await api.put(`/users/${id}/change-password`, { newPassword });
}

export const updateUserSuspendAPI = async (id: string, isSuspended: boolean): Promise<void> => {
  await api.put(`/users/${id}/suspend`, {isSuspended});
}
