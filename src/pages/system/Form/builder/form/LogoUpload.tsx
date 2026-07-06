import { useState, useRef } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { message } from 'antd'

const FALLBACK = 'https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png'

interface LogoUploadProps {
  src?: string
  size: number
  editable: boolean
  onUpload?: (dataUrl: string) => void
}

export function LogoUpload({ src, size, editable, onUpload }: LogoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [hover, setHover] = useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { message.error('Chỉ chấp nhận file ảnh'); return }
    if (file.size > 2 * 1024 * 1024) { message.error('File quá lớn (tối đa 2MB)'); return }
    const reader = new FileReader()
    reader.onload = () => onUpload?.(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
      onMouseEnter={() => editable && setHover(true)} onMouseLeave={() => setHover(false)}>
      <img src={src || '/logo/vua.png'} alt="Logo"
        style={{ width: size, height: 'auto', objectFit: 'contain', border: hover && editable ? '2px dashed #6b7280' : 'none', transition: 'all .2s', display: 'block' }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK }} />
      {editable && hover && (
        <div onClick={() => fileRef.current?.click()}
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4 }}>
          <UploadOutlined style={{ color: '#fff', fontSize: 18 }} />
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 600 }}>Đổi logo</span>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  )
}
