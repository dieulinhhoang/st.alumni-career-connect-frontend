import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getListRoleAPI,
  createRoleAPI,
  updateRoleAPI,
  deleteRoleAPI,
  getRoleDetailAPI,
  getResourceListAPI,
} from '../api'

import {
  IRoleListResponse,
  IRoleQuery,
  ICreateRoleBody,
  IRole,
} from '../type'
import { message } from 'antd'
 
// get list
export const useGetListRoles = (params:IRoleQuery)=>{
    return useQuery<IRoleListResponse>({
        queryKey: ['roles', params],
        queryFn: () =>getListRoleAPI(params),
    })
}

//get detail
export const useGetRoleDetail =({id,enabled}:{id?:string , enabled?:boolean})=>{
    return useQuery<IRole>({
        queryKey:['role-detail',id],
        queryFn:()=> getRoleDetailAPI(id!),
        enabled: !!id && enabled

    })
}

export const useCreateRole=()=>{
    const qc = useQueryClient();
    return useMutation({
        mutationFn:(body:ICreateRoleBody )=>createRoleAPI(body),
        onSuccess:()=>{
            qc.invalidateQueries({queryKey:['roles']}),
            message.success('Them moi thanh cong')
        },
        onError:(error)=>{
            console.log(error)
        }
    })
}

export const useUpdateRole=()=>{
    const qc=useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: ICreateRoleBody }) =>
        updateRoleAPI(id, body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['roles'] })
            qc.invalidateQueries({ queryKey: ['role-detail'] })
    }
    })
}

export const useDeleteRole=()=>{
    const qc=useQueryClient();
    return useMutation({
        mutationFn: (id:string) =>deleteRoleAPI(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['roles'] })
    }
    })
}
export const useGetResourceList = () => {
  return useQuery({
    queryKey: ['resources'],
    queryFn: () => getResourceListAPI(),
  });
}
