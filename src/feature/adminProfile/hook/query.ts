import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { getAdminProfileAPI, updateAdminProfileAPI } from '../api'
import type { IUpdateAdminProfileBody } from '../type'

const ADMIN_PROFILE_KEY = ['admin-profile']

export const useGetAdminProfile = () => {
  return useQuery({
    queryKey: ADMIN_PROFILE_KEY,
    queryFn: () => getAdminProfileAPI(),
  })
}

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: IUpdateAdminProfileBody) =>
      updateAdminProfileAPI(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PROFILE_KEY })
      message.success('Cập nhật thông tin thành công')
    },
  })
}
