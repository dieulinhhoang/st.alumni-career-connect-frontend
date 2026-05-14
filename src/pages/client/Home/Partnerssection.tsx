import React, { useMemo, useState } from "react";

const green = "#234b2f";
const gold = "#c8a84b";

export interface PartnerLogo {
  companyName?: string;
  name?: string;
  logoUrl?: string;
  logo?: string;
  [key: string]: any;
}

function isUrl(s?: string) {
  if (!s) return false;
  return s.startsWith("http") || s.startsWith("/");
}

function normalize(p: PartnerLogo) {
  const logoUrl = isUrl(p.logo) ? p.logo : isUrl(p.logoUrl) ? p.logoUrl : undefined;
  return {
    companyName: p.companyName ?? p.name ?? "Partner",
    logoUrl,
  };
}

const PARTNERS_STYLES = `
  * { box-sizing: border-box; }

  #partners {
    position: relative;
    overflow: hidden;
    padding: 110px 0;
  }

  #partners::before {
    content: "";
    position: absolute;
    width: 1200px; height: 1200px;
    left: -520px; top: -520px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(214,190,98,0.16) 0%, rgba(214,190,98,0.08) 24%, transparent 70%);
    filter: blur(12px);
    pointer-events: none;
    z-index: 0;
  }

  #partners::after {
    content: "";
    position: absolute;
    width: 1400px; height: 1400px;
    left: -680px; top: -620px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.24);
    opacity: 0.7;
    pointer-events: none;
    z-index: 0;
  }

  .partners-inner {
    position: relative; z-index: 2;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .partners-header {
    display: flex; flex-direction: column;
    align-items: center; text-align: center;
    margin-bottom: 58px;
  }

  .partners-eyebrow {
    display: inline-flex; align-items: center;
    gap: 12px; margin-bottom: 18px;
  }

  .partners-eyebrow-dot {
    width: 10px; height: 10px;
    border-radius: 999px;
    background: ${green};
    box-shadow: 0 0 12px rgba(200,168,75,0.35);
  }

  .partners-eyebrow-text {
    font-family: 'Open Sans', sans-serif;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: #667085;
  }

  .partners-title {
    margin: 0 0 14px;
    font-family: 'Actor', sans-serif;
    font-size: clamp(34px, 4vw, 50px);
    line-height: 1.08; letter-spacing: -0.04em;
    color: #0f172a;
  }

  .partners-subtitle {
    max-width: 640px;
    font-family: 'Open Sans', sans-serif;
    font-size: 0.98rem; line-height: 1.85;
    color: #667085;
  }

  .partners-carousel-outer {
    position: relative; overflow: hidden; padding: 12px 0;
  }

  .partners-carousel-outer::before,
  .partners-carousel-outer::after {
    content: ""; position: absolute;
    top: 0; bottom: 0; width: 140px;
    z-index: 3; pointer-events: none;
  }

  .partners-carousel-outer::before {
    left: 0;
    background: linear-gradient(to right, #f5f6f1, rgba(245,246,241,0));
  }

  .partners-carousel-outer::after {
    right: 0;
    background: linear-gradient(to left, #f5f3e8, rgba(245,243,232,0));
  }

  .partners-track {
    display: flex; align-items: center;
    width: max-content;
    animation: partners-marquee 36s linear infinite;
  }

  .partners-carousel-outer:hover .partners-track {
    animation-play-state: paused;
  }

  @keyframes partners-marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-33.333%); }
  }

  .partner-card {
    position: relative; overflow: hidden;
    flex: 0 0 auto;
    width: 270px; height: 150px;
    margin-right: 24px;
    border-radius: 32px;
    background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.90));
    border: 1px solid rgba(255,255,255,0.9);
    backdrop-filter: blur(18px);
    box-shadow:
      0 12px 40px rgba(15,23,42,0.05),
      0 2px 6px rgba(15,23,42,0.03),
      inset 0 1px 0 rgba(255,255,255,0.9);
    display: flex; align-items: center; justify-content: center;
    padding: 28px;
    transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
  }

  .partner-card::before {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.36), transparent);
    pointer-events: none;
  }

  .partner-card:hover {
    transform: translateY(-6px);
    border-color: rgba(200,168,75,0.24);
    box-shadow: 0 24px 50px rgba(15,23,42,0.08), 0 8px 20px rgba(15,23,42,0.04);
  }

  .partner-card img {
    max-width: 100%; max-height: 72px;
    object-fit: contain;
    filter: grayscale(0.05) opacity(0.95);
    transition: transform 0.28s ease, filter 0.28s ease;
  }

  .partner-card:hover img {
    transform: scale(1.05);
    filter: grayscale(0) opacity(1);
  }

  .partner-name-fallback {
    font-family: 'Open Sans', sans-serif;
    font-size: 16px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: #243444; text-align: center;
    line-height: 1.3;
  }

  .partners-empty {
    text-align: center;
    font-family: 'Open Sans', sans-serif;
    font-size: 0.95rem;
    color: #98a2b3;
    padding: 32px 0;
  }

  @media (max-width: 768px) {
    #partners { padding: 84px 0; }
    .partners-title { font-size: 40px; }
    .partner-card { width: 220px; height: 126px; border-radius: 24px; padding: 22px; }
    .partner-card img { max-height: 58px; }
  }
`;

function ImageWithFallback({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <span className="partner-name-fallback">{alt}</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}

function PartnerCard({ companyName, logoUrl }: { companyName: string; logoUrl?: string }) {
  return (
    <div className="partner-card" aria-label={companyName}>
      <ImageWithFallback src={logoUrl} alt={companyName} />
    </div>
  );
}

interface PartnersSectionProps {
  partnerLogos: PartnerLogo[];
}

export function PartnersSection({ partnerLogos }: PartnersSectionProps) {
  const normalized = useMemo(
    () => partnerLogos.map(normalize),
    [partnerLogos]
  );

  const track = useMemo(
    () => [...normalized, ...normalized, ...normalized],
    [normalized]
  );

  return (
    <section id="partners" aria-label="Đối tác doanh nghiệp">
      <style>{PARTNERS_STYLES}</style>

      <div className="partners-inner">
        <header className="partners-header">
          <div className="partners-eyebrow">
            <span className="partners-eyebrow-dot" />
            <span className="partners-eyebrow-text">Doanh nghiệp đối tác</span>
          </div>
          <h2 className="partners-title">Kết nối với doanh nghiệp hàng đầu</h2>
          <p className="partners-subtitle">
            Mạng lưới doanh nghiệp đồng hành cùng sinh viên trong hoạt động
            tuyển dụng, thực tập và phát triển nghề nghiệp.
          </p>
        </header>

        {normalized.length === 0 ? (
          <p className="partners-empty">Chưa có dữ liệu doanh nghiệp đối tác.</p>
        ) : (
          <div
            className="partners-carousel-outer"
            role="region"
            aria-label="Danh sách logo đối tác chạy ngang"
          >
            <div className="partners-track">
              {track.map((p, idx) => (
                <PartnerCard
                  key={`${p.companyName}-${idx}`}
                  companyName={p.companyName}
                  logoUrl={p.logoUrl}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}