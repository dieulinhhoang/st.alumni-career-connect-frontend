import React, { useState, useEffect } from 'react'
import { message } from 'antd'
import type { DataNode } from 'antd/es/tree'
import PageContentLayout from '@/components/layout/PageContentLayout'
import { usePermission } from '@/Global/hooks/usePermission'
import { PermissionEnum } from '@/features/Auth/type'
import { RESOURCE_LABEL_VI, ACTION_LABEL_VI } from '@/libs/rbac'

import {
  IRole,
  IRoleQuery,
  ICreateRoleBody,
  IPermissionInput,
} from '../../features/Role/type'
import {
  useGetListRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useGetRoleDetail,
  useGetResourceList,
} from '../../features/Role/hooks/query'

import RoleListView from './RoleListView'
import RoleFormView from './RoleFormView'

export type ViewMode = 'list' | 'create' | 'edit' | 'view'

const buildPermissionsFromChecked = (checked: React.Key[]): IPermissionInput[] => {
  return checked
    .map(String)
    .filter((key) => key.includes(':'))
    .map((key) => {
      const [resource, action] = key.split(':')
      return { resource, action }
    })
}

const RoleManagement: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const { havePermission } = usePermission()

  const canCreate = havePermission(PermissionEnum.ROLE_CREATE)
  const canUpdate = havePermission(PermissionEnum.ROLE_UPDATE)
  const canDelete = havePermission(PermissionEnum.ROLE_DELETE)

  const [view, setView] = useState<ViewMode>('list')
  const [query, setQuery] = useState<IRoleQuery>({ page: 0, size: 10, code: '', name: '' })
  const [roleId, setRoleId] = useState<string | null>(null)

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])

  const { data: listData, isLoading: listLoading } = useGetListRoles(query)
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const deleteRole = useDeleteRole()
  const { data: resourceList } = useGetResourceList()

  const { data: roleDetail } = useGetRoleDetail({
    id: roleId || undefined,
    enabled: !!roleId && (view === 'edit' || view === 'view'),
  })

  useEffect(() => {
    if (roleDetail && (view === 'edit' || view === 'view')) {
      setCode(roleDetail.code)
      setName(roleDetail.name)
      setDescription(roleDetail.description || '')
      if (roleDetail.permissions) {
        setCheckedKeys(roleDetail.permissions.map((p) => `${p.resource}:${p.action}`))
      }
    }
  }, [roleDetail, view])

  const resetForm = () => {
    setCode('')
    setName('')
    setDescription('')
    setCheckedKeys([])
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
    setRoleId(role._id)
    setCode(role.code)
    setName(role.name)
    setDescription(role.description || '')
  }

  const openView = (role: IRole) => {
    setView('view')
    setRoleId(role._id)
    setCode(role.code)
    setName(role.name)
    setDescription(role.description || '')
  }

  const handleDelete = (id: string) => {
    if (!canDelete) return messageApi.warning('Không có quyền')
    deleteRole.mutate(id, {
      onSuccess: () => messageApi.success('Xóa vai trò thành công'),
      onError: () => messageApi.error('Xóa vai trò không thành công'),
    })
  }

  const handleSubmit = (values: any) => {
    const body: ICreateRoleBody = {
      code: values.code.trim(),
      name: values.name.trim(),
      description: values.description?.trim(),
      permissions: buildPermissionsFromChecked(checkedKeys),
    }

    if (view === 'create') {
      createRole.mutate(body, {
        onSuccess: () => {
          messageApi.success('Tạo mới vai trò thành công')
          handleBackToList()
        },
        onError: () => messageApi.error('Tạo mới không thành công'),
      })
    } else if (view === 'edit' && roleId) {
      updateRole.mutate(
        { id: roleId, body },
        {
          onSuccess: () => {
            messageApi.success('Cập nhật vai trò thành công')
            handleBackToList()
          },
          onError: () => messageApi.error('Cập nhật không thành công'),
        }
      )
    }
  }

  const treeData: DataNode[] = (resourceList || []).map((r) => ({
    key: r.code,
    title: RESOURCE_LABEL_VI[r.code] ?? r.code,
    children: r.actions.map((action) => ({
      key: `${r.code}:${action}`,
      title: ACTION_LABEL_VI[action] ?? action,
    })),
  }))

  return (
    <>
      {contextHolder}
      <PageContentLayout breadcrumbs={[]} title="Vai Trò">
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
                page: p.current - 1,
                size: p.pageSize,
              }))
            }
          />
        ) : (
          <RoleFormView
            view={view}
            code={code}
            name={name}
            description={description}
            setCode={setCode}
            setName={setName}
            setDescription={setDescription}
            onBack={handleBackToList}
            onSubmit={handleSubmit}
            submitting={createRole.isPending || updateRole.isPending}
            treeData={treeData}
            checkedKeys={checkedKeys}
            setCheckedKeys={setCheckedKeys}
          />
        )}
      </PageContentLayout>
    </>
  )
}

export default RoleManagement
