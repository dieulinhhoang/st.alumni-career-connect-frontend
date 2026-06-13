import { Button, Tag, Modal } from "antd";
import {
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { Job, Faculty } from "../../../feature/enterprise/type";

interface Props {
  job: Job;
  entColor: string;
  faculties?: Faculty[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

// Helpers định dạng ngày giờ vietnam
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr; // raw string nếu parse fail
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const datePart = formatDate(dateStr);
  const timePart = formatTime(dateStr);
  return datePart && timePart ? `${datePart} ${timePart}` : datePart || dateStr;
}

// Kiểm tra job có quá hạn nộp không
function isJobExpired(job: Job): boolean {
  if (!job.deadline || job.status === "closed") return false;
  try {
    const deadlineDate = new Date(job.deadline);
    if (Number.isNaN(deadlineDate.getTime())) return false;
    return deadlineDate < new Date();
  } catch {
    return false;
  }
}

function getJobFacultyLabel(job: Job, faculties: Faculty[] = []): string | null {
  const raw = job.faculty;
  if (!raw) return null;
  if (typeof raw === "object") {
    return (raw as Faculty).name ?? (raw as Faculty).code ?? String((raw as Faculty).id ?? null);
  }
  const matched = faculties.find(
    (f) => String(f.id) === String(raw) || f.code === raw || f.name === raw,
  );
  return matched?.name ?? raw;
}

function getJobFacultyColor(job: Job, faculties: Faculty[] = []): string {
  const raw = job.faculty;
  if (!raw) return "#1d4ed8";
  if (typeof raw === "object") {
    return (raw as Faculty).color ?? "#1d4ed8";
  }
  const matched = faculties.find(
    (f) => String(f.id) === String(raw) || f.code === raw || f.name === raw,
  );
  return matched?.color ?? "#1d4ed8";
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
  const expired = isJobExpired(job);

  return (
    <div
      className="job-card"
      style={{
        padding: "16px 20px",
        border: "1px solid #f0f0f0",
        borderRadius: 12,
        background: "white",
        transition: "box-shadow 0.2s",
        opacity: job.status === "closed" || expired ? 0.7 : 1,
        borderLeft: `3px solid ${
          expired ? "#ef4444" : job.status === "active" ? entColor : "#d9d9d9"
        }`,
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
              Đăng {formatDateTime(job.postedAt)}
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
          <Tag color={expired ? "error" : job.status === "active" ? "success" : "default"} style={{ margin: 0 }}>
            {expired ? "Hết hạn nộp" : job.status === "active" ? "Đang tuyển" : "Đã đóng"}
          </Tag>
          {job.deadline && (
            <span style={{ fontSize: 11, color: expired ? "#ef4444" : "#d97706", whiteSpace: "nowrap" }}>
              {expired } Hạn: {formatDate(job.deadline)}
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
          {(job.tags || []).slice(0, 1).map(tag => (
          <span key={tag} style={{ fontSize: 11, padding: '5px 10px', background: 'rgba(255,255,255,0.02)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12, fontWeight: 500 }}>
            {tag}
          </span>
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
          onClick={
            () =>
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