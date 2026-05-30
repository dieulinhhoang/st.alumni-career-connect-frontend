const font = "'Open Sans', sans-serif";
const fontActor = "'Actor', sans-serif";
const green = "#234b2f";
const greenLight = "#2f6841";

const steps = [
  {
    num: "1",
    title: "Đăng nhập tài khoản",
    desc: "Dùng email sinh viên HVN hoặc đăng ký mới với mã số sinh viên.",
  },
  {
    num: "2",
    title: "Chọn đợt khảo sát",
    desc: "Chọn đúng đợt khảo sát tương ứng với năm tốt nghiệp của bạn.",
  },
  {
    num: "3",
    title: "Điền thông tin",
    desc: "Cung cấp thông tin việc làm hiện tại, mức thu nhập và đánh giá chương trình học.",
  },
  {
    num: "4",
    title: "Nhận xác nhận",
    desc: "Hệ thống gửi email xác nhận và bạn có thể xem hồ sơ nghề nghiệp của mình.",
  },
];

export function StepsSection() {
  return (
    <section id="steps">
      <style>{`
        * { box-sizing: border-box; }

        #steps {
          padding: 88px 1.5rem;
          background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(245,248,241,0.6));
        }

        .steps-shell {
          max-width: 1200px;
          margin: 0 auto;
        }

        .steps-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .steps-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .steps-eyebrow-dot {
          width: 8px; height: 8px;
          border-radius: 999px;
          background: ${green};
        }

        .steps-eyebrow-text {
          font-family: ${font};
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #667085;
        }

        .steps-title {
          font-family: ${fontActor};
          font-size: clamp(28px, 3.5vw, 44px);
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin: 0 0 12px;
        }

        .steps-subtitle {
          font-family: ${font};
          font-size: 1rem;
          line-height: 1.85;
          color: #667085;
        }

        .steps-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          position: relative;
        }

        .steps-row::before {
          content: "";
          position: absolute;
          top: 32px;
          left: 12.5%; right: 12.5%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(35,75,47,0.15), transparent);
          z-index: 0;
        }

        @media (max-width: 768px) {
          .steps-row {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .steps-row::before { display: none; }
        }

        @media (max-width: 440px) {
          .steps-row {
            grid-template-columns: 1fr;
          }
          #steps { padding: 64px 1rem; }
        }

        .step-item {
          text-align: center;
          padding: 0 20px;
          position: relative;
          z-index: 1;
        }

        .step-num-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
        }

        .step-num {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: rgba(255,255,255,0.96);
          border: 2px solid ${green};
          display: flex; align-items: center; justify-content: center;
          font-family: ${fontActor};
          font-size: 24px; font-weight: 700;
          color: ${green};
          box-shadow: 0 8px 24px rgba(35,75,47,0.1);
          transition: background 0.22s, color 0.22s, transform 0.22s;
        }

        .step-item:hover .step-num {
          background: ${green};
          color: #fff;
          transform: scale(1.08);
        }

        .step-title {
          font-family: ${fontActor};
          font-size: 16px; font-weight: 700;
          color: #0f172a;
          margin: 0 0 10px;
        }

        .step-desc {
          font-family: ${font};
          font-size: 13.5px;
          line-height: 1.75;
          color: #667085;
        }
      `}</style>

      <div className="steps-shell">
        <div className="steps-header">
          <div className="steps-eyebrow">
            <span className="steps-eyebrow-dot" />
            <span className="steps-eyebrow-text">Hướng dẫn nhanh</span>
          </div>
          <h2 className="steps-title">Tham gia khảo sát chỉ trong 4 bước</h2>
          <p className="steps-subtitle">Quy trình đơn giản, hoàn thành trong vòng 10 phút.</p>
        </div>

        <div className="steps-row">
          {steps.map((s, i) => (
            <div className="step-item" key={i}>
              <div className="step-num-wrap">
                <div className="step-num">{s.num}</div>
              </div>
              <h4 className="step-title">{s.title}</h4>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}