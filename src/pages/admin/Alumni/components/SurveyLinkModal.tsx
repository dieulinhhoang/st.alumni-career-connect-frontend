import React, { useState } from 'react';
import { Modal, Input, Button, Typography, message } from 'antd';
import { LinkOutlined, CopyOutlined, CheckOutlined, GlobalOutlined } from '@ant-design/icons';
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
  if (!batchId) return null;

  const url = getSurveyUrl(batchId);

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

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1D9E75' }}>
          <LinkOutlined /> Link khảo sát
        </div>
      }
      width={520}
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

      {/* URL input + copy */}
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
            minWidth: 100,
          }}
        >
          {copied ? 'Đã sao chép' : 'Sao chép'}
        </Button>
      </Input.Group>

      {/* Open link */}
      <Button
        block icon={<GlobalOutlined />}
        onClick={() => window.open(url, '_blank')}
        style={{
          marginTop: 10, borderRadius: 6,
          borderColor: '#2563eb', color: '#2563eb', fontWeight: 500,
        }}
      >
        Mở form khảo sát (dành cho sinh viên)
      </Button>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
        <Button onClick={onClose} style={{ borderRadius: 6 }}>Đóng</Button>
      </div>
    </Modal>
  );
};