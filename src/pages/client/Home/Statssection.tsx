// ====================== Statssection.tsx ======================
import type { SurveyStats } from "../../../feature/home/type.ts";
import { useCountUp, useInView } from "../../../feature/home/hooks/index.ts";

const font = "'Open Sans', sans-serif";
const fontActor = "'Actor', sans-serif";
const green = "#234b2f";
const gold = "#c8a84b";

export function StatsSection({ stats }: { stats: SurveyStats }) {
  const { ref, inView } = useInView();
  const alumni    = useCountUp(stats.totalRespondents ?? 0, inView ? 0 : stats.totalRespondents ?? 0);
  const pct       = useCountUp(stats.overallEmploymentRate ?? 0, inView ? 0 : stats.overallEmploymentRate ?? 0);
  const companies = useCountUp(stats.partnerCompanies ?? 0, inView ? 0 : stats.partnerCompanies ?? 0);
  const studying  = useCountUp(stats.stillStudying ?? 0, inView ? 0 : stats.stillStudying ?? 0);

  return (
    <section id="stats" ref={ref}>
      <style>{`
        #stats { padding: 5rem 1.5rem; background: #fefcf5; }
        .stats-shell { max-width: 1280px; margin: 0 auto; }
        .stats-head { text-align: center; margin-bottom: 3rem; }
        .stats-kicker {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(35,75,47,0.08); padding: 6px 18px; border-radius: 40px;
          font-size: 12px; font-weight: 700; color: ${green}; text-transform: uppercase;
        }
        .stats-title {
          font-family: ${fontActor}; font-size: clamp(2rem, 4vw, 2.8rem);
          margin: 1rem 0 0.5rem; color: #0f172a;
        }
        .stats-sub { color: #5b6b8c; max-width: 560px; margin: 0 auto; }
        .stats-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr));
          gap: 1.8rem; margin-top: 2rem;
        }
        .stats-card {
          background: white; border-radius: 32px; padding: 1.8rem 1.5rem;
          box-shadow: 0 12px 30px rgba(0,0,0,0.05); transition: all 0.25s;
          border: 1px solid rgba(0,0,0,0.03);
        }
        .stats-card:hover { transform: translateY(-6px); box-shadow: 0 22px 40px rgba(0,0,0,0.08); border-color: ${gold}40; }
        .stats-card-value { font-family: ${fontActor}; font-size: 3rem; font-weight: 700; color: ${green}; line-height: 1.2; }
        .stats-card-label { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-top: 0.5rem; }
        .stats-card-note { font-size: 0.8rem; color: #94a3b8; margin-top: 1rem; }
      `}</style>
      <div className="stats-shell">
        <div className="stats-head">
          <div className="stats-kicker"><span>📊 THỐNG KÊ TỔNG QUAN</span></div>
          <h2 className="stats-title">Dữ liệu khảo sát việc làm mới nhất</h2>
          <p className="stats-sub">Kết quả từ hơn 15.000 cựu sinh viên đã tham gia khảo sát</p>
        </div>
        <div className="stats-grid">
          <div className="stats-card"><div className="stats-card-value">{alumni.toLocaleString()}+</div><div className="stats-card-label">Cựu sinh viên tham gia</div><div className="stats-card-note">Mở rộng theo từng khóa</div></div>
          <div className="stats-card"><div className="stats-card-value">{pct}%</div><div className="stats-card-label">Tỉ lệ có việc làm sau 12 tháng</div><div className="stats-card-note">Đúng ngành, đúng vị trí</div></div>
          <div className="stats-card"><div className="stats-card-value">{companies}</div><div className="stats-card-label">Doanh nghiệp đối tác</div><div className="stats-card-note">Đa dạng lĩnh vực</div></div>
          <div className="stats-card"><div className="stats-card-value">{studying}</div><div className="stats-card-label">Đang học tập nâng cao</div><div className="stats-card-note">Cao học, nghiên cứu sinh</div></div>
        </div>
      </div>
    </section>
  );
}