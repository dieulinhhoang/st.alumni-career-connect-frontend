import React, { useState, useEffect, useMemo } from 'react'
import { message } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { usePermission } from '../../../global/hooks/usePermission'
import { PermissionEnum } from '../../../feature/auth/type'

import {
  useGetListRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useGetRoleDetail,
  useGetResourceList,
} from '../../../feature/role/hooks/query'

import RoleListView from './RoleListView'
import RoleFormView from './RoleFormView'
import AdminLayout from '../../../components/layout/AdminLayout'
import type { ICreateRoleBody, IPermissionInput, IRole, IRoleQuery } from '../../../feature/role/type'

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

// Hàm chuyển đổi resource list thành treeData cho Ant Design Tree
const buildTreeDataFromResources = (resources: any[]): DataNode[] => {
  if (!resources || !Array.isArray(resources)) return []
  
  return resources.map((resource) => ({
    title: resource.name || resource.resourceName,
    key: resource.resourceKey || resource.code,
    children: resource.actions?.map((action: string) => ({
      title: `${resource.name || resource.resourceName} - ${action.toUpperCase()}`,
      key: `${resource.resourceKey || resource.code}:${action}`,
    })) || [],
  }))
}

const RoleManagement: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const { havePermission } = usePermission()

  // const canCreate = havePermission(PermissionEnum.ROLE_CREATE)
  // const canUpdate = havePermission(PermissionEnum.ROLE_UPDATE)
  // const canDelete = havePermission(PermissionEnum.ROLE_DELETE)
  const canCreate = true
  const canUpdate = true
  const canDelete = true
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
  const { data: resourceList, isLoading: resourcesLoading } = useGetResourceList()

  const { data: roleDetail } = useGetRoleDetail({
    id: roleId || undefined,
    enabled: !!roleId && (view === 'edit' || view === 'view'),
  })

  // Chuyển đổi resourceList thành treeData
  const treeData = useMemo(() => {
    return buildTreeDataFromResources(resourceList || [])
  }, [resourceList])

  useEffect(() => {
    if (roleDetail && (view === 'edit' || view === 'view')) {
      setCode(roleDetail.code)
      setName(roleDetail.name)
      setDescription(roleDetail.description || '')
      if (roleDetail.permissions) {
        setCheckedKeys(roleDetail.permissions.map((p: { resource: any; action: any }) => `${p.resource}:${p.action}`))
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
      </AdminLayout>
    </>
  )
}

export default RoleManagement