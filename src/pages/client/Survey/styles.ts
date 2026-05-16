import type React from 'react'

export const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: '1.5px solid #e2e8f0', fontSize: 14, color: '#1e293b',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color .13s, box-shadow .13s', background: '#fff',
}

export function focusIn(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#1D9E75'
  e.target.style.boxShadow = '0 0 0 3px #1D9E7522'
}

export function focusOut(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#e2e8f0'
  e.target.style.boxShadow = 'none'
}
