// HeroSection.tsx

import { Link } from "react-router-dom";
import { useCountUp } from "../../../feature/home/hooks/index.ts";
import type { SurveyStats } from "../../../feature/home/type.ts";

const green = "#234b2f";
const greenLight = "#2f6841";
const bgPrimary = "#f5f8f1";
const dark = "#1f1f1f";

export function HeroSection({ stats }: { stats: SurveyStats }) {
  const alumni = useCountUp(stats.totalRespondents, 1800, 400);
  const pct = useCountUp(stats.overallEmploymentRate, 1600, 600);

  return (
    <section id="home" className="hero-wrapper">
      <style>{`
        :root {
          --accent: #3f4739;
          --secondary: #d2b93d;
          --text-muted: #626262;
          --card-bg: rgba(255, 255, 255, 0.78);
        }

        .hero-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
          background:
            radial-gradient(circle at top left, #edf5e8 0%, transparent 40%),
            radial-gradient(circle at bottom right, #f7f0c9 0%, transparent 30%),
            ${bgPrimary};
        }

        .hero-section {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 88vh;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 64px;
          padding: 5.5rem 1.5rem 4.5rem;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 900px) {
          .hero-section {
            flex-direction: column-reverse;
            text-align: center;
            gap: 2.5rem;
            min-height: auto;
            padding: 4.5rem 1.25rem 3.5rem;
          }
        }

        /* LEFT */

        .hero-contents {
          flex: 1 1 560px;
          max-width: 620px;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: 999px;
          background: rgba(63, 71, 57, 0.06);
          color: var(--accent);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1.1rem;
          font-family: "Open Sans", sans-serif;
        }

        .hero-title {
          font-family: "Actor", sans-serif;
          font-size: clamp(2.4rem, 4.4vw, 3.6rem);
          line-height: 1.12;
          font-weight: 700;
          color: ${dark};
          margin-bottom: 0.9rem;
        }

        .hero-highlight {
          background: linear-gradient(135deg, var(--accent), var(--secondary));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hero-subText {
          font-family: "Open Sans", sans-serif;
          font-size: 1rem;
          line-height: 1.8;
          color: var(--text-muted);
          margin-bottom: 1.9rem;
          max-width: 56ch;
        }

        @media (max-width: 900px) {
          .hero-subText {
            margin-inline: auto;
          }
        }

        /* CTA */

        .hero-cta-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 1.6rem;
        }

        @media (max-width: 900px) {
          .hero-cta-row {
            justify-content: center;
          }
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          padding: 0.9rem 1.6rem;
          border-radius: 14px;
          background: linear-gradient(135deg, ${green}, ${greenLight});
          color: white;
          font-family: "Open Sans", sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            filter 0.2s ease;
          box-shadow:
            0 12px 28px rgba(35, 75, 47, 0.22),
            0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow:
            0 20px 40px rgba(35, 75, 47, 0.28),
            0 4px 12px rgba(0, 0, 0, 0.08);
          filter: brightness(1.03);
        }

        /* STATS – không tràn */

        .hero-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          max-width: 360px;
        }

        @media (max-width: 900px) {
          .hero-stats {
            justify-content: center;
            max-width: 100%;
            margin-inline: auto;
          }
        }

        .hero-stat-item {
          flex: 0 1 110px;
          padding: 0.9rem 1rem;
          border-radius: 16px;
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow:
            0 10px 26px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.7);
        }

        .hero-stat-value {
          font-family: "Actor", sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: ${dark};
          margin-bottom: 2px;
        }

        .hero-stat-label {
          font-family: "Open Sans", sans-serif;
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #787878;
        }

        /* RIGHT – ảnh ngang, to hơn khoảng 1.5 lần */

        .hero-image-container {
          flex: 0 1 600px;      /* tăng từ 420 lên 600 (~1.4–1.5 lần) */
          max-width: 600px;
          width: 100%;
          position: relative;
        }

        .hero-image-container::before {
          content: "";
          position: absolute;
          inset: 0;
          transform: scale(1.02);
          background: linear-gradient(
            135deg,
            rgba(210, 185, 61, 0.22),
            rgba(63, 71, 57, 0.18)
          );
          filter: blur(26px);
          z-index: -1;
        }

        .hero-image {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          display: block;
          border-radius: 20px;
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.16),
            0 8px 18px rgba(0, 0, 0, 0.06);
        }

        @media (max-width: 900px) {
          .hero-image-container {
            flex: 1 1 auto;
            max-width: 100%;
          }
          .hero-image {
            aspect-ratio: 16 / 10;
          }
        }

        .hero-badge {
          position: absolute;
          left: 18px;
          bottom: 18px;
          max-width: 260px;
          padding: 12px 16px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(14px);
          color: ${dark};
          font-family: "Open Sans", sans-serif;
          font-size: 0.84rem;
          font-weight: 600;
          line-height: 1.55;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
        }

        @media (max-width: 900px) {
          .hero-badge {
            left: 14px;
            right: 14px;
            bottom: 14px;
            max-width: unset;
          }
        }
      `}</style>

      <div className="container hero-section">
        {/* LEFT */}
        <div className="hero-contents">
          <div className="hero-eyebrow">Hệ Thống Khảo Sát Việc Làm Và Hỗ Trợ Kết Nối Doanh Nghiệp</div>

          <h1 className="hero-title">
            Kết nối{" "}
            <span className="hero-highlight">cựu sinh viên</span>
            <br />
            & cơ hội nghề nghiệp
          </h1>

          <p className="hero-subText">
            Nền tảng khảo sát việc làm hiện đại dành cho cộng đồng cựu sinh viên
            Học viện Nông nghiệp Việt Nam, giúp kết nối, chia sẻ dữ liệu nghề nghiệp
            và mở rộng cơ hội tương lai.
          </p>

          <div className="hero-cta-row">
            <Link to="" className="cta-primary">
              Tham gia ngay
            </Link>
          </div>
{/* 
          <div className="hero-stats">
            <div className="hero-stat-item">
              <div className="hero-stat-value">
                {alumni.toLocaleString()}+
              </div>
              <div className="hero-stat-label">Cựu sinh viên</div>
            </div>

            <div className="hero-stat-item">
              <div className="hero-stat-value">{pct}%</div>
              <div className="hero-stat-label">Tỷ lệ việc làm</div>
            </div>

            <div className="hero-stat-item">
              <div className="hero-stat-value">50+</div>
              <div className="hero-stat-label">Doanh nghiệp</div>
            </div>
          </div> */}
        </div>

        {/* RIGHT */}
        <article className="hero-image-container">
          <img
            className="hero-image"
            src="https://xdcs.cdnchinhphu.vn/446259493575335936/2024/8/18/nn1-17239512376531343079339.jpg"
            alt="Học viện Nông nghiệp Việt Nam"
            loading="lazy"
          />
          {/* Badge nếu cần */}
          {/* <div className="hero-badge">
            Khảo sát việc làm & kết nối nghề nghiệp dành cho cộng đồng VNUA
          </div> */}
        </article>
      </div>
    </section>
  );
}