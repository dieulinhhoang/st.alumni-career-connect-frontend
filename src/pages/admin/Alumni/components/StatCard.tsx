import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export interface StatCardProps {
  numerator: number;
  denominator: number;
  label: string;
  numColor: string;
  barColor: string;
  pctBg: string;
  pctColor: string;
  cardBg: string;
  cardBorder: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  numerator,
  denominator,
  label,
  numColor,
  barColor,
  pctBg,
  pctColor,
  cardBg,
  cardBorder,
}) => {
  const pct = denominator ? Math.round((numerator / denominator) * 10000) / 100 : 0;
  const displayPct = pct % 1 === 0 ? pct : pct.toFixed(1);

  return (
    <div
      style={{
        background: cardBg,
        border: `0.5px solid ${cardBorder}`,
        borderRadius: 14,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        height: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
      }}
    >
      {/* Top row: label + percentage badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <Text
          type="secondary"
          title={label}
          style={{
            fontSize: 14,
            lineHeight: 1.4,
            fontWeight: 500,
            color: '#374151',
            wordBreak: 'break-word',
            flex: 1,
          }}
        >
          {label}
        </Text>
        <span
          style={{
            background: pctBg,
            color: pctColor,
            padding: '3px 10px',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.2px',
            lineHeight: 1.5,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {displayPct}%
        </span>
      </div>

      {/* Numerator / denominator */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, lineHeight: 1, flex: 1 }}>
        <span style={{ fontSize: 30, fontWeight: 600, color: numColor, lineHeight: 1 }}>
          {numerator}
        </span>
        <Text type="secondary" style={{ fontSize: 15 }}>
          / {denominator}
        </Text>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 5,
          background: 'rgba(0,0,0,0.08)',
          borderRadius: 4,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(pct, 100)}%`,
            background: barColor,
            borderRadius: 4,
            transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
};
