import React, { useState } from 'react'
import PageContentLayout from '@/components/layout/PageContentLayout'
import UserListView from './UserListView'
import UserModal from './UserModal'
import { message } from 'antd'
import {
  useCreateUser,
  useDeleteUser,
  useGetListUsers,
  useUpdateUser,
  useGetRolesUser,
  useChangeUserPassword,
  useIsSuspended,
} from '@/features/User/hook/query'
import { IUser } from '@/features/User/type'
import ChangePasswordModal from './ChangePasswordModal'

const UserManagement: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [query, setQuery] = useState({ page: 0, size: 10 })

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [userName, setUserName] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [bod, setBod] = useState<string | undefined>(undefined)
  const [sex, setSex] = useState<string>('')
  const [roleIds, setRoleIds] = useState<string[]>([])

  const [mode, setMode] = useState<'create' | 'edit' | 'view'>('view')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [currentUserName, setCurrentUserName] = useState('')
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const { data: listData, isLoading: listLoading } = useGetListUsers(query)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const changeUserPassword = useChangeUserPassword()
  const { data: roleList = [] } = useGetRolesUser({ page: 0, size: 10 })
  const isSuspended = useIsSuspended()

  const resetForm = () => {
    setFullName('')
    setEmail('')
    setMobile('')
    setUserName('')
    setAddress('')
    setRoleIds([])
    setPassword('')
    setBod('')
    setSex('')
    setCurrentUserId(null)
  }

  const openCreate = () => {
    resetForm()
    setMode('create')
    setIsUserModalOpen(true)
  }

  const openEdit = (user: IUser) => {
    setMode('edit')
    setCurrentUserId(user._id)
    setFullName(user.fullName || '')
    setEmail(user.email || '')
    setMobile(user.mobile || '')
    setUserName(user.userName || '')
    setAddress(user.address || '')
    setBod(user.bod)
    setSex(user.sex || '')
    setRoleIds(Array.isArray(user.roles) ? (user.roles as any[]).map((r) => r._id || r) : [])
    setIsUserModalOpen(true)
  }

  const openView = (user: IUser) => {
    setMode('view')
    setFullName(user.fullName || '')
    setEmail(user.email || '')
    setMobile(user.mobile || '')
    setUserName(user.userName || '')
    setAddress(user.address || '')
    setBod(user.bod)
    setSex(user.sex || '')
    setRoleIds(Array.isArray(user.roles) ? (user.roles as any[]).map((r) => r._id || r) : [])
    setIsUserModalOpen(true)
  }

  const openChangePassword = (user: IUser) => {
    setCurrentUserId(user._id)
    setCurrentUserName(user.userName || '')
    setIsChangePasswordOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteUser.mutate(id, {
      onSuccess: () => messageApi.success('Xóa người dùng thành công'),
      onError: () => messageApi.error('Xóa người dùng thất bại'),
    })
  }
  const handleChangePassword = (newPassword: string) => {
    if (!currentUserId) return
    changeUserPassword.mutate(
      { id: currentUserId, newPassword },
      {
        onSuccess: () => {
          setIsChangePasswordOpen(false)
          messageApi.success('Đổi mật khẩu thành công')
        },
        onError: () => messageApi.error('Đổi mật khẩu thất bại'),
      }
    )
  }
  const handleSubmit = () => {
    if (mode === 'create') {
      const body = {
        fullName: fullName.trim(),
        email,
        mobile,
        userName,
        address,
        roleIds,
        password,
        bod,
        sex,
      }

      createUser.mutate(body as any, {
        onSuccess: () => {
          messageApi.success('Tạo người dùng thành công')
          setIsUserModalOpen(false)
        },
        onError: (err: any) => messageApi.error(err?.response?.data?.message),
      })
    } else if (mode === 'edit' && currentUserId) {
      const body = {
        fullName: fullName.trim(),
        email,
        mobile,
        userName,
        address,
        roleIds,
        bod,
        sex,
      }

      updateUser.mutate(
        { id: currentUserId, body: body as any },
        {
          onSuccess: () => {
            messageApi.success('Cập nhật người dùng thành công')
            setIsUserModalOpen(false)
          },
          onError: () => messageApi.error('Cập nhật người dùng thất bại'),
        },
      )
    }
  }

  const onToggleStatus = (record: IUser, checked: boolean) => {
    isSuspended.mutate(
      { id: record._id, isSuspended: !checked },
      {
        onSuccess: () => {
          messageApi.success('Cập nhật người dùng thành công')
        },
        onError: () => messageApi.error('Cập nhật người dùng thất bại'),
      },

    )
  }
  // console.log('roleList ', roleList)
  return (
    <>
      {contextHolder}
      <PageContentLayout breadcrumbs={[]} title="Người dùng">
        <UserListView
          query={query}
          setQuery={setQuery}
          listData={listData}
          loading={listLoading}
          onCreate={openCreate}
          onEdit={openEdit}
          onView={openView}
          onDelete={handleDelete}
          onTableChange={(p: any) => setQuery({ ...query, page: (p.current ?? 1) - 1, size: p.pageSize })}
          roleList={roleList}
          onChangePassword={openChangePassword}
          onToggleStatus={onToggleStatus}
        />

        <UserModal
          isOpen={isUserModalOpen}
          mode={mode}
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          mobile={mobile}
          setMobile={setMobile}
          address={address}
          setAddress={setAddress}
          userName={userName}
          setUserName={setUserName}
          password={password}
          setPassword={setPassword}
          roleIds={roleIds}
          setRoleIds={setRoleIds}
          roleList={roleList}
          bod={bod}
          setBod={setBod}
          sex={sex}
          setSex={setSex}
          onOk={handleSubmit}
          onCancel={() => setIsUserModalOpen(false)}
          confirmLoading={createUser.isPending || updateUser.isPending}
        />

        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          userName={currentUserName}
          onOk={handleChangePassword}
          onCancel={() => setIsChangePasswordOpen(false)}
          confirmLoading={changeUserPassword.isPending}
        />
      </PageContentLayout>
    </>
  )
}

export default UserManagement