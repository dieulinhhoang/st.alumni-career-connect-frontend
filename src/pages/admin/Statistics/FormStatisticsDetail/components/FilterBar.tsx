import { Button, Card, Col, Row, Select, Typography } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import type { FormOption, StatisticalQuestion } from '../../../../../feature/statistics/types'

const { Text } = Typography

interface Props {
  forms: FormOption[]
  questions: StatisticalQuestion[]
  formId?: number
  questionId?: string
  onChangeForm: (value: number) => void
  onChangeQuestion: (value: string) => void
}

export function FilterBar({
  forms,
  questions,
  formId,
  questionId,
  onChangeForm,
  onChangeQuestion,
}: Props) {
  return (
    <Card bordered={false}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={10}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Biểu mẫu
          </Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Chọn biểu mẫu"
            value={formId}
            onChange={onChangeForm}
            options={forms.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </Col>

        <Col xs={24} md={10}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Câu hỏi thống kê
          </Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Chọn câu hỏi"
            value={questionId}
            onChange={onChangeQuestion}
            options={questions.map((item) => ({
              label: item.title,
              value: item.id,
            }))}
            disabled={!formId}
          />
        </Col>

        <Col xs={24} md={4}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Hành động
          </Text>
          <Button block icon={<ReloadOutlined />}>
            Làm mới
          </Button>
        </Col>
      </Row>
    </Card>
  )
}