import React from 'react';

export const PctBadge: React.FC<{ pct: number }> = ({ pct }) => {
  const hi  = pct >= 80;
  const mid = pct >= 50;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 52, padding: '3px 10px', borderRadius: 14,
      background: hi ? '#d1fae5' : mid ? '#fef3c7' : '#fee2e2',
      color:      hi ? '#065f46' : mid ? '#92400e' : '#9f1239',
      fontSize: 12, fontWeight: 600,
    }}>
      {pct % 1 === 0 ? pct : pct.toFixed(1)}%
    </span>
  );
};