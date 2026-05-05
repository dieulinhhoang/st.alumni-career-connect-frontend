import { useState, useRef } from 'react'
import { Button, Input, Space, Tag, Spin } from 'antd'
import {
  ArrowLeftOutlined, DeleteOutlined, ThunderboltOutlined,
  UploadOutlined, ReloadOutlined, FileOutlined, PlusOutlined, EyeOutlined,
} from '@ant-design/icons'
import type { Form } from '../../../feature/form/types'
import { generateFormWithAI } from '../../../feature/form/hooks/useAI'
import { QTYPES, SUGGESTIONS } from '../../../feature/form/constants'

const { TextArea } = Input
type AIStatus = 'idle' | 'loading' | 'success' | 'error'
const ACCENT = '#0f766e'

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

  //  handlers 
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

  //  layout helpers 
  const ResultEmpty = () => (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8eaed', padding: '52px 32px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px', background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🤖</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Kết quả sẽ xuất hiện ở đây</div>
      <div style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.7 }}>Điền mô tả hoặc upload file,<br />rồi nhấn <strong style={{ color: '#6b7280' }}>Tạo form</strong>.</div>
    </div>
  )

  const ResultLoading = () => (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8eaed', padding: '52px 32px', textAlign: 'center' }}>
      <Spin size="large" />
      <div style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', marginTop: 16 }}>AI đang phân tích yêu cầu...</div>
      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Thường mất 3–5 giây</div>
    </div>
  )

  const ResultPanel = () => !result ? null : (
    <div className="ai-result-preview">
      <div className="ai-result-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            {editName ? (
              <input autoFocus value={tempName} onChange={(e) => setTempName(e.target.value)}
                onBlur={() => { setResult((r) => r ? { ...r, name: tempName } : r); setEditName(false) }}
                onKeyDown={(e) => { if (e.key === 'Enter') { setResult((r) => r ? { ...r, name: tempName } : r); setEditName(false) } }}
                style={{ fontSize: 15, fontWeight: 700, padding: '4px 8px', border: '1px solid #e8eaed', borderRadius: 5, outline: 'none', fontFamily: 'inherit', width: '100%' }} />
            ) : (
              <div className="result-name" onClick={() => { setTempName(result.name); setEditName(true) }}
                style={{ cursor: 'text', fontSize: 15, fontWeight: 700, color: '#111827' }}>
                {result.name} <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 400 }}>✏️</span>
              </div>
            )}
            <div style={{ fontSize: 12.5, color: '#6b7280', marginTop: 4, lineHeight: 1.5 }}>{result.description}</div>
          </div>
          <Tag color="blue">{result.questions.length} câu</Tag>
        </div>
      </div>

      {/* Question list */}
      <div style={{ maxHeight: 'calc(100vh - 360px)', overflowY: 'auto' }}>
        {result.questions.map((q: any, i) => {
          const qt = QTYPES.find((t) => t.value === q.type)
          return (
            <div key={q.id} className="ai-q-item" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="ai-q-num">{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#111827', marginBottom: 5, lineHeight: 1.5 }}>{q.title}</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
                  <span className="fc-tag">{qt?.icon} {qt?.label}</span>
                  {q.required && <span className="fc-tag danger">Bắt buộc</span>}
                </div>
                {(q.options ?? []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginTop: 7 }}>
                    {q.options.map((o: any) => <span key={o.id} className="opt-pill">{o.label}</span>)}
                  </div>
                )}
              </div>
              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeQ(q.id)} title="Xóa" />
            </div>
          )
        })}
      </div>

      {/* Footer actions */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid #f0f2f5', display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', background: '#fafafa' }}>
        <Button icon={<ReloadOutlined />} onClick={() => { setResult(null); setStatus('idle') }}>Tạo lại</Button>
        <Button type="primary" icon={<EyeOutlined />} onClick={() => onSave(result)}>Lưu &amp; chọn giao diện</Button>
      </div>
    </div>
  )

  //  render 
  return (
    <div className="page">
      {/* Topbar */}
      <div className="topbar">
        <Space size={12}>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack} />
        </Space>
        <div>
          <div className="eyebrow" style={{ marginBottom: 3 }}>Công cụ AI</div>
          <div className="page-title" style={{ fontSize: 18 }}>Tạo form bằng AI</div>
        </div>
        {status === 'success' && result && (
          <Button type="primary" onClick={() => onSave(result)}>Lưu &amp; chọn giao diện</Button>
        )}
      </div>

      {/* Split layout */}
      <div className="ai-split">
        {/* Left: prompt + upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Prompt card */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div className="field-label" style={{ marginBottom: 8 }}>Mô tả yêu cầu form</div>
            <TextArea rows={5}
              placeholder="Ví dụ: Tạo form khảo sát việc làm của sinh viên sau tốt nghiệp..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generate() }}
              style={{ marginBottom: 10, resize: 'none' }}
            />
            {/* Suggestions */}
            <div className="sugs-row">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="sug-btn" onClick={() => setPrompt(s)}>{s}</button>
              ))}
            </div>
          </div>

          {/* Upload card */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div className="field-label" style={{ marginBottom: 8 }}>
              Tài liệu đính kèm <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: 4 }}>PDF, DOC, TXT</span>
            </div>
            {fileInfo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#f0fdf9', borderRadius: 8, border: '1px solid #99f6e4' }}>
                <div style={{ width: 36, height: 36, background: ACCENT, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <FileOutlined />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{fileInfo.name}</div>
                  <div style={{ fontSize: 11.5, color: '#6b7280' }}>{fileInfo.size} KB đã đọc nội dung</div>
                </div>
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => { setFileInfo(null); setFileText(null); if (fileRef.current) fileRef.current.value = '' }} />
              </div>
            ) : (
              <div className="upload-zone" onClick={() => fileRef.current?.click()} role="button" aria-label="Tải lên tài liệu" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click() }}>
                <div style={{ color: '#9ca3af', marginBottom: 8, fontSize: 24 }}><UploadOutlined /></div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Kéo thả hoặc click chọn file</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>PDF, DOC, DOCX, TXT</div>
              </div>
            )}
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={handleFile} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 14 }}>
              <Button type="primary" icon={<ThunderboltOutlined />}
                onClick={generate}
                disabled={status === 'loading' || (!prompt.trim() && !fileText)}
                loading={status === 'loading'}
              >
                {status === 'loading' ? 'Đang tạo...' : 'Tạo form'}
              </Button>
            </div>

            {status === 'error' && (
              <div className="error-box" style={{ marginTop: 10, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#dc2626' }}>
                ⚠️ {errMsg}
              </div>
            )}
          </div>
        </div>

        {/* Right: result */}
        <div className="ai-panel-right">
          {status === 'idle'    && <ResultEmpty />}
          {status === 'loading' && <ResultLoading />}
          {status === 'error'   && <ResultEmpty />}
          {status === 'success' && <ResultPanel />}
        </div>
      </div>
    </div>
  )
}
