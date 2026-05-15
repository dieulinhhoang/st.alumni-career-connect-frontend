import React from 'react';
import type { SubmissionStatus } from '../../../../feature/reports/types';

const CONFIG: Record<SubmissionStatus, { label: string; color: string; bg: string }> = {
  draft:     { label: 'Chưa nộp',    color: '#8c8c8c', bg: '#f5f5f5' },
  submitted: { label: 'Đã nộp',      color: '#1677ff', bg: '#e6f4ff' },
  returned:  { label: 'Cần bổ sung', color: '#faad14', bg: '#fffbe6' },
  approved:  { label: 'Đã duyệt',    color: '#52c41a', bg: '#f6ffed' },
};

interface Props {
  status: SubmissionStatus;
}

export const SubmissionPill: React.FC<Props> = ({ status }) => {
  const { label, color, bg } = CONFIG[status] ?? CONFIG.draft;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
        color,
        background: bg,
        border: `1px solid ${color}33`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
};
