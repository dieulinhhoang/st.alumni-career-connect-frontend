import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    getListResourceAPI,
    createResourceAPI,
    updateResourceAPI,
    deleteResourceAPI,
} from '../api'
import {
    IResource,
    IResourceQuery,
    ICreateResource,
    IUpdateResource,
} from '../type'



export const useGetListResources = (query: IResourceQuery) => {
  return useQuery({
    queryKey: ['resources', query],
    queryFn: () => getListResourceAPI(query),
    select: (res: any) => ({
      data: Array.isArray(res?.data) ? res.data : [],
      page: res?.page ?? { total_elements: 0 },
    }),
  })
}


export const useCreateResource = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (body: ICreateResource) => createResourceAPI(body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['resources'],
            })
        },
    })
}

export const useUpdateResource = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            body,
        }: {
            id: string
            body: IUpdateResource
        }) => updateResourceAPI(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['resources'],
            })
        },
    })
}


export const useDeleteResource = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteResourceAPI(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['resources'],
            })
        },
    })
}
