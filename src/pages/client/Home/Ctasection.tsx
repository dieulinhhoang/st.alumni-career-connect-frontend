import { Link } from "react-router-dom";

const font = "'Open Sans', sans-serif";
const fontActor = "'Actor', sans-serif";
const green = "#234b2f";
const gold = "#c8a84b";

export function CtaSection() {
  return (
    <section id="cta">
      <style>{`
        * { box-sizing: border-box; }

        #cta {
          padding: 88px 1.5rem;
          background: linear-gradient(120deg, #0f2917 0%, ${green} 60%, #1a3d22 100%);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        #cta::before {
          content: "";
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px; height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,168,75,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-shell {
          max-width: 680px;
          margin: 0 auto;
          position: relative; z-index: 2;
        }

        .cta-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .cta-eyebrow-dot {
          width: 8px; height: 8px;
          border-radius: 999px;
          background: ${gold};
          box-shadow: 0 0 12px rgba(200,168,75,0.5);
        }

        .cta-eyebrow-text {
          font-family: ${font};
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        .cta-title {
          font-family: ${fontActor};
          font-size: clamp(30px, 4.5vw, 50px);
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: #fff;
          margin: 0 0 16px;
        }

        .cta-subtitle {
          font-family: ${font};
          font-size: 1.05rem;
          line-height: 1.85;
          color: rgba(255,255,255,0.62);
          margin: 0 0 36px;
        }

        .cta-btns {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .cta-btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 12px;
          background: ${gold};
          color: #1a1000;
          font-family: ${font};
          font-size: 15px; font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.18s;
          box-shadow: 0 8px 24px rgba(200,168,75,0.28);
        }

        .cta-btn-gold:hover {
          transform: translateY(-3px);
          filter: brightness(1.06);
          box-shadow: 0 16px 36px rgba(200,168,75,0.36);
        }

        .cta-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.35);
          background: transparent;
          color: rgba(255,255,255,0.9);
          font-family: ${font};
          font-size: 15px; font-weight: 600;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s;
        }

        .cta-btn-outline:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.55);
        }

        @media (max-width: 480px) {
          #cta { padding: 64px 1rem; }
          .cta-btns { flex-direction: column; align-items: center; }
        }
      `}</style>

      <div className="cta-shell">
        <div className="cta-eyebrow">
          <span className="cta-eyebrow-dot" />
          <span className="cta-eyebrow-text">Tham gia ngay hôm nay</span>
        </div>
        <h2 className="cta-title">Bạn là cựu sinh viên HVN?</h2>
        <p className="cta-subtitle">
          Đóng góp của bạn giúp Học viện nâng cao chất lượng đào tạo và hỗ trợ thế hệ sinh viên tiếp theo tốt hơn.
        </p>
        <div className="cta-btns">
          <Link to="" className="cta-btn-gold">
            Điền khảo sát ngay
          </Link>
          <a href="mailto:congtacsinhvien@vnua.edu.vn" className="cta-btn-outline">
            Liên hệ hỗ trợ
          </a>
        </div>
      </div>
    </section>
  );
}