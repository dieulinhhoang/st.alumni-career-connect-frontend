import { useEffect, useMemo, useState } from "react";
import { Modal, Button, message, Empty, Alert } from "antd";
import { EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import CustomTable from "../../../components/common/customTable";
import { getBatchById, sendInviteEmails } from "../../../feature/alumni/api";
import { getSurveyUrl } from "../../../feature/alumni/constants";
import { fetchGraduationStudents } from "../../../feature/graduation/api";
import type { GraduationStudent } from "../../../feature/graduation/type";
import { useGetAllTemplates } from "../../../feature/mail-settings/hooks/query";

interface Props {
  batchId: number;
  batchTitle: string;
  open: boolean;
  onClose: () => void;
}

export const SendEmailModal: React.FC<Props> = ({ batchId, batchTitle, open, onClose }) => {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  // API danh sách batch (getBatches) không trả graduationId, nên phải tự gọi
  // getBatchById để lấy chi tiết đầy đủ — giống cách BatchResults.tsx đang làm.
  const [graduationId, setGraduationId] = useState<number | undefined>(undefined);
  const [loadingBatch, setLoadingBatch] = useState(false);

  const [students, setStudents] = useState<GraduationStudent[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  useEffect(() => {
    if (!open) {
      setGraduationId(undefined);
      return;
    }
    setLoadingBatch(true);
    getBatchById(batchId)
      .then((b) => setGraduationId(b.graduationId))
      .catch(() => message.error("Không tải được thông tin đợt khảo sát"))
      .finally(() => setLoadingBatch(false));
  }, [open, batchId]);

  const [previewOpen, setPreviewOpen] = useState(false);

  // Template email dùng cho lời mời khảo sát — quản lý tập trung ở Mail Settings
  const { data: templates = [], isLoading: loadingTemplates } = useGetAllTemplates();
  const surveyTemplate = useMemo(
    () => templates.find((t) => t.type === "survey_invite"),
    [templates],
  );

  // getTemplatePreviewAPI (dùng trong trang Mail Settings) chỉ preview CHUNG cho
  // template, không biết batch nào -> {{ten_khao_sat}}/{{button_url}} sẽ ra dữ liệu mẫu,
  // không phải tên/link thật của đợt khảo sát này. Nên ở đây tự điền biến bằng dữ liệu
  // thật (tên batch, link khảo sát thật, tên 1 SV đang chọn nếu có) rồi render tạm.
  // Lưu ý: đây chỉ là preview XẤP XỈ nội dung chữ, chưa chắc đúng 100% giao diện
  // (màu sắc, layout) như email thật BE gửi đi.
  const surveyUrl = getSurveyUrl(batchId, batchTitle);
  const sampleRecipientName =
    students.find((s) => selectedEmails.includes(s.email))?.full_name ?? "Anh/Chị";

  const fillVars = (text: string) =>
    text
      .replaceAll("{{ten_khao_sat}}", batchTitle)
      .replaceAll("{{button_url}}", surveyUrl)
      .replaceAll("{{ten_nguoi_dung}}", sampleRecipientName);

  // Chỉ điền biến CẤP BATCH (giống nhau cho mọi người nhận). Cố tình KHÔNG thay
  // {{ten_nguoi_dung}} ở đây — 1 request gửi cho nhiều SV khác tên nhau, nên để
  // nguyên placeholder này trong subject/htmlBody gửi lên BE, để BE tự thay
  // theo từng người nhận lúc thực sự dispatch email.
  const fillBatchVars = (text: string) =>
    text.replaceAll("{{ten_khao_sat}}", batchTitle).replaceAll("{{button_url}}", surveyUrl);

  const previewSubject = surveyTemplate ? fillVars(surveyTemplate.subject) : "";
  const renderHtml = (fill: (text: string) => string) =>
    surveyTemplate
      ? `
      <div style="font-family: -apple-system, sans-serif; font-size: 14px; color: #111827; line-height: 1.6; padding: 8px 4px;">
        ${surveyTemplate.sections?.greeting ? `<p>${fill(surveyTemplate.sections.greeting)}</p>` : ""}
        ${surveyTemplate.sections?.intro ? `<p style="white-space: pre-wrap;">${fill(surveyTemplate.sections.intro)}</p>` : ""}
        <p>
          <a href="${surveyUrl}" target="_blank" rel="noopener noreferrer"
             style="display: inline-block; padding: 10px 18px; background: #1D9E75; color: #fff; border-radius: 6px; text-decoration: none;">
            ${surveyTemplate.sections?.button_label ? fill(surveyTemplate.sections.button_label) : "Tham gia khảo sát"}
          </a>
        </p>
        ${surveyTemplate.sections?.signature ? `<p style="white-space: pre-wrap;">${fill(surveyTemplate.sections.signature)}</p>` : ""}
        ${surveyTemplate.sections?.footer ? `<p style="font-size: 12px; color: #6b7280; white-space: pre-wrap;">${fill(surveyTemplate.sections.footer)}</p>` : ""}
      </div>
    `
      : "";

  // Dùng để hiển thị cho admin xem (có điền tên mẫu cho dễ hình dung)
  const previewHtml = renderHtml(fillVars);
  // Dùng để GỬI THẬT lên BE — giữ nguyên {{ten_nguoi_dung}} để BE tự điền theo từng người nhận
  const sendSubject = surveyTemplate ? fillBatchVars(surveyTemplate.subject) : "";
  const sendHtmlBody = renderHtml(fillBatchVars);

  // Tải danh sách cựu SV thuộc đợt tốt nghiệp liên kết với batch khảo sát này
  useEffect(() => {
    if (!open || !graduationId) {
      setStudents([]);
      setSelectedEmails([]);
      return;
    }
    setLoadingList(true);
    fetchGraduationStudents(graduationId, 1, 9999)
      .then((res) => {
        const withEmail = res.data.filter((s) => !!s.email);
        setStudents(withEmail);
        setSelectedEmails(withEmail.map((s) => s.email));
      })
      .catch(() => message.error("Không tải được danh sách cựu sinh viên"))
      .finally(() => setLoadingList(false));
  }, [open, graduationId]);

  const handlePreview = () => {
    if (!surveyTemplate) {
      message.warning('Chưa có template "Lời mời khảo sát" — hãy tạo ở Mail Settings trước.');
      return;
    }
    setPreviewOpen(true);
  };

  const handleSend = async () => {
    if (!surveyTemplate?.isActive) {
      message.warning('Template "Lời mời khảo sát" đang bị tắt — hãy bật ở Mail Settings trước khi gửi.');
      return;
    }
    if (graduationId && !students.length) {
      message.warning("Đợt tốt nghiệp này chưa có cựu sinh viên nào có email để gửi");
      return;
    }
    if (!surveyTemplate) {
      message.error('Không tìm thấy template "Lời mời khảo sát" để lấy nội dung gửi.');
      return;
    }
    setSending(true);
    try {
      // BE hiện validate subject/htmlBody là bắt buộc (không rỗng), nên gửi nội dung
      // đã điền sẵn biến cấp-batch từ template "survey_invite". {{ten_nguoi_dung}}
      // cố tình để nguyên placeholder — cần BE tự thay theo từng người nhận khi gửi.
      // Cần xác nhận thêm: BE của /alumni/batches/:id/send-email đã đọc field `emails`
      // để chỉ gửi cho người được chọn chưa (thay vì gửi toàn bộ theo graduationId).
      // DTO thật của BE (SendEmailDto) CHỈ nhận subject + htmlBody, KHÔNG có field
      // lọc người nhận. Nghĩa là BE luôn gửi cho TOÀN BỘ SV có email theo graduationId
      // của batch — bảng chọn bên dưới hiện chỉ mang tính xem trước/rà soát, KHÔNG lọc
      // được người nhận thật. Nếu cần lọc theo lựa chọn, phải xin BE bổ sung field này
      // vào SendEmailDto trước.
      const result = await sendInviteEmails(batchId, {
        subject: sendSubject,
        htmlBody: sendHtmlBody,
      });
      message.success(
        `Gửi thành công ${result.sent} email, thất bại ${result.failed}, bỏ qua ${result.skipped}`,
      );
      onClose();
    } catch (err: any) {
      console.error("Lỗi:", err);
      message.error(err?.response?.data?.message ?? "Gửi email thất bại");
    } finally {
      setSending(false);
    }
  };

  const columns: ColumnsType<GraduationStudent> = [
    { title: "Mã SV", dataIndex: "code", width: 100 },
    { title: "Họ và tên", dataIndex: "full_name" },
    { title: "Email", dataIndex: "email" },
    { title: "Ngành", dataIndex: "training_industry_name" },
  ];

  return (
    <>
      <Modal
        title={`Gửi email khảo sát — ${batchTitle}`}
        open={open}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose}>
            Hủy
          </Button>,
          <Button
            key="send"
            type="primary"
            loading={sending}
            disabled={loadingBatch}
            onClick={handleSend}
          >
            Gửi email{graduationId ? ` (${selectedEmails.length})` : ""}
          </Button>,
        ]}
        width={760}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Alert
            type="info"
            showIcon
            message={
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <span>
                  Nội dung email lấy từ template{" "}
                  <b>{loadingTemplates ? "…" : surveyTemplate?.name ?? '"Lời mời khảo sát"'}</b>
                  {surveyTemplate && !surveyTemplate.isActive && (
                    <span style={{ color: "#b45309" }}> (đang tắt)</span>
                  )}
                  .
                </span>
                <Button size="small" icon={<EyeOutlined />} onClick={handlePreview}>
                  Xem trước
                </Button>
              </div>
            }
            action={
              surveyTemplate && (
                <Button
                  size="small"
                  type="link"
                  icon={<SettingOutlined />}
                  onClick={() => navigate(`/admin/mail-settings/templates/${surveyTemplate.id}`)}
                >
                  Sửa
                </Button>
              )
            }
          />

          {loadingBatch ? (
            <div style={{ fontSize: 13, color: "#888" }}>Đang tải thông tin đợt khảo sát…</div>
          ) : graduationId ? (
            <div>
              <div style={{ marginBottom: 4, fontWeight: 500 }}>
                Danh sách người nhận ({selectedEmails.length}/{students.length})
              </div>
              <CustomTable<GraduationStudent>
                size="small"
                rowKey="email"
                loading={loadingList}
                columns={columns}
                data={students}
                pagination={{ pageSize: 8 }}
                rowSelection={{
                  selectedRowKeys: selectedEmails,
                  onChange: (keys) => setSelectedEmails(keys as string[]),
                }}
                locale={{
                  emptyText: (
                    <Empty description="Không có cựu sinh viên nào có email trong đợt tốt nghiệp này" />
                  ),
                }}
              />
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "#b45309" }}>
              Đợt khảo sát này chưa liên kết với đợt tốt nghiệp nào nên không thể hiển thị danh
              sách người nhận cụ thể.
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={previewOpen}
        title={`Tiêu đề: ${previewSubject || "(chưa có tiêu đề)"}`}
        onCancel={() => setPreviewOpen(false)}
        footer={null}
        width={640}
      >
       
        <iframe
          title="email-preview"
          sandbox=""
          srcDoc={previewHtml}
          style={{ width: "100%", height: 420, border: "1px solid #f0f0f0", borderRadius: 8 }}
        />
      </Modal>
    </>
  );
};