import { Button, Card, Form, Input } from 'antd'
import React from 'react'
import { useLoginMutation } from '@/features/Auth/hooks/query'
import { LoginRequest } from '@/features/Auth/type'
import { trimFormValues } from '@/Global/util'
export default function LoginPage() {
  const { mutate: login } = useLoginMutation()
  const handleLogin = async (values: LoginRequest) => {
    const trimmedValues = trimFormValues(values)
    login(trimmedValues)
  }
  return (
    <div className='flex h-screen items-center justify-center bg-[url(/images/bg-login.svg)]'>
      <Card>
        <div className='login-logo flex justify-center'>
          <img src='/images/logo.png' />
        </div>
        <Form name='basic' labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign='left' onFinish={handleLogin}>
          <Form.Item
            label='Tên tài khoản'
            name='userName'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Mật khẩu'
            name='password'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type='primary' htmlType='submit' size='large' className='w-full'>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
