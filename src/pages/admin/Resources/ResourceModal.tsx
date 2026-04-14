import React from 'react'
import { Input, Modal, Space, Button, Form } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

type Props = {
  isOpen: boolean
  mode: 'create' | 'edit'
  code: string
  setCode: (v: string) => void
  name: string
  setName: (v: string) => void
  actions: string[]
  setActions: React.Dispatch<React.SetStateAction<string[]>>

  onOk: () => void
  onCancel: () => void
  confirmLoading?: boolean
}

const clean = (s: string) => s.trim()

const ResourceModal: React.FC<Props> = ({
  isOpen,
  mode,
  code,
  setCode,
  name,
  setName,
  actions,
  setActions,
  onOk,
  onCancel,
  confirmLoading
}) => {
  const isEdit = mode === 'edit'

  const changeAction = (idx: number, value: string) => {
    setActions((prev) => prev.map((a, i) => (i === idx ? value : a)))
  }

  const addActionAt = (idx: number) => {
    setActions((prev) => {
      const next = [...prev]
      next.splice(idx + 1, 0, '')
      return next
    })
  }

  const removeAction = (idx: number) => {
    setActions((prev) => {
      if (prev.length === 1) return prev
      return prev.filter((_, i) => i !== idx)
    })
  }

  const handleOk = () => {
    const normalized = Array.from(
      new Set((actions || []).map(clean).filter(Boolean))
    )
    setActions(normalized.length ? normalized : [''])
    onOk()
  }

  return (
    <Modal
      open={isOpen}
      title={isEdit ? 'Cập nhật tài nguyên' : 'Tạo tài nguyên'}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      width={760}
    >
      <Form layout="vertical">
        <Form.Item
          label="Mã tài nguyên"
          required
          rules={[{ required: true, message: 'Bắt buộc nhập mã tài nguyên' }]}
        >
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="vd: teachers..."
          />
        </Form.Item>

        <Form.Item label="Tên tài nguyên">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="vd: Quản lý giáo viên..."
          />
        </Form.Item>

        <Form.Item label="Chức năng (Actions)" required>
          <Space direction="vertical" size={10} style={{ width: '100%' }}>
            {(actions?.length ? actions : ['']).map((a, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center'
                }}
              >
                <Input
                  value={a}
                  onChange={(e) => changeAction(idx, e.target.value)}
                  placeholder="vd: read..."
                  style={{ height: 40 }}
                />

                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={() => addActionAt(idx)}
                  style={{ height: 40 }}
                />

                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => removeAction(idx)}
                  disabled={(actions?.length || 0) <= 1}
                  style={{ height: 40 }}
                />
              </div>
            ))}
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ResourceModal
