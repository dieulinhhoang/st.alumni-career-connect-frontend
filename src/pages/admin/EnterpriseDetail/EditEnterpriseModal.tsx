import { useState } from "react";
import { Modal, Form, Input, Select, Row, Col } from "antd";
import {
  ALL_FACULTIES, ENTERPRISE_SIZES, FACULTY_VI_NAME, INDUSTRIES,
  type Enterprise, type EnterpriseFormValues,
} from "../../../feature/enterprise/type";

interface Props {
  open: boolean;
  enterprise: Enterprise | null;
  onClose: () => void;
  onSave: (data: EnterpriseFormValues) => Promise<void>;
}

export function EnterpriseFormModal({ open, enterprise, onClose, onSave }: Props) {
  const [form]   = Form.useForm();
  const [saving, setSaving] = useState(false);

  const handleOk = async () => {
    const values = await form.validateFields();
    setSaving(true);
    await onSave(values);
    setSaving(false);
    form.resetFields();
    onClose();
  };

  const afterOpenChange = (isOpen: boolean) => {
    if (isOpen) form.setFieldsValue(enterprise ?? {});
    else form.resetFields();
  };

  return (
    <Modal
      title={enterprise ? "✏️ Chỉnh sửa doanh nghiệp" : "➕ Thêm doanh nghiệp"}
      open={open} onOk={handleOk} onCancel={onClose}
      okText={enterprise ? "Lưu thay đổi" : "Thêm mới"} cancelText="Hủy" width={600}
      confirmLoading={saving}
      afterOpenChange={afterOpenChange}
      okButtonProps={{ style: { background: "#7c3aed", border: "none" } }}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={14}>
            <Form.Item name="name" label="Tên doanh nghiệp" rules={[{ required: true, message: "Nhập tên doanh nghiệp" }]}>
              <Input placeholder="VD: FPT Software" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="abbr" label="Tên viết tắt" rules={[{ required: true, message: "Nhập tên viết tắt" }]}>
              <Input placeholder="FPT" maxLength={6} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="industry" label="Ngành nghề" rules={[{ required: true, message: "Chọn ngành nghề" }]}>
              <Select placeholder="Chọn ngành nghề">
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
          <Select mode="multiple" placeholder="Chọn khoa liên kết" allowClear>
            {ALL_FACULTIES.map(k => (
              <Select.Option key={k} value={k}>
                <span style={{ color: FACULTY_VI_NAME[k] }}>●</span> {FACULTY_VI_NAME[k]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="email" label="Email liên hệ" rules={[{ type: "email", message: "Email không hợp lệ" }]}>
              <Input placeholder="hr@company.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input placeholder="024 xxxx xxxx" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="website" label="Website"><Input placeholder="https://company.com" /></Form.Item>
        <Form.Item name="address" label="Địa chỉ"><Input placeholder="Số nhà, đường, quận, thành phố" /></Form.Item>
        <Form.Item name="description" label="Mô tả doanh nghiệp">
          <Input.TextArea rows={3} placeholder="Giới thiệu ngắn về doanh nghiệp..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}