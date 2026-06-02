import React, { useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Space,
  Form,
  Checkbox,
  Typography,
  Divider,
  Empty,
  Spin,
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'

const { Text } = Typography

type ViewMode = 'view' | 'create' | 'edit'

interface PermissionItem {
  id: number
  name: string
  code: string
  isGranted?: boolean
}

interface PermissionGroup {
  id: number
  name: string
  code: string
  permissions: PermissionItem[]
}

interface RoleFormViewProps {
  view: ViewMode
  name: string
  description: string
  permissionGroups: PermissionGroup[]
  selectedPermissionIds: number[]
  loadingPermissions: boolean
  onBack: () => void
  onSubmit: (values: any) => void
  submitting: boolean
}

const RoleFormView: React.FC<RoleFormViewProps> = ({
  view,
  name,
  description,
  permissionGroups,
  selectedPermissionIds,
  loadingPermissions,
  onBack,
  onSubmit,
  submitting,
}) => {
  const [form] = Form.useForm()
  const isView = view === 'view'

  useEffect(() => {
    form.setFieldsValue({
      name,
      description,
      permissionIds: selectedPermissionIds,
    })
  }, [name, description, selectedPermissionIds, form])

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
        <span style={{ fontWeight: 600, fontSize: 16 }}>
          {view === 'create' && 'Tạo mới vai trò'}
          {view === 'edit' && 'Chỉnh sửa vai trò'}
          {view === 'view' && 'Thông tin vai trò'}
        </span>
      </Space>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Tên vai trò"
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập tên vai trò!' },
                { max: 255, message: 'Tối đa 255 ký tự!' },
              ]}
            >
              <Input
                placeholder="Nhập tên vai trò"
                disabled={isView}
                style={{ height: 40, borderRadius: 8 }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ max: 255, message: 'Tối đa 255 ký tự!' }]}
            >
              <Input.TextArea
                placeholder="Nhập mô tả"
                disabled={isView}
                rows={4}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Divider style={{ marginTop: 4 }}>Phân quyền</Divider>

            {loadingPermissions ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                <Spin />
              </div>
            ) : permissionGroups?.length ? (
              <Form.Item name="permissionIds" style={{ marginBottom: 0 }}>
                <Checkbox.Group style={{ width: '100%' }} disabled={isView}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {permissionGroups.map((group) => (
                      <Card
                        key={group.id}
                        size="small"
                        style={{
                          borderRadius: 12,
                          border: '1px solid #edf2f7',
                          background: '#fafcff',
                        }}
                        bodyStyle={{ padding: 16 }}
                      >
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 600, color: '#1f2937' }}>{group.name}</div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {group.code}
                          </Text>
                        </div>

                        <Row gutter={[12, 12]}>
                          {group.permissions.map((permission) => (
                            <Col xs={24} sm={12} md={8} key={permission.id}>
                              <Checkbox value={permission.id}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: 500 }}>{permission.name}</span>
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    {permission.code}
                                  </Text>
                                </div>
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Card>
                    ))}
                  </div>
                </Checkbox.Group>
              </Form.Item>
            ) : (
              <Empty description="Chưa có dữ liệu quyền" />
            )}
          </Col>
        </Row>

        {!isView && (
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
              style={{
                borderRadius: 8,
                minWidth: 140,
                height: 40,
                background: '#1677ff',
                borderColor: '#1677ff',
              }}
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
