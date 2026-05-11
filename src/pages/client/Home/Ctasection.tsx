import { Link } from "react-router-dom";

const font = "'Be Vietnam Pro', sans-serif";
const green = "#1a6b35";
const greenDark = "#14542a";
const gold = "#8B6914";

export function CtaSection() {
  return (
    <section
      style={{
        background: `linear-gradient(135deg, ${green} 0%, ${greenDark} 100%)`,
        padding: "100px 5%",
        textAlign: "center",
      }}
    >
      <style>{`
        .cta-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .cta-title {
          font-family: ${font};
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 800;
          color: white;
          margin-bottom: 18px;
          line-height: 1.15;
        }
        .cta-title span {
          color: ${gold};
        }
        .cta-desc {
          font-family: ${font};
          font-size: 18px;
          color: rgba(255,255,255,0.85);
          margin-bottom: 32px;
          line-height: 1.65;
        }
        .cta-btn {
          font-family: ${font};
          font-size: 16px;
          font-weight: 700;
          padding: 16px 40px;
          background: white;
          color: ${green};
          border: none;
          border-radius: 14px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.35);
        }
        .cta-note {
          font-family: ${font};
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          margin-top: 16px;
        }
      `}</style>
      <div className="cta-container">
        <h2 className="cta-title">
          Bắt đầu kết nối với cộng đồng <span>với VNUA</span> ngay hôm nay
        </h2>
        <p className="cta-desc">
          Tham gia cùng hàng nghìn cựu sinh viên khác. Tìm việc làm, chia sẻ kinh nghiệm và xây dựng mối quan hệ.
        </p>
        <Link to="/register" className="cta-btn">Tham gia ngay</Link>
        <div className="cta-note">Hoàn toàn miễn phí - Đăng ký trong 2 phút</div>
      </div>
    </section>
  );
}
