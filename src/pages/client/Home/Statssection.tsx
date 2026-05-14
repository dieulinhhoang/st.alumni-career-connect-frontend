// StatsSection.tsx

import type { SurveyStats } from "../../../feature/home/type.ts";
import { useCountUp, useInView } from "../../../feature/home/hooks/index.ts";

const font = "'Open Sans', sans-serif";
const fontActor = "'Actor', sans-serif";
const green = "#234b2f";
const gold = "#c8a84b";
const dark = "#0f172a";

export function StatsSection({ stats }: { stats: SurveyStats }) {
  const { ref, inView } = useInView();

  const alumni    = useCountUp(stats.totalRespondents ?? 0,     inView ? 0 : stats.totalRespondents ?? 0);
  const pct       = useCountUp(stats.overallEmploymentRate ?? 0, inView ? 0 : stats.overallEmploymentRate ?? 0);
  const companies = useCountUp(stats.partnerCompanies ?? 0,     inView ? 0 : stats.partnerCompanies ?? 0);
  const studying  = useCountUp(stats.stillStudying ?? 0,        inView ? 0 : stats.stillStudying ?? 0);

  return (
    <section id="stats" ref={ref}>
      <style>{`
        * { box-sizing: border-box; }

        #stats {
          position: relative;
          overflow: hidden;
          padding: 78px 1.5rem 92px;
        }

        .stats-shell {
          position: relative; z-index: 2;
          width: 100%; max-width: 1200px;
          margin: 0 auto;
        }

        .stats-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 38px;
        }

        .stats-head-left { max-width: 560px; }

        .stats-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .stats-kicker-dot {
          width: 8px; height: 8px;
          border-radius: 999px;
          background: linear-gradient(135deg, ${gold}, #e0c96a);
          box-shadow: 0 0 12px rgba(200,168,75,0.4);
        }

        .stats-kicker-text {
          font-family: ${font};
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #667085;
        }

        .stats-title {
          margin: 0 0 14px;
          font-family: ${fontActor};
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.1; font-weight: 700;
          letter-spacing: -0.02em;
          color: #111827;
        }

        .stats-sub {
          max-width: 58ch;
          font-family: ${font};
          font-size: 1.02rem; line-height: 1.9;
          color: #5f6470;
        }

        .stats-head-tag {
          display: inline-flex;
          align-items: center; gap: 10px;
          padding: 10px 18px;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(35,75,47,0.10), rgba(35,75,47,0.06));
          backdrop-filter: blur(14px);
          border: 1px solid rgba(35,75,47,0.14);
          box-shadow: 0 4px 14px rgba(35,75,47,0.06);
          font-family: ${font};
          font-size: 12px; font-weight: 600;
          color: ${green};
        }

        .stats-head-tag-dot {
          width: 8px; height: 8px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2f6841, #5b9b74);
          box-shadow: 0 0 10px rgba(47,104,65,0.35);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .stats-card {
          position: relative; overflow: hidden;
          padding: 22px 22px 20px;
          border-radius: 24px;
          background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.82));
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow:
            0 10px 30px rgba(15,23,42,0.05),
            0 1px 2px rgba(15,23,42,0.04),
            inset 0 1px 0 rgba(255,255,255,0.8);
          transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
        }

        .stats-card::before {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.35), transparent);
          pointer-events: none;
        }

        .stats-card:hover {
          transform: translateY(-4px);
          border-color: rgba(200,168,75,0.28);
          box-shadow: 0 18px 40px rgba(15,23,42,0.08), 0 4px 12px rgba(15,23,42,0.04);
        }

        .stats-card-label {
          display: inline-block;
          margin-bottom: 10px;
          font-family: ${font};
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #667085;
        }

        .stats-card-main {
          display: flex; align-items: baseline;
          gap: 10px; margin-bottom: 10px;
        }

        .stats-card-value {
          font-family: ${fontActor};
          font-size: 40px; line-height: 1;
          color: ${dark};
        }

        .stats-card-unit {
          font-family: ${font};
          font-size: 14px; color: #475467;
        }

        .stats-card-note {
          font-family: ${font};
          font-size: 13px; line-height: 1.7;
          color: #98a2b3;
        }

        @media (max-width: 768px) {
          #stats { padding: 56px 1rem 72px; }
          .stats-head { align-items: flex-start; }
          .stats-title { font-size: 34px; }
          .stats-card { border-radius: 20px; }
          .stats-card-value { font-size: 34px; }
        }
      `}</style>

      <div className="stats-shell">
        <div className="stats-head">
          <div className="stats-head-left">
            <div className="stats-kicker">
              <span className="stats-kicker-dot" />
              <span className="stats-kicker-text">Số liệu tổng quan</span>
            </div>
            <h2 className="stats-title">
              Thống kê từ kết quả khảo sát 
            </h2>
            <p className="stats-sub">
              Số liệu bên dưới được rút ra từ dữ liệu khảo sát việc làm,
              giúp Học viện và cựu sinh viên có thêm thông tin tham khảo sau tốt nghiệp.
            </p>
          </div>
          <div className="stats-head-tag">
            <span className="stats-head-tag-dot" />
            Dữ liệu cập nhật từ hệ thống khảo sát
          </div>
        </div>

        <div className="stats-grid">
          <div className="stats-card">
            <span className="stats-card-label">Cựu sinh viên</span>
            <div className="stats-card-main">
              <span className="stats-card-value">{alumni.toLocaleString()}</span>
              <span className="stats-card-unit">người đã tham gia khảo sát</span>
            </div>
            <p className="stats-card-note">Mở rộng dần theo từng khóa và từng ngành đào tạo.</p>
          </div>

          <div className="stats-card">
            <span className="stats-card-label">Tỷ lệ có việc làm</span>
            <div className="stats-card-main">
              <span className="stats-card-value">{pct}</span>
              <span className="stats-card-unit">% sau 12 tháng tốt nghiệp</span>
            </div>
            <p className="stats-card-note">
              Tính trên các cựu sinh viên đã trả lời đầy đủ thông tin việc làm.
            </p>
          </div>

          <div className="stats-card">
            <span className="stats-card-label">Doanh nghiệp đối tác</span>
            <div className="stats-card-main">
              <span className="stats-card-value">{companies}</span>
              <span className="stats-card-unit">đơn vị hợp tác</span>
            </div>
            <p className="stats-card-note">
              Đồng hành trong hoạt động tuyển dụng, thực tập và hướng nghiệp.
            </p>
          </div>

          <div className="stats-card">
            <span className="stats-card-label">Tiếp tục học tập</span>
            <div className="stats-card-main">
              <span className="stats-card-value">{studying}</span>
              <span className="stats-card-unit">cựu sinh viên</span>
            </div>
            <p className="stats-card-note">
              Đang theo học cao học, nghiên cứu sinh hoặc chương trình chuyên sâu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}