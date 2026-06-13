import { useState } from 'react'
import { Input } from 'antd'

interface InlineInputProps {
  value: string
  onChange: (v: string) => void
  style?: React.CSSProperties
  multiline?: boolean
  placeholder?: string
}

export function InlineInput({ value, onChange, style, multiline, placeholder }: InlineInputProps) {
  const [hover, setHover] = useState(false)
  const base: React.CSSProperties = {
    background: 'transparent', border: 'none', outline: 'none',
    borderBottom: hover ? '1.5px dashed #ccc' : '1.5px solid transparent',
    width: '100%', fontFamily: 'inherit', resize: 'none', cursor: 'text',
    transition: 'border-color .15s', ...style,
  }
  return multiline ? (
    <Input.TextArea rows={2} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, display: 'block' }} />
  ) : (
    <Input value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={base} />
  )
}
