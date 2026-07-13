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

// ── Loader: nạp Google Maps JS (Places, thư viện mới) 1 lần duy nhất cho toàn app ──
let cachedKey: string | null = null
let scriptPromise: Promise<boolean> | null = null

// Đảm bảo dropdown gợi ý hiển thị trên modal/antd
function ensurePacStyle() {
  if (document.getElementById('gmaps-pac-style')) return
  const style = document.createElement('style')
  style.id = 'gmaps-pac-style'
  style.textContent =
    '.pac-container{z-index:20000!important}' +
    'gmp-place-autocomplete{z-index:20000;width:100%}'
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
  if ((window as any).google?.maps?.places?.PlaceAutocompleteElement) {
    return Promise.resolve(true)
  }
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
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}` +
      `&libraries=places&language=vi&region=VN&loading=async&v=weekly`
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })
  return scriptPromise
}

/**
 * Lấy tỉnh/thành từ addressComponents (định dạng thư viện Places mới: longText/shortText).
 * Nếu địa điểm KHÔNG thuộc Việt Nam → trả về "Nước ngoài" (không cần ghi rõ tỉnh),
 * để báo cáo gom nhóm chung như câu hỏi chọn tỉnh.
 */
function extractProvince(components: any[]): string {
  const country = components?.find((c) => c.types?.includes('country'))
  if (country && country.shortText && country.shortText !== 'VN') return 'Nước ngoài'
  const comp = components?.find((c) =>
    c.types?.includes('administrative_area_level_1'),
  )
  return comp?.longText || ''
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
  const hostRef = useRef<HTMLDivElement>(null)
  const elRef = useRef<any>(null)
  const [ready, setReady] = useState(false)
  const [noKey, setNoKey] = useState(false)

  // Ref để callback event luôn đọc được value mới nhất (tránh stale closure)
  const vRef = useRef(v)
  vRef.current = v
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const inputStyle: React.CSSProperties = {
    ...baseStyle,
    ...(hasError ? errorStyle : {}),
  }

  // Nạp key + script (chỉ khi cần dùng autocomplete)
  useEffect(() => {
    if (readOnly) return
    let cancelled = false
    fetchMapsKey().then((key) => {
      if (cancelled) return
      if (!key) { setNoKey(true); return }
      loadGoogleMaps(key).then((ok) => {
        if (!cancelled) (ok ? setReady(true) : setNoKey(true))
      })
    })
    return () => { cancelled = true }
  }, [readOnly])

  // Tạo <gmp-place-autocomplete> khi thư viện sẵn sàng
  useEffect(() => {
    if (!ready || readOnly || !hostRef.current) return
    const g = (window as any).google
    const PlaceAutocompleteElement = g?.maps?.places?.PlaceAutocompleteElement
    if (!PlaceAutocompleteElement) { setNoKey(true); return }

    ensurePacStyle()

    const el = new PlaceAutocompleteElement()
    el.style.width = '100%'
    // Giá trị địa chỉ đã có (khi xem/sửa lại) → hiển thị sẵn nếu API hỗ trợ
    if (vRef.current.address) {
      try { (el as any).value = vRef.current.address } catch { /* element mới không cho set value */ }
    }
    hostRef.current.appendChild(el)
    elRef.current = el

    // Sự kiện chọn địa điểm (GA: 'gmp-select' với placePrediction)
    const handler = async (e: any) => {
      try {
        const prediction = e?.placePrediction
        const place = prediction ? prediction.toPlace() : e?.place
        if (!place) return
        await place.fetchFields?.({ fields: ['formattedAddress', 'addressComponents'] })
        const address = place.formattedAddress || ''
        const city = extractProvince(place.addressComponents || [])
        onChangeRef.current?.({ address, city: city || vRef.current.city })
      } catch {
        /* bỏ qua lỗi lấy chi tiết địa điểm */
      }
    }
    el.addEventListener('gmp-select', handler)
    // Fallback cho phiên bản cũ hơn của element
    el.addEventListener('gmp-placeselect', handler)

    return () => {
      el.removeEventListener('gmp-select', handler)
      el.removeEventListener('gmp-placeselect', handler)
      el.remove()
      elRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, readOnly])

  // ── Fallback: chưa có key / lỗi tải / chế độ chỉ đọc → ô text thường ──
  if (readOnly || noKey) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="text"
          readOnly={readOnly}
          placeholder="Địa chỉ"
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Google PlaceAutocompleteElement được gắn vào đây */}
      <div ref={hostRef} style={{ width: '100%' }} />
      <input
        type="text"
        placeholder="Tỉnh / Thành phố"
        value={v.city ?? ''}
        onChange={(e) => onChange?.({ ...v, city: e.target.value })}
        style={baseStyle}
      />
    </div>
  )
}
