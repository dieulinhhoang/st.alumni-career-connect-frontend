import { useState } from "react";
import { useScrolled } from "../../../feature/home/hooks/index.ts";
import { Link } from "react-router-dom";

const font = "'Be Vietnam Pro', sans-serif";

// VNUA color palette
const green = "#1a6b35";
const greenDark = "#14542a";
const brown = "#7a5c1e";
const blue = "#1b5299";

const IconGradCap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
  </svg>
);

export function Navbar() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.98)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${scrolled ? "#d6e8da" : "#e8f0eb"}`,
        boxShadow: scrolled ? "0 2px 20px rgba(26,107,53,0.08)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <style>{`
        .nav-inner {
          padding: 0 5%;
          height: 68px;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-links {
          display: flex;
          gap: 36px;
          font-family: ${font};
          font-size: 14px;
          font-weight: 500;
        }
        .nav-sso {
          font-family: ${font};
          font-size: 14px;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 8px;
          background: ${green};
          color: white !important;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: all 0.2s;
          white-space: nowrap;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 2px 8px rgba(26,107,53,0.25);
        }
        .nav-sso:hover {
          background: ${greenDark};
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(26,107,53,0.35);
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
          background: #2d5a3d;
          border-radius: 2px;
          transition: all 0.3s;
        }
        .nav-mobile {
          display: none;
          flex-direction: column;
          padding: 12px 5% 20px;
          border-top: 1px solid #e8f0eb;
          gap: 4px;
          background: white;
        }
        .nav-mobile a {
          font-family: ${font};
          font-size: 15px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          padding: 10px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .nav-mobile-sso {
          margin-top: 12px;
          font-family: ${font};
          font-size: 14px;
          font-weight: 600;
          padding: 12px;
          border-radius: 8px;
          background: ${green};
          color: white !important;
          cursor: pointer;
          width: 100%;
          text-decoration: none;
          display: block;
          text-align: center;
        }
        @media (max-width: 768px) {
          .nav-links     { display: none; }
          .nav-sso       { display: none; }
          .nav-hamburger { display: flex; }
          .nav-mobile[data-open="true"] { display: flex; }
        }
      `}</style>

      <div className="nav-inner">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: green,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <IconGradCap />
          </div>
          <div>
            <div style={{ fontFamily: font, fontWeight: 800, fontSize: 15, color: "#1a2e1f", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
              ST Alumni
            </div>
            <div style={{ fontFamily: font, fontWeight: 400, fontSize: 11, color: "#6b7280", letterSpacing: "0.02em", lineHeight: 1 }}>
              VNUA Career Connect
            </div>
          </div>
        </div>

        {/* Desktop links */}
        <nav className="nav-links">
          <a href="#features" style={{ color: "#4b5563", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = green)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#4b5563")}>
            Tính năng
          </a>
          <a href="#stats" style={{ color: "#4b5563", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = green)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#4b5563")}>
            Thống kê
          </a>
          <a href="#partners" style={{ color: "#4b5563", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = green)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#4b5563")}>
            Doanh nghiệp
          </a>
        </nav>

        {/* Desktop CTA */}
        <Link to="admin/dashboard" className="nav-sso">
          Đăng nhập ST SSO
        </Link>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen((o) => !o)} aria-label="Mở menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className="nav-mobile" data-open={String(menuOpen)}>
        <a href="#features">Tính năng</a>
        <a href="#stats">Thống kê</a>
        <a href="#partners">Doanh nghiệp</a>
        <Link to="admin/dashboard" className="nav-mobile-sso">Đăng nhập với ST SSO</Link>
      </div>
    </header>
  );
}
