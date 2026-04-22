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
  icon, iconBg, iconColor = '#fff', numerator, denominator, label,
  numColor, barColor, pctBg, pctColor, cardBg, cardBorder,
}) => {
  const pct = denominator ? Math.round((numerator / denominator) * 10000) / 100 : 0;
  const displayPct = pct % 1 === 0 ? pct : pct.toFixed(2);

  return (
    <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        {/* Icon circle */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: iconColor,
        }}>
          {icon}
        </div>
        <span style={{
          background: pctBg, color: pctColor,
          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700,
        }}>
          {displayPct}%
        </span>
      </div>
      <div style={{ marginBottom: 2 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: numColor, lineHeight: 1 }}>
          {numerator}
        </span>
        <Text type="secondary" style={{ fontSize: 14, marginLeft: 4 }}>/ {denominator}</Text>
      </div>
      <Text type="secondary" style={{ fontSize: 12 }}>{label}</Text>
      <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${Math.min(pct, 100)}%`,
          background: barColor, borderRadius: 2, transition: 'width .5s ease',
        }} />
      </div>
    </div>
  );
};