import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor?: string;
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
  icon,
  iconBg,
  iconColor = '#fff',
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
      {/* Top row: icon + badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            color: iconColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            background: pctBg,
            color: pctColor,
            padding: '3px 8px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.2px',
            lineHeight: 1.5,
            whiteSpace: 'nowrap',
          }}
        >
          {displayPct}%
        </span>
      </div>

      {/* Number + label */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, lineHeight: 1 }}>
          <span style={{ fontSize: 26, fontWeight: 500, color: numColor, lineHeight: 1 }}>
            {numerator}
          </span>
          <Text type="secondary" style={{ fontSize: 13 }}>
            / {denominator}
          </Text>
        </div>
        <Text
          type="secondary"
          title={label}
          style={{
            fontSize: 12,
            lineHeight: 1.4,
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </Text>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 4,
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