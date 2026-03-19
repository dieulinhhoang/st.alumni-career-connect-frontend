import { useInView } from "../../../feature/home/hooks/index.ts";
import type { SurveyStats } from "../../../feature/home/type.ts";

const font = "'Be Vietnam Pro', sans-serif";
const purple = "#7c3aed";
const purpleLight = "#ede9fe";

export function StatsSection({ stats }: { stats: SurveyStats }) {
  const { ref, visible } = useInView();
  const items = [
    { value: `${stats.totalRespondents.toLocaleString("vi-VN")}+`, label: "Cựu sinh viên tham gia", icon: "👥" },
    { value: "350+",                                                label: "Doanh nghiệp đối tác",  icon: "🏢" },
    { value: `${stats.overallEmploymentRate}%`,                    label: "Tỷ lệ có việc làm",     icon: "✅" },
    { value: "2.800+",                                             label: "Vị trí tuyển dụng",     icon: "💼" },
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
          <div key={s.label} style={{ background: "white", borderRadius: 16, padding: "28px 24px", border: `1px solid ${purpleLight}`, textAlign: "center", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.5s ${i * 0.1}s, transform 0.5s ${i * 0.1}s` }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontFamily: font, fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 800, color: purple, marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontFamily: font, fontSize: 14, color: "#6b7280" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}