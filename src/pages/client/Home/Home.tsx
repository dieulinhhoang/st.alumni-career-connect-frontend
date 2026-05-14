import { useSurveyStats, useEnterprises } from "../../../feature/home/hooks/index.ts";
import { Navbar }          from "./Navbar.tsx";
import { HeroSection }     from "./Herosection";
import { StatsSection }    from "./Statssection";
import { FeaturesSection } from "./Featuressection";
import { PartnersSection } from "./Partnerssection";
import { CtaSection }      from "./Ctasection";
import { Footer }          from "./Footer";

export default function HomePage() {
  const { data: stats }        = useSurveyStats();
  const { items: enterprises } = useEnterprises(6);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700&family=Actor&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { overflow-x: hidden; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /*
         * Wrapper trải gradient MỘT LẦN xuyên suốt toàn trang.
         * background-attachment: fixed giữ cho gradient đứng yên khi scroll
         * → tạo cảm giác nền liền mạch như một tờ landing page.
         */
        .page-bg {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 80% 40% at 0%   0%,   #dff0e0 0%, transparent 55%),
            radial-gradient(ellipse 60% 30% at 100% 15%,  #f7f0c9 0%, transparent 50%),
            radial-gradient(ellipse 65% 30% at 8%   55%,  #e8f4ea 0%, transparent 52%),
            radial-gradient(ellipse 75% 35% at 92%  75%,  #fdf3d0 0%, transparent 50%),
            radial-gradient(ellipse 55% 28% at 48% 100%,  #edf5e8 0%, transparent 60%),
            #f5f8f1;
          background-attachment: fixed;
        }

        /* Xoá background riêng của từng section — dùng chung nền page-bg */
        .hero-wrapper,
        #stats,
        #partners,
        .ft {
          background: transparent !important;
        }

        /* Giảm opacity pseudo-elements trang trí để không chồng quá nặng */
        #stats::before,
        #stats::after,
        #partners::before,
        #partners::after {
          opacity: 0.4;
        }
      `}</style>

      <div className="page-bg">
        <Navbar />
        {stats && <HeroSection stats={stats} />}
        {stats && <StatsSection stats={stats} />}
        {/* <FeaturesSection /> */}
        {enterprises.length > 0 && <PartnersSection partnerLogos={enterprises} />}
        {/* <CtaSection /> */}
        
      </div>
      <Footer />
    </>
  );
}