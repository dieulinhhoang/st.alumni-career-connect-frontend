import type React from 'react'

interface RichTextDisplayProps {
  text: string
  style?: React.CSSProperties
}

export function RichTextDisplay({ text, style }: RichTextDisplayProps) {
  return (
    <span
      style={style}
      dangerouslySetInnerHTML={{
        __html: text
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>'),
      }}
    />
  )
}
