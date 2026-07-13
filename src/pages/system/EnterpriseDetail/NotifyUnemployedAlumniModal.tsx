import { useEffect, useState } from "react";
import { Modal, Select, message, Empty, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import CustomTable from "../../../components/common/customTable";
import {
  fetchUnemployedAlumniPreview,
  fetchNotifyEmailPreview,
  notifyUnemployedAlumni,
  type UnemployedAlumnus,
  type EmailPreview,
} from "../../../feature/enterprise/api";
import { fetchSurveyOptions, type SurveyOption } from "../../../feature/reports/api";

interface Props {
  open: boolean;
  jobId: string;
  jobTitle: string;
  onClose: () => void;
}

export function NotifyUnemployedAlumniModal({ open, jobId, jobTitle, onClose }: Props) {
  const [surveyOptions, setSurveyOptions] = useState<SurveyOption[]>([]);
  const [surveyId, setSurveyId] = useState<string>("");
  const [alumni, setAlumni] = useState<UnemployedAlumnus[]>([]);
  const [batchTitle, setBatchTitle] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailPreview, setEmailPreview] = useState<EmailPreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Tải danh sách đợt khảo sát khi mở modal
  useEffect(() => {
    if (!open) return;
    fetchSurveyOptions().then((opts) => {
      setSurveyOptions(opts);
      setSurveyId((prev) => prev || opts[0]?.value || "");
    });
  }, [open]);

  // Tải danh sách cựu SV chưa có việc làm mỗi khi đổi đợt khảo sát
  useEffect(() => {
    if (!open || !surveyId) return;
    setLoadingList(true);
    fetchUnemployedAlumniPreview(jobId, surveyId)
      .then((res) => {
        setBatchTitle(res.batchTitle);
        setAlumni(res.alumni);
        setSelectedEmails(res.alumni.map((a) => a.email));
      })
      .catch(() => message.error("Không tải được danh sách cựu sinh viên"))
      .finally(() => setLoadingList(false));
  }, [open, surveyId, jobId]);

  const handlePreviewEmail = async () => {
    setLoadingPreview(true);
    try {
      const preview = await fetchNotifyEmailPreview(jobId);
      setEmailPreview(preview);
    } catch {
      message.error("Không xem được nội dung email mẫu");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleSend = async () => {
    if (!selectedEmails.length) {
      message.warning("Vui lòng chọn ít nhất 1 cựu sinh viên để gửi");
      return;
    }
    setSending(true);
    try {
      const result = await notifyUnemployedAlumni(jobId, surveyId, selectedEmails);
      message.success(
        `Đã gửi ${result.sentCount}/${result.total} email${result.failedCount ? `, ${result.failedCount} email gửi lỗi` : ""}.`,
      );
      onClose();
    } catch (err: any) {
      message.error(err.response?.data?.message ?? "Gửi email thất bại");
    } finally {
      setSending(false);
    }
  };

  const columns: ColumnsType<UnemployedAlumnus> = [
    { title: "Mã SV", dataIndex: "studentCode", width: 100 },
    { title: "Họ và tên", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Ngành", dataIndex: "majorName" },
  ];

  return (
    <Modal
      open={open}
      title={`Gửi thông báo tuyển dụng: ${jobTitle}`}
      onCancel={onClose}
      onOk={handleSend}
      okText={`Gửi (${selectedEmails.length})`}
      okButtonProps={{ disabled: !selectedEmails.length, loading: sending }}
      cancelText="Hủy"
      width={720}
    >
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#6b7280" }}>Đợt khảo sát:</span>
        <Select
          value={surveyId}
          onChange={setSurveyId}
          options={surveyOptions}
          style={{ minWidth: 260 }}
          placeholder="Chọn đợt khảo sát"
        />
        <Button
          size="small"
          icon={<EyeOutlined />}
          loading={loadingPreview}
          onClick={handlePreviewEmail}
        >
          Xem trước email
        </Button>
      </div>

      <CustomTable<UnemployedAlumnus>
        size="small"
        rowKey="email"
        loading={loadingList}
        columns={columns}
        data={alumni}
        pagination={{ pageSize: 8 }}
        rowSelection={{
          selectedRowKeys: selectedEmails,
          onChange: (keys) => setSelectedEmails(keys as string[]),
        }}
        locale={{
          emptyText: (
            <Empty
              description={
                batchTitle
                  ? `Không có cựu SV "Chưa có việc làm" phù hợp trong đợt "${batchTitle}"`
                  : "Không có dữ liệu"
              }
            />
          ),
        }}
      />

      <Modal
        open={!!emailPreview}
        title={emailPreview ? `Tiêu đề: ${emailPreview.subject}` : "Xem trước email"}
        onCancel={() => setEmailPreview(null)}
        footer={null}
        width={640}
      >
        {emailPreview && (
          <iframe
            title="email-preview"
            sandbox=""
            srcDoc={emailPreview.html}
            style={{ width: "100%", height: 480, border: "1px solid #f0f0f0", borderRadius: 8 }}
          />
        )}
      </Modal>
    </Modal>
  );
}
