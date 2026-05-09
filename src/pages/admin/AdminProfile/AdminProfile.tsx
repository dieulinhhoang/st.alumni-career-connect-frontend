import React, { useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from 'antd'
import { EditOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import AdminLayout from '../../../components/layout/AdminLayout'

const { Title, Text } = Typography

const AdminProfile: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl] = useState<string | undefined>(undefined)

  const initialValues = {
    fullName: 'Quản Trị Viên',
    userName: 'admin',
    email: 'admin@example.com',
    mobile: '0123456789',
    address: 'Hà Nội, Việt Nam',
    sex: 'MALE',
    bod: dayjs('1990-01-01'),
    roleName: 'Quản trị viên',
    roles: [
      'Quản trị viên',
      'Quản lý người dùng',
      'Quản lý biểu mẫu',
      'Xem thống kê',
    ],
  }

  const handleSave = (values: any) => {
    console.log('Cập nhật thông tin:', values)
    messageApi.success('Cập nhật thông tin thành công!')
    setIsEditing(false)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsEditing(false)
  }

  return (
    <>
      {contextHolder}
      <AdminLayout>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
          <div
            style={{
              marginBottom: 24,
              padding: '20px 24px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
              border: '1px solid #e5e7eb',
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              Thông tin tài khoản
            </Title>
            <Text type="secondary">
              Quản lý thông tin cá nhân và nhóm quyền của quản trị viên
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={7}>
              <Card
                style={{
                  textAlign: 'center',
                  borderRadius: 16,
                  border: '1px solid #eef2f7',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                }}
                styles={{ body: { padding: 24 } }}
              >
                <div
                  style={{
                    width: 112,
                    height: 112,
                    margin: '0 auto 16px',
                    padding: 4,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                  }}
                >
                  <Avatar
                    size={104}
                    src={avatarUrl}
                    icon={!avatarUrl ? <UserOutlined /> : undefined}
                    style={{ background: '#fff', color: '#7c3aed' }}
                  />
                </div>

                <Text strong style={{ display: 'block', fontSize: 18, marginBottom: 4 }}>
                  {form.getFieldValue('fullName') || initialValues.fullName}
                </Text>

                <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                  @{initialValues.userName}
                </Text>

                <Tag
                  color="purple"
                  style={{
                    borderRadius: 999,
                    padding: '6px 12px',
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 20,
                  }}
                >
                  {initialValues.roleName}
                </Tag>

                <div
                  style={{
                    marginTop: 8,
                    padding: 16,
                    borderRadius: 12,
                    background: '#f8fafc',
                    border: '1px solid #eef2f7',
                    textAlign: 'left',
                  }}
                >
                  <Text
                    type="secondary"
                    style={{ display: 'block', marginBottom: 12, fontWeight: 500 }}
                  >
                    Nhóm quyền
                  </Text>

                  <Space wrap size={[8, 8]}>
                    {initialValues.roles.map((role) => (
                      <Tag
                        key={role}
                        color="purple"
                        style={{ borderRadius: 999, padding: '4px 10px', marginInlineEnd: 0 }}
                      >
                        {role}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={17}>
              <Card
                style={{
                  borderRadius: 16,
                  border: '1px solid #eef2f7',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                }}
                extra={
                  !isEditing ? (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setIsEditing(true)}
                      style={{ borderRadius: 10 }}
                    >
                      Chỉnh sửa
                    </Button>
                  ) : null
                }
                title="Thông tin cá nhân"
              >
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={initialValues}
                  onFinish={handleSave}
                  disabled={!isEditing}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                      >
                        <Input placeholder="Nhập họ và tên" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item label="Tên đăng nhập" name="userName">
                        <Input placeholder="Tên đăng nhập" disabled />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          { required: true, message: 'Vui lòng nhập email' },
                          { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                      >
                        <Input placeholder="Nhập email" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Số điện thoại"
                        name="mobile"
                        rules={[
                          {
                            pattern: /^[0-9]{9,11}$/,
                            message: 'Số điện thoại không hợp lệ',
                          },
                        ]}
                      >
                        <Input placeholder="Nhập số điện thoại" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Ngày sinh" name="bod">
                        <DatePicker
                          style={{ width: '100%' }}
                          format="DD/MM/YYYY"
                          placeholder="Chọn ngày sinh"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item label="Giới tính" name="sex">
                        <Select placeholder="Chọn giới tính">
                          <Select.Option value="MALE">Nam</Select.Option>
                          <Select.Option value="FEMALE">Nữ</Select.Option>
                          <Select.Option value="OTHER">Khác</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Vai trò" name="roleName">
                        <Input disabled />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item label="Địa chỉ" name="address">
                        <Input placeholder="Nhập địa chỉ" />
                      </Form.Item>
                    </Col>
                  </Row>

                  {isEditing && (
                    <>
                      <Divider />
                      <Row justify="end" gutter={12}>
                        <Col>
                          <Button onClick={handleCancel}>Hủy</Button>
                        </Col>
                        <Col>
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                          >
                            Lưu thay đổi
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </AdminLayout>
    </>
  )
}

export default AdminProfile