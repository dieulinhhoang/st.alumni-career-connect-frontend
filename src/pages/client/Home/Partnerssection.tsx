import { useInView } from "../../../feature/home/hooks/index.ts";
import type { Enterprise } from "../../../feature/home/type.ts";

const font = "'Be Vietnam Pro', sans-serif";
const purple = "#7c3aed";
const purpleLight = "#ede9fe";

export function PartnersSection({ enterprises }: { enterprises: Enterprise[] }) {
  const { ref, visible } = useInView();

  return (
    <section ref={ref} style={{ background: "#faf5ff", padding: "80px 5%" }}>
      <style>{`
        .partners-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .partners-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .partners-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: purpleLight, color: purple, borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 600, fontFamily: font, marginBottom: 16 }}>
            🤝 Mạng lưới tuyển dụng
          </div>
          <h2 style={{ fontFamily: font, fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, color: "#1e1b4b", marginBottom: 16 }}>
            Doanh nghiệp đối tác
          </h2>
          <p style={{ fontFamily: font, fontSize: "clamp(14px, 1.5vw, 17px)", color: "#6b7280", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Hơn 350 doanh nghiệp hàng đầu đang tìm kiếm nhân tài từ cộng đồng alumni VNUA
          </p>
        </div>
        <div className="partners-grid">
          {enterprises.map((p, i) => (
            <div key={p.id} style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e5e7eb", cursor: "pointer", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.5s ${i * 0.08}s, transform 0.5s ${i * 0.08}s, box-shadow 0.2s`, display: "flex", alignItems: "center", gap: 16 }}
              onMouseEnter={(e) => { (e.currentTarget).style.boxShadow = "0 8px 24px rgba(124,58,237,0.12)"; (e.currentTarget).style.borderColor = "#c4b5fd"; }}
              onMouseLeave={(e) => { (e.currentTarget).style.boxShadow = "none"; (e.currentTarget).style.borderColor = "#e5e7eb"; }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 12, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{p.logo}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: font, fontWeight: 700, fontSize: 15, color: "#1e1b4b", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                <div style={{ fontFamily: font, fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>{p.industry}</div>
                <span style={{ background: purpleLight, color: purple, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, fontFamily: font }}>
                  {p.openPositions} vị trí đang tuyển
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}