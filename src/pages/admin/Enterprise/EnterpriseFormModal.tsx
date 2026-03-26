import { useState } from "react";
import { Modal, Form, Input, Select, Row, Col } from "antd";
import {
  ALL_FACULTIES, ENTERPRISE_SIZES, FACULTY_VI_NAME, INDUSTRIES,
  type Enterprise,
} from "../../../feature/enterprise/type";

interface Props {
  open: boolean;
  ent: Enterprise | null;
  onClose: () => void;
  onSave: (v: Partial<Enterprise>) => Promise<void>;
}

export  function EditEnterpriseModal({ open, ent, onClose, onSave }: Props) {
  const [form]   = Form.useForm();
  const [saving, setSaving] = useState(false);

  const afterOpenChange = (isOpen: boolean) => {
    if (isOpen && ent) form.setFieldsValue(ent);
    else form.resetFields();
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    setSaving(true);
    await onSave(values);
    setSaving(false);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="✏️ Chỉnh sửa doanh nghiệp" open={open}
      onOk={handleOk} onCancel={onClose}
      okText="Lưu thay đổi" cancelText="Hủy" width={580}
      confirmLoading={saving}
      afterOpenChange={afterOpenChange}
      okButtonProps={{ style: { background: ent?.color ?? "#7c3aed", border: "none" } }}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={14}><Form.Item name="name" label="Tên doanh nghiệp" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={10}><Form.Item name="abbr" label="Tên viết tắt" rules={[{ required: true }]}><Input maxLength={6} /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="industry" label="Ngành nghề">
              <Select>
                {INDUSTRIES.map(i => <Select.Option key={i} value={i}>{i}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="size" label="Quy mô nhân sự">
              <Select placeholder="Chọn quy mô">
                {ENTERPRISE_SIZES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="faculties" label="Khoa đối tác">
          <Select mode="multiple" allowClear placeholder="Chọn khoa liên kết">
            {ALL_FACULTIES.map(k => (
              <Select.Option key={k} value={k}>
                <span style={{ color: FACULTY_VI_NAME[k] }}>●</span> {FACULTY_VI_NAME[k]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}><Form.Item name="email" label="Email"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item name="phone" label="Điện thoại"><Input /></Form.Item></Col>
        </Row>
        <Form.Item name="website" label="Website"><Input /></Form.Item>
        <Form.Item name="address" label="Địa chỉ"><Input /></Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}