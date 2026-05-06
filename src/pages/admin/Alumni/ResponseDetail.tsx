import { useEffect } from 'react';
import { Card, Tag, Button, Spin, Divider, Typography, Space } from 'antd';
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined, BankOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useResponseDetail } from '../../../feature/alumni/hooks/useResponseDetail';

const { Title, Text } = Typography;

export default function ResponseDetail() {
  const { responseId } = useParams<{ responseId: string }>();
  const navigate = useNavigate();
  const { response, loading, fetchDetail } = useResponseDetail(responseId);

  useEffect(() => { if (responseId) fetchDetail(); }, [responseId]);

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (!response) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <Text type="secondary">Không tìm thấy phản hồi</Text>
      <br />
      <Button style={{ marginTop: 12 }} onClick={() => navigate(-1)}>Quay lại</Button>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 0 40px' }}>
      <Button
        icon={<ArrowLeftOutlined />} type="text"
        style={{ marginBottom: 16, color: '#6b7280', padding: '0 4px' }}
        onClick={() => navigate(-1)}
      >
        Quay lại
      </Button>

      {/* Header */}
      <Card style={{ borderRadius: 14, marginBottom: 20, border: '1px solid #ede9fe' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#7c3aed',
          }}>
            {response.studentName?.[0]?.toUpperCase()}
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>{response.studentName}</Title>
            <Space size={8} style={{ marginTop: 4 }}>
              <Tag icon={<UserOutlined />} color="purple">{response.studentCode}</Tag>
              {response.faculty && <Tag icon={<BankOutlined />} color="blue">{response.faculty}</Tag>}
              {response.submittedAt && (
                <Tag icon={<CalendarOutlined />} color="default">{response.submittedAt}</Tag>
              )}
            </Space>
          </div>
        </div>
      </Card>

      {/* Answers */}
      {response.sections?.map((section: any, si: number) => (
        <Card
          key={si}
          style={{ borderRadius: 14, marginBottom: 16, border: '1px solid #f3f4f6' }}
          title={<span style={{ fontWeight: 700 }}>{section.title}</span>}
        >
          {section.questions?.map((q: any, qi: number) => (
            <div key={qi} style={{ marginBottom: qi < section.questions.length - 1 ? 20 : 0 }}>
              <div style={{ fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                {qi + 1}. {q.question}
              </div>
              <div style={{
                background: '#f9fafb', borderRadius: 8, padding: '10px 14px',
                color: '#1f2937', lineHeight: 1.7
              }}>
                {Array.isArray(q.answer)
                  ? q.answer.join(', ')
                  : q.answer ?? <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Chưa trả lời</span>
                }
              </div>
              {qi < section.questions.length - 1 && <Divider style={{ margin: '16px 0 0' }} />}
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}
