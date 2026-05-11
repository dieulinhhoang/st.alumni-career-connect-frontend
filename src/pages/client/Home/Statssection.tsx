import type { SurveyStats } from "../../../feature/home/type.ts";
import { useCountUp } from "../../../feature/home/hooks/index.ts";
import { useInView } from "../../../feature/home/hooks/useInView.ts";

const font = "'Be Vietnam Pro', sans-serif";
const green = "#1a6b35";
const gold = "#8B6914";
const blue = "#1b5299";
const bgLight = "#f4f8f5";

export function StatsSection({ stats }: { stats: SurveyStats }) {
  const { ref, inView } = useInView();
  const alumni = useCountUp(stats.totalRespondents, inView ? 0 : stats.totalRespondents);
  const pct = useCountUp(stats.overallEmploymentRate, inView ? 0 : stats.overallEmploymentRate);
  const companies = useCountUp(stats.partnerCompanies, inView ? 0 : stats.partnerCompanies);
  const studying = useCountUp(stats.stillStudying, inView ? 0 : stats.stillStudying);

  return (
    <section
      ref={ref}
      style={{
        background: bgLight,
        padding: "100px 5%",
        textAlign: "center",
      }}
    >
      <style>{`
        .stats-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        .stats-title {
          font-family: ${font};
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 52px;
        }
        .stats-title span {
          background: linear-gradient(135deg, ${green} 0%, ${gold} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 32px;
        }
        .stat-card {
          background: white;
          border-radius: 18px;
          padding: 32px 24px;
          box-shadow: 0 4px 20px rgba(26, 107, 53, 0.08);
          border: 1px solid rgba(26, 107, 53, 0.1);
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          transform: translateY(0);
        }
        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(26, 107, 53, 0.15);
          border-color: rgba(26, 107, 53, 0.25);
        }
        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
        }
        .stat-icon.green { background: rgba(26, 107, 53, 0.12); color: ${green}; }
        .stat-icon.gold { background: rgba(139, 105, 20, 0.12); color: ${gold}; }
        .stat-icon.blue { background: rgba(27, 82, 153, 0.12); color: ${blue}; }
        .stat-icon.purple { background: rgba(124, 58, 237, 0.12); color: #7c3aed; }
        .stat-num {
          font-family: ${font};
          font-size: 38px;
          font-weight: 900;
          margin-bottom: 6px;
        }
        .stat-label {
          font-family: ${font};
          font-size: 14px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
      `}</style>
      <div className="stats-container">
        <h2 className="stats-title">Sức mạnh của cộng đồng <span>VNUA Alumni</span></h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon green">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="stat-num" style={{ color: green }}>{alumni.toLocaleString()}</div>
            <div className="stat-label">Cựu sinh viên đã tham gia</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon gold">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div className="stat-num" style={{ color: gold }}>{pct}%</div>
            <div className="stat-label">Tỷ lệ có việc làm</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
            </div>
            <div className="stat-num" style={{ color: blue }}>{companies}</div>
            <div className="stat-label">Doanh nghiệp đối tác</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
            </div>
            <div className="stat-num" style={{ color: "#7c3aed" }}>{studying}</div>
            <div className="stat-label">Đang học cao học và nghiên cứu</div>
          </div>
        </div>
      </div>
    </section>
  );
}
