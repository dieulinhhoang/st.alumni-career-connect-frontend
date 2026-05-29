import { Button, Tag, Modal } from "antd";
import {
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { Job, Faculty } from "../../../feature/enterprise/type";

interface Props {
  job: Job;
  entColor: string;
  faculties?: Faculty[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

function getJobFacultyLabel(job: Job, faculties: Faculty[] = []) {
  const raw = job.faculty;

  if (!raw) return null;

  if (typeof raw === "object") {
    return raw.name ?? raw.code ?? raw.id ?? null;
  }

  const matched = faculties.find(
    (f) => f.id === raw || f.code === raw || f.name === raw,
  );

  return matched?.name ?? raw;
}

function getJobFacultyColor(job: Job, faculties: Faculty[] = []) {
  const raw = job.faculty;

  if (!raw) return "#6d28d9";

  if (typeof raw === "object") {
    return raw.color ?? "#6d28d9";
  }

  const matched = faculties.find(
    (f) => f.id === raw || f.code === raw || f.name === raw,
  );

  return matched?.color ?? "#6d28d9";
}

export function JobCard({
  job,
  entColor,
  faculties = [],
  onEdit,
  onDelete,
}: Props) {
  const facultyLabel = getJobFacultyLabel(job, faculties);
  const facultyColor = getJobFacultyColor(job, faculties);

  return (
    <div
      className="job-card"
      style={{
        padding: "16px 20px",
        border: "1px solid #f0f0f0",
        borderRadius: 12,
        background: "white",
        transition: "box-shadow 0.2s",
        opacity: job.status === "closed" ? 0.7 : 1,
        borderLeft: `3px solid ${job.status === "active" ? entColor : "#d9d9d9"}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
          gap: 8,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: "#1e1b4b",
              marginBottom: 4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {job.title}
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              fontSize: 12,
              color: "#6b7280",
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <EnvironmentOutlined />
              {job.location}
            </span>

            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <DollarOutlined />
              {job.salary}
            </span>

            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <ClockCircleOutlined />
              Đăng {job.postedAt}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <Tag color={job.status === "active" ? "success" : "default"} style={{ margin: 0 }}>
            {job.status === "active" ? "Đang tuyển" : "Đã đóng"}
          </Tag>

          {job.deadline && (
            <span style={{ fontSize: 11, color: "#ef4444", whiteSpace: "nowrap" }}>
              Hạn: {job.deadline}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {job.tags.map((tag) => (
            <Tag key={tag} color="purple" style={{ fontSize: 11, margin: 0 }}>
              {tag}
            </Tag>
          ))}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {facultyLabel && (
            <span
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 100,
                background: `${facultyColor}15`,
                color: facultyColor,
                fontWeight: 600,
              }}
            >
              {facultyLabel}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 12,
          paddingTop: 10,
          borderTop: "1px solid #f5f5f5",
        }}
      >
        <Button
          size="small"
          icon={<EditOutlined />}
          style={{ fontSize: 11, borderRadius: 6 }}
          onClick={() => onEdit(job)}
        >
          Chỉnh sửa
        </Button>

        <Button
          size="small"
          icon={<DeleteOutlined />}
          danger
          style={{ fontSize: 11, borderRadius: 6 }}
          onClick={() =>
            Modal.confirm({
              title: "Xóa tin tuyển dụng?",
              content: `Tin "${job.title}" sẽ bị xóa vĩnh viễn.`,
              okText: "Xóa",
              okType: "danger",
              cancelText: "Hủy",
              onOk: () => onDelete(job.id),
            })
          }
        >
          Xóa
        </Button>
      </div>

      <style>{`
        .job-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}