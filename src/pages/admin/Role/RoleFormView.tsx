import React, { useEffect } from 'react'
import { Card, Row, Col, Input, Button, Space, Form } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, CheckOutlined } from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'

type ViewMode = 'view' | 'create' | 'edit'

interface RoleFormViewProps {
  view: ViewMode
  code: string
  name: string
  description: string
  setCode: (v: string) => void
  setName: (v: string) => void
  setDescription: (v: string) => void
  onBack: () => void
  onSubmit: (values: any) => void
  submitting: boolean
  treeData: DataNode[]
  checkedKeys: React.Key[]
  setCheckedKeys: (keys: React.Key[]) => void
}

const RoleFormView: React.FC<RoleFormViewProps> = ({
  view,
  code,
  name,
  description,
  onBack,
  onSubmit,
  submitting,
  treeData,
  checkedKeys,
  setCheckedKeys,
}) => {
  const [form] = Form.useForm();
  const isView = view === 'view'

  useEffect(() => {
    form.setFieldsValue({ code, name, description });
  }, [code, name, description, form]);

  const onFinish = (values: any) => {
    onSubmit({ ...values, permissions: checkedKeys });
  };

  const togglePermission = (key: React.Key, checked: boolean) => {
    if (isView) return
    if (checked) {
      if (!checkedKeys.includes(key)) setCheckedKeys([...checkedKeys, key])
    } else {
      setCheckedKeys(checkedKeys.filter((k) => k !== key))
    }
  }

  const resources = treeData as (DataNode & { children?: DataNode[] })[]
  const checkAll = (childKeys: React.Key[]) => {
    const allChecked = childKeys.every((key) => checkedKeys.includes(key))
    if (allChecked) {
      setCheckedKeys(checkedKeys.filter((k) => !childKeys.includes(k)))
    } else {
      const newKeys = childKeys.filter((k) => !checkedKeys.includes(k))
      setCheckedKeys([...checkedKeys, ...newKeys])
    }
  }

  const allPermissions = resources.flatMap((r) =>
    (r.children || []).map((child) => String(child.key))
  )

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
     
    >
      <div style={{ paddingBottom: 16 }}>
        <Card style={{ marginBottom: 12, borderRadius: 12, padding: '8px 16px' }}>
          <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={onBack} />
              <span style={{ fontSize: 16, fontWeight: 600 }}>
                {view === 'create' && 'Tạo mới vai trò'}
                {view === 'edit' && 'Chỉnh sửa vai trò'}
                {view === 'view' && 'Thông tin vai trò'}
              </span>
            </Space>
          </Space>
        </Card>

        <Card bordered={false} style={{ borderRadius: 12, marginBottom: 10 }}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label={<b>Mã vai trò</b>}
                name="code"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã vai trò!' },
                  { max: 50, message: 'Tối đa 50 ký tự!' },
                  {
                    pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                    message: 'Chỉ bao gồm chữ cái!'
                  }
                ]}
              >
                <Input placeholder="VD: QUANTRI, GV..." style={{ height: 36 }}  disabled={isView}/>
              </Form.Item>
            </Col>

            <Col span={16}>
              <Form.Item
                label={<b>Tên vai trò</b>}
                name="name"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên vai trò!' },
                  { max: 100, message: 'Tối đa 100 ký tự!' },
                  {
                    pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                    message: 'Chỉ bao gồm chữ cái !'
                  }
                ]}
              >
                <Input placeholder="Nhập tên vai trò" style={{ height: 36 }}  disabled={isView} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={<b>Ghi chú</b>}
                name="description"
                rules={[{ max: 250, message: 'Mô tả tối đa 250 ký tự!' }]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Mô tả ngắn về vai trò..."
                  showCount={!isView}
                  disabled={isView}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card style={{ borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Phân quyền hệ thống</span>
            {!isView && (
              <Button
                size="small"
                type="link"
                onClick={() => checkAll(allPermissions)}
              >
                {allPermissions.every(k => checkedKeys.includes(k))
                  ? 'Bỏ chọn tất cả'
                  : 'Chọn tất cả tất cả'}
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {resources.map((r, idx) => {
              const children = (r.children || []) as DataNode[]
              const childrenKeys = children.map((child) => String(child.key))
              const allChildrenChecked = childrenKeys.every((key) => checkedKeys.includes(key))

              return (
                <div
                  key={r.key}
                  style={{
                    display: 'flex',
                    padding: '16px 0',
                    borderBottom: idx === resources.length - 1 ? 'none' : '1px solid #f0f0f0',
                  }}
                >
                  <div style={{ width: 200, fontWeight: 600, color: '#1f1f1f' }}>
                    {(r as any).name?.trim() || (typeof r.title === 'function' ? r.title(r) : r.title)}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {!isView && (
                      <Button
                        size="small"
                        type="link"
                        style={{ padding: '0 8px', height: 'auto' }}
                        onClick={() => checkAll(childrenKeys)}
                      >
                        {allChildrenChecked ? 'Bỏ chọn' : 'Chọn tất cả'}
                      </Button>
                    )}

                    {children.map((child) => {
                      const key = String(child.key)
                      const title = (child as any).name?.trim() || (typeof child.title === 'function' ? child.title(child) : child.title)
                      const isChecked = checkedKeys.includes(key)

                      return (
                        <div
                          key={key}
                          onClick={() => togglePermission(key, !isChecked)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 6,
                            border: isChecked ? '1px solid #1677ff' : '1px solid #d9d9d9',
                            background: isChecked ? '#e6f4ff' : '#fff',
                            color: isChecked ? '#1677ff' : '#595959',
                            cursor: isView ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 13,
                            userSelect: 'none',
                            transition: 'all 0.1s',
                          }}
                        >
                          {isChecked && <CheckOutlined style={{ fontSize: 12 }} />}
                          {title}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {!isView && (
            <div style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
            }}>
              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                loading={submitting}
                htmlType="submit"
                style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              >
                {view === 'create' ? 'Tạo mới' : 'Cập nhật'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Form>
  )
}

export default RoleFormView
