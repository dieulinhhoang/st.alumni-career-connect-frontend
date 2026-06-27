import { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Select, Tag, Row, Col, DatePicker, Alert } from "antd";
import dayjs from "dayjs";
import {
  JOB_LOCATIONS,
  type Job,
  type JobFormValues,
  type Faculty,
} from "../../../feature/enterprise/type";

interface Props {
  open: boolean;
  job: Job | null;
  entColor: string;
  faculties?: Faculty[];
  onClose: () => void;
  onSave: (data: JobFormValues) => Promise<void>;
}

function normalizeFacultyValue(job: Job | null): string | undefined {
  if (!job) return undefined;

  const raw = job.faculty;

  if (!raw) return undefined;
  if (typeof raw === "string") return raw;

  // FIX: wrap String() để đảm bảo luôn là string, khớp với value của options
  return String(raw.id ?? raw.code ?? raw.name ?? "") || undefined;
}

function normalizeDeadline(deadline?: string | null) {
  if (!deadline) return null;
  const d = dayjs(deadline);
  return d.isValid() ? d : null;
}

export function JobFormModal({
  open,
  job,
  entColor,
  faculties = [],
  onClose,
  onSave,
}: Props) {
  const [form] = Form.useForm<JobFormValues>();
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // FIX: value là String(f.id) để khớp với normalizeFacultyValue
  const facultyOptions = useMemo(
    () =>
      faculties.map((f) => ({
        label: f.name,
        value: String(f.id),
      })),
    [faculties],
  );

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setTags([]);
      setTagInput("");
      return;
    }

    form.setFieldsValue({
      title: job?.title ?? "",
      location: job?.location ?? undefined,
      salary: job?.salary ?? "",
      faculty: normalizeFacultyValue(job),
      deadline: normalizeDeadline(job?.deadline),
      status: job?.status ?? "active",
      tags: job?.tags ?? [],
    });

    setTags(job?.tags ?? []);
    setTagInput("");
  }, [open, job, form]);

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;

    setTags((prev) => {
      if (prev.includes(value)) return prev;
      return [...prev, value];
    });

    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      setSaving(true);

      await onSave({
        title: values.title,
        location: values.location,
        salary: values.salary ?? "",
        faculty: values.faculty ?? null,
        deadline: values.deadline ? dayjs(values.deadline).format('YYYY-MM-DD') : null,
        status: values.status ?? "active",
        tags,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={job ? "Chỉnh sửa tin tuyển dụng" : "Thêm tin tuyển dụng"}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText={job ? "Lưu thay đổi" : "Đăng tin"}
      cancelText="Hủy"
      width={580}
      destroyOnClose
      confirmLoading={saving}
      okButtonProps={{
        style: {
          background: entColor,
          borderColor: entColor,
        },
      }}
    >
      <Form<JobFormValues>
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="title"
          label="Vị trí tuyển dụng"
          rules={[{ required: true, message: "Nhập tên vị trí" }]}
        >
          <Input placeholder="VD: Lập trình viên Backend" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="location"
              label="Địa điểm"
              rules={[{ required: true, message: "Chọn địa điểm" }]}
            >
              <Select
                placeholder="Chọn tỉnh/thành"
                options={JOB_LOCATIONS.map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="salary" label="Mức lương">
              <Input placeholder="VD: 15–25 triệu" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="faculty" label="Khoa phù hợp">
          <Select
            allowClear
            showSearch
            placeholder="Chọn khoa liên quan"
            options={facultyOptions}
            optionFilterProp="label"
            notFoundContent={faculties.length === 0 ? "Đang tải khoa..." : "Không có khoa phù hợp"}
          />
        </Form.Item>

        <Form.Item label="Kỹ năng / Tags">
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 8,
              minHeight: 24,
            }}
          >
            {tags.map((tag) => (
              <Tag
                key={tag}
                closable
                color="purple"
                style={{ fontSize: 12 }}
                onClose={() => removeTag(tag)}
              >
                {tag}
              </Tag>
            ))}
          </div>

          <Input.Search
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onSearch={addTag}
            onPressEnter={(e) => {
              e.preventDefault();
              addTag();
            }}
            placeholder="Nhập kỹ năng rồi nhấn Enter hoặc +"
            enterButton="+"
            style={{ maxWidth: 320 }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="deadline" label="Hạn nộp hồ sơ">
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày hết hạn"
                disabledDate={(d) => d && d.isBefore(dayjs().startOf('day'))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            {job && job.status === "active" ? (
              <Form.Item name="status" label="Trạng thái">
                <Select
                  options={[
                    { label: "Đang tuyển", value: "active" },
                    { label: "Đã đóng", value: "closed" },
                  ]}
                />
              </Form.Item>
            ) : job ? (
              <div style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 8, fontSize: 14 }}>Trạng thái</div>
                {job.status === "pending" && (
                  <Alert type="info" showIcon message="Đang chờ admin duyệt" />
                )}
                {job.status === "rejected" && (
                  <Alert
                    type="error"
                    showIcon
                    message="Đã bị từ chối"
                    description={job.rejectionReason || undefined}
                  />
                )}
                {job.status === "closed" && (
                  <Alert type="warning" showIcon message="Tin đã đóng" />
                )}
              </div>
            ) : null}
          </Col>
        </Row>

        {!job && (
          <Alert
            type="info"
            showIcon
            message="Tin tuyển dụng sẽ ở trạng thái chờ duyệt cho đến khi admin xác nhận"
            style={{ marginTop: -4 }}
          />
        )}
      </Form>
    </Modal>
  );
}
