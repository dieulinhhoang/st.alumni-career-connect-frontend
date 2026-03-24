import { useState } from "react";
import { Modal, Form, Input, Select, Tag, Row, Col } from "antd";
import {
  ALL_FACULTIES, FACULTY_VI_NAME, JOB_LOCATIONS,
  type Job, type JobFormValues,
} from "../../../feature/enterprise/type";

interface Props {
  open: boolean;
  job: Job | null;
  entColor: string;
  entFaculties: string[];
  onClose: () => void;
  onSave: (data: JobFormValues) => Promise<void>;
}

export function JobFormModal({ open, job, entColor, entFaculties, onClose, onSave }: Props) {
  const [form]     = Form.useForm();
  const [saving,   setSaving]   = useState(false);
  const [tags,     setTags]     = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const afterOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      form.setFieldsValue(job ?? { status: "active" });
      setTags(job?.tags ?? []);
    } else {
      form.resetFields();
      setTags([]);
      setTagInput("");
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput("");
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    setSaving(true);
    await onSave({ ...values, tags });
    setSaving(false);
    onClose();
  };

  return (
    <Modal
      title={job ? "Chỉnh sửa tin tuyển dụng" : "Thêm tin tuyển dụng"}
      open={open} onOk={handleOk} onCancel={onClose}
      okText={job ? "Lưu thay đổi" : "Đăng tin"} cancelText="Hủy" width={580}
      confirmLoading={saving}
      afterOpenChange={afterOpenChange}
      okButtonProps={{ style: { background: entColor, border: "none" } }}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="title" label="Vị trí tuyển dụng" rules={[{ required: true, message: "Nhập tên vị trí" }]}>
          <Input placeholder="VD: Lập trình viên Backend" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="location" label="Địa điểm" rules={[{ required: true, message: "Chọn địa điểm" }]}>
              <Select placeholder="Chọn tỉnh/thành">
                {JOB_LOCATIONS.map(l => <Select.Option key={l} value={l}>{l}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="salary" label="Mức lương">
              <Input placeholder="VD: 15–25 triệu" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="faculties" label="Khoa phù hợp">
          <Select mode="multiple" allowClear placeholder="Chọn khoa liên quan">
            {(entFaculties.length > 0 ? entFaculties : [...ALL_FACULTIES]).map(k => (
              <Select.Option key={k} value={k}>
                <span style={{ color: FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] }}>●</span>{" "}
                {FACULTY_VI_NAME[k as keyof typeof FACULTY_VI_NAME] ?? k}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kỹ năng / Tags">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            {tags.map(t => (
              <Tag key={t} closable onClose={() => setTags(p => p.filter(x => x !== t))} color="purple" style={{ fontSize: 12 }}>
                {t}
              </Tag>
            ))}
          </div>
          <Input.Search
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onSearch={addTag}
            onPressEnter={e => { e.preventDefault(); }}
            placeholder="Nhập kỹ năng rồi nhấn Enter hoặc +"
            enterButton="+"
            style={{ maxWidth: 300 }}
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="deadline" label="Hạn nộp hồ sơ">
              <Input placeholder="DD/MM/YYYY (bỏ trống nếu chưa có)" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Trạng thái" initialValue="active">
              <Select>
                <Select.Option value="active">Đang tuyển</Select.Option>
                <Select.Option value="closed">Đã đóng</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}