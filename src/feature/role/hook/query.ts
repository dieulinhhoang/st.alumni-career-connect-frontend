import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getListRoleAPI,
  createRoleAPI,
  updateRoleAPI,
  deleteRoleAPI,
  getRoleDetailAPI,
  getRoleResourcesAPI,
  assignRoleResourcesAPI,
} from '../api'
import type {
  IRoleListResponse,
  IRoleQuery,
  ICreateRoleBody,
  IUpdateRoleBody,
  IRole,
  IRoleResource,
  IResourceAssignment,
} from '../type'
import { message } from 'antd'

export const useGetListRoles = (params: IRoleQuery) =>
  useQuery<IRoleListResponse>({
    queryKey: ['roles', params],
    queryFn: () => getListRoleAPI(params),
  })

export const useGetRoleDetail = ({
  id,
  enabled,
}: {
  id?: string
  enabled?: boolean
}) =>
  useQuery<IRole>({
    queryKey: ['role-detail', id],
    queryFn: () => getRoleDetailAPI(id!),
    enabled: !!id && enabled !== false,
  })

/**
 * Lấy danh sách resources + isGranted cho role.
 * Dùng cho form chỉnh sửa / xem.
 */
export const useGetRoleResources = ({
  id,
  enabled,
}: {
  id?: string
  enabled?: boolean
}) =>
  useQuery<IRoleResource[]>({
    queryKey: ['role-resources', id],
    queryFn: () => getRoleResourcesAPI(id!),
    enabled: !!id && enabled !== false,
  })

export const useAssignRoleResources = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      assignments,
    }: {
      id: string
      assignments: IResourceAssignment[]
    }) => assignRoleResourcesAPI(id, assignments),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['role-resources', vars.id] })
    },
    onError: () => message.error('Lưu phân quyền thất bại'),
  })
}

export const useCreateRole = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ICreateRoleBody) => createRoleAPI(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
    onError: (err: any) =>
      message.error(err?.response?.data?.message || 'Tạo mới không thành công'),
  })
}

export const useUpdateRole = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: IUpdateRoleBody }) =>
      updateRoleAPI(id, body),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      qc.invalidateQueries({ queryKey: ['role-detail', vars.id] })
      qc.invalidateQueries({ queryKey: ['role-resources', vars.id] })
    },
    onError: (err: any) =>
      message.error(err?.response?.data?.message || 'Cập nhật không thành công'),
  })
}

export const useDeleteRole = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRoleAPI(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
    onError: (err: any) =>
      message.error(err?.response?.data?.message || 'Xóa không thành công'),
  })
}