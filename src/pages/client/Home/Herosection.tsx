import { Link } from "react-router-dom";
import { useCountUp } from "../../../feature/home/hooks/index.ts";
import type { SurveyStats } from "../../../feature/home/type.ts";

const font = "'Be Vietnam Pro', sans-serif";
const purple = "#7c3aed";
const purpleDark = "#4f46e5";
const purpleLight = "#ede9fe";

export function HeroSection({ stats }: { stats: SurveyStats }) {
  const alumni = useCountUp(stats.totalRespondents, 1800, 400);
  const pct    = useCountUp(stats.overallEmploymentRate, 1600, 600);

  return (
    <section style={{ minHeight: "100vh", background: `linear-gradient(135deg, #6d28d9 0%, ${purpleDark} 50%, ${purple} 100%)`, display: "flex", alignItems: "center", padding: "100px 5% 60px", position: "relative", overflow: "hidden" }}>
      <style>{`
        .hero-inner {
          display: flex;
          align-items: center;
          gap: 80px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        .hero-mockup {
          flex: 0 0 460px;
          animation: fadeUp 0.7s 0.2s ease both;
        }
        .hero-counters {
          display: flex;
          gap: 32px;
          margin-top: 40px;
          animation: fadeUp 0.6s 0.4s ease both;
        }
        .hero-btns {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          animation: fadeUp 0.6s 0.3s ease both;
        }
        @media (max-width: 1024px) {
          .hero-mockup { flex: 0 0 380px; }
          .hero-inner  { gap: 40px; }
        }
        @media (max-width: 768px) {
          .hero-inner   { flex-direction: column; gap: 40px; }
          .hero-mockup  { flex: unset; width: 100%; max-width: 480px; }
          .hero-btns    { flex-direction: column; }
          .hero-btns button { width: 100%; }
          .hero-counters { gap: 20px; }
        }
      `}</style>

      {/* Decorative blobs */}
      {[{ top: -100, right: -100, size: 500 }, { bottom: -150, left: "30%", size: 400 }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, width: pos.size, height: pos.size, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
      ))}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

      <div className="hero-inner">
        {/* Left */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 100, padding: "6px 16px", marginBottom: 28, animation: "fadeUp 0.6s ease both" }}>
            <span style={{ fontSize: 12 }}>✨</span>
            <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.03em" }}>Nền tảng alumni đầu tiên của VNUA</span>
          </div> */}

          <h1 style={{ fontFamily: font, fontSize: "clamp(30px, 4vw, 56px)", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 20, animation: "fadeUp 0.6s 0.1s ease both" }}>
            Kết nối cựu sinh viên
            <br />
            <span style={{ background: "linear-gradient(90deg, #fbbf24, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              với doanh nghiệp
            </span>
          </h1>

          <p style={{ fontFamily: font, fontSize: "clamp(15px, 1.5vw, 17px)", color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 480, marginBottom: 36, animation: "fadeUp 0.6s 0.2s ease both" }}>
            ST Alumni giúp khảo sát việc làm, phân tích dữ liệu nghề nghiệp và kết nối cựu sinh viên với hơn 350 doanh nghiệp đối tác trên toàn quốc.
          </p>

          <div className="hero-btns">
            <Link
                to="/enterprises"
                style={{
                  fontFamily: font, fontWeight: 700, fontSize: 15,
                  padding: "14px 32px", borderRadius: 12,
                  background: "white", color: purple,
                  cursor: "pointer", boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  transition: "all 0.2s", textDecoration: "none", display: "inline-block",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Xem doanh nghiệp đối tác →
              </Link>

              <Link
                to="admin/dashboard"
                style={{
                  fontFamily: font, fontWeight: 600, fontSize: 15,
                  padding: "14px 28px", borderRadius: 12,
                  border: "1.5px solid rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.1)", color: "white",
                  cursor: "pointer", backdropFilter: "blur(4px)",
                  transition: "all 0.2s", textDecoration: "none", display: "inline-block",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              >
                Đăng nhập với ST SSO →
              </Link>
          </div>

          {/* Counters */}
          <div className="hero-counters">
            {[
              { val: `${alumni.toLocaleString("vi-VN")}+`, label: "Cựu sinh viên" },
              null,
              { val: "350+", label: "Doanh nghiệp" },
              null,
              { val: `${pct}%`, label: "Có việc làm", gold: true },
            ].map((item, i) =>
              item === null
                ? <div key={i} style={{ width: 1, background: "rgba(255,255,255,0.2)", alignSelf: "stretch" }} />
                : <div key={i}>
                    <div style={{ fontFamily: font, fontSize: "clamp(22px, 2.5vw, 28px)", fontWeight: 800, color: item.gold ? "#fbbf24" : "white" }}>{item.val}</div>
                    <div style={{ fontFamily: font, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{item.label}</div>
                  </div>
            )}
          </div>
        </div>

        {/* Right — mockup */}
        <div className="hero-mockup">
          <div style={{ background: "white", borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,0.3)", overflow: "hidden" }}>
            {/* Browser bar */}
            <div style={{ background: "#f3f4f6", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#ef4444", "#f59e0b", "#22c55e"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
              </div>
              <div style={{ flex: 1, background: "white", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: "#9ca3af", fontFamily: "monospace", border: "1px solid #e5e7eb" }}>
                    https://st-dse.vnua.edu.vn:6870
              </div>
            </div>
            {/* Content */}
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: font, fontWeight: 700, fontSize: 15, color: "#1e1b4b" }}>Kết quả khảo sát 2024</div>
                  <div style={{ fontFamily: font, fontSize: 12, color: "#9ca3af" }}>{stats.totalRespondents.toLocaleString("vi-VN")} phản hồi</div>
                </div>
                <span style={{ background: purpleLight, color: purple, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, fontFamily: font }}>Mới nhất</span>
              </div>

              {stats.byMajor.map((m) => (
                <div key={m.majorCode} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: font, fontSize: 13, color: "#374151" }}>{m.major}</span>
                    <span style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: purple }}>{m.employmentRate}%</span>
                  </div>
                  <div style={{ height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${m.employmentRate}%`, background: purple, borderRadius: 3 }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 20, padding: 14, background: "#faf5ff", borderRadius: 12, border: `1px solid ${purpleLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: font, fontSize: 11, color: "#9ca3af" }}>Mức lương trung bình</div>
                  <div style={{ fontFamily: font, fontSize: 18, fontWeight: 800, color: purple }}>{stats.avgSalaryMillionVND} triệu/tháng</div>
                </div>
                <div style={{ background: `linear-gradient(135deg, ${purple}, ${purpleDark})`, color: "white", fontSize: 11, fontWeight: 600, padding: "8px 14px", borderRadius: 8, fontFamily: font, cursor: "pointer" }}>
                  Xem chi tiết →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}