import React, { useState } from 'react';
import { Input, Space, Button, Popover } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Nhập mô tả...",
  minHeight = 100,
}) => {
  const [showToolbar, setShowToolbar] = useState(false);

  const applyFormat = (tag: string, attr?: string, attrValue?: string) => {
    const textarea = document.getElementById('rich-text-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let wrappedText = '';
    switch (tag) {
      case 'bold':
        wrappedText = `**${selectedText}**`;
        break;
      case 'italic':
        wrappedText = `*${selectedText}*`;
        break;
      case 'underline':
        wrappedText = `__${selectedText}__`;
        break;
      case 'ol':
        wrappedText = selectedText.split('\n').map(line => `1. ${line}`).join('\n');
        break;
      case 'ul':
        wrappedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        break;
      default:
        return;
    }
    
    const newValue = value.substring(0, start) + wrappedText + value.substring(end);
    onChange(newValue);
  };

  // Render HTML from markdown-like syntax
  const renderHTML = (text: string) => {
    if (!text) return '';
    
    let html = text
      // Bold: **text** -> <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic: *text* -> <em>text</em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Underline: __text__ -> <u>text</u>
      .replace(/__(.*?)__/g, '<u>$1</u>')
      // Line break
      .replace(/\n/g, '<br/>');
    
    return html;
  };

  return (
    <div 
      style={{ border: '1px solid #d9d9d9', borderRadius: 6, overflow: 'hidden' }}
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => setShowToolbar(false)}
    >
      {showToolbar && (
        <div style={{ 
          padding: '8px 12px', 
          borderBottom: '1px solid #f0f0f0', 
          background: '#fafafa',
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap',
        }}>
          <Button size="small" icon={<BoldOutlined />} onClick={() => applyFormat('bold')} />
          <Button size="small" icon={<ItalicOutlined />} onClick={() => applyFormat('italic')} />
          <Button size="small" icon={<UnderlineOutlined />} onClick={() => applyFormat('underline')} />
          <Button size="small" icon={<OrderedListOutlined />} onClick={() => applyFormat('ol')} />
          <Button size="small" icon={<UnorderedListOutlined />} onClick={() => applyFormat('ul')} />
        </div>
      )}
      
      <div style={{ position: 'relative' }}>
        <TextArea
          id="rich-text-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoSize={{ minRows: 3, maxRows: 10 }}
          style={{ 
            border: 'none', 
            resize: 'vertical',
            fontFamily: 'inherit',
            minHeight,
          }}
        />
      </div>
      
      {/* Preview */}
      {value && (
        <div style={{ 
          padding: '12px', 
          borderTop: '1px solid #f0f0f0', 
          background: '#fafafa',
          fontSize: 13,
        }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 8 }}>Xem trước:</div>
          <div 
            dangerouslySetInnerHTML={{ __html: renderHTML(value) }}
            style={{ lineHeight: 1.6 }}
          />
        </div>
      )}
    </div>
  );
};