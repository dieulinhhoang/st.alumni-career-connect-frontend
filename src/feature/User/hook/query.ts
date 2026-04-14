import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getListUserAPI,
    createUserAPI,
    updateUserAPI,
    deleteUserAPI,
    getUserDetailAPI,
    changeUserPasswordAPI,
    updateUserSuspendAPI,
} from '../api'
import {
    IUserListResponse,
    IUserQuery,
    ICreateUserBody,
    IUser,
    IUpdateUserBody,
} from '../type'
import { message } from 'antd'
import { getListRoleAPI } from '@/features/Role/api'
import { IRole } from '@/features/Role/type'

export const useGetListUsers = (params: IUserQuery) => {
    return useQuery<IUserListResponse>({
        queryKey: ['users', params],
        queryFn: () => getListUserAPI(params),
    })
}

export const useGetUserDetail = ({ id, enabled }: { id?: string, enabled?: boolean }) => {
    return useQuery<IUser>({
        queryKey: ['user-detail', id],
        queryFn: () => getUserDetailAPI(id!),
        enabled: !!id && enabled
    })
}

export const useCreateUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: ICreateUserBody) => createUserAPI(body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['users'] }),
                message.success('Thêm mới thành công')
        }
    })
}

export const useUpdateUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: IUpdateUserBody }) =>
            updateUserAPI(id, body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['users'] })
            qc.invalidateQueries({ queryKey: ['user-detail'] })
        }
    })
}

export const useDeleteUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteUserAPI(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['users'] })
            message.success('Xóa thành công')
        }
    })
}

export const useGetRolesUser = (params: any) => {
    return useQuery<IRole[]>({
        queryKey: ['roles-user', params],
        queryFn: () => getListRoleAPI(params).then(res => res.data),
    })
}

export const useChangeUserPassword = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
            changeUserPasswordAPI(id, newPassword),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['users'] })
            qc.invalidateQueries({ queryKey: ['user-detail'] })
            message.success('Đổi mật khẩu thành công')
        }
    })
}

export const useIsSuspended  = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, isSuspended }: { id: string;  isSuspended: boolean }) =>
            updateUserSuspendAPI(id, isSuspended),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['users'] })
            qc.invalidateQueries({ queryKey: ['user-detail'] })
        }
    })
}