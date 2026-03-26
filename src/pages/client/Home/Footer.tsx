const font = "'Be Vietnam Pro', sans-serif";
const purple = "#7c3aed";
const purpleDark = "#4f46e5";

const COLS = [
  { title: "Hỗ trợ", items: ["Trung tâm hỗ trợ", "Liên hệ", "Điều khoản", "Chính sách bảo mật"] },
];

export function Footer() {
  return (
    <footer style={{ background: "#0f0d1a", padding: "60px 5% 32px", color: "#9ca3af" }}>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 24px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .footer-bottom {
            grid-template-columns: 1fr;
            justify-items: center;
            gap: 8px;
          }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${purple}, ${purpleDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                🎓
              </div>
              <span style={{ fontFamily: font, fontWeight: 700, fontSize: 18, color: "white" }}>ST Alumni</span>
            </div>
            <p style={{ fontFamily: font, fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
              Nền tảng khảo sát cựu sinh viên và kết nối doanh nghiệp của Học viện Nông nghiệp Việt Nam.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {COLS.map((col) => (
              <div key={col.title}>
                <div style={{ fontFamily: font, fontWeight: 700, fontSize: 14, color: "white", marginBottom: 16 }}>
                  {col.title}
                </div>
                {col.items.map((item) => (
                  <div
                    key={item}
                    style={{ fontFamily: font, fontSize: 14, color: "#9ca3af", marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#c4b5fd")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#9ca3af")}
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

         <div className="footer-bottom">
          <div />
          <div style={{ fontFamily: font, fontSize: 13, color: "#6b7280", textAlign: "center", whiteSpace: "nowrap" }}>
            © 2026 ST TEAM 
          </div>
          <div />
        </div>
      </div>
    </footer>
  );
}