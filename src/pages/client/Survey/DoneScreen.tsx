export function DoneScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: '#f0fdf7',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', -apple-system, sans-serif", padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '48px 40px',
        boxShadow: '0 8px 32px rgba(0,0,0,.08)', textAlign: 'center',
        maxWidth: 420, width: '100%',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1D9E75, #16a34a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 32, color: '#fff',
          boxShadow: '0 8px 24px #1D9E7540',
        }}>
          ✓
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
          Đã gửi thành công!
        </h2>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
          Cảm ơn bạn đã hoàn thành phiếu khảo sát.
          <br />
          Thông tin của bạn đã được ghi nhận.
        </p>
        <div style={{
          marginTop: 24, padding: '12px 16px',
          background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0',
          fontSize: 13, color: '#166534',
        }}>
          Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!
        </div>
      </div>
    </div>
  )
}
