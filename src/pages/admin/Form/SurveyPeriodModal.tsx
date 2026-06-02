import { useEffect } from 'react'
import {
  Modal, Form, Input, DatePicker, Select, Switch,
  Typography, Divider,
} from 'antd'
import dayjs from 'dayjs'
import type { SurveyPeriod } from '../../../feature/form/types'
import { MOCK_FORMS, SURVEY_PERIOD_STATUS_CONFIG } from '../../../feature/form/constants'

const { Text } = Typography

interface Props {
  open: boolean
  initialValues: SurveyPeriod | null
  onClose: () => void
  onSave: (data: Omit<SurveyPeriod, 'id' | 'totalResponses' | 'created_at' | 'createdBy'>) => void
}

export default function SurveyPeriodModal({ open, initialValues, onClose, onSave }: Props) {
  const [form] = Form.useForm()
  const isEdit = !!initialValues

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          title:               initialValues.title,
          description:         initialValues.description,
          formId:              initialValues.formId,
          targetAudience:      initialValues.targetAudience,
          targetYear:          initialValues.targetYear,
          totalInvited:        initialValues.totalInvited,
          requiresVerification: initialValues.requiresVerification,
          status:              initialValues.status,
          dateRange: [
            dayjs(initialValues.startDate),
            dayjs(initialValues.endDate),
          ],
        })
      } else {
        form.resetFields()
        form.setFieldsValue({ requiresVerification: true, status: 'draft' })
      }
    }
  }, [open, initialValues, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    const [start, end] = values.dateRange
    const selectedForm = MOCK_FORMS.find((f) => f.id === values.formId)
    onSave({
      title:               values.title,
      description:         values.description,
      formId:              values.formId,
      formName:            selectedForm?.name ?? '',
      startDate:           start.format('YYYY-MM-DD'),
      endDate:             end.format('YYYY-MM-DD'),
      targetAudience:      values.targetAudience,
      targetYear:          values.targetYear ? Number(values.targetYear) : undefined,
      totalInvited:        values.totalInvited ? Number(values.totalInvited) : 0,
      requiresVerification: values.requiresVerification ?? true,
      status:              values.status ?? 'draft',
    })
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title={
        <span style={{ fontWeight: 700, fontSize: 16 }}>
          {isEdit ? 'Chỉnh sửa đợt khảo sát' : 'Tạo đợt khảo sát mới'}
        </span>
      }
      okText={isEdit ? 'Lưu thay đổi' : 'Tạo đợt'}
      cancelText="Hủy"
      okButtonProps={{ style: { background: '#1D9E75', borderColor: '#1D9E75' } }}
      width={580}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false} style={{ marginTop: 8 }}>

        {/* Tên đợt */}
        <Form.Item
          name="title"
          label={<Text strong>Tên đợt khảo sát</Text>}
          rules={[{ required: true, message: 'Vui lòng nhập tên đợt' }]}
        >
          <Input placeholder="VD: Đợt khảo sát việc làm – Khóa 67 (2025)" />
        </Form.Item>

        {/* Mô tả */}
        <Form.Item name="description" label={<Text strong>Mô tả</Text>}>
          <Input.TextArea rows={2} placeholder="Mô tả ngắn về mục đích đợt khảo sát" />
        </Form.Item>

        {/* Biểu mẫu */}
        <Form.Item
          name="formId"
          label={<Text strong>Biểu mẫu sử dụng</Text>}
          rules={[{ required: true, message: 'Vui lòng chọn biểu mẫu' }]}
        >
          <Select
            placeholder="Chọn biểu mẫu..."
            options={MOCK_FORMS.filter((f) => f.id !== null).map((f) => ({
              value: f.id as number,
              label: f.name,
            }))}
          />
        </Form.Item>

        {/* Thời gian */}
        <Form.Item
          name="dateRange"
          label={<Text strong>Thời gian khảo sát</Text>}
          rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
        >
          <DatePicker.RangePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
          />
        </Form.Item>

        {/* Đối tượng + năm */}
        <Flex gap={12}>
          <Form.Item
            name="targetAudience"
            label={<Text strong>Đối tượng khảo sát</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập đối tượng' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="VD: Sinh viên tốt nghiệp Khóa 67" />
          </Form.Item>
          <Form.Item
            name="targetYear"
            label={<Text strong>Năm tốt nghiệp</Text>}
            style={{ width: 140 }}
          >
            <Input type="number" placeholder="VD: 2025" min={2000} max={2099} />
          </Form.Item>
        </Flex>

        {/* Số lượng mời */}
        <Form.Item name="totalInvited" label={<Text strong>Số lượng mời (dự kiến)</Text>}>
          <Input type="number" placeholder="VD: 1200" min={0} />
        </Form.Item>

        <Divider style={{ margin: '12px 0' }} />

        {/* Trạng thái + xác thực */}
        <Flex gap={24}>
          <Form.Item name="status" label={<Text strong>Trạng thái</Text>} style={{ flex: 1 }}>
            <Select
              options={Object.entries(SURVEY_PERIOD_STATUS_CONFIG).map(([k, v]) => ({
                value: k,
                label: v.label,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="requiresVerification"
            label={<Text strong>Yêu cầu xác thực danh tính</Text>}
            valuePropName="checked"
          >
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
        </Flex>

      </Form>
    </Modal>
  )
}

// Need Flex in scope
import { Flex } from 'antd'
