// ─── LoadingScreen ────────────────────────────────────────────────────────────
export function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'inherit', background: '#f0fdf9',
    }}>
      <style>{`
        @keyframes iso-spin { to { transform: rotate(360deg) } }
        @keyframes iso-float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-8px) } }
        @keyframes iso-blink { 0%,100% { opacity:1 } 50% { opacity:.25 } }
        @keyframes iso-fadeup { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      <div style={{ textAlign:'center', animation:'iso-fadeup .5s ease both' }}>
        {/* ── Isometric clipboard đang load ── */}
        <svg width="240" height="220" viewBox="0 0 240 220" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display:'block', margin:'0 auto', animation:'iso-float 2.6s ease-in-out infinite' }}>

          {/* Bóng */}
          <ellipse cx="120" cy="210" rx="56" ry="7" fill="#a7f3d0" opacity=".6"/>

          {/* ── Mặt trên clipboard (top face) ── */}
          <polygon points="120,18 200,62 120,106 40,62" fill="#1D9E75"/>
          {/* Shine top */}
          <polygon points="120,18 160,40 120,62 80,40" fill="#34d399" opacity=".35"/>

          {/* ── Mặt phải (right face) ── */}
          <polygon points="200,62 200,152 120,196 120,106" fill="#0d7a5a"/>

          {/* ── Mặt trái (left face) ── */}
          <polygon points="40,62 40,152 120,196 120,106" fill="#15896a"/>

          {/* ── Dòng kẻ isometric trên mặt trên ── */}
          {/* dòng 1 */}
          <polygon points="96,52 136,30 148,37 108,59" fill="#fff" opacity=".5"/>
          {/* dòng 2 */}
          <polygon points="96,62 124,47 136,54 108,69" fill="#fff" opacity=".5"/>
          {/* dòng 3 — nhấp nháy giả loading */}
          <polygon points="96,72 118,60 130,67 108,79" fill="#fff" opacity=".9"
            style={{ animation:'iso-blink 1s ease-in-out infinite' }}/>

          {/* ── Kẹp clipboard trên đỉnh ── */}
          <polygon points="108,18 132,18 136,26 120,34 104,26" fill="#0d7a5a"/>
          <polygon points="112,14 128,14 132,22 120,28 108,22" fill="#94a3b8"/>
          <polygon points="115,12 125,12 128,18 120,22 112,18" fill="#cbd5e1"/>

          {/* ── Spinner nhỏ góc phải ── */}
          <g transform="translate(194,46)">
            <circle cx="0" cy="0" r="16" fill="#f0fdf9" stroke="#a7f3d0" strokeWidth="2"/>
            <circle cx="0" cy="0" r="11" fill="none" stroke="#1D9E75" strokeWidth="3"
              strokeDasharray="20 15"
              style={{ animation:'iso-spin .85s linear infinite', transformOrigin:'194px 46px' }}/>
          </g>
        </svg>

        <p style={{ fontWeight:700, fontSize:18, color:'#065f46', margin:'4px 0 4px' }}>
          Đang tải phiếu khảo sát…
        </p>
        <p style={{ fontSize:15, color:'#6ee7b7', margin:0 }}>
          Vui lòng chờ trong giây lát
        </p>
      </div>
    </div>
  )
}


// ─── ErrorScreen ──────────────────────────────────────────────────────────────
export function ErrorScreen() {
  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'inherit', background:'#f8fafb', padding:24,
    }}>
      <style>{`
        @keyframes err-fadeup { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes err-float  { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-7px) } }
        @keyframes err-blink  { 0%,100% { opacity:1 } 45%,55% { opacity:0 } }
        @keyframes err-shake  { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-6deg)} 40%{transform:rotate(6deg)} 60%{transform:rotate(-3deg)} 80%{transform:rotate(3deg)} }
      `}</style>

      <div style={{ textAlign:'center', maxWidth:420, animation:'err-fadeup .5s ease both' }}>

        {/* ── Isometric scene: robot bối rối bên cạnh màn hình lỗi ── */}
        <svg width="340" height="260" viewBox="0 0 340 260" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ width:'100%', maxWidth:340, display:'block', margin:'0 auto 4px' }}>

          {/* Bóng nền */}
          <ellipse cx="170" cy="250" rx="120" ry="8" fill="#e2e8f0" opacity=".7"/>

          {/* ══════════════════════════════════
              MÀN HÌNH ISOMETRIC (bên trái)
          ══════════════════════════════════ */}
          <g style={{ animation:'err-float 3s ease-in-out infinite' }}>
            {/* Chân đỡ màn hình */}
            <polygon points="118,222 130,222 130,210 118,210" fill="#94a3b8"/>
            <polygon points="112,226 136,226 130,222 118,222" fill="#cbd5e1"/>

            {/* Thân màn hình — mặt trước */}
            <polygon points="72,100 164,54 164,194 72,240" fill="#1e293b"/>
            {/* Mặt trên */}
            <polygon points="72,100 164,54 180,64 88,110" fill="#334155"/>
            {/* Mặt phải */}
            <polygon points="164,54 180,64 180,204 164,194" fill="#0f172a"/>

            {/* Màn hình bên trong */}
            <polygon points="84,112 152,76 152,182 84,218" fill="#1D9E75" opacity=".12"/>
            <polygon points="84,112 152,76 152,182 84,218" fill="#fff" opacity=".06"/>

            {/* Nội dung màn hình — "ERROR" isometric */}
            {/* dòng đỏ 1 */}
            <polygon points="96,132 140,109 148,114 104,137" fill="#f87171" opacity=".9"/>
            {/* dòng đỏ 2 */}
            <polygon points="96,146 128,129 136,134 104,151" fill="#f87171" opacity=".7"/>
            {/* Vòng cảnh báo */}
            <ellipse cx="118" cy="168" rx="18" ry="10" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5"
              transform="skewX(-10)"/>
            <text x="108" y="172" fontSize="11" fontWeight="800" fill="#e11d48"
              
              style={{ animation:'err-blink 1.4s ease-in-out infinite' }}>
              !
            </text>

            {/* Viền màn hình */}
            <polygon points="72,100 164,54 180,64 88,110" fill="none" stroke="#475569" strokeWidth="1.2"/>
            <polygon points="72,100 72,240 164,194 164,54"  fill="none" stroke="#475569" strokeWidth="1.2"/>
            <polygon points="164,54 180,64 180,204 164,194" fill="none" stroke="#475569" strokeWidth="1.2"/>
          </g>

          {/* ══════════════════════════════════
              ROBOT BỐI RỐI (bên phải)
          ══════════════════════════════════ */}
          <g transform="translate(185,55)"
            style={{ animation:'err-float 2.8s ease-in-out infinite .3s' }}>

            {/* Chân robot */}
            <rect x="10"  y="148" width="16" height="28" rx="5" fill="#64748b"/>
            <rect x="34"  y="148" width="16" height="28" rx="5" fill="#64748b"/>
            <rect x="6"   y="172" width="24" height="8"  rx="4" fill="#475569"/>
            <rect x="30"  y="172" width="24" height="8"  rx="4" fill="#475569"/>

            {/* Thân robot */}
            <rect x="4" y="82" width="56" height="70" rx="10" fill="#94a3b8"/>
            <rect x="4" y="82" width="56" height="70" rx="10" stroke="#cbd5e1" strokeWidth="1.5"/>
            {/* Ngực — panel */}
            <rect x="14" y="96" width="36" height="28" rx="5" fill="#1D9E75" opacity=".2"/>
            <rect x="14" y="96" width="36" height="28" rx="5" stroke="#1D9E75" strokeWidth="1" opacity=".5"/>
            {/* Đèn ngực */}
            <circle cx="22" cy="110" r="4" fill="#1D9E75"/>
            <circle cx="32" cy="110" r="4" fill="#fbbf24"
              style={{ animation:'err-blink 1.2s ease-in-out infinite' }}/>
            <circle cx="42" cy="110" r="4" fill="#f87171"/>

            {/* Cánh tay trái (giơ lên — bối rối) */}
            <rect x="-18" y="72" width="14" height="36" rx="7" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.2"
              transform="rotate(-40,-18,72)"
              style={{ animation:'err-shake 2.5s ease-in-out infinite', transformOrigin:'-11px 90px' }}/>
            <circle cx="-24" cy="58" r="8" fill="#64748b" stroke="#94a3b8" strokeWidth="1.2"
              style={{ animation:'err-shake 2.5s ease-in-out infinite', transformOrigin:'-11px 90px' }}/>

            {/* Cánh tay phải (để xuống) */}
            <rect x="60" y="90" width="14" height="32" rx="7" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.2"
              transform="rotate(15,60,90)"/>
            <circle cx="76" cy="128" r="8" fill="#64748b" stroke="#94a3b8" strokeWidth="1.2"/>

            {/* Đầu robot */}
            <rect x="8" y="18" width="48" height="66" rx="12" fill="#cbd5e1"/>
            <rect x="8" y="18" width="48" height="66" rx="12" stroke="#94a3b8" strokeWidth="1.5"/>
            {/* Ăng-ten */}
            <rect x="29" y="6" width="6" height="14" rx="3" fill="#94a3b8"/>
            <circle cx="32" cy="5" r="5" fill="#1D9E75"
              style={{ animation:'err-blink .9s ease-in-out infinite' }}/>

            {/* Mắt trái — "x" bối rối */}
            <line x1="18" y1="36" x2="28" y2="46" stroke="#475569" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="28" y1="36" x2="18" y2="46" stroke="#475569" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Mắt phải — "?" */}
            <text x="34" y="48" fontSize="16" fontWeight="900" fill="#475569"
              >?</text>

            {/* Miệng — zigzag bối rối */}
            <polyline points="18,62 22,68 26,62 30,68 34,62 38,68 42,62" fill="none"
              stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </g>

          {/* Dấu ? bay ra từ đầu robot */}
          <text x="284" y="65" fontSize="22" fontWeight="900" fill="#1D9E75" opacity=".4"
            
            style={{ animation:'err-float 2s ease-in-out infinite .1s' }}>?</text>
          <text x="298" y="42" fontSize="14" fontWeight="900" fill="#1D9E75" opacity=".25"
            
            style={{ animation:'err-float 2s ease-in-out infinite .5s' }}>?</text>

          {/* Chữ 404 isometric dưới màn hình */}
          <text x="118" y="246" textAnchor="middle" fontSize="12" fontWeight="800"
            fill="#94a3b8"  letterSpacing="6">
            404
          </text>
        </svg>

        <h2 style={{ fontSize:24, fontWeight:800, color:'#1e293b', margin:'0 0 8px' }}>
          Không tìm thấy phiếu khảo sát
        </h2>
        <p style={{ fontSize:16, color:'#64748b', margin:'0 0 28px', lineHeight:1.75 }}>
          Link không hợp lệ, đã hết hạn hoặc đã bị xóa.
          <br/>Vui lòng liên hệ người gửi để nhận lại link mới.
        </p>

        <a href="/" style={{
          display:'inline-flex', alignItems:'center', gap:6,
          padding:'10px 24px', borderRadius:8,
          background:'#1D9E75', color:'#fff',
          fontSize:16, fontWeight:600, textDecoration:'none',
          boxShadow:'0 4px 14px #1D9E7540',
          transition:'opacity .15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity='0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity='1')}
        >
          ← Về trang chủ
        </a>
      </div>
    </div>
  )
}