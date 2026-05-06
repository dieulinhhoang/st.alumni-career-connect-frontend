import { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, Space } from "antd";
import dayjs from "dayjs";
import {
  FACULTY_VI_NAME,
  type Job, type JobFormValues,
} from "../../../feature/enterprise/type";

interface Props {
  open: boolean;
  job: Job | null;
  entColor: string;
  entFaculties: string[];
  onClose: () => void;
  onSave: (values: JobFormValues) => Promise<void>;
}

export function JobFormModal({ open, job, entColor, entFaculties, onClose, onSave }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (job) {
        form.setFieldsValue({
          ...job,
          deadline: job.deadline ? dayjs(job.deadline, 'DD/MM/YYYY') : undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, job]);

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSave({
      ...values,
      deadline: values.deadline?.format('DD/MM/YYYY'),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title={job ? 'Chỉnh sửa tin tuyển dụng' : 'Thêm tin tuyển dụng'}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="ok" type="primary" style={{ background: entColor, border: 'none' }} onClick={handleOk}>
          {job ? 'Cập nhật' : 'Thêm tin'}
        </Button>,
      ]}
      width={560}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
        <Form.Item name="title" label="Vị trí tuyển dụng" rules={[{ required: true }]}>
          <Input placeholder="VD: Lập trình viên Backend" />
        </Form.Item>
        <Space style={{ display: 'flex', gap: 12 }} align="start">
          <Form.Item name="location" label="Địa điểm" rules={[{ required: true }]} style={{ flex: 1 }}>
            <Input placeholder="Hà Nội" />
          </Form.Item>
          <Form.Item name="salary" label="Mức lương" style={{ flex: 1 }}>
            <Input placeholder="15-25 triệu" />
          </Form.Item>
        </Space>
        <Form.Item name="deadline" label="Hạn nộp hồ sơ">
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
        </Form.Item>
        <Form.Item name="tags" label="Kỹ năng yêu cầu">
          <Select mode="tags" placeholder="Nhập kỹ năng, nhấn Enter" />
        </Form.Item>
        <Form.Item name="faculties" label="Khoa phù hợp">
          <Select
            mode="multiple"
            placeholder="Chọn khoa"
            options={entFaculties.map(k => ({
              value: k,
              label: FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] ?? k,
            }))}
          />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái" initialValue="active">
          <Select options={[
            { value: 'active', label: 'Đang tuyển' },
            { value: 'closed', label: 'Đã đóng' },
          ]} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
