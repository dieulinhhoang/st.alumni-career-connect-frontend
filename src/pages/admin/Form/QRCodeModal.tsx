import { useRef } from 'react'
import { Modal, QRCode, Button, message, Typography, Flex, Space } from 'antd'
import { DownloadOutlined, CopyOutlined, QrcodeOutlined } from '@ant-design/icons'

const { Text } = Typography

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
    const padding = 24
    const labelH  = 48
    const out = document.createElement('canvas')
    out.width  = canvas.width  + padding * 2
    out.height = canvas.height + padding * 2 + labelH
    const ctx = out.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, out.width, out.height)
    ctx.drawImage(canvas, padding, padding)
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
        <Space>
          <QrcodeOutlined style={{ color: '#0f766e' }} />
          <span style={{ fontSize: 15, fontWeight: 700 }}>QR Code khảo sát</span>
        </Space>
      }
    >
      <Flex vertical align="center" gap={20} style={{ padding: '8px 0 16px' }}>
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
          <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>{formName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>Quét mã QR để truy cập khảo sát</Text>
        </div>

        {/* Link box */}
        <Flex
          align="center"
          gap={8}
          style={{
            width: '100%',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '10px 12px',
          }}
        >
          <Text
            style={{
              flex: 1, fontSize: 12, color: '#374151',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              fontFamily: 'monospace',
            }}
          >
            {surveyUrl}
          </Text>
          <Button size="small" icon={<CopyOutlined />} onClick={handleCopyLink}>
            Copy
          </Button>
        </Flex>

        {/* Download button */}
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          block
          size="large"
          style={{ background: '#0f766e', borderColor: '#0f766e' }}
        >
          Tải xuống QR Code (.PNG)
        </Button>
      </Flex>
    </Modal>
  )
}
