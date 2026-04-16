// FooterEditor.tsx
import React from 'react';
import { Input, Space } from 'antd';

const { TextArea } = Input;

interface FooterEditorProps {
  primaryText: string;
  secondaryText: string;
  onChange: (footer: { primaryText: string; secondaryText: string }) => void;
  editable?: boolean;
}

export const FooterEditor: React.FC<FooterEditorProps> = ({
  primaryText,
  secondaryText,
  onChange,
  editable = true,
}) => {
  if (!editable) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div 
          style={{ fontWeight: 700, marginBottom: 8 }}
          dangerouslySetInnerHTML={{ 
            __html: primaryText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
          }}
        />
        <div 
          style={{ fontStyle: 'italic' }}
          dangerouslySetInnerHTML={{ 
            __html: secondaryText.replace(/\*(.*?)\*/g, '<em>$1</em>') 
          }}
        />
      </div>
    );
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={12}>
      <div>
        <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>Dòng cảm ơn (in đậm)</div>
        <TextArea
          value={primaryText}
          onChange={(e) => onChange({ primaryText: e.target.value, secondaryText })}
          placeholder="Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!"
          autoSize={{ minRows: 1, maxRows: 3 }}
        />
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>Lời chúc (in nghiêng)</div>
        <TextArea
          value={secondaryText}
          onChange={(e) => onChange({ primaryText, secondaryText: e.target.value })}
          placeholder="Kính chúc Anh/Chị sức khỏe và thành công!"
          autoSize={{ minRows: 1, maxRows: 3 }}
        />
      </div>
    </Space>
  );
};