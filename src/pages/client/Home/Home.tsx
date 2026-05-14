import { useSurveyStats, useEnterprises } from "../../../feature/home/hooks/index.ts";
import { Navbar }          from "./Navbar.tsx";
import { HeroSection }     from "./Herosection";
import { StatsSection }    from "./Statssection";
import { PartnersSection } from "./Partnerssection";
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

        .page-bg {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 70% 40% at 0%   0%,   #dff0e0 0%, transparent 55%),
            radial-gradient(ellipse 60% 30% at 8%   55%,  #e8f4ea 0%, transparent 52%),
            radial-gradient(ellipse 55% 28% at 48% 100%,  #edf5e8 0%, transparent 60%),
            #f5f8f1;
          background-attachment: fixed;
        }

        .hero-wrapper,
        #stats,
        #partners,
        .ft {
          background: transparent !important;
        }
      `}</style>

      <div className="page-bg">
        <Navbar />
        {stats && <HeroSection stats={stats} />}
        {stats && <StatsSection stats={stats} />}
        {/* <FeaturesSection /> */}
        {enterprises.length > 0 && <PartnersSection partnerLogos={enterprises} />}
        {/* <CtaSection /> */}
        <Footer />
      </div>
    </>
  );
}