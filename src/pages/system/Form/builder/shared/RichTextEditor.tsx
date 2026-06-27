import React, { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  minHeight?: number
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value, onChange, placeholder = 'Nhập nội dung...', minHeight = 120,
}) => {
  const editorRef = useRef<any>(null)
  const plugins = ['advlist','autolink','lists','link','image','charmap','preview','anchor','searchreplace','visualblocks','code','fullscreen','insertdatetime','media','table','help','wordcount','quickbars']
  const toolbar = ['undo redo | blocks | bold italic underline forecolor backcolor','alignleft aligncenter alignright alignjustify','bullist numlist outdent indent | removeformat | help | image media']
  return (
    <Editor
      apiKey={import.meta.env.VITE_API_TINYMCE_KEY}
      onInit={(evt, editor) => { editorRef.current = editor }}
      value={value}
      onEditorChange={(v) => onChange(v)}
      init={{
        height: minHeight, menubar: false, plugins, toolbar: toolbar.join(' | '), placeholder,
        quickbars_selection_toolbar: 'bold italic underline quicklink h2 h3 blockquote',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; line-height: 1.6; padding: 12px }',
      }}
    />
  )
}
