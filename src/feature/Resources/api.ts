import { api } from '@/libs/api'
import { IResource, IResourceQuery, ICreateResource, IUpdateResource } from './type'

export const getListResourceAPI = async (
  query?: IResourceQuery
): Promise<any> => {
  const params: any = {}

  // pagination
  if (typeof query?.page === 'number') params.page = query.page
  if (typeof query?.size === 'number') params.size = query.size

  // filter
  if (query?.code?.trim()) params.code = query.code.trim()
  if ((query as any)?.action?.trim()) params.action = (query as any).action.trim()

  const { data } = await api.get(`/v1.0/resources`, { params })
  return data
}


 export const createResourceAPI = async (body: ICreateResource): Promise<IResource> => {
  const { data } = await api.post(`/v1.0/resources/`, body)
  return data.data
}

 export const updateResourceAPI = async (
  id: string,
  body: IUpdateResource
): Promise<void> => {
  await api.put(`/v1.0/resources/${id}`, body)
}

 export const deleteResourceAPI = async (id: string): Promise<any> => {
  const { data } = await api.delete(`/v1.0/resources/${id}`)
  return data
}
