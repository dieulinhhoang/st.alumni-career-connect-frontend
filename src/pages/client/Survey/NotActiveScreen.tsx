import type { SurveyBatch } from '../../../feature/alumni/types'

interface Props {
  batch: SurveyBatch | null
}

export function NotActiveScreen({ batch }: Props) {
  const now       = new Date()
  const start     = batch ? new Date(batch.startDate) : null
  const isUpcoming = start && now < start

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      background: '#fffbeb', padding: 24,
    }}>
      <div style={{ textAlign: 'center', color: '#92400e', maxWidth: 360 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>
          {isUpcoming ? '🕐' : '🔒'}
        </div>
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>
          {isUpcoming ? 'Phiếu khảo sát chưa mở' : 'Phiếu khảo sát đã kết thúc'}
        </div>
        {batch && (
          <div style={{ fontSize: 13.5, color: '#b45309', lineHeight: 1.7 }}>
            {batch.title}
            {isUpcoming && (
              <div style={{ marginTop: 6 }}>
                Mở từ {new Date(batch.startDate).toLocaleDateString('vi-VN')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
