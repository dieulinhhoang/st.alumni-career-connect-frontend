import React, { useState } from 'react'
import { message } from 'antd'
import AdminLayout from '../../../components/layout/AdminLayout'
import UserListView from './UserListView'
import UserModal from './UserModal'
import type { IUser } from '../../../feature/user/type'
import {
  useCreateUser,
  useDeleteUser,
  useGetListUsers,
  useIsSuspended,
  useUpdateUser,
} from '../../../feature/user/hook/query'

const UserManagement: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [query, setQuery] = useState({ page: 0, size: 10 })

  const [ssoId, setSsoId] = useState('')
  const [fullName, setFullName] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('active')
  const [type, setType] = useState('officer')

  const [mode, setMode] = useState<'create' | 'edit' | 'view'>('view')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  const { data: listData, isLoading: listLoading } = useGetListUsers(query)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const isSuspended = useIsSuspended()

  const resetForm = () => {
    setSsoId('')
    setFullName('')
    setCode('')
    setStatus('active')
    setType('officer')
    setCurrentUserId(null)
  }

  const openCreate = () => {
    resetForm()
    setMode('create')
    setIsUserModalOpen(true)
  }

  const openEdit = (user: IUser) => {
    setMode('edit')
    setCurrentUserId(String(user.id))
    setSsoId(user.sso_id || '')
    setFullName(user.fullName || '')
    setCode(user.code || '')
    setStatus(user.status || 'active')
    setType(user.type || 'officer')
    setIsUserModalOpen(true)
  }

  const openView = (user: IUser) => {
    setMode('view')
    setCurrentUserId(String(user.id))
    setSsoId(user.sso_id || '')
    setFullName(user.fullName || '')
    setCode(user.code || '')
    setStatus(user.status || 'active')
    setType(user.type || 'officer')
    setIsUserModalOpen(true)
  }
console.log('List Data:', listData) // Debug log to check the data structure
  const handleDelete = (id: string) => {
    deleteUser.mutate(id, {
      onSuccess: () => messageApi.success('Xóa người dùng thành công'),
      onError: () => messageApi.error('Xóa người dùng thất bại'),
    })
  }

  const handleSubmit = () => {
    if (mode === 'create') {
      const body = {
        sso_id: ssoId.trim(),
        fullName: fullName.trim(),
        code: code.trim() || undefined,
        status,
        type,
      }

      createUser.mutate(body as any, {
        onSuccess: () => {
          messageApi.success('Tạo người dùng thành công')
          setIsUserModalOpen(false)
          resetForm()
        },
        onError: (err: any) =>
          messageApi.error(err?.response?.data?.message || 'Tạo người dùng thất bại'),
      })
    } else if (mode === 'edit' && currentUserId) {
      const body = {
        fullName: fullName.trim(),
        code: code.trim() || undefined,
        status,
        type,
      }

      updateUser.mutate(
        { id: currentUserId, body: body as any },
        {
          onSuccess: () => {
            messageApi.success('Cập nhật người dùng thành công')
            setIsUserModalOpen(false)
            resetForm()
          },
          onError: () => messageApi.error('Cập nhật người dùng thất bại'),
        },
      )
    }
  }

  const onToggleStatus = (record: IUser, checked: boolean) => {
    isSuspended.mutate(
      {
        id: String(record.id),
        isSuspended: !checked,
      },
      {
        onSuccess: () => {
          messageApi.success('Cập nhật trạng thái người dùng thành công')
        },
        onError: () => messageApi.error('Cập nhật trạng thái người dùng thất bại'),
      },
    )
  }

  return (
    <>
      {contextHolder}
      <AdminLayout>
        <div>
          <UserListView
            query={query}
            setQuery={setQuery}
            listData={listData}
            loading={listLoading}
            onCreate={openCreate}
            onEdit={openEdit}
            onView={openView}
            onDelete={handleDelete}
            onToggleStatus={onToggleStatus}
            onTableChange={(p: any) =>
              setQuery({
                ...query,
                page: (p.current ?? 1) - 1,
                size: p.pageSize,
              })
            }
          />

          <UserModal
            isOpen={isUserModalOpen}
            mode={mode}
            ssoId={ssoId}
            setSsoId={setSsoId}
            fullName={fullName}
            setFullName={setFullName}
            code={code}
            setCode={setCode}
            status={status}
            setStatus={setStatus}
            type={type}
            setType={setType}
            onOk={handleSubmit}
            onCancel={() => setIsUserModalOpen(false)}
            confirmLoading={createUser.isPending || updateUser.isPending}
          />
        </div>
      </AdminLayout>
    </>
  )
}

export default UserManagement