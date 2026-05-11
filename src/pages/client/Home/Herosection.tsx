import { Link } from "react-router-dom";
import { useCountUp } from "../../../feature/home/hooks/index.ts";
import type { SurveyStats } from "../../../feature/home/type.ts";

const font = "'Be Vietnam Pro', sans-serif";
const green = "#1a6b35";
const greenLight = "#2d8f4f";
const gold = "#8B6914";
const cream = "#faf8f3";

export function HeroSection({ stats }: { stats: SurveyStats }) {
  const alumni = useCountUp(stats.totalRespondents, 1800, 400);
  const pct = useCountUp(stats.overallEmploymentRate, 1600, 600);

  return (
    <section
      style={{
        minHeight: "100vh",
        background: cream,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 5%",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes blobMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -50px) scale(1.1); }
          50% { transform: translate(-30px, 30px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        .hero-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 80px;
          max-width: 1280px;
          width: 100%;
        }
        .hero-text {
          flex: 0 0 50%;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: rgba(26, 107, 53, 0.1);
          border: 1.5px solid rgba(26, 107, 53, 0.3);
          border-radius: 50px;
          font-family: ${font};
          font-size: 13px;
          font-weight: 600;
          color: ${green};
          margin-bottom: 28px;
          animation: floatBadge 3s ease-in-out infinite;
        }
        .hero-badge svg { width: 16px; height: 16px; fill: ${green}; }
        .hero-title {
          font-family: ${font};
          font-size: clamp(38px, 5vw, 56px);
          font-weight: 800;
          line-height: 1.15;
          color: #1a1a1a;
          margin: 0 0 18px 0;
          letter-spacing: -1px;
        }
        .hero-title .highlight {
          background: linear-gradient(135deg, ${green} 0%, ${gold} 50%, ${greenLight} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-desc {
          font-family: ${font};
          font-size: 19px;
          line-height: 1.75;
          color: #4a4a4a;
          margin: 0 0 32px 0;
        }
        .hero-cta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .hero-btn-primary {
          font-family: ${font};
          font-size: 15px;
          font-weight: 700;
          padding: 14px 32px;
          background: linear-gradient(135deg, ${green} 0%, ${greenLight} 100%);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
          box-shadow: 0 4px 16px rgba(26, 107, 53, 0.3);
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(26, 107, 53, 0.4);
        }
        .hero-btn-secondary {
          font-family: ${font};
          font-size: 15px;
          font-weight: 600;
          padding: 14px 32px;
          background: transparent;
          color: ${green};
          border: 2px solid ${green};
          border-radius: 12px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s;
        }
        .hero-btn-secondary:hover {
          background: rgba(26, 107, 53, 0.08);
        }
        .hero-stats-row {
          display: flex;
          gap: 40px;
        }
        .hero-stat-item {
          display: flex;
          flex-direction: column;
        }
        .hero-stat-num {
          font-family: ${font};
          font-size: 32px;
          font-weight: 800;
          color: ${green};
        }
        .hero-stat-label {
          font-family: ${font};
          font-size: 13px;
          color: #6b6b6b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }
        .hero-mockup {
          flex: 0 0 48%;
          position: relative;
        }
        .hero-mockup-frame {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow:
            0 30px 80px rgba(26, 107, 53, 0.15),
            0 8px 24px rgba(26, 107, 53, 0.1);
          border: 1px solid rgba(26, 107, 53, 0.12);
          transform: perspective(800px) rotateY(-6deg);
          transition: transform 0.5s ease;
        }
        .hero-mockup-frame:hover {
          transform: perspective(800px) rotateY(0deg);
        }
        .mockup-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(26, 107, 53, 0.1);
          margin-bottom: 16px;
        }
        .mockup-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .mockup-dot.red { background: #ff5f57; }
        .mockup-dot.yellow { background: #ffbd2e; }
        .mockup-dot.green { background: #28c840; }
        .mockup-title {
          flex: 1;
          text-align: center;
          font-family: ${font};
          font-size: 12px;
          color: #888;
        }
        .mockup-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mockup-skeleton-line {
          height: 10px;
          border-radius: 5px;
          background: #e8eee6;
        }
        .mockup-skeleton-line.short { width: 40%; }
        .mockup-skeleton-line.med { width: 70%; }
        .mockup-skeleton-line.long { width: 85%; }
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          z-index: -1;
          animation: blobMove 8s ease-in-out infinite;
        }
        .blob-1 {
          width: 400px;
          height: 400px;
          background: rgba(26, 107, 53, 0.08);
          top: -100px;
          right: -100px;
        }
        .blob-2 {
          width: 300px;
          height: 300px;
          background: rgba(139, 105, 20, 0.08);
          bottom: 0;
          left: -50px;
        }
        .floating-badge {
          position: absolute;
          top: -30px;
          right: -20px;
          background: white;
          padding: 12px 20px;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(26, 107, 53, 0.15);
          border: 1px solid rgba(26, 107, 53, 0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          animation: floatBadge 4s ease-in-out infinite;
        }
        .floating-badge-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, ${green} 0%, ${gold} 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .floating-badge-text {
          font-family: ${font};
          font-size: 12px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .floating-badge-text small {
          display: block;
          font-weight: 400;
          color: #888;
          font-size: 10px;
          margin-top: 2px;
        }
        @media (max-width: 968px) {
          .hero-inner { flex-direction: column; }
          .hero-text { flex: none; }
          .hero-mockup { flex: none; }
        }
      `}</style>
      <div className="hero-blob blob-1"></div>
      <div className="hero-blob blob-2"></div>
      <div className="hero-inner">
        <div className="hero-text">
          <div className="hero-badge">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
            </svg>
            Kết nối Cựu sinh viên VNUA
          </div>
          <h1 className="hero-title">
            Tìm cơ hội nghề nghiệp từ <span className="highlight">hơn 1,800 cựu sinh viên</span>
          </h1>
          <p className="hero-desc">
            Nền tảng kết nối tuyển dụng và chia sẻ kinh nghiệm dành riêng cho cộng đồng cựu sinh viên Học viện Nông nghiệp Việt Nam.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="hero-btn-primary">
              Tham gia ngay
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
            <Link to="/login" className="hero-btn-secondary">Đăng nhập</Link>
          </div>
          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <div className="hero-stat-num">{alumni.toLocaleString()}</div>
              <div className="hero-stat-label">Cựu sinh viên</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-num">{pct}%</div>
              <div className="hero-stat-label">Tỷ lệ việc làm</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-num">50+</div>
              <div className="hero-stat-label">Doanh nghiệp</div>
            </div>
          </div>
        </div>
        <div className="hero-mockup">
          <div className="floating-badge">
            <div className="floating-badge-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
            </div>
            <div className="floating-badge-text">
              VNUA Alumni
              <small>FITA - Career Connect</small>
            </div>
          </div>
          <div className="hero-mockup-frame">
            <div className="mockup-header">
              <div className="mockup-dot red"></div>
              <div className="mockup-dot yellow"></div>
              <div className="mockup-dot green"></div>
              <div className="mockup-title">st.alumni-career-connect</div>
            </div>
            <div className="mockup-content">
              <div className="mockup-skeleton-line med" style={{ background: `linear-gradient(90deg, ${cream} 0%, rgba(26,107,53,0.08) 50%, ${cream} 100%)` }}></div>
              <div className="mockup-skeleton-line long"></div>
              <div className="mockup-skeleton-line" style={{ width: '90%' }}></div>
              <div className="mockup-skeleton-line" style={{ width: '75%' }}></div>
              <div className="mockup-skeleton-line short"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
