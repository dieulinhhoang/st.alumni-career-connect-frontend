import React, { useEffect, useRef, useState } from 'react'
import api from '../../../../../libs/api'
import type { AddressValue } from './GoogleAddressInput'

/**
 * Ô địa chỉ dùng Goong.io (Goong Maps) — nhà cung cấp bản đồ Việt Nam.
 * - Gợi ý địa chỉ: GET https://rsapi.goong.io/Place/AutoComplete
 * - Chi tiết địa điểm: GET https://rsapi.goong.io/Place/Detail → lấy formatted_address + compound.province
 * `city` = compound.province (tỉnh/thành) để báo cáo gom nhóm.
 */

interface GoongAddressInputProps {
  value?: AddressValue
  onChange?: (v: AddressValue) => void
  readOnly?: boolean
  hasError?: boolean
  baseStyle?: React.CSSProperties
  errorStyle?: React.CSSProperties
}

interface Prediction {
  place_id: string
  description: string
}

let cachedKey: string | null = null

async function fetchGoongKey(): Promise<string> {
  if (cachedKey !== null) return cachedKey
  try {
    const { data } = await api.get('/service-config/public/goong_api_key')
    cachedKey = data?.value || ''
  } catch {
    cachedKey = ''
  }
  return cachedKey
}

export const GoongAddressInput: React.FC<GoongAddressInputProps> = ({
  value,
  onChange,
  readOnly = false,
  hasError = false,
  baseStyle,
  errorStyle,
}) => {
  const v: AddressValue = value ?? {}
  const [key, setKey] = useState<string | null>(cachedKey)
  const [text, setText] = useState(v.address ?? '')
  const [preds, setPreds] = useState<Prediction[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const inputStyle: React.CSSProperties = {
    ...baseStyle,
    ...(hasError ? errorStyle : {}),
  }

  // Đồng bộ khi value từ ngoài đổi (prefill / reset)
  useEffect(() => { setText(v.address ?? '') }, [v.address])

  // Nạp key
  useEffect(() => {
    if (readOnly) return
    let cancelled = false
    fetchGoongKey().then((k) => { if (!cancelled) setKey(k) })
    return () => { cancelled = true }
  }, [readOnly])

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const runAutocomplete = (input: string) => {
    if (!key || input.trim().length < 2) { setPreds([]); return }
    setLoading(true)
    fetch(
      `https://rsapi.goong.io/Place/AutoComplete?api_key=${encodeURIComponent(key)}` +
      `&input=${encodeURIComponent(input)}`,
    )
      .then((r) => r.json())
      .then((data) => {
        setPreds(Array.isArray(data?.predictions) ? data.predictions : [])
        setOpen(true)
      })
      .catch(() => setPreds([]))
      .finally(() => setLoading(false))
  }

  const handleInput = (val: string) => {
    setText(val)
    onChange?.({ ...v, address: val })
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runAutocomplete(val), 300)
  }

  const handleSelect = async (p: Prediction) => {
    setOpen(false)
    if (!key) return
    try {
      const r = await fetch(
        `https://rsapi.goong.io/Place/Detail?place_id=${encodeURIComponent(p.place_id)}` +
        `&api_key=${encodeURIComponent(key)}`,
      )
      const data = await r.json()
      const result = data?.result
      const address = result?.formatted_address || p.description
      const city = result?.compound?.province || v.city || ''
      setText(address)
      onChange?.({ address, city })
    } catch {
      // Lỗi lấy chi tiết → dùng luôn description
      setText(p.description)
      onChange?.({ ...v, address: p.description })
    }
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
        <input
          type="text"
          placeholder="Nhập & chọn địa chỉ (gợi ý từ Goong Maps)"
          value={text}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => { if (preds.length) setOpen(true) }}
          style={inputStyle}
          autoComplete="off"
        />
        {open && (loading || preds.length > 0) && (
          <div
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20000,
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
              marginTop: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
              maxHeight: 260, overflowY: 'auto',
            }}
          >
            {loading && preds.length === 0 ? (
              <div style={{ padding: '10px 14px', fontSize: 13, color: '#94a3b8' }}>Đang tìm…</div>
            ) : (
              preds.map((p) => (
                <div
                  key={p.place_id}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(p) }}
                  style={{
                    padding: '10px 14px', fontSize: 14, color: '#1e293b',
                    cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f0fdf4')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                >
                  {p.description}
                </div>
              ))
            )}
          </div>
        )}
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
