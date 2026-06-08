import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import {
  createUserAPI,
  deleteUserAPI,
  getListUserAPI,
  getUserDetailAPI,
  getUserRolesAPI,
  assignUserRolesAPI,
  updateUserAPI,
  updateUserSuspendAPI,
} from '../api'
import type { ICreateUserBody, IUpdateUserBody, IUser, IUserListResponse, IUserQuery } from '../type'

export const useGetListUsers = (params: IUserQuery) =>
  useQuery<IUserListResponse>({
    queryKey: ['users', params],
    queryFn: () => getListUserAPI(params),
  })

export const useGetUserDetail = ({ id, enabled }: { id?: string; enabled?: boolean }) =>
  useQuery<IUser>({
    queryKey: ['user-detail', id],
    queryFn: () => getUserDetailAPI(id!),
    enabled: !!id && enabled !== false,
  })

export const useGetUserRoles = ({ id, enabled }: { id?: string; enabled?: boolean }) =>
  useQuery<{ assignedRoleIds: number[]; roles: any[] }>({
    queryKey: ['user-roles', id],
    queryFn: () => getUserRolesAPI(id!),
    enabled: !!id && enabled !== false,
  })

export const useAssignUserRoles = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, roleIds }: { id: string; roleIds: number[] }) =>
      assignUserRolesAPI(id, roleIds),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['user-roles', vars.id] })
      qc.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => message.error('Gán role thất bại'),
  })
}

export const useCreateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ICreateUserBody) => createUserAPI(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      message.success('Thêm mới thành công')
    },
  })
}

export const useUpdateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: IUpdateUserBody }) =>
      updateUserAPI(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      qc.invalidateQueries({ queryKey: ['user-detail'] })
    },
  })
}

export const useDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUserAPI(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      message.success('Xóa thành công')
    },
  })
}

export const useIsSuspended = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string }) => updateUserSuspendAPI(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      qc.invalidateQueries({ queryKey: ['user-detail'] })
    },
  })
}