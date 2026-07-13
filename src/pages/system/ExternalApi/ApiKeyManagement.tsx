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
  Select,
  Space,
  Spin,
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
import CustomTable from '../../../components/common/customTable'
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

      <CustomTable<IApiKey>
        rowKey="id"
        data={keys}
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

interface ServiceKeyDef {
  key: string
  label: string
  placeholder: string
  description: string
  provider: string // giá trị address_provider tương ứng
  guide: React.ReactNode // hướng dẫn lấy key (hiện trong Popover dấu "?")
}

const SERVICE_KEYS: ServiceKeyDef[] = [
  {
    key: 'goong_api_key',
    label: 'Goong API Key (Địa chỉ – Việt Nam)',
    placeholder: 'Nhập API key từ goong.io',
    description: 'Gợi ý địa chỉ Việt Nam (chi tiết tới phường/xã) & tự tách tỉnh/thành. Miễn phí, KHÔNG cần thẻ quốc tế.',
    provider: 'goong',
    guide: (
      <div style={{ maxWidth: 320, fontSize: 13, lineHeight: 1.6 }}>
        <b>Lấy Goong API Key (khuyến nghị cho VN):</b>
        <ol style={{ paddingLeft: 18, margin: '6px 0' }}>
          <li>Vào <a href="https://goong.io" target="_blank" rel="noreferrer">goong.io</a> → Đăng ký (chỉ cần email, không cần thẻ).</li>
          <li>Vào <b>API Keys</b> → tạo key mới → copy.</li>
          <li>Dán vào ô bên dưới → Lưu.</li>
          <li>Chọn "Goong" ở mục <b>Nhà cung cấp đang dùng</b> phía trên.</li>
        </ol>
        Key dùng cho REST <i>Place/AutoComplete</i> + <i>Place/Detail</i>. Gói free đủ cho khảo sát trường.
      </div>
    ),
  },
  {
    key: 'google_maps_api_key',
    label: 'Google Maps API Key (Địa chỉ)',
    placeholder: 'Nhập API key từ Google Cloud Console (Maps JavaScript + Places API)',
    description: 'Gợi ý địa chỉ chất lượng cao & tự tách tỉnh/thành. Cần bật billing (thẻ Visa/Mastercard).',
    provider: 'google',
    guide: (
      <div style={{ maxWidth: 320, fontSize: 13, lineHeight: 1.6 }}>
        <b>Lấy Google Maps API Key:</b>
        <ol style={{ paddingLeft: 18, margin: '6px 0' }}>
          <li>Vào <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer">Google Cloud Console</a> → tạo Project.</li>
          <li>Bật <b>Billing</b> (bắt buộc, cần thẻ Visa/Mastercard; có ~200$/tháng miễn phí).</li>
          <li>APIs &amp; Services → Library → Enable <b>Maps JavaScript API</b> + <b>Places API (New)</b>.</li>
          <li>Credentials → Create API key → copy.</li>
          <li>Giới hạn key: <b>HTTP referrers</b> (domain của bạn) + chỉ 2 API trên.</li>
        </ol>
      </div>
    ),
  },
  {
    key: 'geoapify_api_key',
    label: 'Geoapify API Key (Địa chỉ)',
    placeholder: 'Nhập API key từ myprojects.geoapify.com',
    description: 'Gợi ý địa chỉ (dữ liệu VN trung bình). Miễn phí, không cần thẻ.',
    provider: 'geoapify',
    guide: (
      <div style={{ maxWidth: 320, fontSize: 13, lineHeight: 1.6 }}>
        <b>Lấy Geoapify API Key:</b>
        <ol style={{ paddingLeft: 18, margin: '6px 0' }}>
          <li>Vào <a href="https://myprojects.geoapify.com" target="_blank" rel="noreferrer">myprojects.geoapify.com</a> → Đăng ký (email, không cần thẻ).</li>
          <li>Tạo Project → copy <b>API key</b>.</li>
          <li>Dán vào ô bên dưới → Lưu.</li>
        </ol>
      </div>
    ),
  },
]

const PROVIDER_OPTIONS = [
  { value: 'none', label: 'Không dùng (người dùng tự nhập tay)' },
  { value: 'goong', label: 'Goong (Việt Nam – khuyến nghị)' },
  { value: 'google', label: 'Google Maps' },
  { value: 'geoapify', label: 'Geoapify' },
]

