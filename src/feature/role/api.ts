import api from '../../libs/api'

//  CRUD Role 

export const getListRoleAPI = (params: any) =>
  api.get('/role', { params }).then((r) => r.data)

export const getRoleDetailAPI = (id: string) =>
  api.get(`/role/${id}`).then((r) => r.data)

export const createRoleAPI = (body: any) =>
  api.post('/role', body).then((r) => r.data)

export const updateRoleAPI = (id: string, body: any) =>
  api.put(`/role/${id}`, body).then((r) => r.data)

export const deleteRoleAPI = (id: string) =>
  api.delete(`/role/${id}`).then((r) => r.data)

//  Phân quyền resources 

/**
 * GET /role/:id/resources
 * Trả về: [{ id, name, code, actions: [{ action, isGranted }] }]
 */
export const getRoleResourcesAPI = (id: string) =>
  api.get(`/role/${id}/resources`).then((r) => r.data)

/**
 * POST /role/:id/resources
 * Body: { assignments: [{ resourceId, actions[] }] }
 */
export const assignRoleResourcesAPI = (
  id: string,
  assignments: { resourceId: number; actions: string[] }[],
) =>
  api
    .post(`/role/${id}/resources`, { assignments })
    .then((r) => r.data)