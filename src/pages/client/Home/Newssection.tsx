const font = "'Open Sans', sans-serif";
const fontActor = "'Actor', sans-serif";
const green = "#234b2f";

const news = [
  {
    tag: "Sự kiện nổi bật",
    title: "Ngày hội Việc làm HVN 2025 — 500+ cơ hội tuyển dụng",
    desc: "Hơn 80 doanh nghiệp trong lĩnh vực nông nghiệp, công nghệ thực phẩm và quản lý môi trường tham gia ngày hội việc làm thường niên của Học viện.",
    date: "15 tháng 5, 2025",
    featured: true,
  },
  {
    tag: "Báo cáo",
    title: "Kết quả khảo sát khóa 2019: 89% có việc làm",
    desc: "Báo cáo toàn diện về tình hình việc làm sinh viên khóa 2019 vừa được công bố.",
    date: "8 tháng 4, 2025",
    featured: false,
  },
  {
    tag: "Hợp tác",
    title: "HVN ký kết hợp tác với Tập đoàn TH True Milk",
    desc: "Thỏa thuận hợp tác tạo ra hơn 50 vị trí thực tập và tuyển dụng cho sinh viên ngành Chăn nuôi và Thú y.",
    date: "22 tháng 3, 2025",
    featured: false,
  },
];

const tagColors: Record<string, { bg: string; color: string }> = {
  "Sự kiện nổi bật": { bg: "rgba(35,75,47,0.08)", color: "#234b2f" },
  "Báo cáo": { bg: "rgba(200,168,75,0.12)", color: "#7a5800" },
  "Hợp tác": { bg: "rgba(45,91,227,0.08)", color: "#2d5be3" },
};

export function NewsSection() {
  return (
    <section id="news">
      <style>{`
        * { box-sizing: border-box; }

        #news {
          padding: 88px 1.5rem;
        }

        .news-shell {
          max-width: 1200px;
          margin: 0 auto;
        }

        .news-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 44px;
        }

        .news-header-left {}

        .news-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .news-eyebrow-dot {
          width: 8px; height: 8px;
          border-radius: 999px;
          background: ${green};
        }

        .news-eyebrow-text {
          font-family: ${font};
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #667085;
        }

        .news-title {
          font-family: ${fontActor};
          font-size: clamp(28px, 3.5vw, 42px);
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin: 0 0 10px;
        }

        .news-subtitle {
          font-family: ${font};
          font-size: 0.97rem;
          line-height: 1.8;
          color: #667085;
          max-width: 480px;
        }

        .news-view-all {
          font-family: ${font};
          font-size: 13.5px; font-weight: 700;
          color: ${green};
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          transition: gap 0.15s;
          white-space: nowrap;
        }

        .news-view-all:hover { gap: 10px; }

        .news-grid {
          display: grid;
          grid-template-columns: 1.55fr 1fr 1fr;
          gap: 22px;
        }

        @media (max-width: 900px) {
          .news-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 560px) {
          .news-grid { grid-template-columns: 1fr; }
          #news { padding: 64px 1rem; }
        }

        .news-card {
          position: relative; overflow: hidden;
          background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.88));
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 24px;
          box-shadow: 0 8px 28px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.9);
          transition: transform 0.24s ease, box-shadow 0.24s ease;
        }

        .news-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(15,23,42,0.09);
        }

        .news-thumb {
          width: 100%; height: 180px;
          background: linear-gradient(135deg, #edf5e8, #dff0e0);
          display: flex; align-items: center; justify-content: center;
        }

        .news-card-featured .news-thumb {
          height: 220px;
        }

        .news-thumb-inner {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(35,75,47,0.12);
          display: flex; align-items: center; justify-content: center;
        }

        .news-thumb svg {
          width: 36px; height: 36px;
          stroke: ${green};
        }

        .news-body {
          padding: 22px 22px 24px;
        }

        .news-tag {
          display: inline-block;
          font-family: ${font};
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 999px;
          margin-bottom: 12px;
        }

        .news-card-title {
          font-family: ${fontActor};
          font-size: 16px;
          line-height: 1.45;
          color: #0f172a;
          margin: 0 0 10px;
        }

        .news-card-featured .news-card-title {
          font-size: 19px;
        }

        .news-card-desc {
          font-family: ${font};
          font-size: 13.5px;
          line-height: 1.7;
          color: #667085;
          margin: 0 0 16px;
        }

        .news-date {
          font-family: ${font};
          font-size: 12px;
          color: #98a2b3;
          display: flex;
          align-items: center;
          gap: 5px;
        }
      `}</style>

      <div className="news-shell">
        <div className="news-header">
          <div className="news-header-left">
            <div className="news-eyebrow">
              <span className="news-eyebrow-dot" />
              <span className="news-eyebrow-text">Tin tức & Sự kiện</span>
            </div>
            <h2 className="news-title">Cập nhật mới nhất</h2>
            <p className="news-subtitle">
              Thông tin về khảo sát, hội thảo việc làm và hoạt động kết nối doanh nghiệp.
            </p>
          </div>
          <a href="#" className="news-view-all">
            Xem tất cả tin tức
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="news-grid">
          {news.map((n, i) => {
            const tc = tagColors[n.tag] ?? { bg: "rgba(35,75,47,0.08)", color: green };
            return (
              <div className={`news-card${n.featured ? " news-card-featured" : ""}`} key={i}>
                <div className="news-thumb">
                  <div className="news-thumb-inner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2zM9 12h6M9 16h4" />
                    </svg>
                  </div>
                </div>
                <div className="news-body">
                  <span className="news-tag" style={{ background: tc.bg, color: tc.color }}>
                    {n.tag}
                  </span>
                  <h3 className="news-card-title">{n.title}</h3>
                  <p className="news-card-desc">{n.desc}</p>
                  <div className="news-date">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {n.date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}