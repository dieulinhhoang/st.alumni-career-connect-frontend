import React, { useEffect, useMemo, useState } from 'react'
import { Row, Col, Spin, Typography, message, Form } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import AdminLayout from '../../../components/layout/AdminLayout'
import {
  useGetAdminProfile,
  useUpdateAdminProfile,
} from '../../../feature/adminProfile/hook/query'
import type { IUpdateAdminProfileBody } from '../../../feature/adminProfile/type'
import ProfileSidebar from './ProfileSidebar'
import ProfileForm from './ProfileForm'

const { Title, Text } = Typography

const AdminProfile: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl] = useState<string | undefined>(undefined)

  const { data: profile, isLoading } = useGetAdminProfile()
  const updateProfile = useUpdateAdminProfile()

  const [form] = Form.useForm()

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
    }
  }, [profile])

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues)
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
    if (initialValues) form.setFieldsValue(initialValues)
    else form.resetFields()
    setIsEditing(false)
  }

  if (isLoading || !profile || !initialValues) {
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
          <div
            style={{
              marginBottom: 24,
              background:
                'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)',
              borderRadius: 20,
              padding: '20px 24px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #e8e5ff',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: 'rgba(99,102,241,0.06)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -20,
                right: 80,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(139,92,246,0.05)',
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                position: 'relative',
              }}
            >
              <div>
                <Title
                  level={4}
                  style={{ margin: 0, color: '#1e1b4b', fontWeight: 800, fontSize: 20 }}
                >
                  Thông tin tài khoản
                </Title>
                
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#fff',
                  borderRadius: 100,
                  padding: '6px 14px',
                  border: '1px solid #e8e5ff',
                  boxShadow: '0 1px 4px rgba(99,102,241,0.1)',
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#4ade80',
                    boxShadow: '0 0 0 2px rgba(74,222,128,0.4)',
                  }}
                />
                <Text style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600 }}>
                  Hồ sơ quản trị
                </Text>
              </div>
            </div>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={7}>
              <ProfileSidebar
                profile={profile}
                avatarUrl={avatarUrl}
                displayName={form.getFieldValue('fullName') || profile.fullName}
              />
            </Col>

            <Col xs={24} md={17}>
              <ProfileForm
                form={form}
                isEditing={isEditing}
                isSubmitting={updateProfile.isPending}
                onEdit={() => setIsEditing(true)}
                onCancel={handleCancel}
                onSave={handleSave}
              />
            </Col>
          </Row>
        </div>
      </AdminLayout>
    </>
  )
}

export default AdminProfile