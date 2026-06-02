import api from '../../libs/api'

export const getListRoleAPI = (params: any) => {
  return api.get('/role', { params })
}

export const getRoleDetailAPI = (id: string) => {
  return api.get(`/role/${id}`)
}

export const createRoleAPI = (body: any) => {
  return api.post('/role', body)
}

export const updateRoleAPI = (id: string, body: any) => {
  return api.put(`/role/${id}`, body)
}

export const deleteRoleAPI = (id: string) => {
  return api.delete(`/role/${id}`)
}

export const getRolePermissionsAPI = (id: string) => {
  return api.get(`/role/${id}/permissions`)
}

export const assignRolePermissionsAPI = (id: string, permissionIds: number[]) => {
  return api.post(`/role/${id}/permissions`, { permissionIds })
}

export const getAllPermissionsAPI = () => {
  return api.get('/role/permissions/all')
}