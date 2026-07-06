import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createApiKeyAPI, deleteApiKeyAPI, listApiKeysAPI, revokeApiKeyAPI } from '../api'
import type { ICreateApiKeyBody } from '../type'

export const useListApiKeys = () =>
  useQuery({
    queryKey: ['api-keys'],
    queryFn: listApiKeysAPI,
  })

export const useCreateApiKey = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ICreateApiKeyBody) => createApiKeyAPI(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys'] }),
  })
}

export const useRevokeApiKey = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => revokeApiKeyAPI(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys'] }),
  })
}

export const useDeleteApiKey = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteApiKeyAPI(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys'] }),
  })
}
