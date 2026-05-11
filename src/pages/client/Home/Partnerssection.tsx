import type { PartnerLogo } from "../../../feature/home/type.ts";

const font = "'Be Vietnam Pro', sans-serif";
const green = "#1a6b35";
const gold = "#8B6914";
const bgLightGray = "#faf8f3";

interface PartnersSectionProps {
  partnerLogos: PartnerLogo[];
}

export function PartnersSection({ partnerLogos }: PartnersSectionProps) {
  return (
    <section
      style={{
        background: bgLightGray,
        padding: "100px 5% 80px",
        textAlign: "center",
      }}
    >
      <style>{`
        .partners-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        .partners-label {
          display: inline-block;
          font-family: ${font};
          font-size: 13px;
          font-weight: 700;
          color: ${green};
          text-transform: uppercase;
          letter-spacing: 1.2px;
          padding: 6px 16px;
          border-radius: 20px;
          background: rgba(26, 107, 53, 0.08);
          margin-bottom: 16px;
        }
        .partners-title {
          font-family: ${font};
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 40px 0;
          line-height: 1.2;
        }
        .partners-title span {
          background: linear-gradient(135deg, ${green} 0%, ${gold} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .partners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }
        .partner-card {
          background: white;
          border-radius: 14px;
          padding: 28px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 4 / 3;
          border: 1px solid rgba(26, 107, 53, 0.08);
          transition: all 0.3s;
        }
        .partner-card:hover {
          border-color: rgba(26, 107, 53, 0.25);
          box-shadow: 0 8px 24px rgba(26, 107, 53, 0.1);
        }
        .partner-logo-text {
          font-family: ${font};
          font-size: 15px;
          font-weight: 700;
          color: #555;
        }
        .partners-more {
          margin-top: 40px;
        }
        .partners-more-btn {
          font-family: ${font};
          font-size: 14px;
          font-weight: 600;
          padding: 12px 28px;
          background: transparent;
          color: ${green};
          border: 2px solid ${green};
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .partners-more-btn:hover {
          background: ${green};
          color: white;
        }
      `}</style>
      <div className="partners-container">
        <div className="partners-label">Doanh nghiệp đối tác</div>
        <h2 className="partners-title">
          Kết nối với <span>50+ doanh nghiệp</span> hàng đầu
        </h2>
        <div className="partners-grid">
          {partnerLogos.map((partner, idx) => (
            <div key={idx} className="partner-card">
              <div className="partner-logo-text">{partner.companyName}</div>
            </div>
          ))}
        </div>
        <div className="partners-more">
          <button className="partners-more-btn">Xem tất cả đối tác</button>
        </div>
      </div>
    </section>
  );
}
