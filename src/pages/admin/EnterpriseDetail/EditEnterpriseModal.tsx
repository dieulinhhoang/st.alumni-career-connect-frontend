import { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Select, Row, Col } from "antd";
import {
  ENTERPRISE_SIZES,
  INDUSTRIES,
  type Enterprise,
  type EnterpriseFormValues,
  type Faculty,
} from "../../../feature/enterprise/type";

interface Props {
  open: boolean;
  enterprise: Enterprise | null;
  faculties?: Faculty[];
  onClose: () => void;
  onSave: (data: EnterpriseFormValues) => Promise<void>;
}

function normalizeFacultyValue(enterprise: Enterprise | null): string | undefined {
  if (!enterprise) return undefined;

  const raw = enterprise.faculty;

  if (!raw) return undefined;
  if (typeof raw === "string") return raw;

  return raw.id ?? raw.code ?? raw.name ?? undefined;
}

export function EnterpriseFormModal({
  open,
  enterprise,
  faculties = [],
  onClose,
  onSave,
}: Props) {
  const [form] = Form.useForm<EnterpriseFormValues>();
  const [saving, setSaving] = useState(false);

  const facultyOptions = useMemo(
    () =>
      faculties.map((f) => ({
        label: f.name,
        value: f.id,
      })),
    [faculties],
  );

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      name: enterprise?.name ?? "",
      abbr: enterprise?.abbr ?? "",
      industry: enterprise?.industry ?? undefined,
      size: enterprise?.size ?? undefined,
      faculty: normalizeFacultyValue(enterprise),
      email: enterprise?.email ?? "",
      phone: enterprise?.phone ?? "",
      website: enterprise?.website ?? "",
      address: enterprise?.address ?? "",
      description: enterprise?.description ?? "",
    });
  }, [open, enterprise, form]);

  const handleOk = async () => {
    const values = await form.validateFields();

    setSaving(true);
    try {
      await onSave({
        ...values,
        faculty: values.faculty ?? null,
      });
      form.resetFields();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={enterprise ? "Chỉnh sửa doanh nghiệp" : "Thêm doanh nghiệp"}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText={enterprise ? "Lưu thay đổi" : "Thêm mới"}
      cancelText="Hủy"
      width={600}
      confirmLoading={saving}
      destroyOnClose
      okButtonProps={{ style: { background: "#7c3aed", border: "none" } }}
    >
      <Form<EnterpriseFormValues>
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
      >
        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              name="name"
              label="Tên doanh nghiệp"
              rules={[{ required: true, message: "Nhập tên doanh nghiệp" }]}
            >
              <Input placeholder="VD: FPT Software" />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item
              name="abbr"
              label="Tên viết tắt"
              rules={[{ required: true, message: "Nhập tên viết tắt" }]}
            >
              <Input placeholder="FPT" maxLength={10} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="industry"
              label="Ngành nghề"
              rules={[{ required: true, message: "Chọn ngành nghề" }]}
            >
              <Select
                placeholder="Chọn ngành nghề"
                options={INDUSTRIES.map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="size" label="Quy mô nhân sự">
              <Select
                placeholder="Chọn quy mô"
                options={ENTERPRISE_SIZES.map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="faculty" label="Khoa đối tác">
          <Select
            allowClear
            showSearch
            placeholder="Chọn khoa liên kết"
            options={facultyOptions}
            optionFilterProp="label"
            notFoundContent="Không có khoa"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email liên hệ"
              rules={[{ type: "email", message: "Email không hợp lệ" }]}
            >
              <Input placeholder="hr@company.com" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input placeholder="024 xxxx xxxx" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="website" label="Website">
          <Input placeholder="https://company.com" />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ">
          <Input placeholder="Số nhà, đường, quận, thành phố" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả doanh nghiệp">
          <Input.TextArea rows={3} placeholder="Giới thiệu ngắn về doanh nghiệp..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}