import { useInView } from "../../../feature/home/hooks/index.ts";

const font = "'Be Vietnam Pro', sans-serif";

const FEATURES = [
  { icon: "📋", bg: "#EDE9FE", title: "Khảo sát việc làm",    desc: "Thu thập và phân tích dữ liệu tình trạng việc làm cựu sinh viên theo từng ngành, khóa học và khu vực địa lý." },
  { icon: "🤝", bg: "#DCFCE7", title: "Kết nối doanh nghiệp", desc: "Nền tảng kết nối trực tiếp cựu sinh viên với các doanh nghiệp tuyển dụng, ưu tiên mạng lưới alumni." },
  { icon: "🎓", bg: "#FEF3C7", title: "Hồ sơ cựu sinh viên", desc: "Xây dựng hồ sơ chuyên nghiệp, cập nhật hành trình sự nghiệp và thành tựu sau tốt nghiệp." },
  { icon: "📈", bg: "#E0F2FE", title: "Báo cáo & Thống kê",   desc: "Dashboard trực quan về tỷ lệ có việc làm, mức lương trung bình và xu hướng nghề nghiệp." },
  { icon: "📢", bg: "#FCE7F3", title: "Tin tuyển dụng",        desc: "Bảng tin việc làm được cá nhân hóa theo chuyên ngành, kinh nghiệm và địa điểm mong muốn." },
  { icon: "🌐", bg: "#F0FDF4", title: "Cộng đồng Alumni",      desc: "Diễn đàn chia sẻ kinh nghiệm, mentorship và sự kiện giao lưu cựu sinh viên toàn quốc." },
];

export function FeaturesSection() {
  const { ref, visible } = useInView();

  return (
    <section ref={ref} style={{ background: "white", padding: "80px 5%" }}>
      <style>{`
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .features-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontFamily: font, fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, color: "#1e1b4b", marginBottom: 16 }}>
            Tính năng quản lý toàn diện
          </h2>
          <p style={{ fontFamily: font, fontSize: "clamp(14px, 1.5vw, 17px)", color: "#6b7280", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            ST Alumni tích hợp đầy đủ công cụ để khảo sát, phân tích và kết nối cựu sinh viên với thị trường lao động
          </p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} style={{ background: "#fafafa", borderRadius: 16, padding: 28, border: "1px solid #f3f4f6", cursor: "pointer", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.5s ${i * 0.08}s, transform 0.5s ${i * 0.08}s, border-color 0.2s, box-shadow 0.2s` }}
              onMouseEnter={(e) => { (e.currentTarget).style.borderColor = "#c4b5fd"; (e.currentTarget).style.boxShadow = "0 8px 24px rgba(124,58,237,0.1)"; (e.currentTarget).style.background = "white"; }}
              onMouseLeave={(e) => { (e.currentTarget).style.borderColor = "#f3f4f6"; (e.currentTarget).style.boxShadow = "none"; (e.currentTarget).style.background = "#fafafa"; }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 20 }}>{f.icon}</div>
              <div style={{ fontFamily: font, fontSize: 17, fontWeight: 700, color: "#1e1b4b", marginBottom: 10 }}>{f.title}</div>
              <div style={{ fontFamily: font, fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}