const PROVIDER_META: Record<string, { emoji: string; accent: string; soft: string }> = {
  goong:    { emoji: '🇻🇳', accent: '#16a34a', soft: '#f0fdf4' },
  google:   { emoji: '🌐', accent: '#2563eb', soft: '#eff6ff' },
  geoapify: { emoji: '📍', accent: '#ea580c', soft: '#fff7ed' },
}

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

  const currentProvider = serverValues['address_provider'] || 'none'
  const currentLabel = PROVIDER_OPTIONS.find(o => o.value === currentProvider)?.label ?? 'Không dùng'

  return (
    <>
      {ctx}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}><Spin /></div>
      ) : (
        <div style={{ maxWidth: 980 }}>
          {/* ─ Card chọn nhà cung cấp ─ */}
          <div style={{
            background: 'linear-gradient(135deg,#f0fdf4,#eff6ff)',
            border: '1px solid #d1fae5', borderRadius: 16,
            padding: '20px 24px', marginBottom: 24,
            display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap',
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12, flexShrink: 0,
              background: '#fff', border: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>📍</div>
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <Text strong style={{ fontSize: 15, display: 'block' }}>Gợi ý địa chỉ trong form khảo sát</Text>
              <Text type="secondary" style={{ fontSize: 12.5 }}>
                Đang dùng: <b style={{ color: '#0f172a' }}>{currentLabel}</b>. Chọn nhà cung cấp rồi nhập key tương ứng bên dưới.
              </Text>
            </div>
            <Space.Compact style={{ minWidth: 300, flex: '0 1 380px' }}>
              <Select
                style={{ flex: 1 }}
                size="large"
                value={editValues['address_provider'] || 'none'}
                onChange={(val) => setEditValues(prev => ({ ...prev, address_provider: val }))}
                options={PROVIDER_OPTIONS}
              />
              <Button
                type="primary" size="large"
                icon={<SaveOutlined />}
                onClick={() => handleSave('address_provider')}
                loading={saving['address_provider']}
                disabled={!isDirty('address_provider')}
                style={{ background: isDirty('address_provider') ? '#16a34a' : undefined, borderColor: isDirty('address_provider') ? '#16a34a' : undefined }}
              >
                Lưu
              </Button>
            </Space.Compact>
          </div>

          {/* ─ Lưới các key ─ */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {SERVICE_KEYS.map(svc => {
              const active = currentProvider === svc.provider
              const configured = !!serverValues[svc.key]
              const meta = PROVIDER_META[svc.provider] ?? { emoji: '🔑', accent: '#64748b', soft: '#f8fafc' }
              return (
                <div key={svc.key} style={{
                  background: '#fff',
                  border: active ? `1.5px solid ${meta.accent}` : '1px solid #e5e7eb',
                  boxShadow: active ? `0 0 0 3px ${meta.accent}18` : '0 1px 2px rgba(0,0,0,0.03)',
                  borderRadius: 14, padding: 18,
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: meta.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}>{meta.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text strong style={{ fontSize: 14 }}>{svc.label}</Text>
                        {active && (
                          <span style={{
                            fontSize: 11, fontWeight: 600, color: meta.accent,
                            background: meta.soft, border: `1px solid ${meta.accent}44`,
                            borderRadius: 20, padding: '1px 8px',
                          }}>Đang dùng</span>
                        )}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 2, lineHeight: 1.5 }}>
                        {svc.description}
                      </Text>
                    </div>
                    <Popover content={svc.guide} trigger="click" placement="bottomRight">
                      <Tooltip title="Cách lấy key">
                        <Button type="text" size="small" icon={<QuestionCircleOutlined />} style={{ color: '#2563eb', flexShrink: 0 }} />
                      </Tooltip>
                    </Popover>
                  </div>

                  {/* Input + save */}
                  <Space.Compact style={{ width: '100%', marginTop: 'auto' }}>
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

                  {/* Trạng thái */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: configured ? '#16a34a' : '#f59e0b', display: 'inline-block',
                    }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {configured ? 'Đã cấu hình' : 'Chưa cấu hình'}
                    </Text>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

/* ─── Main ─────────────────────────────────────────────────────────────────── */

const ApiKeyManagement: React.FC = () => {
  return (
    <AdminLayout>
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px', color: '#0f172a' }}>
          Quản lý API Key
        </h2>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Cấp key cho hệ thống bên ngoài truy cập dữ liệu &amp; cấu hình dịch vụ bên thứ ba (gợi ý địa chỉ, bản đồ…).
        </Text>
      </div>
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
