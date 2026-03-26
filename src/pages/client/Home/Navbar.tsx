import { useState } from "react";
import { useScrolled } from "../../../feature/home/hooks/index.ts";
import { Link } from "react-router-dom";

const font = "'Be Vietnam Pro', sans-serif";
const purple = "#7c3aed";
const purpleDark = "#4f46e5";

const NAV_LINKS = ["Khảo sát", "Doanh nghiệp", "Thống kê", "Cộng đồng"];

export function Navbar() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.95)" : "white",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: `1px solid ${scrolled ? "#ede9fe" : "#f3f4f6"}`,
        transition: "all 0.3s",
      }}
    >
      <style>{`
        .nav-inner {
          padding: 0 5%;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-links {
          display: flex;
          gap: 32px;
          font-family: ${font};
          font-size: 14px;
          font-weight: 500;
        }
        .nav-sso {
          font-family: ${font};
          font-size: 14px;
          font-weight: 600;
          padding: 9px 20px;
          border-radius: 10px;
          background: linear-gradient(135deg, ${purple}, ${purpleDark});
          color: white !important;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(124,58,237,0.35);
          transition: all 0.2s;
          white-space: nowrap;
          text-decoration: none;
          display: inline-block;
        }
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 4px;
          background: none;
          border: none;
        }
        .nav-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #374151;
          border-radius: 2px;
          transition: all 0.3s;
        }
        .nav-mobile {
          display: none;
          flex-direction: column;
          padding: 16px 5% 20px;
          border-top: 1px solid #f3f4f6;
          gap: 4px;
        }
        .nav-mobile a {
          font-family: ${font};
          font-size: 15px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          padding: 10px 0;
          border-bottom: 1px solid #f9fafb;
        }
        .nav-mobile-sso {
          margin-top: 12px;
          font-family: ${font};
          font-size: 14px;
          font-weight: 600;
          padding: 12px;
          border-radius: 10px;
          background: linear-gradient(135deg, ${purple}, ${purpleDark});
          color: white !important;
          cursor: pointer;
          width: 100%;
          text-decoration: none;
          display: block;
          text-align: center;
        }
        @media (max-width: 768px) {
          .nav-links    { display: none; }
          .nav-sso      { display: none; }
          .nav-hamburger { display: flex; }
          .nav-mobile[data-open="true"] { display: flex; }
        }
      `}</style>

      {/* Main bar */}
      <div className="nav-inner">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${purple}, ${purpleDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎓</div>
          <span style={{ fontFamily: font, fontWeight: 700, fontSize: 18, color: "#1e1b4b" }}>
            ST{" "}
            <span style={{ background: `linear-gradient(90deg, ${purple}, ${purpleDark})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Alumni
            </span>
          </span>
        </div>

        {/* Desktop links */}
        <nav className="nav-links">
          {NAV_LINKS.map((l) => (
            <a key={l} href="#"
              style={{ color: "#6b7280", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = purple)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#6b7280")}
            >{l}</a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          to="admin/dashboard"
          className="nav-sso"
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Đăng nhập với ST SSO
        </Link>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className="nav-mobile" data-open={String(menuOpen)}>
        {NAV_LINKS.map((l) => (
          <a key={l} href="#">{l}</a>
        ))}
        <Link to="admin/dashboard" className="nav-mobile-sso">
          Đăng nhập với ST SSO
        </Link>
      </div>
    </header>
  );
}