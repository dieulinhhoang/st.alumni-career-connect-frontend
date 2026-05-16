export function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      background: '#f0fdf7', color: '#64748b',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 36, height: 36,
          border: '3px solid #1D9E75', borderTopColor: 'transparent',
          borderRadius: '50%', animation: 'spin 0.7s linear infinite',
          margin: '0 auto 12px',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        Đang tải phiếu khảo sát…
      </div>
    </div>
  )
}

export function ErrorScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      background: '#fff1f2', padding: 24,
    }}>
      <div style={{ textAlign: 'center', color: '#9f1239' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚠</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
          Không tìm thấy phiếu khảo sát
        </div>
        <div style={{ fontSize: 13, color: '#be123c' }}>
          Link không hợp lệ hoặc đã bị xóa.
        </div>
      </div>
    </div>
  )
}
