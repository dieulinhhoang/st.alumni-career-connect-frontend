import api from '../../libs/api'
import type { IApiKey, ICreateApiKeyBody, ICreateApiKeyResponse } from './type'

export const listApiKeysAPI = async (): Promise<IApiKey[]> => {
  const { data } = await api.get('/external-api/keys')
  return data
}

export const createApiKeyAPI = async (body: ICreateApiKeyBody): Promise<ICreateApiKeyResponse> => {
  const { data } = await api.post('/external-api/keys', body)
  return data
}

export const revokeApiKeyAPI = async (id: number): Promise<void> => {
  await api.patch(`/external-api/keys/${id}/revoke`)
}

export const deleteApiKeyAPI = async (id: number): Promise<void> => {
  await api.delete(`/external-api/keys/${id}`)
}
