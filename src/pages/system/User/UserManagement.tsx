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
  useAssignUserRoles,
} from '../../../feature/user/hook/query'

const UserManagement: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const [query, setQuery] = useState({
    page: 0,
    size: 10,
    sso_id: '',
    fullName: '',
    code: '',
    status: '',
    type: '',
    facultyId: '',
  })

  const [ssoId, setSsoId] = useState('')
  const [fullName, setFullName] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('active')
  const [type, setType] = useState('officer')
  const [facultyId, setFacultyId] = useState<number | null>(null)

  const [mode, setMode] = useState<'create' | 'edit' | 'view'>('view')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  const { data: listData, isLoading: listLoading } = useGetListUsers(query)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const isSuspended = useIsSuspended()
  const assignRoles = useAssignUserRoles()

  const resetForm = () => {
    setSsoId('')
    setFullName('')
    setCode('')
    setStatus('active')
    setType('officer')
    setFacultyId(null)
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
    setFacultyId(user.facultyId ?? null)
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
    setFacultyId(user.facultyId ?? null)
    setIsUserModalOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteUser.mutate(id, {
      onSuccess: () => messageApi.success('Xóa người dùng thành công'),
      onError: () => messageApi.error('Xóa người dùng thất bại'),
    })
  }

  /**
   * handleSubmit: lưu thông tin user.
   * Role assignment được xử lý bên trong UserModal (tab Vai trò).
   */
  const handleSubmit = (roleIds?: number[]) => {
    if (mode === 'create') {
      const body = {
        sso_id: ssoId.trim(),
        fullName: fullName.trim(),
        code: code.trim() || undefined,
        status,
        type,
        facultyId,
      }

      createUser.mutate(body as any, {
        onSuccess: async (created: any) => {
          // Nếu có roles được chọn trong lúc tạo
          if (roleIds?.length && created?.id) {
            await assignRoles.mutateAsync({
              id: String(created.id),
              roleIds,
            })
          }
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
        facultyId,
      }

      updateUser.mutate(
        { id: currentUserId, body: body as any },
        {
          onSuccess: async () => {
            // Gán roles nếu có thay đổi
            if (roleIds !== undefined) {
              await assignRoles.mutateAsync({
                id: currentUserId,
                roleIds,
              })
            }
            messageApi.success('Cập nhật người dùng thành công')
            setIsUserModalOpen(false)
            resetForm()
          },
          onError: () => messageApi.error('Cập nhật người dùng thất bại'),
        },
      )
    }
  }

  const onToggleStatus = (record: IUser) => {
    isSuspended.mutate(
      { id: String(record.id) },
      {
        onSuccess: () =>
          messageApi.success('Cập nhật trạng thái thành công'),
        onError: () =>
          messageApi.error('Cập nhật trạng thái thất bại'),
      },
    )
  }

  return (
    <>
      {contextHolder}
      <AdminLayout>
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
            setQuery((prev) => ({
              ...prev,
              page: (p.current ?? 1) - 1,
              size: p.pageSize ?? 10,
            }))
          }
        />

        <UserModal
          isOpen={isUserModalOpen}
          mode={mode}
          userId={currentUserId}
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
          facultyId={facultyId}
          setFacultyId={setFacultyId}
          onOk={handleSubmit}
          onCancel={() => {
            setIsUserModalOpen(false)
            resetForm()
          }}
          confirmLoading={
            createUser.isPending ||
            updateUser.isPending ||
            assignRoles.isPending
          }
        />
      </AdminLayout>
    </>
  )
}

export default UserManagement