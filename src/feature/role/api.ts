import request from '../../global/config/request'

export const getListRoleAPI = (params: any) => {
  return request.get('/role', { params })
}

export const getRoleDetailAPI = (id: string) => {
  return request.get(`/role/${id}`)
}

export const createRoleAPI = (body: any) => {
  return request.post('/role', body)
}

export const updateRoleAPI = (id: string, body: any) => {
  return request.put(`/role/${id}`, body)
}

export const deleteRoleAPI = (id: string) => {
  return request.delete(`/role/${id}`)
}

export const getRolePermissionsAPI = (id: string) => {
  return request.get(`/role/${id}/permissions`)
}

export const assignRolePermissionsAPI = (id: string, permissionIds: number[]) => {
  return request.post(`/role/${id}/permissions`, { permissionIds })
}

export const getAllPermissionsAPI = () => {
  return request.get('/role/permissions/all')
}
