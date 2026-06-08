import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGetListRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useGetRoleDetail,
  useGetRoleResources,
  useAssignRoleResources,
} from '../../../feature/role/hook/query'
import RoleListView from './RoleListView'
import RoleFormView from './RoleFormView'
import AdminLayout from '../../../components/layout/AdminLayout'
import type { IRole, IRoleQuery, IResourceAssignment } from '../../../feature/role/type'

export type ViewMode = 'list' | 'create' | 'edit' | 'view'

const RoleManagement: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const queryClient = useQueryClient()

  const [view, setView] = useState<ViewMode>('list')
  const [query, setQuery] = useState<IRoleQuery>({ page: 0, size: 10 })
  const [roleId, setRoleId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')

  const { data: listData, isLoading: listLoading } = useGetListRoles(query)

  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const deleteRole = useDeleteRole()
  const assignResources = useAssignRoleResources()

  const { data: roleDetail } = useGetRoleDetail({
    id: roleId || undefined,
    enabled: !!roleId && view !== 'list',
  })

  /**
   * GET /role/:id/resources → mảng [{ id, name, code, actions: [{action, isGranted}] }]
   * Dùng cho cả edit và view (với roleId), create sẽ lấy từ resources API (tất cả isGranted=false)
   */
  const { data: roleResources = [], isLoading: loadingResources } =
    useGetRoleResources({
      id: roleId || undefined,
      enabled: !!roleId && view !== 'list',
    })

  useEffect(() => {
    if (roleDetail && view !== 'list') {
      setName(roleDetail.name || '')
      setCode(roleDetail.code || '')
      setDescription(roleDetail.description || '')
    }
  }, [roleDetail, view])

  const resetForm = () => {
    setName('')
    setCode('')
    setDescription('')
  }

  const handleBackToList = () => {
    setView('list')
    setRoleId(null)
    resetForm()
  }

  const openCreate = () => {
    setView('create')
    setRoleId(null)
    resetForm()
  }

  const openEdit = (role: IRole) => {
    setView('edit')
    setRoleId(String(role.id))
  }

  const openView = (role: IRole) => {
    setView('view')
    setRoleId(String(role.id))
  }

  const handleDelete = (id: string) => {
    deleteRole.mutate(id, {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ['roles'] })
        messageApi.success('Xóa vai trò thành công')
      },
      onError: () => messageApi.error('Xóa vai trò thất bại'),
    })
  }

  const handleSubmit = async (values: {
    name: string
    code?: string
    description?: string
    assignments: IResourceAssignment[]
  }) => {
    const { assignments, ...roleBody } = values

    if (view === 'create') {
      createRole.mutate(roleBody, {
        onSuccess: async (created: any) => {
          const newId = String(created?.id)
          if (newId && assignments.length) {
            await assignResources.mutateAsync({ id: newId, assignments })
          }
          await queryClient.refetchQueries({ queryKey: ['roles'] })
          messageApi.success('Tạo vai trò thành công')
          handleBackToList()
        },
        onError: () => messageApi.error('Tạo vai trò thất bại'),
      })
    } else if (view === 'edit' && roleId) {
      updateRole.mutate(
        { id: roleId, body: roleBody },
        {
          onSuccess: async () => {
            await assignResources.mutateAsync({ id: roleId, assignments })
            await queryClient.refetchQueries({ queryKey: ['roles'] })
            messageApi.success('Cập nhật vai trò thành công')
            handleBackToList()
          },
          onError: () => messageApi.error('Cập nhật vai trò thất bại'),
        },
      )
    }
  }

  // Khi create: cần lấy tất cả resources (không có isGranted).
  // Ta dùng roleResources endpoint — nhưng cần roleId.
  // Giải pháp: khi create, dùng một roleId tạm hoặc lấy từ resources API riêng.
  // Ở đây dùng resources API (GET /resources) qua import riêng.
  // Xem CreateResourcesLoader component bên dưới.

  return (
    <>
      {contextHolder}
      <AdminLayout>
        {view === 'list' ? (
          <RoleListView
            query={query}
            setQuery={setQuery}
            listData={listData}
            loading={listLoading}
            onCreate={openCreate}
            onEdit={openEdit}
            onView={openView}
            onDelete={handleDelete}
            onTableChange={(p) =>
              setQuery((prev) => ({
                ...prev,
                page: (p.current ?? 1) - 1,
                size: p.pageSize ?? 10,
              }))
            }
          />
        ) : (
          <RoleFormView
            view={view as 'create' | 'edit' | 'view'}
            name={name}
            code={code}
            description={description}
            resources={roleResources}
            loadingResources={loadingResources}
            onBack={handleBackToList}
            onSubmit={handleSubmit}
            submitting={
              createRole.isPending ||
              updateRole.isPending ||
              assignResources.isPending
            }
          />
        )}
      </AdminLayout>
    </>
  )
}

export default RoleManagement