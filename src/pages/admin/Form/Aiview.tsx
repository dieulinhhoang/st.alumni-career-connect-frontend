import { useState, useRef } from 'react'
import { Button, Input, Space, Tag, Spin, Card, Typography, Flex, Alert } from 'antd'
import {
  ArrowLeftOutlined, DeleteOutlined, ThunderboltOutlined,
  UploadOutlined, ReloadOutlined, FileOutlined, EyeOutlined,
} from '@ant-design/icons'
import type { Form } from '../../../feature/form/types'
import { generateFormWithAI } from '../../../feature/form/hooks/useAI'
import { QTYPES, SUGGESTIONS } from '../../../feature/form/constants'

const { TextArea } = Input
const { Title, Text } = Typography
type AIStatus = 'idle' | 'loading' | 'success' | 'error'
const ACCENT = '#16a34a'

interface AIViewProps {
  onSave: (form: Omit<Form, 'id' | 'createdat' | 'themeId'>) => void
  onBack: () => void
}

export function AIView({ onSave, onBack }: AIViewProps) {
  const [prompt,   setPrompt]   = useState('')
  const [status,   setStatus]   = useState<AIStatus>('idle')
  const [result,   setResult]   = useState<Omit<Form, 'id' | 'createdat' | 'themeId'> | null>(null)
  const [errMsg,   setErrMsg]   = useState('')
  const [editName, setEditName] = useState(false)
  const [tempName, setTempName] = useState('')
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null)
  const [fileText, setFileText] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFileInfo({ name: f.name, size: (f.size / 1024).toFixed(1) })
    try {
      const text = await f.text()
      setFileText(text.slice(0, 8000))
    } catch {
      setFileText(null)
    }
  }

  const generate = async () => {
    if (!prompt.trim && !fileText) return
    setStatus('loading'); setErrMsg(''); setResult(null)
    try {
      const parsed = await generateFormWithAI(prompt, fileText ?? undefined)
      setResult(parsed); setStatus('success')
    } catch {
      setErrMsg('Không thể tạo form. Thử lại hoặc kiểm tra kết nối.')
      setStatus('error')
    }
  }

  const removeQ = (id: string) =>
    setResult((r) => r ? { ...r, questions: r.questions.filter((q) => q.id !== id) } : r)

  const ResultEmpty = () => (
    <Card style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px', background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🤖</div>
      <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 8 }}>Kết quả sẽ xuất hiện ở đây</Text>
      <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.7 }}>
        Điền mô tả hoặc upload file,<br />rồi nhấn <Text strong>Tạo form</Text>.
      </Text>
    </Card>
  )

  const ResultLoading = () => (
    <Card style={{ textAlign: 'center', padding: '20px 0' }}>
      <Spin size="large" />
      <Text strong style={{ display: 'block', marginTop: 16, color: '#6b7280' }}>AI đang phân tích yêu cầu...</Text>
      <Text type="secondary" style={{ fontSize: 14, display: 'block', marginTop: 4 }}>Thường mất 3–5 giây</Text>
    </Card>
  )

  const ResultPanel = () => !result ? null : (
    <Card bodyStyle={{ padding: 0 }} style={{ overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f2f5' }}>
        <Flex align="flex-start" justify="space-between" gap={10} style={{ marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            {editName ? (
              <Input
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={() => { setResult((r) => r ? { ...r, name: tempName } : r); setEditName(false) }}
                onKeyDown={(e) => { if (e.key === 'Enter') { setResult((r) => r ? { ...r, name: tempName } : r); setEditName(false) } }}
                style={{ fontSize: 15, fontWeight: 700 }}
              />
            ) : (
              <Text
                strong
                onClick={() => { setTempName(result.name); setEditName(true) }}
                style={{ cursor: 'text', fontSize: 15, display: 'block' }}
              >
                {result.name} <Text type="secondary" style={{ fontSize: 14, fontWeight: 400 }}>✏️</Text>
              </Text>
            )}
            <Text type="secondary" style={{ fontSize: 12.5, lineHeight: 1.5, display: 'block', marginTop: 4 }}>
              {result.description}
            </Text>
          </div>
          <Tag color="blue">{result.questions.length} câu</Tag>
        </Flex>
      </div>

      {/* Question list */}
      <div style={{ maxHeight: 'calc(100vh - 360px)', overflowY: 'auto', padding: '8px 0' }}>
        {result.questions.map((q: any, i) => {
          const qt = QTYPES.find((t) => t.value === q.type)
          return (
            <Flex key={q.id} align="flex-start" gap={10} style={{ padding: '10px 16px', borderBottom: '1px solid #f5f5f5' }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: '#f0fdfa', color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 5 }}>{q.title}</Text>
                <Space size={4} wrap>
                  <Tag style={{ fontSize: 13 }}>{qt?.icon} {qt?.label}</Tag>
                  {q.required && <Tag color="red" style={{ fontSize: 13 }}>Bắt buộc</Tag>}
                </Space>
                {(q.options ?? []).length > 0 && (
                  <Flex wrap="wrap" gap={4} style={{ marginTop: 7 }}>
                    {q.options.map((o: any) => (
                      <Tag key={o.id} style={{ fontSize: 13, borderRadius: 20 }}>{o.label}</Tag>
                    ))}
                  </Flex>
                )}
              </div>
              <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => removeQ(q.id)} />
            </Flex>
          )
        })}
      </div>

      {/* Footer actions */}
      <Flex justify="space-between" align="center" gap={8} style={{ padding: '10px 16px', borderTop: '1px solid #f0f2f5', background: '#fafafa' }}>
        <Button icon={<ReloadOutlined />} onClick={() => { setResult(null); setStatus('idle') }}>Tạo lại</Button>
        <Button type="primary" icon={<EyeOutlined />} onClick={() => onSave(result)} style={{ background: ACCENT, borderColor: ACCENT }}>
          Lưu &amp; chọn giao diện
        </Button>
      </Flex>
    </Card>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Topbar */}
      <Flex align="center" gap={12} style={{ padding: '12px 20px', borderBottom: '1px solid #e4e6ea', background: '#fff' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack} />
        <div>
          <Text style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: ACCENT, display: 'block' }}>
            Công cụ AI
          </Text>
          <Text strong style={{ fontSize: 18 }}>Tạo form bằng AI</Text>
        </div>
        {status === 'success' && result && (
          <Button type="primary" onClick={() => onSave(result)} style={{ marginLeft: 'auto', background: ACCENT, borderColor: ACCENT }}>
            Lưu &amp; chọn giao diện
          </Button>
        )}
      </Flex>

      {/* Split layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 20, flex: 1, overflow: 'auto' }}>
        {/* Left: prompt + upload */}
        <Flex vertical gap={14}>
          {/* Prompt card */}
          <Card>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Mô tả yêu cầu form</Text>
            <TextArea
              rows={5}
              placeholder="Ví dụ: Tạo form khảo sát việc làm của sinh viên sau tốt nghiệp..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generate() }}
              style={{ marginBottom: 10, resize: 'none' }}
            />
            {/* Suggestions */}
            <Flex wrap="wrap" gap={6}>
              {SUGGESTIONS.map((s, i) => (
                <Button key={i} size="small" onClick={() => setPrompt(s)} style={{ fontSize: 14, borderRadius: 20 }}>
                  {s}
                </Button>
              ))}
            </Flex>
          </Card>

          {/* Upload card */}
          <Card>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              Tài liệu đính kèm{' '}
              <Text type="secondary" style={{ fontWeight: 400 }}>PDF, DOC, TXT</Text>
            </Text>
            {fileInfo ? (
              <Flex align="center" gap={12} style={{ padding: '10px 14px', background: '#f0fdf9', borderRadius: 8, border: '1px solid #99f6e4' }}>
                <div style={{ width: 36, height: 36, background: ACCENT, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <FileOutlined />
                </div>
                <div style={{ flex: 1 }}>
                  <Text strong style={{ fontSize: 13, display: 'block' }}>{fileInfo.name}</Text>
                  <Text type="secondary" style={{ fontSize: 11.5 }}>{fileInfo.size} KB đã đọc nội dung</Text>
                </div>
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => { setFileInfo(null); setFileText(null); if (fileRef.current) fileRef.current.value = '' }} />
              </Flex>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click() }}
                style={{ border: '2px dashed #e2e8f0', borderRadius: 10, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = ACCENT; (e.currentTarget as HTMLDivElement).style.background = '#f0fdf4' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLDivElement).style.background = '' }}
              >
                <UploadOutlined style={{ fontSize: 24, color: '#9ca3af', display: 'block', marginBottom: 8 }} />
                <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 3 }}>Kéo thả hoặc click chọn file</Text>
                <Text type="secondary" style={{ fontSize: 14 }}>PDF, DOC, DOCX, TXT</Text>
              </div>
            )}
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={handleFile} />

            <Flex align="center" justify="space-between" gap={10} style={{ marginTop: 14 }}>
              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                onClick={generate}
                disabled={status === 'loading' || (!prompt.trim() && !fileText)}
                loading={status === 'loading'}
                style={{ background: ACCENT, borderColor: ACCENT }}
              >
                {status === 'loading' ? 'Đang tạo...' : 'Tạo form'}
              </Button>
            </Flex>

            {status === 'error' && (
              <Alert message={errMsg} type="error" showIcon style={{ marginTop: 10 }} />
            )}
          </Card>
        </Flex>

        {/* Right: result */}
        <div>
          {status === 'idle'    && <ResultEmpty />}
          {status === 'loading' && <ResultLoading />}
          {status === 'error'   && <ResultEmpty />}
          {status === 'success' && <ResultPanel />}
        </div>
      </div>
    </div>
  )
}