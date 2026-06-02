import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getListRoleAPI,
  createRoleAPI,
  updateRoleAPI,
  deleteRoleAPI,
  getRoleDetailAPI,
  getRolePermissionsAPI,
  assignRolePermissionsAPI,
  getAllPermissionsAPI,
} from '../api'
import {
  IRoleListResponse,
  IRoleQuery,
  ICreateRoleBody,
  IUpdateRoleBody,
  IRole,
} from '../type'
import { message } from 'antd'

export const useGetListRoles = (params: IRoleQuery) => {
  return useQuery<IRoleListResponse>({
    queryKey: ['roles', params],
    queryFn: () => getListRoleAPI(params),
  })
}

export const useGetRoleDetail = ({
  id,
  enabled,
}: {
  id?: string
  enabled?: boolean
}) => {
  return useQuery<IRole>({
    queryKey: ['role-detail', id],
    queryFn: () => getRoleDetailAPI(id!),
    enabled: !!id && enabled,
  })
}

export const useGetRolePermissions = ({
  id,
  enabled,
}: {
  id?: string
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['role-permissions', id],
    queryFn: () => getRolePermissionsAPI(id!),
    enabled: !!id && enabled,
  })
}

export const useGetAllPermissions = ({ enabled }: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['permissions-all'],
    queryFn: () => getAllPermissionsAPI(),
    enabled: enabled !== false,
  })
}

export const useAssignRolePermissions = () => {
  return useMutation({
    mutationFn: ({
      id,
      permissionIds,
    }: {
      id: string
      permissionIds: number[]
    }) => assignRolePermissionsAPI(id, permissionIds),
  })
}

export const useCreateRole = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (body: ICreateRoleBody) => createRoleAPI(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['role'] })
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Tạo mới không thành công')
    },
  })
}

export const useUpdateRole = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: IUpdateRoleBody }) =>
      updateRoleAPI(id, body),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['role'] })
      qc.invalidateQueries({ queryKey: ['role-detail', variables.id] })
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Cập nhật không thành công')
    },
  })
}

export const useDeleteRole = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteRoleAPI(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['role'] })
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Xóa không thành công')
    },
  })
}
