import React, { useEffect } from 'react'
import { Card, Row, Col, Input, Button, Space, Form } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'

type ViewMode = 'view' | 'create' | 'edit'

interface RoleFormViewProps {
  view: ViewMode
  name: string
  description: string
  onBack: () => void
  onSubmit: (values: any) => void
  submitting: boolean
}

const RoleFormView: React.FC<RoleFormViewProps> = ({
  view,
  name,
  description,
  onBack,
  onSubmit,
  submitting,
}) => {
  const [form] = Form.useForm()
  const isView = view === 'view'

  useEffect(() => {
    form.setFieldsValue({ name, description })
  }, [name, description, form])

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Card
        style={{
          marginBottom: 12,
          borderRadius: 14,
          border: '1px solid #e8edf3',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        }}
      >
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack} />
          <span style={{ fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
            {view === 'create' && 'Tạo mới vai trò'}
            {view === 'edit' && 'Chỉnh sửa vai trò'}
            {view === 'view' && 'Thông tin vai trò'}
          </span>
        </Space>
      </Card>

      <Card
        style={{
          borderRadius: 14,
          border: '1px solid #e8edf3',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={<b>Tên vai trò</b>}
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
              label={<b>Mô tả</b>}
              name="description"
              rules={[{ max: 255, message: 'Tối đa 255 ký tự!' }]}
            >
              <Input.TextArea
                rows={4}
                maxLength={255}
                showCount={!isView}
                disabled={isView}
                placeholder="Nhập mô tả vai trò..."
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </Col>
        </Row>

        {!isView && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
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
      </Card>
    </Form>
  )
}

export default RoleFormView