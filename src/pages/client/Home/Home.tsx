import { useSurveyStats, useEnterprises } from "../../../feature/home/hooks/index.ts";
import { Navbar }              from "./Navbar.tsx";
import { HeroSection }         from "./Herosection";
import { StatsSection }        from "./Statssection";
import { FeaturesSection }     from "./Featuressection";
import { StepsSection }        from "./Stepssection";
import { NewsSection }         from "./Newssection";
import { PartnersSection }     from "./Partnerssection";
import { TestimonialsSection } from "./Testimonialssection";
import { CtaSection }          from "./Ctasection";
import { Footer }              from "./Footer";

export default function HomePage() {
  const { data: stats }        = useSurveyStats();
  const { items: enterprises } = useEnterprises(6);

  return (
    <>
      <style>{`
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

        /* Keep section backgrounds transparent so page-bg shows through */
        .hero-wrapper,
        #stats,
        #features,
        #steps,
        #news,
        #partners,
        .ft {
          background: transparent !important;
        }

        /* Sections with their own opaque bg keep them */
        #testimonials,
        #cta {
          /* intentional — these have their own dark backgrounds */
        }
      `}</style>

      <div className="page-bg">
        <Navbar />

        {stats && <HeroSection stats={stats} />}
        {stats && <StatsSection stats={stats} />}

        <FeaturesSection />
        <StepsSection />

        {enterprises.length > 0 && <PartnersSection partnerLogos={enterprises} />}

        <NewsSection />
        <TestimonialsSection />
        <CtaSection />

        <Footer />
      </div>
    </>
  );
}