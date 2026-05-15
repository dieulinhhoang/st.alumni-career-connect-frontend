import React from 'react';

export interface KpiItem {
  icon: React.ReactNode;
  color: string;
  bg: string;
  label: string;
  value: string;
  sub: string;
}

interface Props {
  items: KpiItem[];
}

export const KpiGrid: React.FC<Props> = ({ items }) => (
  <div className="rp-kpi-grid">
    {items.map((kpi, i) => (
      <div className="rp-kpi-card" key={i}>
        <div className="rp-kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>
          {kpi.icon}
        </div>
        <div className="rp-kpi-body">
          <div className="rp-kpi-label">{kpi.label}</div>
          <div className="rp-kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
          <div className="rp-kpi-sub">{kpi.sub}</div>
        </div>
      </div>
    ))}
  </div>
);
