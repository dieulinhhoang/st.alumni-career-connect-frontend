const font = "'DM Sans', sans-serif";

export function Footer() {
  return (
    <footer className="ft">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ft {
          font-family: ${font};
          background: #fdfbf7;
        }

        .ft-strips {
          display: flex;
          flex-direction: column;
        }
        .ft-strip-gold  { height: 5px; background: #f0b90b; }
        .ft-strip-brown { height: 5px; background: #7a4e1d; }
        .ft-strip-green { height: 5px; background: #0c6b37; }

        .ft-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 32px 32px;
        }

        .ft-logo-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .ft-logo-img {
          width: 72px;
          height: 72px;
          object-fit: contain;
        }
        .ft-logo-abbr {
          font-size: 20px;
          font-weight: 700;
          color: #0c6b37;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .ft-logo-full {
          font-size: 13px;
          color: #333;
          line-height: 1.45;
          margin-top: 3px;
        }

        .ft-info {
          font-size: 14px;
          color: #444;
          line-height: 1.9;
          margin-bottom: 20px;
        }

        .ft-bottom-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }
        .ft-copy {
          font-size: 13.5px;
          color: #444;
        }

        @media (max-width: 600px) {
          .ft-body { padding: 28px 16px 24px; }
          .ft-logo-abbr { font-size: 16px; }
        }
      `}</style>

      <div className="ft-strips">
        <div className="ft-strip-gold" />
        <div className="ft-strip-brown" />
        <div className="ft-strip-green" />
      </div>

      <div className="ft-body">
        <div className="ft-logo-row">
          <img src="https://vitc.edu.vn/Frond_end/images/logo_vnua-1.png" alt="VNUA Logo" className="ft-logo-img" />
          <div>
            <div className="ft-logo-abbr">Hệ Thống Khảo Sát Việc Làm Và Hỗ Trợ Kết Nối Doanh Nghiệp</div>
            <div className="ft-logo-full">Học viện Nông nghiệp Việt Nam</div>
          </div>
        </div>

        <div className="ft-info">
          <div>Địa chỉ: 236 phố Ngô Xuân Quảng, xã Gia Lâm, thành phố Hà Nội.</div>
          <div>Điện thoại: 84.024.62617586</div>
        </div>

        <div className="ft-bottom-row">
          <span className="ft-copy">Copyright © 2026 ST TEAM – VNUA. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}