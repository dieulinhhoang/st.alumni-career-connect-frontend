import { useState } from "react";
import { useScrolled } from "../../../feature/home/hooks/index.ts";
import { Link } from "react-router-dom";

const font = "'Open Sans', sans-serif";
const fontActor = "'Actor', sans-serif";
const green = "#1e4d2b";
const greenLight = "#2d6a3f";
const gold = "#c8a84b";
const bgNav = "#fdfbf7";

export function Navbar() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  const buildSsoUrl = () => {
    const returnUrl = window.location.pathname + window.location.search + window.location.hash;
    return `${import.meta.env.VITE_API_URL}/auth/sso/redirect?returnUrl=${encodeURIComponent(returnUrl || "/")}`;
  };

  const handleSsoLogin = () => { window.location.href = buildSsoUrl(); };
  const handleMobileSsoLogin = () => { setMenuOpen(false); window.location.href = buildSsoUrl(); };

  const isLogin = !!localStorage.getItem('accessToken');
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(253, 251, 247, 0.98)" : "rgba(253, 251, 247, 0.96)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid rgba(15, 23, 42, 0.08)`,
        boxShadow: scrolled ? "0 10px 30px rgba(15, 23, 42, 0.1)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <style>{`
        .nav-inner {
          padding: 0 1.5rem;
          height: 70px;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        @media (max-width: 768px) { .nav-inner { padding: 0 1.25rem; height: 64px; } }
        .nav-brand { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .nav-logo-img { height: 42px; width: auto; transition: transform 0.2s; }
        .nav-logo-img:hover { transform: scale(1.02); }
        .nav-logo-texts { display: flex; flex-direction: column; }
        .nav-logo-title {
          font-family: ${fontActor};
          font-size: 22px;
          font-weight: 600;
          background: linear-gradient(135deg, ${green}, ${gold});
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -0.02em;
        }
        .nav-sso {
          font-family: ${font};
          font-size: 14px;
          font-weight: 600;
          padding: 8px 24px;
          border-radius: 40px;
          border: none;
          background: linear-gradient(135deg, ${green}, ${greenLight});
          color: white;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(30,77,43,0.2);
        }
        .nav-sso:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(30,77,43,0.3);
          filter: brightness(1.02);
        }
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 6px;
        }
        .nav-hamburger span {
          display: block;
          width: 22px;
          height: 2.5px;
          background: #1f2937;
          border-radius: 4px;
          transition: all 0.25s;
        }
        .nav-hamburger[data-open="true"] span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
        .nav-hamburger[data-open="true"] span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger[data-open="true"] span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }
        @media (max-width: 768px) {
          .nav-sso { display: none; }
          .nav-hamburger { display: flex; }
        }
        .nav-mobile {
          display: none;
          flex-direction: column;
          padding: 16px 1.5rem 24px;
          background: rgba(253,251,247,0.98);
          backdrop-filter: blur(14px);
          border-top: 1px solid rgba(0,0,0,0.05);
        }
        .nav-mobile[data-open="true"] { display: flex; }
        .nav-mobile-sso {
          font-family: ${font};
          font-size: 15px;
          font-weight: 600;
          padding: 12px;
          border-radius: 40px;
          background: linear-gradient(135deg, ${green}, ${greenLight});
          color: white;
          text-align: center;
          cursor: pointer;
          border: none;
          width: 100%;
        }
      `}</style>
      <div className="nav-inner">
        <div className="nav-brand">
          <img src="https://vitc.edu.vn/Frond_end/images/logo_vnua-1.png" alt="VNUA Logo" className="nav-logo-img" />
          <div className="nav-logo-texts">
            <span className="nav-logo-title">Hệ Thống Khảo Sát Việc Làm</span>
          </div>
        </div>
        <div className="nav-main">
          {isLogin ? (
             <button className="nav-sso">
               <Link to="admin/dashboard" style={{ color: "inherit", textDecoration: "none" }}>Trang quản trị</Link>
             </button>
          ) : (
            <button className="nav-sso" onClick={handleSsoLogin}>
              Đăng nhập SSO
            </button>
          )}
          <button className="nav-hamburger" data-open={String(menuOpen)} onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
      <div className="nav-mobile" data-open={String(menuOpen)}>
        {isLogin ? (
          <button className="nav-mobile-sso"  >
            <Link to="admin/dashboard" style={{ color: "inherit", textDecoration: "none" }}>Trang quản trị</Link>
          </button>
        ) : (
          <button className="nav-mobile-sso" onClick={handleMobileSsoLogin}>
            Đăng nhập SSO
          </button>
        )}
      </div>
    </header>
  );
}