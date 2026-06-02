const font = "'Open Sans', sans-serif";
const fontActor = "'Actor', sans-serif";
const green = "#234b2f";

const testimonials = [
  {
    quote:
      "Hệ thống khảo sát giúp tôi cập nhật thông tin nghề nghiệp dễ dàng. Nhờ đó tôi cũng được giới thiệu cơ hội việc làm mới tại Bayer — điều tôi không ngờ tới!",
    name: "Nguyễn Thị Lan Anh",
    role: "Kỹ sư Kiểm dịch, Bayer Vietnam · K62 Bảo vệ Thực vật",
    initials: "NL",
  },
  {
    quote:
      "Trang kết nối doanh nghiệp rất hữu ích. Tôi tìm được công việc đúng chuyên ngành chỉ 3 tuần sau khi đăng hồ sơ, với mức lương tốt hơn kỳ vọng.",
    name: "Trần Văn Hoàng",
    role: "Chuyên viên R&D, Vinamilk · K61 Công nghệ Thực phẩm",
    initials: "TH",
  },
  {
    quote:
      "Số liệu thống kê trên hệ thống giúp tôi có cái nhìn tổng quan về thị trường việc làm ngành Thú y — rất quan trọng khi định hướng nghề nghiệp sau khi ra trường.",
    name: "Phạm Minh Phúc",
    role: "Bác sĩ Thú y, TH True Milk · K63 Thú y",
    initials: "MP",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials">
      <style>{`
        * { box-sizing: border-box; }

        #testimonials {
          padding: 88px 1.5rem;
          background: linear-gradient(135deg, ${green} 0%, #1a3d22 100%);
          position: relative;
          overflow: hidden;
        }

        #testimonials::before {
          content: "";
          position: absolute;
          top: -120px; right: -120px;
          width: 480px; height: 480px;
          border-radius: 50%;
          border: 60px solid rgba(255,255,255,0.04);
          pointer-events: none;
        }

        #testimonials::after {
          content: "";
          position: absolute;
          bottom: -80px; left: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          border: 40px solid rgba(255,255,255,0.03);
          pointer-events: none;
        }

        .testi-shell {
          max-width: 1200px;
          margin: 0 auto;
          position: relative; z-index: 2;
        }

        .testi-header {
          text-align: center;
          margin-bottom: 52px;
        }

        .testi-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .testi-eyebrow-dot {
          width: 8px; height: 8px;
          border-radius: 999px;
          background: #c8a84b;
        }

        .testi-eyebrow-text {
          font-family: ${font};
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }

        .testi-title {
          font-family: ${fontActor};
          font-size: clamp(28px, 3.5vw, 44px);
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #fff;
          margin: 0 0 12px;
        }

        .testi-subtitle {
          font-family: ${font};
          font-size: 0.97rem;
          line-height: 1.85;
          color: rgba(255,255,255,0.55);
        }

        .testi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        @media (max-width: 900px) {
          .testi-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 560px) {
          #testimonials { padding: 64px 1rem; }
        }

        .testi-card {
          padding: 30px 28px;
          border-radius: 24px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          transition: background 0.24s ease, transform 0.24s ease;
        }

        .testi-card:hover {
          background: rgba(255,255,255,0.12);
          transform: translateY(-4px);
        }

        .testi-quote-mark {
          font-family: Georgia, serif;
          font-size: 56px;
          color: rgba(200,168,75,0.7);
          line-height: 0.8;
          margin-bottom: 18px;
          display: block;
        }

        .testi-text {
          font-family: ${font};
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255,255,255,0.82);
          font-style: italic;
          margin: 0 0 26px;
        }

        .testi-author {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .testi-avatar {
          width: 46px; height: 46px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-family: ${fontActor};
          font-size: 14px; font-weight: 700;
          color: rgba(200,168,75,0.9);
          flex-shrink: 0;
        }

        .testi-name {
          font-family: ${fontActor};
          font-size: 14.5px; font-weight: 700;
          color: #fff;
          margin-bottom: 3px;
        }

        .testi-role {
          font-family: ${font};
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
        }

        .testi-stars {
          font-size: 13px;
          color: #c8a84b;
          margin-top: 3px;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="testi-shell">
        <div className="testi-header">
          <div className="testi-eyebrow">
            <span className="testi-eyebrow-dot" />
            <span className="testi-eyebrow-text">Chia sẻ từ cựu sinh viên</span>
          </div>
          <h2 className="testi-title">Họ đã thành công từ HVN</h2>
          <p className="testi-subtitle">
            Câu chuyện thực tế từ những cựu sinh viên đang làm việc tại các tổ chức hàng đầu.
          </p>
        </div>

        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div className="testi-card" key={i}>
              <span className="testi-quote-mark">"</span>
              <p className="testi-text">{t.quote}</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                  <div className="testi-stars">★★★★★</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}