import React from 'react';
import type { SubmissionStatus } from '../../../../feature/reports/types';

const CONFIG: Record<SubmissionStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:     { label: 'Chưa nộp',    color: '#6b7280', bg: '#f3f4f6', border: '#e5e7eb' },
  submitted: { label: 'Đã nộp',      color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  returned:  { label: 'Cần bổ sung', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  approved:  { label: 'Đã duyệt',    color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
};

interface Props {
  status: SubmissionStatus;
}

export const SubmissionPill: React.FC<Props> = ({ status }) => {
  const { label, color, bg, border } = CONFIG[status] ?? CONFIG.draft;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        color,
        whiteSpace: 'nowrap',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 16,
        padding: '3px 12px 3px 10px',
      }}
    >
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }} />
      {label}
    </span>
  );
};
