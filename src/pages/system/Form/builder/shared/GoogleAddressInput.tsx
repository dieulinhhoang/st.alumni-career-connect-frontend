import React, { useEffect, useRef, useState } from 'react'
import api from '../../../../../libs/api'

/**
 * Giá trị câu trả lời cho câu hỏi loại 'address'.
 * `city` = tỉnh/thành, được tách tự động từ Google Places (administrative_area_level_1)
 * để báo cáo có thể gom nhóm theo tỉnh/thành.
 */
export interface AddressValue {
  address?: string
  city?: string
}

interface GoogleAddressInputProps {
  value?: AddressValue
  onChange?: (v: AddressValue) => void
  readOnly?: boolean
  hasError?: boolean
  baseStyle?: React.CSSProperties
  errorStyle?: React.CSSProperties
}

// ── Loader: nạp Google Maps JS (Places) 1 lần duy nhất cho toàn app ──────────
let cachedKey: string | null = null
let scriptPromise: Promise<boolean> | null = null

// Đảm bảo dropdown gợi ý (.pac-container gắn vào <body>) hiển thị trên modal/antd
function ensurePacStyle() {
  if (document.getElementById('gmaps-pac-style')) return
  const style = document.createElement('style')
  style.id = 'gmaps-pac-style'
  style.textContent = '.pac-container{z-index:20000!important}'
  document.head.appendChild(style)
}

async function fetchMapsKey(): Promise<string> {
  if (cachedKey !== null) return cachedKey
  try {
    const { data } = await api.get('/service-config/public/google_maps_api_key')
    cachedKey = data?.value || ''
  } catch {
    cachedKey = ''
  }
  return cachedKey
}

function loadGoogleMaps(key: string): Promise<boolean> {
  if ((window as any).google?.maps?.places) return Promise.resolve(true)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<boolean>((resolve) => {
    const existing = document.getElementById('google-maps-places') as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve(true))
      existing.addEventListener('error', () => resolve(false))
      return
    }
    const script = document.createElement('script')
    script.id = 'google-maps-places'
    script.async = true
    script.defer = true
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}` +
      `&libraries=places&language=vi&region=VN`
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })
  return scriptPromise
}

/** Lấy tỉnh/thành (administrative_area_level_1) từ danh sách address_components */
function extractProvince(components: any[]): string {
  const comp = components?.find((c) =>
    c.types?.includes('administrative_area_level_1'),
  )
  return comp?.long_name || ''
}

export const GoogleAddressInput: React.FC<GoogleAddressInputProps> = ({
  value,
  onChange,
  readOnly = false,
  hasError = false,
  baseStyle,
  errorStyle,
}) => {
  const v: AddressValue = value ?? {}
  const inputRef = useRef<HTMLInputElement>(null)
  const acRef = useRef<any>(null)
  const [ready, setReady] = useState(false)
  const [noKey, setNoKey] = useState(false)

  const inputStyle: React.CSSProperties = {
    ...baseStyle,
    ...(hasError ? errorStyle : {}),
  }

  useEffect(() => {
    let cancelled = false
    fetchMapsKey().then((key) => {
      if (cancelled) return
      if (!key) { setNoKey(true); return }
      loadGoogleMaps(key).then((ok) => {
        if (!cancelled) (ok ? setReady(true) : setNoKey(true))
      })
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!ready || readOnly || !inputRef.current) return
    const g = (window as any).google
    if (!g?.maps?.places) return

    ensurePacStyle()
    const ac = new g.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'vn' },
      fields: ['address_components', 'formatted_address'],
      types: ['geocode'],
    })
    acRef.current = ac

    const listener = ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      if (!place) return
      const address = place.formatted_address || inputRef.current?.value || ''
      const city = extractProvince(place.address_components || [])
      onChange?.({ address, city: city || v.city })
    })

    return () => {
      listener?.remove?.()
      // Gỡ dropdown .pac-container do widget tạo ra khi unmount
      g.maps.event.clearInstanceListeners(ac)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, readOnly])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <input
        ref={inputRef}
        type="text"
        readOnly={readOnly}
        placeholder={
          noKey ? 'Địa chỉ' : 'Nhập & chọn địa chỉ (gợi ý từ Google Maps)'
        }
        value={v.address ?? ''}
        onChange={(e) => onChange?.({ ...v, address: e.target.value })}
        style={inputStyle}
        autoComplete="off"
      />
      <input
        type="text"
        readOnly={readOnly}
        placeholder="Tỉnh / Thành phố"
        value={v.city ?? ''}
        onChange={(e) => onChange?.({ ...v, city: e.target.value })}
        style={baseStyle}
      />
    </div>
  )
}
