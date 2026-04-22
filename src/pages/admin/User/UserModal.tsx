import React, { useEffect } from 'react'
import { Form, Input, Modal, Row, Col, Select, DatePicker, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { IRole } from '@/features/Role/type'
import dayjs from 'dayjs'

type Props = {
  isOpen: boolean
  mode: 'create' | 'edit' | 'view'

  fullName: string
  setFullName: (v: string) => void

  email: string
  setEmail: (v: string) => void

  password: string
  setPassword: (v: string) => void

  mobile: string
  setMobile: (v: string) => void

  address: string
  setAddress: (v: string) => void

  bod?: string
  setBod: (v?: string) => void

  sex: string
  setSex: (v: string) => void

  userName: string
  setUserName: (v: string) => void

  roleIds: string[]
  setRoleIds: React.Dispatch<React.SetStateAction<string[]>>
  roleList: IRole[]

  onOk: () => void
  onCancel: () => void
  confirmLoading?: boolean
}

const UserModal: React.FC<Props> = ({
  isOpen,
  mode,
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  mobile,
  setMobile,
  address,
  setAddress,
  bod,
  setBod,
  sex,
  setSex,
  userName,
  setUserName,
  roleIds,
  setRoleIds,
  roleList,
  onOk,
  onCancel,
  confirmLoading,
}) => {
  const [form] = Form.useForm()
  const isEdit = mode === 'edit'
  const isView = mode === 'view'
  const isCreate = mode === 'create'
  // reset
  // Reset form  
   useEffect(() => {
    if (isOpen) {
       form.setFieldsValue({
        fullName,
        userName,
        email,
        password,
        mobile,
        address,
        sex,
        roleIds,
        bod: bod ? dayjs(bod) : null,
      })
    } else {
       form.resetFields()
    }
  }, [isOpen, fullName, userName, email, password, mobile, address, sex, roleIds, bod, form])
  
  return (
    <Modal
      title={
        isView ? `Xem người dùng - ${userName}` :
          isEdit ? `Chỉnh sửa người dùng - ${userName}` : 'Tạo người dùng'
      }
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okButtonProps={{ disabled: isView }}
      width={680}
      okText="Lưu"       
      cancelText="Huỷ" 
    >
    <Form  form={form} layout="vertical" disabled={isView} style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[
                { required: true, message: 'Họ và tên không được để trống' },
                { max: 100, message: 'Tối đa 100 ký tự' },
                { 
                  pattern: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s|_]+$/, 
                  message: 'Chỉ bao gồm ký tự chữ và khoảng trắng' 
                }
              ]}
            >
              <Input placeholder="Nhập họ tên" onChange={(e) => setFullName(e.target.value)} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="userName"
              label={
                <span>Tên đăng nhập&nbsp;
                  <Tooltip title="Nếu bỏ trống, hệ thống tự sinh từ họ tên">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[
                { max: 50, message: 'Tối đa 50 ký tự' },
                { pattern: /^(?!\.)(?!.*\.\.)(?!.*\.$)[\p{L}0-9.]+$/u, message: 'Chỉ bao gồm chữ thường và số' }
              ]}
            >
              <Input placeholder="Nhập tên đăng nhập" onChange={(e) => setUserName(e.target.value)} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email không được để trống' },
                { max: 64, message: 'Tối đa 64 ký tự' },
                {
                  pattern: /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?<!\.)$/,
                  message: 'Email không đúng định dạng'
                }
              ]}
            >
              <Input placeholder="Nhập email" onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
          </Col>

          {isCreate && (
            <Col span={12}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Mật khẩu không được để trống' },
                  { min: 8, message: 'Mật khẩu ít nhất 8 ký tự' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'Phải có 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
                  }
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" onChange={(e) => setPassword(e.target.value)} />
              </Form.Item>
            </Col>
          )}

          <Col span={12}>
            <Form.Item
              name="mobile"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Số điện thoại không được để trống' },
                { pattern: /^(03[2-9]|05[25689]|07[06789]|08[1-9]|09[0-9])\d{7}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input placeholder="Nhập số điện thoại" onChange={(e) => setMobile(e.target.value)} />
            </Form.Item>
          </Col>
{/* 
          <Col span={12}>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ max: 250, message: 'Tối đa 250 ký tự' }]}
            >
              <Input placeholder="Nhập địa chỉ" onChange={(e) => setAddress(e.target.value)} />
            </Form.Item>
          </Col> */}

          <Col span={12}>
            <Form.Item
              name="bod"
              label="Ngày sinh"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="dd/mm/yyyy"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
                onChange={(_d, dateStr) => setBod(Array.isArray(dateStr) ? dateStr[0] : dateStr)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="sex"
              label="Giới tính"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            >
              <Select
                placeholder="Chọn giới tính"
                onChange={(val) => setSex(val)}
                options={[
                  { label: 'Nam', value: '0' },
                  { label: 'Nữ', value: '1' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="roleIds"
              label="Vai trò"
              // rules={[{ required: true, message: 'Chọn ít nhất 1 vai trò' }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn vai trò"
                onChange={(vals) => setRoleIds(vals)}
                options={roleList?.map(r => ({ label: r.name, value: r._id ,disabled: r.code === 'QLL' || r.code === 'TG' || r.code ==='GV',}))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default UserModal
