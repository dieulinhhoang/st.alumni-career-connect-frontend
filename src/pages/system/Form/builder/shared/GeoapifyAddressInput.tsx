import React, { useEffect, useState } from 'react'
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'
import api from '../../../../../libs/api'
import type { AddressValue } from './GoogleAddressInput'

/**
 * Ô địa chỉ dùng Geoapify Geocoder.
 * Chuẩn hoá về contract `{ address, city }` — `city` = state (tỉnh/thành) để báo cáo gom nhóm.
 */

interface GeoapifyAddressInputProps {
  value?: AddressValue
  onChange?: (v: AddressValue) => void
  readOnly?: boolean
  hasError?: boolean
  baseStyle?: React.CSSProperties
  errorStyle?: React.CSSProperties
}

let cachedKey: string | null = null

async function fetchGeoapifyKey(): Promise<string> {
  if (cachedKey !== null) return cachedKey
  try {
    const { data } = await api.get('/service-config/public/geoapify_api_key')
    cachedKey = data?.value || ''
  } catch {
    cachedKey = ''
  }
  return cachedKey
}

export const GeoapifyAddressInput: React.FC<GeoapifyAddressInputProps> = ({
  value,
  onChange,
  readOnly = false,
  hasError = false,
  baseStyle,
  errorStyle,
}) => {
  const v: AddressValue = value ?? {}
  const [key, setKey] = useState<string | null>(cachedKey)

  const inputStyle: React.CSSProperties = {
    ...baseStyle,
    ...(hasError ? errorStyle : {}),
  }

  useEffect(() => {
    if (readOnly) return
    let cancelled = false
    fetchGeoapifyKey().then((k) => { if (!cancelled) setKey(k) })
    return () => { cancelled = true }
  }, [readOnly])

  const handlePlaceSelect = (place: any) => {
    const props = place?.properties
    if (!props) return
    const address = props.formatted || ''
    const city = props.state || props.city || v.city || ''
    onChange?.({ address, city })
  }

  // ── Fallback: chỉ đọc / chưa có key → ô text thường ──
  if (readOnly || key === '') {
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

  if (!key) {
    // đang tải key
    return (
      <input type="text" placeholder="Địa chỉ" value={v.address ?? ''}
        onChange={(e) => onChange?.({ ...v, address: e.target.value })} style={inputStyle} />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative', width: '100%' }}>
        <GeoapifyContext apiKey={key}>
          <GeoapifyGeocoderAutocomplete
            value={v.address ?? ''}
            placeholder="Nhập & chọn địa chỉ (gợi ý từ Geoapify)"
            lang="vi"
            filterByCountryCode={['vn']}
            limit={7}
            placeSelect={handlePlaceSelect}
          />
        </GeoapifyContext>
      </div>
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
