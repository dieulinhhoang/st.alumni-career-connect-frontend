import React, { useEffect, useState } from 'react'
import {
  Checkbox,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Tabs,
  Tag,
} from 'antd'
import { useGetUserRoles, useAssignUserRoles } from '../../../feature/user/hook/query'
import type { IRole } from '../../../feature/role/type'

type Props = {
  isOpen: boolean
  mode: 'create' | 'edit' | 'view'
  userId?: string | null

  ssoId: string
  setSsoId: (v: string) => void
  fullName: string
  setFullName: (v: string) => void
  code: string
  setCode: (v: string) => void
  status: string
  setStatus: (v: string) => void
  type: string
  setType: (v: string) => void

  onOk: () => void
  onCancel: () => void
  confirmLoading?: boolean
}

const UserModal: React.FC<Props> = ({
  isOpen,
  mode,
  userId,
  ssoId,
  setSsoId,
  fullName,
  setFullName,
  code,
  setCode,
  status,
  setStatus,
  type,
  setType,
  onOk,
  onCancel,
  confirmLoading,
}) => {
  const [form] = Form.useForm()
  const isEdit = mode === 'edit'
  const isView = mode === 'view'
  const isCreate = mode === 'create'

  // Role assignment state
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([])
  const [rolesDirty, setRolesDirty] = useState(false)

  const { data: userRolesData, isLoading: loadingRoles } = useGetUserRoles({
    id: userId || undefined,
    enabled: !!userId && isOpen && !isCreate,
  })

  const assignRoles = useAssignUserRoles()

  // Sync roles khi data load
  useEffect(() => {
    if (userRolesData?.assignedRoleIds) {
      setSelectedRoleIds(userRolesData.assignedRoleIds)
      setRolesDirty(false)
    }
  }, [userRolesData])

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ ssoId, fullName, code, status, type })
      if (isCreate) {
        setSelectedRoleIds([])
        setRolesDirty(false)
      }
    } else {
      form.resetFields()
      setSelectedRoleIds([])
      setRolesDirty(false)
    }
  }, [isOpen, ssoId, fullName, code, status, type, isCreate, form])

  const handleOk = async () => {
    // Lưu thông tin user trước
    onOk()

    // Nếu có thay đổi role (edit) → gán roles
    if ((isEdit || isCreate) && rolesDirty && userId) {
      await assignRoles.mutateAsync({ id: userId, roleIds: selectedRoleIds })
    }
  }

  const handleRoleChange = (roleId: number, checked: boolean) => {
    setRolesDirty(true)
    setSelectedRoleIds((prev) =>
      checked ? [...prev, roleId] : prev.filter((id) => id !== roleId),
    )
  }

  const allRoles: IRole[] = userRolesData?.roles ?? []

  const infoTab = (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        {isCreate && (
          <Col span={24}>
            <Form.Item
              label="SSO ID"
              name="ssoId"
              rules={[{ required: true, message: 'Vui lòng nhập SSO ID' }]}
            >
              <Input
                value={ssoId}
                onChange={(e) => setSsoId(e.target.value)}
                placeholder="Nhập SSO ID"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </Col>
        )}

        <Col span={24}>
          <Form.Item label="Họ và tên" name="fullName">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Họ và tên"
              disabled={isView}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Mã người dùng" name="code">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Mã người dùng"
              disabled={isView}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Trạng thái" name="status">
            <Select
              value={status}
              onChange={setStatus}
              disabled={isView}
              style={{ borderRadius: 8 }}
              options={[
                { value: 'active', label: 'Hoạt động' },
                { value: 'inactive', label: 'Tạm khoá' },
              ]}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Loại người dùng" name="type">
            <Select
              value={type}
              onChange={setType}
              disabled={isView}
              options={[
                { value: 'officer', label: 'Nhân viên' },
                { value: 'admin', label: 'Quản trị viên' },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )

  const rolesTab = (
    <div>
      {isCreate && !userId ? (
        <div style={{ color: '#6b7280', fontSize: 13, padding: '8px 0' }}>
          Lưu thông tin người dùng trước, sau đó có thể gán role.
        </div>
      ) : loadingRoles ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
          <Spin tip="Đang tải danh sách role..." />
        </div>
      ) : allRoles.length === 0 ? (
        <Empty description="Chưa có role nào" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {allRoles.map((role) => {
            const isAssigned = selectedRoleIds.includes(Number(role.id))
            return (
              <div
                key={role.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid',
                  borderColor: isAssigned ? '#93c5fd' : '#e5e7eb',
                  background: isAssigned ? '#eff6ff' : '#fafafa',
                  transition: 'all 0.2s',
                  cursor: isView ? 'default' : 'pointer',
                }}
                onClick={() =>
                  !isView && handleRoleChange(Number(role.id), !isAssigned)
                }
              >
                <Checkbox
                  checked={isAssigned}
                  disabled={isView}
                  onChange={(e) =>
                    handleRoleChange(Number(role.id), e.target.checked)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, color: '#111827' }}>
                    {role.name}
                  </div>
                  {role.code && (
                    <div style={{ fontSize: 11, color: '#6b7280' }}>
                      {role.code}
                    </div>
                  )}
                </div>
                {role.description && (
                  <div style={{ fontSize: 12, color: '#9ca3af', maxWidth: 180, textAlign: 'right' }}>
                    {role.description}
                  </div>
                )}
                {isAssigned && (
                  <Tag color="blue" style={{ borderRadius: 6, margin: 0 }}>
                    Đã gán
                  </Tag>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <Modal
      title={
        isView
          ? `Xem người dùng — ${fullName || ssoId}`
          : isEdit
            ? `Chỉnh sửa — ${fullName || ssoId}`
            : 'Tạo người dùng'
      }
      open={isOpen}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading || assignRoles.isPending}
      okButtonProps={{ disabled: isView }}
      width={660}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Tabs
        defaultActiveKey="info"
        items={[
          { key: 'info', label: 'Thông tin', children: infoTab },
          {
            key: 'roles',
            label: (
              <span>
                Vai trò{' '}
                {selectedRoleIds.length > 0 && (
                  <Tag color="blue" style={{ borderRadius: 10, marginLeft: 4 }}>
                    {selectedRoleIds.length}
                  </Tag>
                )}
              </span>
            ),
            children: rolesTab,
          },
        ]}
      />
    </Modal>
  )
}

export default UserModal