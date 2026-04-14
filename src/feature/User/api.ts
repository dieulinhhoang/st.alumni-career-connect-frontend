import { api } from '@/libs/api'
import { IUser, IUserListResponse, IUserQuery, ICreateUserBody, IUpdateUserBody } from './type';

export const getListUserAPI = async (params: IUserQuery): Promise<IUserListResponse> => {
    const { data } = await api.get(`/v1.0/users`, { params });
    return data;
}

export const createUserAPI = async (body: ICreateUserBody): Promise<IUser> => {
    const { data } = await api.post(`/v1.0/users/`, body)
    return data.data;
}

export const deleteUserAPI = async (id: string): Promise<any> => {
    const { data } = await api.delete(`/v1.0/users/${id}`)
    return data;
}

export const updateUserAPI = async (id: string, body: IUpdateUserBody): Promise<void> => {
    await api.put(`/v1.0/users/${id}`, body);
}

export const getUserDetailAPI = async (id: string): Promise<any> => {
    const { data } = await api.get(`/v1.0/users/${id}`);
    return data;
}

export const changeUserPasswordAPI = async (id: string, newPassword: string): Promise<void> => {
    await api.put(`/v1.0/users/${id}/change-password`, { newPassword });
}

export const updateUserSuspendAPI = async (id: string, isSuspended: boolean): Promise<void> => {
    await api.put(`/v1.0/users/${id}/suspend`, {isSuspended});
}