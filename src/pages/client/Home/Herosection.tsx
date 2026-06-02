// ====================== Herosection.tsx ======================
import { Link } from "react-router-dom";
import { useCountUp } from "../../../feature/home/hooks/index.ts";
import type { SurveyStats } from "../../../feature/home/type.ts";

const green = "#234b2f";
const greenLight = "#2f6841";
const gold = "#c8a84b";
const dark = "#0f172a";

export function HeroSection({ stats }: { stats: SurveyStats }) {
  const alumni = useCountUp(stats.totalRespondents, 1800, 400);
  const pct = useCountUp(stats.overallEmploymentRate, 1600, 600);
  const companies = useCountUp(stats.partnerCompanies || 48, 1200, 500);

  return (
    <section id="home" className="hero-wrapper">
      <style>{`
        .hero-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
          background: radial-gradient(circle at 0% 20%, #eef3e9, #fef9e6);
        }
        .hero-section {
          max-width: 1280px;
          margin: 0 auto;
          min-height: 90vh;
          display: flex;
          align-items: center;
          gap: 48px;
          padding: 6rem 1.5rem 4rem;
        }
        @media (max-width: 900px) {
          .hero-section { flex-direction: column-reverse; text-align: center; gap: 2rem; padding-top: 5rem; }
        }
        .hero-contents { flex: 1.2; max-width: 600px; }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(35,75,47,0.08);
          padding: 6px 16px;
          border-radius: 40px;
          font-size: 13px;
          font-weight: 700;
          color: ${green};
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 1.5rem;
          font-family: 'Open Sans', sans-serif;
        }
        .hero-title {
          font-family: 'Actor', sans-serif;
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          line-height: 1.15;
          font-weight: 700;
          color: ${dark};
          margin-bottom: 1.2rem;
        }
        .hero-highlight {
          background: linear-gradient(120deg, ${green}, ${gold});
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .hero-subText {
          font-family: 'Open Sans', sans-serif;
          font-size: 1.05rem;
          line-height: 1.7;
          color: #4b5563;
          margin-bottom: 2rem;
        }
        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(100deg, ${green}, ${greenLight});
          padding: 14px 32px;
          border-radius: 60px;
          color: white;
          font-weight: 700;
          font-family: 'Open Sans', sans-serif;
          text-decoration: none;
          transition: all 0.25s;
          box-shadow: 0 8px 20px rgba(35,75,47,0.25);
        }
        .cta-primary:hover { transform: translateY(-3px); box-shadow: 0 18px 30px rgba(35,75,47,0.35); gap: 16px; }
        .hero-stats {
          display: flex;
          gap: 24px;
          margin-top: 2.5rem;
          flex-wrap: wrap;
        }
        .hero-stat-item {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(12px);
          border-radius: 28px;
          padding: 12px 20px;
          min-width: 120px;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 6px 14px rgba(0,0,0,0.03);
        }
        .hero-stat-value {
          font-family: 'Actor', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          color: ${green};
        }
        .hero-stat-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #4b5563; }
        .hero-image-container { flex: 1; border-radius: 32px; overflow: hidden; box-shadow: 0 25px 45px -12px rgba(0,0,0,0.25); transition: transform 0.3s; }
        .hero-image-container:hover { transform: scale(1.01); }
        .hero-image { width: 100%; height: auto; aspect-ratio: 4/3; object-fit: cover; display: block; }
      `}</style>
      <div className="hero-section">
        <div className="hero-contents">
          <div className="hero-eyebrow">✨ Nền tảng kết nối & khảo sát việc làm</div>
          <h1 className="hero-title">
            Kết nối <span className="hero-highlight">cựu sinh viên</span><br />với cơ hội nghề nghiệp
          </h1>
          <p className="hero-subText">
            Hệ thống khảo sát việc làm hiện đại dành cho cộng đồng cựu sinh viên Học viện Nông nghiệp Việt Nam,
            giúp kết nối, chia sẻ dữ liệu nghề nghiệp và mở rộng tương lai.
          </p>
          <Link to="" className="cta-primary">Tham gia khảo sát ngay →</Link>
          <div className="hero-stats">
            <div className="hero-stat-item"><div className="hero-stat-value">{alumni.toLocaleString()}+</div><div className="hero-stat-label">Cựu sinh viên</div></div>
            <div className="hero-stat-item"><div className="hero-stat-value">{pct}%</div><div className="hero-stat-label">Tỉ lệ việc làm</div></div>
            <div className="hero-stat-item"><div className="hero-stat-value">{companies}+</div><div className="hero-stat-label">Doanh nghiệp</div></div>
          </div>
        </div>
        <div className="hero-image-container">
          <img className="hero-image" src="https://xdcs.cdnchinhphu.vn/446259493575335936/2024/8/18/nn1-17239512376531343079339.jpg" alt="VNUA Campus" loading="lazy" />
        </div>
      </div>
    </section>
  );
}