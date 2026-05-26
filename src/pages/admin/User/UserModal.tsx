import React, { useEffect } from 'react'
import { Form, Input, Modal, Row, Col, Select } from 'antd'

type Props = {
  isOpen: boolean
  mode: 'create' | 'edit' | 'view'

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

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        ssoId,
        fullName,
        code,
        status,
        type,
      })
    } else {
      form.resetFields()
    }
  }, [isOpen, ssoId, fullName, code, status, type, form])

  return (
    <Modal
      title={
        isView
          ? `Xem người dùng - ${fullName || ssoId}`
          : isEdit
            ? `Chỉnh sửa người dùng - ${fullName || ssoId}`
            : 'Tạo người dùng'
      }
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okButtonProps={{ disabled: isView }}
      width={640}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical" disabled={isView} style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ssoId"
              label="SSO ID"
              rules={[
                { required: true, message: 'SSO ID không được để trống' },
                { max: 255, message: 'Tối đa 255 ký tự' },
              ]}
            >
              <Input
                placeholder="Nhập SSO ID"
                onChange={(e) => setSsoId(e.target.value)}
                disabled={!isCreate}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[
                { required: true, message: 'Họ và tên không được để trống' },
                { max: 255, message: 'Tối đa 255 ký tự' },
              ]}
            >
              <Input
                placeholder="Nhập họ và tên"
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã người dùng"
              rules={[{ max: 100, message: 'Tối đa 100 ký tự' }]}
            >
              <Input
                placeholder="Nhập mã người dùng"
                onChange={(e) => setCode(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select
                placeholder="Chọn trạng thái"
                onChange={(val) => setStatus(val)}
                options={[
                  { label: 'Hoạt động', value: 'active' },
                  { label: 'Ngưng hoạt động', value: 'inactive' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="type"
              label="Loại người dùng"
              rules={[{ required: true, message: 'Vui lòng chọn loại người dùng' }]}
            >
              <Select
                placeholder="Chọn loại người dùng"
                onChange={(val) => setType(val)}
                options={[
                  { label: 'Quản trị viên', value: 'admin' },
                  { label: 'Cán bộ', value: 'officer' },
                  { label: 'Giảng viên', value: 'teacher' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default UserModal