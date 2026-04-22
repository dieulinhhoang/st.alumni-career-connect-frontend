import React, { useEffect } from 'react'
import { Form, Input, Modal } from 'antd'

type Props = {
  isOpen: boolean
  userName?: string
  onOk: (newPassword: string) => void
  onCancel: () => void
  confirmLoading?: boolean
}

const ChangePasswordModal: React.FC<Props> = ({
  isOpen,
  userName,
  onOk,
  onCancel,
  confirmLoading,
}) => {
  const [form] = Form.useForm()

  // Reset form  
  useEffect(() => {
    if (isOpen) {
      form.resetFields()
    }
  }, [isOpen, form])

  const handleInternalOk = () => {
    form.validateFields()
      .then((values) => {
        onOk(values.newPassword.trim())
      })
      .catch((info) => {
        console.log('Validate lỗi:', info)
      })
  }

  return (
    <Modal
      title={`Đổi mật khẩu ${userName ? `- ${userName}` : ''}`}
      open={isOpen}
      onOk={handleInternalOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText="Cập nhật mật khẩu"
      cancelText="Hủy bỏ"
      destroyOnClose
    >
      <Form 
        form={form} 
        layout="vertical" 
        style={{ marginTop: 16 }}
      >
        <Form.Item 
          label="Mật khẩu mới" 
          name="newPassword"  
          required
          rules={[
            { required: true, message: 'Mật khẩu mới không được để trống' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
            {
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
              message: 'Mật khẩu phải chứa ít nhất 1 chữ số, 1 kí tự hoa, 1 kí tự thường và 1 kí tự đặc biệt'
            }
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu mới"
            autoFocus
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ChangePasswordModal