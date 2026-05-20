import React from 'react';

export interface KpiItem {
  icon: React.ReactNode;
  /** accent color for value text and icon  */
  color: string;
  /** pastel background of the whole card */
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
      <div
        className="rp-kpi-card"
        key={i}
        style={{ background: kpi.bg, color: kpi.color }}
      >
        <div className="rp-kpi-icon">
          {kpi.icon}
        </div>
        <div className="rp-kpi-body">
          <div className="rp-kpi-label">{kpi.label}</div>
          <div className="rp-kpi-value">{kpi.value}</div>
          <div className="rp-kpi-sub">{kpi.sub}</div>
        </div>
      </div>
    ))}
  </div>
);
