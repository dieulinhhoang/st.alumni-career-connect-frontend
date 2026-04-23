import { useInView } from "../../../feature/home/hooks/index.ts";
import type { SurveyStats } from "../../../feature/home/type.ts";

const font = "'Be Vietnam Pro', sans-serif";
const purple = "#7c3aed";
const purpleLight = "#ede9fe";

const icons = {
  users: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  building: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
    </svg>
  ),
  check: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  briefcase: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
};

export function StatsSection({ stats }: { stats: SurveyStats }) {
  const { ref, visible } = useInView();

  const items = [
    { value: `${stats.totalRespondents.toLocaleString("vi-VN")}+`, label: "Cựu sinh viên tham gia", icon: icons.users,     iconBg: "#ede9fe", iconColor: "#7c3aed" },
    { value: "350+",                                                label: "Doanh nghiệp đối tác",  icon: icons.building,  iconBg: "#dbeafe", iconColor: "#2563eb" },
    { value: `${stats.overallEmploymentRate}%`,                    label: "Tỷ lệ có việc làm",     icon: icons.check,     iconBg: "#dcfce7", iconColor: "#16a34a" },
    { value: "2.800+",                                             label: "Vị trí tuyển dụng",     icon: icons.briefcase, iconBg: "#fef3c7", iconColor: "#d97706" },
  ];

  return (
    <section ref={ref} style={{ background: "#faf5ff", padding: "80px 5%" }}>
      <style>{`
        .stats-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
        }
      `}</style>
      <div className="stats-grid">
        {items.map((s, i) => (
          <div
            key={s.label}
            style={{
              background: "white", borderRadius: 16, padding: "28px 24px",
              border: `1px solid ${purpleLight}`, textAlign: "center",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.5s ${i * 0.1}s, transform 0.5s ${i * 0.1}s`,
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: s.iconBg, color: s.iconColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              {s.icon}
            </div>
            <div style={{ fontFamily: font, fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 800, color: purple, marginBottom: 6 }}>
              {s.value}
            </div>
            <div style={{ fontFamily: font, fontSize: 14, color: "#6b7280" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}