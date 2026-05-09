import React from 'react'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
} from 'antd'
import { EditOutlined, SaveOutlined } from '@ant-design/icons'

interface Props {
  form: any
  isEditing: boolean
  isSubmitting: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: (values: any) => void
}

const ProfileForm: React.FC<Props> & {
  useProfileForm?: typeof Form.useForm
} = ({ form, isEditing, isSubmitting, onEdit, onCancel, onSave }) => {
  return (
    <Card
      style={{ borderRadius: 12, borderColor: '#f0f0f0' }}
      extra={
        !isEditing ? (
          <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
            Chỉnh sửa
          </Button>
        ) : null
      }
      title="Thông tin cá nhân"
    >
      <Form form={form} layout="vertical" onFinish={onSave} disabled={!isEditing}>
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
                <Button onClick={onCancel}>Hủy</Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={isSubmitting}
                >
                  Lưu thay đổi
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Card>
  )
}

ProfileForm.useProfileForm = Form.useForm

export default ProfileForm