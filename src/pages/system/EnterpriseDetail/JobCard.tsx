import { useState } from "react";
import { Button, Tag, Modal, Input } from "antd";
import {
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  MailOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { Job, Faculty } from "../../../feature/enterprise/type";
import { NotifyUnemployedAlumniModal } from "./NotifyUnemployedAlumniModal";

interface Props {
  job: Job;
  entColor: string;
  faculties?: Faculty[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  // Doanh nghiệp tự đóng tin tuyển dụng khi đã tuyển xong
  onCloseJob?: (id: string) => void;
  // Chỉ admin mới được duyệt/từ chối tin tuyển dụng — doanh nghiệp không tự duyệt tin của mình
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason?: string) => void;
  // Có quyền sửa/đóng/gửi email tin không. Mặc định true vì doanh nghiệp luôn được quản lý tin của
  // chính mình (họ không có hệ thống permission như admin); trang admin truyền vào theo havePermission().
  canManage?: boolean;
  // Có quyền xóa tin không (tách riêng vì admin có permission xóa khác permission sửa). Mặc định = canManage.
  canDelete?: boolean;
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
const STATUS_LABEL: Record<Job["status"], string> = {
  pending: "Chờ duyệt",
  active: "Đang tuyển",
  closed: "Đã đóng",
  rejected: "Bị từ chối",
};

const STATUS_COLOR: Record<Job["status"], string> = {
  pending: "warning",
  active: "success",
  closed: "default",
  rejected: "error",
};

export function JobCard({
  job,
  entColor,
  faculties = [],
  onEdit,
  onDelete,
  onCloseJob,
  isAdmin = false,
  onApprove,
  onReject,
  canManage = true,
  canDelete = canManage,
}: Props) {
  const facultyLabel = getJobFacultyLabel(job, faculties);
  const facultyColor = getJobFacultyColor(job, faculties);
  const expired = isJobExpired(job);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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
          expired
            ? "#ef4444"
            : job.status === "active"
            ? entColor
            : job.status === "pending"
            ? "#d97706"
            : job.status === "rejected"
            ? "#dc2626"
            : "#d9d9d9"
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
          <Tag color={expired ? "error" : STATUS_COLOR[job.status]} style={{ margin: 0 }}>
            {expired ? "Hết hạn nộp" : STATUS_LABEL[job.status]}
          </Tag>
          {job.deadline && (
            <span style={{ fontSize: 11, color: expired ? "#ef4444" : "#d97706", whiteSpace: "nowrap" }}>
              Hạn: {formatDate(job.deadline)}
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
          {(job.tags || []).map(tag => (
          <span key={tag} style={{ fontSize: 11, padding: '3px 10px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 12, fontWeight: 500 }}>
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
      {job.status === "rejected" && job.rejectionReason && (
        <div style={{ fontSize: 12, color: "#dc2626", marginTop: 8, background: "#fef2f2", padding: "6px 10px", borderRadius: 8 }}>
          Lý do từ chối: {job.rejectionReason}
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 12,
          paddingTop: 10,
          borderTop: "1px solid #f5f5f5",
          flexWrap: "wrap",
        }}
      >
        {isAdmin && job.status === "pending" && (
          <>
            <Button
              size="small"
              type="primary"
              icon={<CheckOutlined />}
              style={{ fontSize: 11, borderRadius: 6, background: "#059669", borderColor: "#059669" }}
              onClick={() => onApprove?.(job.id)}
            >
              Duyệt
            </Button>
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              style={{ fontSize: 11, borderRadius: 6 }}
              onClick={() => {
                setRejectReason("");
                Modal.confirm({
                  title: "Từ chối tin tuyển dụng?",
                  content: (
                    <Input.TextArea
                      placeholder="Lý do từ chối (không bắt buộc)"
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={3}
                    />
                  ),
                  okText: "Từ chối",
                  okType: "danger",
                  cancelText: "Hủy",
                  onOk: () => onReject?.(job.id, rejectReason),
                });
              }}
            >
              Từ chối
            </Button>
          </>
        )}
        {canManage && (
          <Button
            size="small"
            icon={<EditOutlined />}
            style={{ fontSize: 11, borderRadius: 6 }}
            onClick={() => onEdit(job)}
          >
            Chỉnh sửa
          </Button>
        )}
        {isAdmin && canManage && job.status === "active" && (
          <Button
            size="small"
            icon={<MailOutlined />}
            style={{ fontSize: 11, borderRadius: 6 }}
            onClick={() => setNotifyOpen(true)}
            title="Gửi email cho cựu SV chưa có việc làm"
          >
            Gửi cho SV chưa có VL
          </Button>
        )}
        {canManage && job.status === "active" && (
          <Button
            size="small"
            icon={<CloseOutlined />}
            style={{ fontSize: 11, borderRadius: 6 }}
            onClick={() =>
              Modal.confirm({
                title: "Đóng tin tuyển dụng?",
                content: `Tin "${job.title}" sẽ được đánh dấu là đã đóng tuyển. Ứng viên sẽ không thể ứng tuyển thêm.`,
                okText: "Đóng tuyển",
                okType: "danger",
                cancelText: "Hủy",
                onOk: () => onCloseJob?.(job.id),
              })
            }
            title="Đóng tuyển dụng"
          >
            Đóng tuyển
          </Button>
        )}
        {canDelete && (
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
        )}
      </div>
      <style>{`
        .job-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }
      `}</style>

      <NotifyUnemployedAlumniModal
        open={notifyOpen}
        jobId={job.id}
        jobTitle={job.title}
        onClose={() => setNotifyOpen(false)}
      />
    </div>
  );
}