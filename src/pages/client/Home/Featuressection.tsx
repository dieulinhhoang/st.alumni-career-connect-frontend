const font = "'Be Vietnam Pro', sans-serif";
const green = "#1a6b35";
const gold = "#8B6914";
const bgWhite = "#ffffff";
const bgLight = "#faf9f6";

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12" y2="8"/>
      </svg>
    ),
    title: "Kể chuyện nghề nghiệp",
    desc: "Chia sẻ hành trình, bài học và kinh nghiệm thực tế từ thế hệ đi trước."
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    title: "Tuyển dụng trực tiếp",
    desc: "Các nhà tuyển dụng đăng bài, tìm ứng viên phù hợp trong cộng đồng cựu sinh viên."
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Mạng lưới kết nối",
    desc: "Tìm mentor, bạn bè cùng ngành và mở rộng mối quan hệ nghề nghiệp."
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5S13.67 7 14.5 7s1.5.67 1.5 1.5S15.33 10 14.5 10z"/>
        <path d="M20.5 10c-.83 0-1.5-.67-1.5-1.5S19.67 7 20.5 7s1.5.67 1.5 1.5S21.33 10 20.5 10z"/>
        <path d="M16 14c0 1.66-1.34 3-3 3H5V7h3v7h8z"/>
        <path d="M9 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
      </svg>
    ),
    title: "Phân tích dữ liệu",
    desc: "Thống kê toàn diện về thị trường việc làm, theo ngành nghề và địa phương."
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    title: "Minh bạch & Bảo mật",
    desc: "Xác thực tài khoản, dữ liệu được bảo vệ, quyền riêng tư được tôn trọng."
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "Đồng hành dài hạn",
    desc: "Không chỉ kết nối việc làm, mà còn là người bạn đồng hành suốt chặng đường sự nghiệp."
  },
];

export function FeaturesSection() {
  return (
    <section
      style={{
        background: bgWhite,
        padding: "100px 5%",
      }}
    >
      <style>{`
        .feat-container {
          max-width: 1180px;
          margin: 0 auto;
        }
        .feat-header {
          text-align: center;
          margin-bottom: 64px;
        }
        .feat-label {
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
        .feat-title {
          font-family: ${font};
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 12px 0;
          line-height: 1.2;
        }
        .feat-title span {
          background: linear-gradient(135deg, ${green} 0%, ${gold} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .feat-desc {
          font-family: ${font};
          font-size: 16px;
          color: #666;
          margin-top: 0;
        }
        .feat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px 28px;
        }
        .feat-item {
          display: flex;
          gap: 18px;
          padding: 24px 20px;
          border-radius: 14px;
          transition: all 0.3s;
          border: 1px solid transparent;
        }
        .feat-item:hover {
          background: rgba(26, 107, 53, 0.03);
          border-color: rgba(26, 107, 53, 0.15);
        }
        .feat-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(26, 107, 53, 0.1);
          color: ${green};
          flex-shrink: 0;
        }
        .feat-text {
          flex: 1;
          min-width: 0;
        }
        .feat-heading {
          font-family: ${font};
          font-size: 17px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 6px 0;
        }
        .feat-p {
          font-family: ${font};
          font-size: 14px;
          line-height: 1.65;
          color: #666;
          margin: 0;
        }
        .feat-accent-line {
          width: 40px;
          height: 3px;
          background: ${gold};
          margin: 0 auto 32px;
          border-radius: 3px;
        }
        @media (max-width: 768px) {
          .feat-grid { grid-template-columns: 1fr; gap: 20px; }
          .feat-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
      <div className="feat-container">
        <div className="feat-header">
          <div className="feat-label">Tiện ích</div>
          <h2 className="feat-title">
            Nền tảng dành riêng cho <span>cựu sinh viên VNUA</span>
          </h2>
          <div className="feat-accent-line"></div>
          <p className="feat-desc">
            Tất cả trong một nơi: từ tuyển dụng, chia sẻ kinh nghiệm đến xây dựng mạng lưới.
          </p>
        </div>
        <div className="feat-grid">
          {FEATURES.map((item, idx) => (
            <div key={idx} className="feat-item">
              <div className="feat-icon">{item.icon}</div>
              <div className="feat-text">
                <h3 className="feat-heading">{item.title}</h3>
                <p className="feat-p">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
