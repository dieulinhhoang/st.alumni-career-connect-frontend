import React, { useEffect, useMemo, useState } from 'react'
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
  Spin,
  Typography,
  message,
} from 'antd'
import { EditOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import AdminLayout from '../../../components/layout/AdminLayout'
import {
  useGetAdminProfile,
  useUpdateAdminProfile,
} from '../../../feature/adminProfile/hook/query'
import type { IUpdateAdminProfileBody } from '../../../feature/adminProfile/type'

const { Title, Text } = Typography

const AdminProfile: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl] = useState<string | undefined>(undefined)

  const { data: profile, isLoading } = useGetAdminProfile()
  const updateProfile = useUpdateAdminProfile()

  const initialValues = useMemo(() => {
    if (!profile) return undefined
    return {
      fullName: profile.fullName,
      userName: profile.userName,
      email: profile.email,
      mobile: profile.mobile,
      address: profile.address,
      sex: profile.sex,
      bod: profile.bod ? dayjs(profile.bod) : undefined,
      roleName: profile.roleName,
      roles: profile.roles ?? [],
    }
  }, [profile])

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
    }
  }, [form, initialValues])

  const handleSave = (values: any) => {
    const body: IUpdateAdminProfileBody = {
      fullName: values.fullName?.trim(),
      email: values.email,
      mobile: values.mobile,
      address: values.address,
      sex: values.sex,
      bod: values.bod ? (values.bod as Dayjs).toISOString() : undefined,
    }

    updateProfile.mutate(body, {
      onSuccess: () => {
        messageApi.success('Cập nhật thông tin thành công!')
        setIsEditing(false)
      },
      onError: () => {
        messageApi.error('Cập nhật thông tin thất bại')
      },
    })
  }

  const handleCancel = () => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
    } else {
      form.resetFields()
    }
    setIsEditing(false)
  }

  if (isLoading || !initialValues || !profile) {
    return (
      <>
        {contextHolder}
        <AdminLayout>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <Spin />
          </div>
        </AdminLayout>
      </>
    )
  }

  return (
    <>
      {contextHolder}
      <AdminLayout>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
          <Title level={3} style={{ marginBottom: 24 }}>
            Thông tin tài khoản
          </Title>

          <Row gutter={[24, 24]}>
            {/* Cột trái: Avatar + nhóm quyền */}
            <Col xs={24} md={7}>
              <Card
                style={{
                  textAlign: 'center',
                  borderRadius: 12,
                  borderColor: '#f0f0f0',
                }}
                styles={{ body: { padding: 24 } }}
              >
                <div
                  style={{
                    width: 96,
                    height: 96,
                    margin: '0 auto 16px',
                    borderRadius: '50%',
                    border: '3px solid #7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar
                    size={64}
                    src={avatarUrl}
                    icon={!avatarUrl ? <UserOutlined /> : undefined}
                    style={{ background: '#ffffff', color: '#7c3aed' }}
                  />
                </div>

                <Text strong style={{ display: 'block', marginBottom: 4 }}>
                  {form.getFieldValue('fullName') || profile.fullName}
                </Text>
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                  @{profile.userName}
                </Text>

                <div
                  style={{
                    marginTop: 8,
                    padding: 16,
                    borderRadius: 12,
                    background: '#f9fafb',
                    border: '1px solid #f1f5f9',
                    textAlign: 'left',
                  }}
                >
                  <Text
                    type="secondary"
                    style={{ display: 'block', marginBottom: 12, fontWeight: 500 }}
                  >
                    Nhóm quyền
                  </Text>

                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    {(profile.roles ?? []).map((role) => (
                      <div
                        key={role}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 999,
                          background: '#f5f3ff',
                          color: '#7c3aed',
                          fontSize: 13,
                          fontWeight: 500,
                          display: 'inline-block',
                        }}
                      >
                        {role}
                      </div>
                    ))}
                  </Space>
                </div>
              </Card>
            </Col>

            {/* Cột phải: Form */}
            <Col xs={24} md={17}>
              <Card
                style={{ borderRadius: 12, borderColor: '#f0f0f0' }}
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
                            loading={updateProfile.isPending}
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
