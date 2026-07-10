import React, { useState, useEffect } from 'react'
import {
  Alert,
  Badge,
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Popover,
  Space,
  Spin,
  Table,
  Tabs,
  Tooltip,
  Typography,
} from 'antd'
import {
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  StopOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import AdminLayout from '../../../components/layout/AdminLayout'
import {
  useCreateApiKey,
  useDeleteApiKey,
  useListApiKeys,
  useRevokeApiKey,
} from '../../../feature/external-api/hook/query'
import type { IApiKey } from '../../../feature/external-api/type'
import api from '../../../libs/api'

const { Text, Paragraph } = Typography

/* ─── Tab 1: API Keys ──────────────────────────────────────────────────────── */

function ApiKeysTab() {
  const [messageApi, ctx] = message.useMessage()
  const [createOpen, setCreateOpen] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [form] = Form.useForm()

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewKey, setPreviewKey] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)

  const { data: keys = [], isLoading } = useListApiKeys()
  const createMutation = useCreateApiKey()
  const revokeMutation = useRevokeApiKey()
  const deleteMutation = useDeleteApiKey()

  const handleCreate = () => {
    form.validateFields().then((values) => {
      createMutation.mutate(values, {
        onSuccess: (res) => {
          setNewKey(res.key)
          form.resetFields()
          setCreateOpen(false)
        },
        onError: () => messageApi.error('Tạo key thất bại'),
      })
    })
  }

  const handlePreview = async () => {
    if (!previewKey.trim()) return
    setPreviewLoading(true)
    setPreviewData(null)
    setPreviewError(null)
    try {
      const { data } = await api.get('/external-api/alumni-career', {
        params: { limit: 3 },
        headers: { 'X-Api-Key': previewKey.trim() },
      })
      setPreviewData(data)
    } catch (err: any) {
      setPreviewError(err?.response?.data?.message || 'Key không hợp lệ hoặc server lỗi')
    } finally {
      setPreviewLoading(false)
    }
  }

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (v: string | null) => v || <Text type="secondary">—</Text>,
    },
    {
      title: 'Key (8 ký tự cuối)',
      dataIndex: 'keySuffix',
      key: 'keySuffix',
      render: (v: string) => (
        <Text code style={{ letterSpacing: 2 }}>••••••••{v}</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (v: boolean) =>
        v ? <Badge status="success" text="Hoạt động" /> : <Badge status="error" text="Đã thu hồi" />,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Dùng lần cuối',
      dataIndex: 'lastUsedAt',
      key: 'lastUsedAt',
      render: (v: string | null) =>
        v ? dayjs(v).format('DD/MM/YYYY HH:mm') : <Text type="secondary">Chưa dùng</Text>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: IApiKey) => (
        <Space>
          {record.isActive && (
            <Popconfirm
              title="Thu hồi key này?"
              description="Key sẽ ngừng hoạt động ngay lập tức."
              onConfirm={() =>
                revokeMutation.mutate(record.id, {
                  onSuccess: () => messageApi.success('Đã thu hồi key'),
                  onError: () => messageApi.error('Thu hồi thất bại'),
                })
              }
              okText="Thu hồi"
              okButtonProps={{ danger: true }}
              cancelText="Hủy"
            >
              <Tooltip title="Thu hồi key">
                <Button size="small" icon={<StopOutlined />} danger />
              </Tooltip>
            </Popconfirm>
          )}
          <Popconfirm
            title="Xóa key này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() =>
              deleteMutation.mutate(record.id, {
                onSuccess: () => messageApi.success('Đã xóa key'),
                onError: () => messageApi.error('Xóa thất bại'),
              })
            }
            okText="Xóa"
            okButtonProps={{ danger: true }}
            cancelText="Hủy"
          >
            <Tooltip title="Xóa key">
              <Button size="small" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      {ctx}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Tạo và quản lý key để hệ thống khác truy cập dữ liệu cựu sinh viên
        </Text>
        <Space>
          <Popover
            title="Cách sử dụng API"
            trigger="click"
            placement="bottomLeft"
            content={
              <div style={{ fontSize: 13, maxWidth: 420 }}>
                <div>Header: <Text code>X-Api-Key: &lt;key&gt;</Text></div>
                <div style={{ marginTop: 6 }}>Endpoint: <Text code>GET /external-api/alumni-career</Text></div>
                <div style={{ marginTop: 4, color: '#64748b' }}>
                  Lọc: <Text code>?batch_id=</Text> <Text code>?student_code=</Text> <Text code>?page=</Text> <Text code>?limit=</Text>
                </div>
                <div style={{ marginTop: 6 }}>Tra cứu 1 SV: <Text code>GET /external-api/alumni-career/:studentCode</Text></div>
              </div>
            }
          >
            <Button icon={<QuestionCircleOutlined />} />
          </Popover>
          <Button icon={<EyeOutlined />} onClick={() => { setPreviewOpen(true); setPreviewData(null); setPreviewError(null) }}>
            Xem thử API
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            Tạo API Key mới
          </Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        dataSource={keys}
        columns={columns}
        loading={isLoading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />

      <Modal
        title="Tạo API Key mới"
        open={createOpen}
        onOk={handleCreate}
        onCancel={() => { setCreateOpen(false); form.resetFields() }}
        okText="Tạo"
        cancelText="Hủy"
        confirmLoading={createMutation.isPending}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Tên key" rules={[{ required: true, message: 'Vui lòng nhập tên key' }]}>
            <Input placeholder="VD: Hệ thống quản lý đào tạo" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (tuỳ chọn)">
            <Input.TextArea rows={3} placeholder="Mô tả mục đích sử dụng key này..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Key đã được tạo"
        open={!!newKey}
        footer={<Button type="primary" onClick={() => setNewKey(null)}>Đã lưu, đóng</Button>}
        onCancel={() => setNewKey(null)}
        closable={false}
        maskClosable={false}
      >
        <Alert
          type="warning"
          showIcon
          message="Hãy sao chép và lưu lại key ngay bây giờ. Key sẽ không hiển thị lại sau khi bạn đóng cửa sổ này."
          style={{ marginBottom: 16 }}
        />
        <Text strong style={{ display: 'block', marginBottom: 8 }}>API Key của bạn:</Text>
        <Paragraph
          copyable={{ text: newKey ?? '', onCopy: () => messageApi.success('Đã sao chép') }}
          style={{
            background: '#f6f8fa',
            padding: '10px 14px',
            borderRadius: 6,
            fontFamily: 'monospace',
            fontSize: 13,
            wordBreak: 'break-all',
            border: '1px solid #e2e8f0',
          }}
        >
          {newKey}
        </Paragraph>
      </Modal>

      <Modal
        title="Xem thử API"
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        footer={null}
        width={700}
      >
        <div style={{ marginBottom: 12 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>Nhập API key để gọi thử và xem dữ liệu trả về (3 bản ghi đầu tiên)</Text>
        </div>
        <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
          <Input.Password
            placeholder="Dán API key vào đây..."
            value={previewKey}
            onChange={(e) => setPreviewKey(e.target.value)}
            onPressEnter={handlePreview}
            style={{ fontFamily: 'monospace', fontSize: 13 }}
          />
          <Button type="primary" onClick={handlePreview} loading={previewLoading}>
            Gọi API
          </Button>
        </Space.Compact>

        {previewLoading && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <Spin tip="Đang gọi API..." />
          </div>
        )}

        {previewError && (
          <Alert type="error" showIcon message={previewError} />
        )}

        {previewData && !previewLoading && (
          <>
            <div style={{ display: 'flex', gap: 16, marginBottom: 10, fontSize: 13 }}>
              <Text>Đợt khảo sát: <Text strong>{previewData.batchTitle}</Text></Text>
              <Text>Tổng: <Text strong>{previewData.total}</Text> phản hồi</Text>
            </div>
            <div
              style={{
                background: '#0f172a',
                borderRadius: 8,
                padding: '14px 16px',
                maxHeight: 400,
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: 12,
                lineHeight: 1.7,
                color: '#e2e8f0',
              }}
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(previewData, null, 2)}
              </pre>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}

/* ─── Tab 2: Cấu hình dịch vụ ─────────────────────────────────────────────── */

interface ServiceConfigItem {
  id: number
  key: string
  value: string | null
  description: string | null
}

const SERVICE_KEYS: { key: string; label: string; placeholder: string; description: string }[] = [
  { key: 'geoapify_api_key', label: 'Geoapify API Key (Địa chỉ)', placeholder: 'Nhập API key từ myprojects.geoapify.com', description: 'API key cho Geoapify Geocoder (tự động gợi ý địa chỉ)' },
  { key: 'google_maps_api_key', label: 'Google Maps API Key (Địa chỉ)', placeholder: 'Nhập API key từ Google Cloud Console (Maps JavaScript + Places API)', description: 'Gợi ý địa chỉ cho câu hỏi địa chỉ & tự tách tỉnh/thành cho báo cáo. Nhớ giới hạn key theo HTTP referrer.' },
]

function ServiceConfigTab() {
  const [messageApi, ctx] = message.useMessage()
  const [serverValues, setServerValues] = useState<Record<string, string>>({})
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  const fetchConfigs = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/service-config')
      const vals: Record<string, string> = {}
      ;(data as ServiceConfigItem[]).forEach(c => { vals[c.key] = c.value || '' })
      setServerValues(vals)
      setEditValues(prev => {
        const merged = { ...prev }
        for (const k of Object.keys(vals)) {
          if (!(k in merged)) merged[k] = vals[k]
        }
        return merged
      })
    } catch {
      // backend chưa chạy — hiện form trống để admin nhập sẵn
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchConfigs() }, [])

  const handleSave = async (key: string) => {
    setSaving(prev => ({ ...prev, [key]: true }))
    try {
      await api.put(`/service-config/${key}`, { value: editValues[key] || '' })
      messageApi.success('Đã lưu cấu hình')
      fetchConfigs()
    } catch {
      messageApi.error('Lưu thất bại — kiểm tra kết nối backend')
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }))
    }
  }

  const isDirty = (key: string) => (editValues[key] ?? '') !== (serverValues[key] ?? '')

  return (
    <>
      {ctx}
      <div style={{ marginBottom: 20 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Cấu hình API key cho các dịch vụ bên thứ 3 (địa chỉ, bản đồ, ...)
        </Text>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}><Spin /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
          {SERVICE_KEYS.map(svc => (
            <div key={svc.key} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px 20px' }}>
              <div style={{ marginBottom: 8 }}>
                <Text strong style={{ fontSize: 14 }}>{svc.label}</Text>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 2 }}>{svc.description}</Text>
              </div>
              <Space.Compact style={{ width: '100%' }}>
                <Input.Password
                  value={editValues[svc.key] ?? ''}
                  onChange={e => setEditValues(prev => ({ ...prev, [svc.key]: e.target.value }))}
                  placeholder={svc.placeholder}
                  style={{ fontFamily: 'monospace', fontSize: 13 }}
                />
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                    onClick={() => handleSave(svc.key)}
                    loading={saving[svc.key]}
                    disabled={!isDirty(svc.key)}
                  >
                    Lưu
                  </Button>
                </Space.Compact>
                {serverValues[svc.key] ? (
                  <Text type="success" style={{ fontSize: 12, marginTop: 6, display: 'block' }}>
                    Đã cấu hình
                  </Text>
                ) : (
                  <Text type="warning" style={{ fontSize: 12, marginTop: 6, display: 'block' }}>
                    Chưa cấu hình
                  </Text>
                )}
              </div>
            ))}
        </div>
      )}
    </>
  )
}

/* ─── Main ─────────────────────────────────────────────────────────────────── */

const ApiKeyManagement: React.FC = () => {
  return (
    <AdminLayout>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Quản lý API Key</h2>
      <Tabs
        defaultActiveKey="keys"
        items={[
          { key: 'keys', label: 'API Keys', children: <ApiKeysTab /> },
          { key: 'services', label: 'Cấu hình dịch vụ', children: <ServiceConfigTab /> },
        ]}
      />
    </AdminLayout>
  )
}

export default ApiKeyManagement
