// src/pages/admin/Reports/components/SubmissionPill.tsx
import React from 'react';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import type { SubmissionStatus } from '../types';

const STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  approved: {
    label: 'Đã duyệt',
    color: '#52c41a',
    bg: '#162312',
    icon: <CheckCircleOutlined />,
  },
  submitted: {
    label: 'Đã nộp',
    color: '#1677ff',
    bg: '#111d2c',
    icon: <AuditOutlined />,
  },
  returned: {
    label: 'Trả về',
    color: '#faad14',
    bg: '#2b2111',
    icon: <ExclamationCircleOutlined />,
  },
  draft: {
    label: 'Chưa nộp',
    color: '#8c8c8c',
    bg: '#1a1a1a',
    icon: <ClockCircleOutlined />,
  },
};

export function SubmissionPill({ status }: { status: SubmissionStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 500,
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.color}55`,
      }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// MiniBar component - inline progress bar
export function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: '#2a2a3e',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 3,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      <span style={{ color: '#aaa', fontSize: 11, minWidth: 32, textAlign: 'right' }}>
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}
