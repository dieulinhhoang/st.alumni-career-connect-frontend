import React, { useState } from 'react'
import { message } from 'antd'
import PageContentLayout from '@/components/layout/PageContentLayout'
import { ACTION_LABEL_VI } from '@/libs/rbac'

import {
  IResource,
  IResourceQuery,
  ICreateResource,
  IUpdateResource
} from '../../features/Resources/type'

import {
  useGetListResources,
  useCreateResource,
  useUpdateResource,
  useDeleteResource
} from '../../features/Resources/hook/query'

import ResourceListView from './ResourceListView'
import ResourceModal from './ResourceModal'

const ResourceManagement: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const [query, setQuery] = useState<IResourceQuery>({
    page: 0,
    size: 10
  })

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<IResource | null>(null)

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [actions, setActions] = useState<string[]>([''])

  const { data: listData, isLoading, refetch } = useGetListResources(query)
  const createResource = useCreateResource()
  const updateResource = useUpdateResource()
  const deleteResource = useDeleteResource()

  const resetForm = () => {
    setCode('')
    setActions([''])
  }

  const openCreate = () => {
    setMode('create')
    setEditing(null)
    resetForm()
    setOpen(true)
  }

  const openEdit = (resource: IResource) => {
    setMode('edit')
    setEditing(resource)
    setCode(resource.code || '')
    setName(resource.name || '')
    setActions(resource.actions?.length ? resource.actions : [''])
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
    setEditing(null)
    resetForm()
  }

  const handleDelete = (id: string) => {
    deleteResource.mutate(id, {
      onSuccess: () => {
        messageApi.success('Xoá tài nguyên thành công')
        refetch()
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Xoá tài nguyên thất bại'
        messageApi.error(msg)
      }
    })
  }

  const handleSubmit = () => {
    const cleanCode = code.trim()

    // trim + bỏ rỗng + uniq
    const cleanActions = Array.from(
      new Set(actions.map((a) => a.trim()).filter(Boolean))
    )

    if (!cleanCode) return messageApi.error('Vui lòng nhập mã tài nguyên')
    if (!cleanActions.length)
      return messageApi.error('Vui lòng nhập ít nhất 1 chức năng')

    if (mode === 'create') {
      const body: ICreateResource = {
        name: name.trim(),
        code: cleanCode,
        actions: cleanActions
      }

      return createResource.mutate(body, {
        onSuccess: () => {
          messageApi.success('Tạo tài nguyên thành công')
          closeModal()
          refetch()
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            'Tạo tài nguyên thất bại'
          messageApi.error(msg)
        }
      })
    }

    if (mode === 'edit' && editing?._id) {
      const body: IUpdateResource = {
        name: name.trim(),
        code: cleanCode,
        actions: cleanActions
      }

      return updateResource.mutate(
        { id: editing._id, body },
        {
          onSuccess: () => {
            messageApi.success('Cập nhật tài nguyên thành công')
            closeModal()
            refetch()
          },
          onError: (err: any) => {
            const msg =
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              'Cập nhật tài nguyên thất bại'
            messageApi.error(msg)
          }
        }
      )
    }
  }

  const handleTableChange = (pagination: any) => {
    setQuery((prev) => ({
      ...prev,
      page: (pagination.current || 1) - 1,
      size: pagination.pageSize || prev.size
    }))
  }

  return (
    <>
      {contextHolder}

      <PageContentLayout breadcrumbs={[]} title="Resources">
        <ResourceListView
          query={query}
          setQuery={setQuery}
          listData={listData}
          loading={isLoading}
          onCreate={openCreate}
          onEdit={openEdit}
          onDelete={handleDelete}
          onTableChange={handleTableChange}
        />

        <ResourceModal
          isOpen={open}
          mode={mode}
          code={code}
          setCode={setCode}
          name={name}
          setName={setName}
          actions={actions}
          setActions={setActions}
          onOk={handleSubmit}
          onCancel={closeModal}
          confirmLoading={createResource.isPending || updateResource.isPending}
        />
      </PageContentLayout>
    </>
  )
}

export default ResourceManagement
