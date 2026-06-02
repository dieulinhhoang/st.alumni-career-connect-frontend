import { useRef } from 'react'
import { Modal, QRCode, message } from 'antd'
import { DownloadOutlined, CopyOutlined, QrcodeOutlined } from '@ant-design/icons'

interface QRCodeModalProps {
  open: boolean
  onClose: () => void
  surveyUrl: string
  formName: string
}

export function QRCodeModal({ open, onClose, surveyUrl, formName }: QRCodeModalProps) {
  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector<HTMLCanvasElement>('canvas')
    if (!canvas) {
      message.error('Không tìm thấy QR code để tải xuống')
      return
    }
    // Tạo canvas mới với padding + label
    const padding = 24
    const labelH  = 48
    const out = document.createElement('canvas')
    out.width  = canvas.width  + padding * 2
    out.height = canvas.height + padding * 2 + labelH
    const ctx = out.getContext('2d')!

    // Nền trắng
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, out.width, out.height)

    // QR code
    ctx.drawImage(canvas, padding, padding)

    // Label tên form
    ctx.fillStyle = '#111827'
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(
      formName.length > 50 ? formName.slice(0, 47) + '…' : formName,
      out.width / 2,
      canvas.height + padding * 2 + 16
    )
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.fillStyle = '#6b7280'
    ctx.fillText('Quét QR để điền khảo sát', out.width / 2, canvas.height + padding * 2 + 36)

    // Tải xuống
    const link = document.createElement('a')
    const safeName = formName.replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF ]/g, '').trim() || 'qr-khao-sat'
    link.download = `QR_${safeName}.png`
    link.href = out.toDataURL('image/png')
    link.click()
    message.success('Đã tải xuống QR code!')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl).then(() => {
      message.success('Đã sao chép link khảo sát!')
    }).catch(() => {
      message.error('Không thể sao chép, hãy copy thủ công')
    })
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
      centered
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#111827' }}>
          <QrcodeOutlined style={{ color: '#0f766e' }} />
          QR Code khảo sát
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '8px 0 16px' }}>
        {/* QR Code */}
        <div
          ref={qrRef}
          style={{
            padding: 16,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <QRCode
            value={surveyUrl}
            size={220}
            color="#111827"
            bgColor="#ffffff"
            style={{ display: 'block' }}
          />
        </div>

        {/* Form name */}
        <div style={{ textAlign: 'center', maxWidth: 320 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 4 }}>
            {formName}
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Quét mã QR để truy cập khảo sát</div>
        </div>

        {/* Link box */}
        <div style={{
          width: '100%',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{
            flex: 1, fontSize: 12, color: '#374151',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontFamily: 'monospace',
          }}>
            {surveyUrl}
          </span>
          <button
            onClick={handleCopyLink}
            title="Sao chép link"
            style={{
              flexShrink: 0, padding: '4px 8px', borderRadius: 6,
              border: '1px solid #e5e7eb', background: '#fff',
              cursor: 'pointer', fontSize: 12, color: '#6b7280',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <CopyOutlined /> Copy
          </button>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          style={{
            width: '100%',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            height: 40, borderRadius: 8,
            border: 'none', background: '#0f766e',
            color: '#fff', fontWeight: 600, fontSize: 14,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#0d6b63' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#0f766e' }}
        >
          <DownloadOutlined />
          Tải xuống QR Code (.PNG)
        </button>
      </div>
    </Modal>
  )
}
