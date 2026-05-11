const font = "'Be Vietnam Pro', sans-serif";
const dark = "#111a13";
const green = "#1a6b35";
const gold = "#8B6914";
const grayText = "rgba(255,255,255,0.7)";
const grayDark = "rgba(255,255,255,0.5)";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        background: dark,
        padding: "64px 5% 32px",
        color: white,
      }}
    >
      <style>{`
        .footer-container {
          max-width: 1180px;
          margin: 0 auto;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }
        .footer-brand {
          padding-right: 24px;
        }
        .footer-logo-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .footer-logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, ${green} 0%, ${gold} 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .footer-logo-text {
          font-family: ${font};
          font-size: 18px;
          font-weight: 800;
          color: white;
        }
        .footer-brand p {
          font-family: ${font};
          font-size: 14px;
          color: ${grayText};
          line-height: 1.6;
          margin: 0;
        }
        .footer-brand small {
          display: block;
          font-family: ${font};
          font-size: 11px;
          color: ${grayDark};
          margin-top: 6px;
          letter-spacing: 0.5px;
        }
        .footer-col h4 {
          font-family: ${font};
          font-size: 14px;
          font-weight: 700;
          color: white;
          margin-bottom: 16px;
          letter-spacing: 0.3px;
        }
        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-col li {
          margin-bottom: 10px;
        }
        .footer-col a {
          font-family: ${font};
          font-size: 14px;
          color: ${grayText};
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-col a:hover {
          color: white;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .footer-bottom p {
          font-family: ${font};
          font-size: 13px;
          color: ${grayDark};
          margin: 0;
        }
        .footer-bottom-links {
          display: flex;
          gap: 24px;
        }
        .footer-bottom-links a {
          font-family: ${font};
          font-size: 13px;
          color: ${grayDark};
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-bottom-links a:hover {
          color: white;
        }
        @media (max-width: 968px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-row">
              <div className="footer-logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                </svg>
              </div>
              <span className="footer-logo-text">VNUA Alumni</span>
            </div>
            <p>
              Nền tảng kết nối cựu sinh viên Học viện Nông nghiệp Việt Nam.
            </p>
            <small>FITA — Faculty of Information Technology & Applied Mathematics</small>
          </div>
          <div className="footer-col">
            <h4>Nền tảng</h4>
            <ul>
              <li><a href="#">Trang chủ</a></li>
              <li><a href="#">Thống kê</a></li>
              <li><a href="#">Câu chuyện</a></li>
              <li><a href="#">Tuyển dụng</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Tài khoản</h4>
            <ul>
              <li><a href="/login">Đăng nhập</a></li>
              <li><a href="/register">Đăng ký</a></li>
              <li><a href="#">Quên mật khẩu</a></li>
              <li><a href="#">Hồ sơ</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Liên hệ</h4>
            <ul>
              <li><a href="mailto:fita@vnua.edu.vn">fita@vnua.edu.vn</a></li>
              <li><a href="tel:+842438767123">+84 243 876 7123</a></li>
              <li><a href="#">Số 1, Gia Lâm, Hà Nội</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {year} FITA - VNUA. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
