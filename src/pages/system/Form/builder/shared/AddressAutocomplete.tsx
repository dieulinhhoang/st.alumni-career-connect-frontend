import React, { useEffect, useState } from 'react'
import api from '../../../../../libs/api'
import type { AddressValue } from './GoogleAddressInput'
import { GoogleAddressInput } from './GoogleAddressInput'
import { GoongAddressInput } from './GoongAddressInput'
import { GeoapifyAddressInput } from './GeoapifyAddressInput'

export type AddressProvider = 'google' | 'geoapify' | 'goong' | 'none'

interface AddressAutocompleteProps {
  value?: AddressValue
  onChange?: (v: AddressValue) => void
  readOnly?: boolean
  hasError?: boolean
  baseStyle?: React.CSSProperties
  errorStyle?: React.CSSProperties
}

// Cache provider cho toàn app (đọc 1 lần)
let cachedProvider: AddressProvider | null = null

async function fetchProvider(): Promise<AddressProvider> {
  if (cachedProvider !== null) return cachedProvider
  try {
    const { data } = await api.get('/service-config/public/address_provider')
    const p = (data?.value || 'none') as AddressProvider
    cachedProvider = ['google', 'geoapify', 'goong', 'none'].includes(p) ? p : 'none'
  } catch {
    cachedProvider = 'none'
  }
  return cachedProvider
}

/** Ô địa chỉ nhập tay (khi không dùng nhà cung cấp gợi ý) */
function ManualAddress({ value, onChange, readOnly, hasError, baseStyle, errorStyle }: AddressAutocompleteProps) {
  const v = value ?? {}
  const inputStyle = { ...baseStyle, ...(hasError ? errorStyle : {}) }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <input
        type="text" readOnly={readOnly} placeholder="Địa chỉ" value={v.address ?? ''}
        onChange={(e) => onChange?.({ ...v, address: e.target.value })}
        style={inputStyle} autoComplete="off"
      />
      <input
        type="text" readOnly={readOnly} placeholder="Tỉnh / Thành phố" value={v.city ?? ''}
        onChange={(e) => onChange?.({ ...v, city: e.target.value })}
        style={baseStyle}
      />
    </div>
  )
}

/**
 * Chọn nhà cung cấp gợi ý địa chỉ theo cấu hình `address_provider` (service-config).
 * google | geoapify | goong | none (nhập tay). Giá trị luôn là `{ address, city }`.
 */
export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = (props) => {
  const [provider, setProvider] = useState<AddressProvider | null>(cachedProvider)

  useEffect(() => {
    let cancelled = false
    fetchProvider().then((p) => { if (!cancelled) setProvider(p) })
    return () => { cancelled = true }
  }, [])

  // Trong lúc chờ đọc cấu hình → ô nhập tay tạm (tránh nhấp nháy component)
  if (provider === null || provider === 'none') return <ManualAddress {...props} />
  if (provider === 'google') return <GoogleAddressInput {...props} />
  if (provider === 'goong') return <GoongAddressInput {...props} />
  if (provider === 'geoapify') return <GeoapifyAddressInput {...props} />
  return <ManualAddress {...props} />
}
