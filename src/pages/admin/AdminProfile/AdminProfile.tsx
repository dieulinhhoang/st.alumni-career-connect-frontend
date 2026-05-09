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
  Typography,
  message,
  Upload,
} from 'antd'
import { EditOutlined, SaveOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import AdminLayout from '../../../components/layout/AdminLayout'

const { Title, Text } = Typography

const AdminProfile: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)

  // Mock dữ liệu ban đầu - thay bằng API call thực tế
  const initialValues = {
    fullName: 'Quản Trị Viên',
    userName: 'admin',
    email: 'admin@example.com',
    mobile: '0123456789',
    address: 'Hà Nội, Việt Nam',
    sex: 'MALE',
    bod: dayjs('1990-01-01'),
  }

  const handleSave = (values: any) => {
    console.log('Cập nhật thông tin:', values)
    // TODO: Gọi API cập nhật thông tin tại đây
    messageApi.success('Cập nhật thông tin thành công!')
    setIsEditing(false)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsEditing(false)
  }

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response?.url)
      messageApi.success('Tải ảnh lên thành công!')
    } else if (info.file.status === 'error') {
      messageApi.error('Tải ảnh lên thất bại!')
    }
  }

  return (
    <>
      {contextHolder}
      <AdminLayout>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
          <Title level={3} style={{ marginBottom: 24 }}>
            Thông tin tài khoản
          </Title>

          <Row gutter={[24, 24]}>
            {/* Cột trái: Avatar */}
            <Col xs={24} md={6}>
              <Card
                style={{ textAlign: 'center', borderRadius: 12 }}
                styles={{ body: { padding: 24 } }}
              >
                <Avatar
                  size={100}
                  src={avatarUrl}
                  icon={!avatarUrl ? <UserOutlined /> : undefined}
                  style={{ marginBottom: 16 }}
                />
                <br />
                <Text strong style={{ display: 'block', marginBottom: 4 }}>
                  {form.getFieldValue('fullName') || initialValues.fullName}
                </Text>
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                  @{initialValues.userName}
                </Text>
                <Upload
                  showUploadList={false}
                  onChange={handleAvatarChange}
                  // action="/api/upload" // TODO: Thay bằng endpoint upload thực tế
                  beforeUpload={() => false} // Tắt auto-upload, xử lý thủ công
                >
                  <Button icon={<UploadOutlined />} size="small">
                    Đổi ảnh đại diện
                  </Button>
                </Upload>
              </Card>
            </Col>

            {/* Cột phải: Form thông tin */}
            <Col xs={24} md={18}>
              <Card
                style={{ borderRadius: 12 }}
                extra={
                  !isEditing ? (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setIsEditing(true)}
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

                  <Form.Item label="Địa chỉ" name="address">
                    <Input placeholder="Nhập địa chỉ" />
                  </Form.Item>

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
