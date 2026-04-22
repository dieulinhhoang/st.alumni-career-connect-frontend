import { useMutation, useQuery } from '@tanstack/react-query'
import Cookies from 'universal-cookie'
import { LoginRequest } from '@/features/Auth/type'
import { getProfileAPI, loginAPI } from '@/features/Auth/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (params: LoginRequest) => loginAPI(params),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message)
      // demo navigate
    },
    onSuccess: async (data) => {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('permissions', JSON.stringify(data.permissions))
      
      const profile = await getProfileAPI()
      localStorage.setItem('user', JSON.stringify(profile))
      // cookies.set('accessToken', data.accessToken, {
      //   maxAge: 3600,
      //   path: '/',
      //   domain: '.dev-lms.vn'
      // })
      window.location.href = '/'
    }
  })
}

export const useGetProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfileAPI()
  })
}
