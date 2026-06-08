import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import type { IRoleResource, IResourceAssignment } from '../../../feature/role/type'

const { Text } = Typography

// Label tiếng Việt cho từng action
const ACTION_LABELS: Record<string, string> = {
  read: 'Xem',
  create: 'Tạo',
  update: 'Sửa',
  delete: 'Xoá',
  export: 'Xuất',
  import: 'Nhập',
  approve: 'Duyệt',
}

const ACTION_COLORS: Record<string, string> = {
  read: 'blue',
  create: 'green',
  update: 'orange',
  delete: 'red',
  export: 'purple',
  import: 'cyan',
  approve: 'gold',
}

type ViewMode = 'view' | 'create' | 'edit'

interface RoleFormViewProps {
  view: ViewMode
  name: string
  description: string
  code?: string
  resources: IRoleResource[]
  loadingResources: boolean
  onBack: () => void
  onSubmit: (values: {
    name: string
    code?: string
    description?: string
    assignments: IResourceAssignment[]
  }) => void
  submitting: boolean
}

const RoleFormView: React.FC<RoleFormViewProps> = ({
  view,
  name,
  description,
  code,
  resources,
  loadingResources,
  onBack,
  onSubmit,
  submitting,
}) => {
  const [form] = Form.useForm()
  const isView = view === 'view'

  // Map: resourceId → Set<action>
  const [checked, setChecked] = useState<Record<number, Set<string>>>({})

  // Khởi tạo checked state từ resources
  useEffect(() => {
    const initial: Record<number, Set<string>> = {}
    for (const res of resources) {
      initial[res.id] = new Set(
        res.actions.filter((a) => a.isGranted).map((a) => a.action),
      )
    }
    setChecked(initial)
  }, [resources])

  useEffect(() => {
    form.setFieldsValue({ name, description, code })
  }, [name, description, code, form])

  const toggleAction = (resourceId: number, action: string) => {
    setChecked((prev) => {
      const next = new Set(prev[resourceId] ?? [])
      if (next.has(action)) next.delete(action)
      else next.add(action)
      return { ...prev, [resourceId]: next }
    })
  }

  const toggleAllActions = (resourceId: number, allActions: string[]) => {
    const current = checked[resourceId] ?? new Set()
    const allGranted = allActions.every((a) => current.has(a))
    setChecked((prev) => ({
      ...prev,
      [resourceId]: allGranted ? new Set() : new Set(allActions),
    }))
  }

  const handleFinish = (values: any) => {
    const assignments: IResourceAssignment[] = resources
      .map((res) => ({
        resourceId: Number(res.id),
        actions: Array.from(checked[res.id] ?? []),
      }))
      .filter((a) => a.actions.length > 0)

    onSubmit({
      name: values.name?.trim(),
      code: values.code?.trim() || undefined,
      description: values.description?.trim(),
      assignments,
    })
  }

  const titleMap = {
    create: 'Tạo mới vai trò',
    edit: 'Chỉnh sửa vai trò',
    view: 'Thông tin vai trò',
  }

  return (
    <Card
      style={{
        borderRadius: 14,
        border: '1px solid #e8edf3',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
      }}
    >
      <Space style={{ marginBottom: 20 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          Quay lại
        </Button>
        <span style={{ fontWeight: 600, fontSize: 16 }}>{titleMap[view]}</span>
      </Space>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={24}>
          {/* Tên vai trò */}
          <Col xs={24} md={12}>
            <Form.Item
              label="Tên vai trò"
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập tên vai trò!' },
                { max: 255, message: 'Tối đa 255 ký tự' },
              ]}
            >
              <Input
                placeholder="VD: Quản lý khoa"
                disabled={isView}
                style={{ height: 40, borderRadius: 8 }}
              />
            </Form.Item>
          </Col>

          {/* Code */}
          <Col xs={24} md={12}>
            <Form.Item
              label="Mã code"
              name="code"
              tooltip="Dùng để identify role trong hệ thống, VD: quan_ly_khoa"
              rules={[
                { max: 100, message: 'Tối đa 100 ký tự' },
                {
                  pattern: /^[a-z0-9_]*$/,
                  message: 'Chỉ chữ thường, số và dấu gạch dưới',
                },
              ]}
            >
              <Input
                placeholder="VD: quan_ly_khoa"
                disabled={isView}
                style={{ height: 40, borderRadius: 8 }}
              />
            </Form.Item>
          </Col>

          {/* Mô tả */}
          <Col span={24}>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ max: 255, message: 'Tối đa 255 ký tự' }]}
            >
              <Input.TextArea
                placeholder="Mô tả vai trò này"
                disabled={isView}
                rows={3}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ marginTop: 4 }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>
            Phân quyền tài nguyên
          </span>
        </Divider>

        {loadingResources ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <Spin tip="Đang tải quyền..." />
          </div>
        ) : resources.length === 0 ? (
          <Empty description="Chưa có tài nguyên nào" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {resources.map((res) => {
              const allActions = res.actions.map((a) => a.action)
              const grantedSet = checked[res.id] ?? new Set()
              const grantedCount = allActions.filter((a) => grantedSet.has(a)).length
              const isAllGranted = grantedCount === allActions.length && allActions.length > 0

              return (
                <Card
                  key={res.id}
                  size="small"
                  style={{
                    borderRadius: 10,
                    border: '1px solid #e5e7eb',
                    background: grantedCount > 0 ? '#f0f7ff' : '#fafafa',
                    transition: 'background 0.2s',
                  }}
                  bodyStyle={{ padding: '12px 16px' }}
                >
                  <Row align="middle" gutter={12}>
                    {/* Tên resource + checkbox "Tất cả" */}
                    <Col xs={24} sm={7} style={{ marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {!isView && (
                          <Checkbox
                            checked={isAllGranted}
                            indeterminate={grantedCount > 0 && !isAllGranted}
                            onChange={() => toggleAllActions(res.id, allActions)}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: '#111827', fontSize: 13 }}>
                            {res.name}
                          </div>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {res.code}
                          </Text>
                        </div>
                      </div>
                    </Col>

                    {/* Actions */}
                    <Col xs={24} sm={17}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {res.actions.length === 0 ? (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Không có action
                          </Text>
                        ) : (
                          res.actions.map(({ action }) => {
                            const granted = grantedSet.has(action)
                            const label = ACTION_LABELS[action] ?? action
                            const color = ACTION_COLORS[action] ?? 'default'

                            if (isView) {
                              return granted ? (
                                <Tag key={action} color={color} style={{ borderRadius: 6 }}>
                                  {label}
                                </Tag>
                              ) : (
                                <Tag
                                  key={action}
                                  style={{
                                    borderRadius: 6,
                                    background: '#f3f4f6',
                                    color: '#9ca3af',
                                    border: '1px solid #e5e7eb',
                                  }}
                                >
                                  {label}
                                </Tag>
                              )
                            }

                            return (
                              <Checkbox
                                key={action}
                                checked={granted}
                                onChange={() => toggleAction(res.id, action)}
                                style={{ userSelect: 'none' }}
                              >
                                <Tag
                                  color={granted ? color : 'default'}
                                  style={{
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    margin: 0,
                                    opacity: granted ? 1 : 0.5,
                                  }}
                                >
                                  {label}
                                </Tag>
                              </Checkbox>
                            )
                          })
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card>
              )
            })}
          </div>
        )}

        {!isView && (
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Button onClick={onBack} style={{ marginRight: 8 }}>
              Huỷ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
              style={{ borderRadius: 8, minWidth: 140, height: 40 }}
            >
              {view === 'create' ? 'Tạo mới' : 'Cập nhật'}
            </Button>
          </div>
        )}
      </Form>
    </Card>
  )
}

export default RoleFormView