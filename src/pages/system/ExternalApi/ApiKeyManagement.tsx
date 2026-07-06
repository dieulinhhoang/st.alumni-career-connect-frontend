import React, { useState } from 'react'
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
  Tooltip,
  Typography,
} from 'antd'
import {
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
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

const ApiKeyManagement: React.FC = () => {
  const [messageApi, ctx] = message.useMessage()
  const [createOpen, setCreateOpen] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [form] = Form.useForm()

  // Preview state
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
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Quản lý API Key</h2>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Tạo và quản lý key để hệ thống khác truy cập dữ liệu cựu sinh viên
            </Text>
          </div>
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

        {/* Modal tạo key */}
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

        {/* Modal hiển thị key vừa tạo */}
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

        {/* Modal xem thử API */}
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
      </AdminLayout>
    </>
  )
}

export default ApiKeyManagement
