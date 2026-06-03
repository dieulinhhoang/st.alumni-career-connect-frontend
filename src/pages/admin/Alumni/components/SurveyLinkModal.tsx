import React, { useRef, useState } from 'react';
import { Modal, Input, Button, Typography, message, QRCode, Divider } from 'antd';
import { LinkOutlined, CopyOutlined, CheckOutlined, GlobalOutlined, DownloadOutlined } from '@ant-design/icons';
import { getSurveyUrl } from '../../../../feature/alumni/constants';

const { Text } = Typography;

interface Props {
  batchId: number | string | undefined;
  batchTitle: string;
  batchYear?: number;
  batchGraduationPeriod?: string;
  batchStatus?: string;
  open: boolean;
  onClose: () => void;
}

export const SurveyLinkModal: React.FC<Props> = ({
  batchId, batchTitle, batchYear, batchGraduationPeriod, batchStatus, open, onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  if (!batchId) return null;

  const url = getSurveyUrl(batchId, batchTitle);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      message.success('Đã sao chép link!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      message.error('Không thể sao chép, hãy copy thủ công.');
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector<HTMLCanvasElement>('canvas');
    if (!canvas) { message.error('Không tìm thấy QR code để tải xuống'); return; }
    const padding = 20;
    const labelH = 44;
    const out = document.createElement('canvas');
    out.width  = canvas.width  + padding * 2;
    out.height = canvas.height + padding * 2 + labelH;
    const ctx = out.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(canvas, padding, padding);
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 13px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    const name = batchTitle.length > 50 ? batchTitle.slice(0, 47) + '…' : batchTitle;
    ctx.fillText(name, out.width / 2, canvas.height + padding * 2 + 16);
    ctx.font = '11px -apple-system, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Quét QR để điền khảo sát', out.width / 2, canvas.height + padding * 2 + 33);
    const link = document.createElement('a');
    const safeName = batchTitle.replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF ]/g, '').trim() || 'qr-khao-sat';
    link.download = `QR_${safeName}.png`;
    link.href = out.toDataURL('image/png');
    link.click();
    message.success('Đã tải xuống QR code!');
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1D9E75' }}>
          <LinkOutlined /> Link & QR khảo sát
        </div>
      }
      width={600}
    >
      {/* Batch info */}
      <div style={{
        background: '#f0fdf4', border: '1px solid #bbf7d0',
        borderRadius: 8, padding: '10px 14px', marginBottom: 18,
      }}>
        <Text strong style={{ fontSize: 13 }}>{batchTitle}</Text>
        {(batchYear || batchGraduationPeriod) && (
          <>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {batchYear && `Năm ${batchYear}`}
              {batchGraduationPeriod && ` · ${batchGraduationPeriod}`}
            </Text>
          </>
        )}
      </div>

      {/* Warning when inactive */}
      {batchStatus && batchStatus !== 'active' && (
        <div style={{
          marginBottom: 12, padding: '8px 12px',
          background: '#fef9c3', border: '1px solid #fde047',
          borderRadius: 6, fontSize: 12, color: '#92400e',
        }}>
          Đợt khảo sát này chưa ở trạng thái <b>Hoạt động</b> — sinh viên chưa thể truy cập link.
        </div>
      )}

      {/* Two-column layout: link on left, QR on right */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* Left: URL + actions */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>Link khảo sát</Text>
          <Input.Group compact style={{ display: 'flex' }}>
            <Input
              value={url} readOnly
              style={{
                flex: 1, borderRadius: '6px 0 0 6px',
                fontFamily: 'monospace', fontSize: 12, background: '#fafafa',
              }}
            />
            <Button
              type="primary"
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={copy}
              style={{
                borderRadius: '0 6px 6px 0',
                background:  copied ? '#059669' : '#1D9E75',
                borderColor: copied ? '#059669' : '#1D9E75',
                minWidth: 95,
              }}
            >
              {copied ? 'Đã sao chép' : 'Sao chép'}
            </Button>
          </Input.Group>

          <Button
            block icon={<GlobalOutlined />}
            onClick={() => window.open(url, '_blank')}
            style={{
              marginTop: 8, borderRadius: 6,
              borderColor: '#2563eb', color: '#2563eb', fontWeight: 500,
            }}
          >
            Mở form khảo sát
          </Button>
        </div>

        <Divider type="vertical" style={{ height: 'auto', alignSelf: 'stretch', margin: '0' }} />

        {/* Right: QR code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>QR Code</Text>
          <div
            ref={qrRef}
            style={{
              padding: 10,
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            }}
          >
            <QRCode
              type="canvas"
              value={url}
              
            />
          </div>
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={handleDownloadQR}
            style={{ borderRadius: 6, borderColor: '#0f766e', color: '#0f766e', fontSize: 12 }}
          >
            Tải PNG
          </Button>
        </div>
      </div>

      {/* <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
        <Button onClick={onClose} style={{ borderRadius: 6 }}>Đóng</Button>
      </div> */}
    </Modal>
  );
};