import React, { useState, useEffect } from 'react'
import { message } from 'antd'
import { useQueryClient } from '@tanstack/react-query'
import { usePermission } from '../../../global/hooks/usePermission'
// import { PermissionEnum } from '../../../feature/auth/type'

import {
  useGetListRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useGetRoleDetail,
} from '../../../feature/role/hook/query'

import RoleListView from './RoleListView'
import RoleFormView from './RoleFormView'
import AdminLayout from '../../../components/layout/AdminLayout'
import type { ICreateRoleBody, IRole, IRoleQuery } from '../../../feature/role/type'

export type ViewMode = 'list' | 'create' | 'edit' | 'view'

const RoleManagement: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const queryClient = useQueryClient()
  const { havePermission } = usePermission()

  // const canCreate = havePermission(PermissionEnum.ROLE_CREATE)
  // const canUpdate = havePermission(PermissionEnum.ROLE_UPDATE)
  // const canDelete = havePermission(PermissionEnum.ROLE_DELETE)
  const canCreate = true
  const canUpdate = true
  const canDelete = true

  const [view, setView] = useState<ViewMode>('list')
  const [query, setQuery] = useState<IRoleQuery>({
    page: 0,
    size: 10,
    name: '',
  })
  const [roleId, setRoleId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const { data: listData, isLoading: listLoading } = useGetListRoles(query)
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const deleteRole = useDeleteRole()

  const { data: roleDetail } = useGetRoleDetail({
    id: roleId || undefined,
    enabled: !!roleId && (view === 'edit' || view === 'view'),
  })

  useEffect(() => {
    if (roleDetail && (view === 'edit' || view === 'view')) {
      setName(roleDetail.name || '')
      setDescription(roleDetail.description || '')
    }
  }, [roleDetail, view])

  const resetForm = () => {
    setName('')
    setDescription('')
  }

  const handleBackToList = () => {
    setView('list')
    setRoleId(null)
    resetForm()
  }

  const openCreate = () => {
    if (!canCreate) return messageApi.warning('Không có quyền')
    setView('create')
    setRoleId(null)
    resetForm()
  }

  const openEdit = (role: IRole) => {
    if (!canUpdate) return messageApi.warning('Không có quyền')
    setView('edit')
    setRoleId(String(role.id))
    setName(role.name || '')
    setDescription(role.description || '')
  }

  const openView = (role: IRole) => {
    setView('view')
    setRoleId(String(role.id))
    setName(role.name || '')
    setDescription(role.description || '')
  }

  const handleDelete = (id: string) => {
    if (!canDelete) return messageApi.warning('Không có quyền')

    deleteRole.mutate(id, {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ['roles'] })
        messageApi.success('Xóa vai trò thành công')
      },
      onError: () => messageApi.error('Xóa vai trò không thành công'),
    })
  }

  const handleSubmit = (values: any) => {
    const body: ICreateRoleBody = {
      name: values.name.trim(),
      description: values.description?.trim(),
    }

    if (view === 'create') {
      createRole.mutate(body, {
        onSuccess: async () => {
          await queryClient.refetchQueries({ queryKey: ['roles'] })
          messageApi.success('Tạo mới vai trò thành công')
          handleBackToList()
        },
        onError: () => messageApi.error('Tạo mới không thành công'),
      })
    } else if (view === 'edit' && roleId) {
      updateRole.mutate(
        { id: roleId, body },
        {
          onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ['roles'] })
            await queryClient.invalidateQueries({ queryKey: ['role-detail', roleId] })
            messageApi.success('Cập nhật vai trò thành công')
            handleBackToList()
          },
          onError: () => messageApi.error('Cập nhật không thành công'),
        },
      )
    }
  }

  return (
    <>
      {contextHolder}
      <AdminLayout>
        <div>
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
              onTableChange={(p: any) =>
                setQuery((prev) => ({
                  ...prev,
                  page: (p.current ?? 1) - 1,
                  size: p.pageSize ?? 10,
                }))
              }
            />
          ) : (
            <RoleFormView
              view={view}
              name={name}
              description={description}
              setName={setName}
              setDescription={setDescription}
              onBack={handleBackToList}
              onSubmit={handleSubmit}
              submitting={createRole.isPending || updateRole.isPending}
            />
          )}
        </div>
      </AdminLayout>
    </>
  )
}

export default RoleManagement