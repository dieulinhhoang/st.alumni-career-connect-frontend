import { Link } from "react-router-dom";

const font = "'Be Vietnam Pro', sans-serif";
const purple = "#7c3aed";
const purpleDark = "#4f46e5";

export function CTASection() {
  return (
    <section style={{ background: `linear-gradient(135deg, ${purpleDark} 0%, ${purple} 100%)`, padding: "80px 5%", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <style>{`
        .cta-title { font-size: clamp(26px, 4vw, 42px); }
        .cta-sub   { font-size: clamp(14px, 1.5vw, 17px); }
      `}</style>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
        <h2 className="cta-title" style={{ fontFamily: font, fontWeight: 800, color: "white", marginBottom: 18, lineHeight: 1.2 }}>
          Sẵn sàng kết nối với chúng tôi?
        </h2>
        <p className="cta-sub" style={{ fontFamily: font, color: "rgba(255,255,255,0.75)", marginBottom: 36, lineHeight: 1.7 }}>
          Đăng nhập để trải nghiệm ngay.</p>
        
          <Link
            to="/admin/dashboard"
            style={{
              fontFamily: font,
              fontWeight: 700,
              fontSize: 15,
              padding: "15px 40px",
              borderRadius: 12,
              background: "white",
              color: purple,
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              transition: "all 0.2s",
              textDecoration: "none",
              display: "inline-block",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Đăng nhập với ST SSO →
          </Link>
         
      </div>
    </section>
  );
}