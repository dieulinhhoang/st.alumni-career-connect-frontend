const font = "'Open Sans', sans-serif";
const fontActor = "'Actor', sans-serif";
const green = "#234b2f";
const greenLight = "#2f6841";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Khảo sát việc làm định kỳ",
    desc: "Thu thập dữ liệu việc làm cựu sinh viên theo từng khóa, từng ngành — thực hiện online, nhanh chóng, bảo mật.",
    link: "Xem biểu mẫu",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Kết nối doanh nghiệp",
    desc: "Doanh nghiệp đăng tin tuyển dụng trực tiếp, tiếp cận cựu sinh viên HVN đang tìm kiếm cơ hội mới.",
    link: "Đăng ký doanh nghiệp",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Báo cáo & Thống kê",
    desc: "Bảng điều khiển trực quan cho cán bộ quản lý: tỉ lệ có việc làm, phân bổ ngành nghề, mức lương trung bình.",
    link: "Xem báo cáo mẫu",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Bảng tin việc làm",
    desc: "Tin tuyển dụng từ các doanh nghiệp đối tác được cập nhật thường xuyên, lọc theo ngành, khu vực, mức lương.",
    link: "Xem việc làm",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Mạng lưới cựu sinh viên",
    desc: "Kết nối với hơn 15.000 cựu sinh viên HVN trên toàn quốc — trao đổi kinh nghiệm, giới thiệu cơ hội việc làm.",
    link: "Khám phá cộng đồng",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Đánh giá chương trình đào tạo",
    desc: "Phản hồi từ cựu sinh viên giúp Học viện cải tiến nội dung giảng dạy, bám sát nhu cầu thực tiễn của thị trường.",
    link: "Gửi phản hồi",
  },
];

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export function FeaturesSection() {
  return (
    <section id="features">
      <style>{`
        * { box-sizing: border-box; }

        #features {
          padding: 88px 1.5rem;
        }

        .feat-shell {
          max-width: 1200px;
          margin: 0 auto;
        }

        .feat-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .feat-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .feat-eyebrow-dot {
          width: 8px; height: 8px;
          border-radius: 999px;
          background: ${green};
        }

        .feat-eyebrow-text {
          font-family: ${font};
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #667085;
        }

        .feat-title {
          font-family: ${fontActor};
          font-size: clamp(30px, 3.8vw, 46px);
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin: 0 0 14px;
        }

        .feat-subtitle {
          font-family: ${font};
          font-size: 1rem;
          line-height: 1.85;
          color: #667085;
          max-width: 540px;
          margin: 0 auto;
        }

        .feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        @media (max-width: 900px) {
          .feat-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 560px) {
          .feat-grid { grid-template-columns: 1fr; }
          #features { padding: 64px 1rem; }
        }

        .feat-card {
          position: relative; overflow: hidden;
          background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.88));
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 24px;
          padding: 30px 28px 26px;
          box-shadow:
            0 8px 28px rgba(15,23,42,0.05),
            inset 0 1px 0 rgba(255,255,255,0.9);
          transition: transform 0.26s ease, box-shadow 0.26s ease, border-color 0.26s ease;
        }

        .feat-card::before {
          content: "";
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, ${green}, ${greenLight});
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .feat-card:hover::before { transform: scaleX(1); }

        .feat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(35,75,47,0.18);
          box-shadow: 0 20px 48px rgba(15,23,42,0.09), 0 4px 12px rgba(15,23,42,0.04);
        }

        .feat-icon-wrap {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: rgba(35,75,47,0.08);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          color: ${green};
          transition: background 0.22s;
        }

        .feat-card:hover .feat-icon-wrap {
          background: rgba(35,75,47,0.14);
        }

        .feat-icon-wrap svg {
          width: 26px; height: 26px;
        }

        .feat-card-title {
          font-family: ${fontActor};
          font-size: 17px; font-weight: 700;
          color: #0f172a;
          margin: 0 0 10px;
        }

        .feat-card-desc {
          font-family: ${font};
          font-size: 14px; line-height: 1.75;
          color: #667085;
          margin: 0 0 18px;
        }

        .feat-card-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: ${font};
          font-size: 13.5px; font-weight: 700;
          color: ${green};
          text-decoration: none;
          transition: gap 0.15s ease;
        }

        .feat-card-link:hover { gap: 10px; }
      `}</style>

      <div className="feat-shell">
        <div className="feat-header">
          <div className="feat-eyebrow">
            <span className="feat-eyebrow-dot" />
            <span className="feat-eyebrow-text">Tính năng hệ thống</span>
          </div>
          <h2 className="feat-title">Một nền tảng — Đa dạng nghiệp vụ</h2>
          <p className="feat-subtitle">
            Từ khảo sát việc làm đến kết nối tuyển dụng, tất cả được tích hợp trong một hệ thống thống nhất.
          </p>
        </div>

        <div className="feat-grid">
          {features.map((f, i) => (
            <div className="feat-card" key={i}>
              <div className="feat-icon-wrap">{f.icon}</div>
              <h3 className="feat-card-title">{f.title}</h3>
              <p className="feat-card-desc">{f.desc}</p>
              <a href="#" className="feat-card-link">
                {f.link} <ArrowIcon />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}