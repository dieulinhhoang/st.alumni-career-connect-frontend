import {api} from '@/libs/api'
import { IRole, IRoleListResponse, IRoleQuery,ICreateRoleBody, IResourceItem } from './type';

export const getListRoleAPI = async(params:IRoleQuery): Promise<IRoleListResponse> =>{
    const {data}= await api.get(`/v1.0/roles`, { params });
    return data;
}

export const createRoleAPI = async (body:ICreateRoleBody): Promise<IRole>=>{
    const {data} =await api.post(`/v1.0/roles/`,body)
    return data.data;
}

export const deleteRoleAPI = async (id:string):Promise<any> =>{
    const {data} = await api.delete(`/v1.0/roles/${id}`)
    return data;
}

// export const updateRoleAPI = async (id:string , body:ICreateRoleBody):Promise<IRole> =>{
//     const {data} = await api.put(`/v1.0/roles/${id}`);
//     return data.data;
// }
export const updateRoleAPI = async (id: string,body: ICreateRoleBody): Promise<void> => {
  await api.put(`/v1.0/roles/${id}`, body)
}

export const getRoleDetailAPI = async (id:string):Promise<any> =>{
     const {data} = await api.get(`/v1.0/roles/${id}`);
    return data;
}

export const getResourceListAPI = async (): Promise<IResourceItem[]> => {
  const { data } = await api.get('/v1.0/resources')
  return data.data;
}