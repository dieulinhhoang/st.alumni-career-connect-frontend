import { useState } from "react";
import { useScrolled } from "../../../feature/home/hooks/index.ts";
import { Link } from "react-router-dom";

const font = "'Open Sans', sans-serif";
const fontActor = "'Actor', sans-serif";
const green = "#1e4d2b";
const greenLight = "#2d6a3f";
const bgNav = "#fdfbf7";
const borderSoft = "rgba(15, 23, 42, 0.08)";

export function Navbar() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  const buildSsoUrl = () => {
    const returnUrl =
      window.location.pathname +
      window.location.search +
      window.location.hash;

    return `${import.meta.env.VITE_API_URL}/auth/sso/redirect?returnUrl=${encodeURIComponent(
      returnUrl || "/"
    )}`;
  };

  const handleSsoLogin = () => {
    window.location.href = buildSsoUrl();
  };

  const handleMobileSsoLogin = () => {
    setMenuOpen(false);
    window.location.href = buildSsoUrl();
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled
          ? "rgba(253, 251, 247, 0.98)"
          : "rgba(253, 251, 247, 0.96)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${borderSoft}`,
        boxShadow: scrolled ? "0 10px 30px rgba(15, 23, 42, 0.15)" : "none",
        transition: "all 0.25s ease",
      }}
    >
      <style>{`
        .nav-inner {
          padding: 0 1.5rem;
          height: 60px;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: ${bgNav};
        }

        @media (max-width: 768px) {
          .nav-inner {
            padding: 0 1.25rem;
          }
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-logo-img {
          height: 34px;
          width: auto;
        }

        .nav-logo-texts {
          display: flex;
          flex-direction: column;
        }

        .nav-logo-title {
          font-family: ${fontActor};
          font-size: 20px;
          color: #111827;
          letter-spacing: 0.02em;
          font-weight: 600;
          line-height: 1.25;
        }

        .nav-main {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-sso {
          font-family: ${font};
          font-size: 13px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 4px;
          border: none;
          background: ${green};
          color: #ffffff;
          text-decoration: none;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
        }

        .nav-sso:hover {
          background: ${greenLight};
          box-shadow: 0 8px 22px rgba(30, 77, 43, 0.28);
          transform: translateY(-1px);
        }

        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          padding: 4px;
          background: none;
          border: none;
        }

        .nav-hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: rgba(15, 23, 42, 0.85);
          border-radius: 999px;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .nav-hamburger[data-open="true"] span:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }
        .nav-hamburger[data-open="true"] span:nth-child(2) {
          opacity: 0;
        }
        .nav-hamburger[data-open="true"] span:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        .nav-mobile {
          display: none;
          flex-direction: column;
          padding: 8px 1.5rem 14px;
          border-top: 1px solid ${borderSoft};
          background: rgba(253, 251, 247, 0.98);
        }

        .nav-mobile-sso {
          font-family: ${font};
          font-size: 13px;
          font-weight: 600;
          padding: 9px 0;
          border-radius: 4px;
          border: none;
          background: ${green};
          color: #ffffff;
          cursor: pointer;
          width: 100%;
          text-decoration: none;
          text-align: center;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .nav-mobile-sso:hover {
          background: ${greenLight};
        }

        @media (max-width: 768px) {
          .nav-sso {
            display: none;
          }
          .nav-hamburger {
            display: flex;
          }
          .nav-mobile[data-open="true"] {
            display: flex;
          }
        }
      `}</style>

      <div className="nav-inner">
        <div className="nav-brand">
          <img
            src="https://vitc.edu.vn/Frond_end/images/logo_vnua-1.png"
            alt="VNUA Logo"
            className="nav-logo-img"
          />
          <div className="nav-logo-texts">
            <span className="nav-logo-title">Hệ Thống Khảo Sát Việc Làm</span>
          </div>
        </div>

        <div className="nav-main">
          <button
            type="button"
            className="nav-sso"
            onClick={handleSsoLogin}
          >
            Đăng nhập SSO
          </button>

          <button
            className="nav-hamburger"
            data-open={String(menuOpen)}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Mở menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="nav-mobile" data-open={String(menuOpen)}>
        <button
          type="button"
          className="nav-mobile-sso"
          onClick={handleMobileSsoLogin}
        >
          Đăng nhập SSO
        </button>
      </div>
    </header>
  );
}
