import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card, Col, Row, Tag, Button, Badge, Divider, Space, Modal, Spin, Dropdown,
} from "antd";
import {
  ArrowLeftOutlined, GlobalOutlined, MailOutlined, PhoneOutlined,
  PlusOutlined, EnvironmentOutlined, SafetyCertificateOutlined,
  PauseCircleOutlined, PlayCircleOutlined, EditOutlined, TeamOutlined,
  SendOutlined, FilterOutlined,
} from "@ant-design/icons";
import api from "../../../libs/api";

import AdminLayout from "../../../components/layout/AdminLayout";
import { findBySlug } from "../../../components/common/utils";
import { useEnterpriseDetail } from "../../../feature/enterprise/hooks/useEnterpriseDetail";
import { useJobs } from "../../../feature/enterprise/hooks/useJobs";
import { fetchEnterprises } from "../../../feature/enterprise/api";
import {
  type Enterprise,
  type Job,
  type JobFormValues,
  type PartnerStatus,
  type EnterpriseFormValues,
} from "../../../feature/enterprise/type";

import { useFaculties } from "../../../feature/faculty/hooks/useFaculties";
import { JobFormModal } from "./JobFormModal";
import { JobCard } from "./JobCard";
import { EnterpriseFormModal } from "./EditEnterpriseModal";
import { havePermission } from "../../../feature/auth/permission";
import { PermissionEnum } from "../../../feature/auth/type";

const DEFAULT_FACULTY_COLOR = "#64748b";
const CARD_BORDER = "1px solid #f0f0f0";
const ACCENT = "#334155";

const IconBuilding = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);

const IconClipboard = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);

export default function EnterpriseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [entId, setEntId] = useState<string | undefined>();

  useEffect(() => {
    fetchEnterprises().then((list) => {
      const found = findBySlug(list, slug ?? "");
      setEntId(found?.id);
    });
  }, [slug]);

  // FIX: useFaculties trả về { faculties, loading } — không phải { data }
  const { faculties = [] } = useFaculties();

  const {
    enterprise: ent,
    loading: entLoading,
    edit,
    verify,
    togglePartnerStatus,
  } = useEnterpriseDetail(entId);

  const {
    jobs,
    pendingJobs,
    activeJobs,
    closedJobs,
    addJob,
    editJob,
    removeJob,
    approveJob,
    rejectJob,
  } = useJobs(entId);

  const [jobTab, setJobTab] = useState("all");
  const [editOpen, setEditOpen] = useState(false);
  const [jobModal, setJobModal] = useState<{ open: boolean; job: Job | null }>({
    open: false,
    job: null,
  });

  if (entLoading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: 80 }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  if (!ent) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <IconBuilding />
          </div>
          <div>Không tìm thấy doanh nghiệp</div>
          <Button style={{ marginTop: 16 }} onClick={() => navigate("/admin/enterprises")}>
            Quay lại
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const displayJobs =
    jobTab === "pending" ? pendingJobs
    : jobTab === "active" ? activeJobs
    : jobTab === "closed" ? closedJobs
    : jobs;

  const enterpriseFaculties = Array.isArray(ent.faculties) ? ent.faculties : [];

  const handleTogglePartner = () => {
    if (ent.partnerStatus === "active") {
      Modal.confirm({
        title: "Ngừng hợp tác đối tác?",
        content: `"${ent.name}" sẽ bị hủy kích hoạt. Tin tuyển dụng sẽ bị ẩn với sinh viên.`,
        okText: "Hủy kích hoạt",
        okType: "danger",
        cancelText: "Quay lại",
        onOk: () => togglePartnerStatus("inactive" as PartnerStatus),
      });
    } else {
      togglePartnerStatus("active" as PartnerStatus);
    }
  };

  const handleSendInvite = async () => {
    if (!entId) return
    try {
      const res = await api.post(`/auth/enterprise/invite/${entId}`)
      // Backend tự chọn: DN chưa có tài khoản → gửi lời mời kích hoạt;
      // DN đã có tài khoản → gửi liên kết đặt lại mật khẩu.
      const mode = res.data?.mode
      Modal.success({
        title: mode === 'reset' ? 'Đã gửi liên kết đặt lại mật khẩu!' : 'Đã gửi lời mời!',
        content: res.data?.message ?? `Email đã được gửi đến ${ent?.email}`,
      })
    } catch (err: any) {
      Modal.error({ title: 'Không thể gửi', content: err.response?.data?.message ?? 'Có lỗi xảy ra' })
    }
  }

  const handleSaveJob = async (values: JobFormValues) => {
    if (jobModal.job) {
      await editJob(jobModal.job.id, values as Partial<Job>);
    } else {
      await addJob(values);
    }
  };

  return (
    <AdminLayout>
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          style={{ marginBottom: 16, padding: "0 4px", color: "#6b7280" }}
          onClick={() => navigate("/admin/enterprises")}
        >
          Quay lại danh sách
        </Button>

        <Card
          style={{
            borderRadius: 16,
            marginBottom: 20,
            border: CARD_BORDER,
            overflow: "hidden",
            padding: 0,
          }}
        >
          <div
            style={{
              height: 52,
              background: "#fafafa",
              borderBottom: "1px solid #f0f0f0",
              margin: "-24px -24px 0",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", right: 16, top: 12, display: "flex", gap: 6 }}>
              <Tag color={ent.partnerStatus === "active" ? "green" : "default"}>
                {ent.partnerStatus === "active" ? "Đang hoạt động" : "Không hoạt động"}
              </Tag>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              paddingTop: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  flexShrink: 0,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 800, color: ACCENT }}>
                  {ent.abbr}
                </span>
              </div>

              <div style={{ paddingBottom: 2 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1e1b4b", lineHeight: 1.2 }}>
                  {ent.name}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "#6b7280",
                    marginTop: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>{ent.industry}</span>
                  {ent.size && (
                    <>
                      <span style={{ color: "#d1d5db" }}>·</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <TeamOutlined style={{ fontSize: 11 }} />
                        {ent.size}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 2 }}>
              <Button
                icon={<SendOutlined />}
                onClick={handleSendInvite}
                style={{ borderRadius: 8 }}
                title="Chưa có tài khoản: gửi lời mời kích hoạt.
                Đã có tài khoản: gửi liên kết đặt lại mật khẩu."
              >
               {/* Gửi liên kết */}
               </Button>

              <Button
                icon={<EditOutlined />}
                onClick={() => setEditOpen(true)}
                style={{ borderRadius: 8 }}
              >
                {/* Chỉnh sửa */}
              </Button>

              {/* {!ent.verified && (
                <Button
                  icon={<SafetyCertificateOutlined />}
                  style={{
                    background: "#059669",
                    border: "none",
                    color: "white",
                    borderRadius: 8,
                  }}
                  onClick={verify}
                >
                  Xác minh
                </Button>
              )} */}

              <Button
                icon={
                  ent.partnerStatus === "active" ? (
                    <PauseCircleOutlined />
                  ) : (
                    <PlayCircleOutlined />
                  )
                }
                style={{
                  borderColor: ent.partnerStatus === "active" ? "#ef4444" : "#059669",
                  color: ent.partnerStatus === "active" ? "#ef4444" : "#059669",
                  borderRadius: 8,
                }}
                onClick={handleTogglePartner}
              >
                {ent.partnerStatus === "active" ? "Hủy kích hoạt" : "Kích hoạt lại"}
              </Button>
            </div>
          </div>
        </Card>

        <Row gutter={[20, 20]}>
          <Col xs={24} lg={8}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card
                style={{ borderRadius: 14, border: CARD_BORDER }}
                title={<span style={{ fontSize: 14, fontWeight: 700 }}>Thông tin liên hệ</span>}
              >
                {[
                  { icon: <GlobalOutlined style={{ color: "#9ca3af" }} />, label: "Website", value: ent.website, href: ent.website && (ent.website.startsWith("http") ? ent.website : `https://${ent.website}`) },
                  { icon: <MailOutlined style={{ color: "#9ca3af" }} />, label: "Email", value: ent.email, href: ent.email && `mailto:${ent.email}` },
                  { icon: <PhoneOutlined style={{ color: "#9ca3af" }} />, label: "Điện thoại", value: ent.phone },
                  { icon: <EnvironmentOutlined style={{ color: "#9ca3af" }} />, label: "Địa chỉ", value: ent.address },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    <div style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>{item.icon}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.label}</div>
                      {item.href && item.value ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            wordBreak: "break-all",
                            color: "#1677ff",
                          }}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div
                          style={{
                            fontSize: 13,
                            color: "#374151",
                            fontWeight: 500,
                            wordBreak: "break-all",
                          }}
                        >
                          {item.value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Divider style={{ margin: "8px 0 12px" }} />
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Đối tác từ</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{ent.joinedDate}</div>
              </Card>

              <Card
                style={{ borderRadius: 14, border: CARD_BORDER }}
                title={<span style={{ fontSize: 14, fontWeight: 700 }}>Khoa đối tác</span>}
              >
                {enterpriseFaculties.length === 0 ? (
                  <span style={{ color: "#9ca3af", fontSize: 13 }}>Chưa có khoa liên kết</span>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {enterpriseFaculties.map((f) => (
                        <span
                          key={f.id}
                          style={{
                            padding: "5px 14px",
                            borderRadius: 100,
                            fontSize: 12,
                            fontWeight: 500,
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          {f.name}
                        </span>
                    ))}
                  </div>
                )}
              </Card>

              <Card
                style={{ borderRadius: 14, border: CARD_BORDER }}
                title={<span style={{ fontSize: 14, fontWeight: 700 }}>Thống kê tuyển dụng</span>}
              >
                <Row gutter={[12, 12]}>
                  {[
                    { label: "Tổng tin", value: jobs.length },
                    { label: "Đang tuyển", value: activeJobs.length },
                    { label: "Đã đóng", value: closedJobs.length },
                  ].map((s) => (
                    <Col key={s.label} span={8}>
                      <div style={{ textAlign: "center", padding: "10px 6px", borderRadius: 10, background: "#f9fafb", border: "1px solid #f0f0f0" }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#1f2937" }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{s.label}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </div>
          </Col>

          <Col xs={24} lg={16}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card
                style={{ borderRadius: 14, border: CARD_BORDER }}
                title={<span style={{ fontSize: 14, fontWeight: 700 }}>Giới thiệu</span>}
              >
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0 }}>
                  {ent.description}
                </p>
              </Card>

              <Card
                style={{ borderRadius: 14, border: CARD_BORDER }}
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Tin tuyển dụng</span>
                    <Badge count={activeJobs.length} style={{ backgroundColor: "#94a3b8" }} />
                  </div>
                }
                extra={
                  <Space size={8}>
                    <Dropdown
                      menu={{
                        items: [
                          { key: "all", label: `Tất cả (${jobs.length})` },
                          { key: "pending", label: `Chờ duyệt (${pendingJobs.length})` },
                          { key: "active", label: `Đang tuyển (${activeJobs.length})` },
                          { key: "closed", label: `Đã đóng (${closedJobs.length})` },
                        ],
                        selectedKeys: [jobTab],
                        onClick: ({ key }) => setJobTab(key),
                      }}
                      trigger={["click"]}
                    >
                      <Button
                        size="small"
                        icon={<FilterOutlined />}
                        style={{
                          borderRadius: 8,
                          ...(jobTab !== "all" ? { borderColor: "#1677ff", color: "#1677ff" } : {}),
                        }}
                      >
                        {jobTab === "all" ? "Bộ lọc" : jobTab === "pending" ? "Chờ duyệt" : jobTab === "active" ? "Đang tuyển" : "Đã đóng"}
                      </Button>
                    </Dropdown>
                    {havePermission(PermissionEnum.JOBS_CREATE) && (
                      <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setJobModal({ open: true, job: null })}
                      >
                        Thêm tin
                      </Button>
                    )}
                  </Space>
                }
              >
                {displayJobs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                      <IconClipboard />
                    </div>
                    <div>Chưa có tin tuyển dụng</div>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      style={{ marginTop: 12 }}
                      onClick={() => setJobModal({ open: true, job: null })}
                    >
                      Thêm tin mới
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {displayJobs.map((j) => (
                      <JobCard
                        key={j.id}
                        job={j}
                        entColor={ent.color}
                        faculties={faculties}
                        onEdit={(job) => setJobModal({ open: true, job })}
                        onDelete={removeJob}
                        onCloseJob={(id) => editJob(id, { status: "closed" })}
                        isAdmin
                        onApprove={approveJob}
                        onReject={rejectJob}
                        canManage={havePermission(PermissionEnum.JOBS_UPDATE)}
                        canDelete={havePermission(PermissionEnum.JOBS_DELETE)}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </Col>
        </Row>
      </div>

      <EnterpriseFormModal
        open={editOpen}
        enterprise={ent}
        faculties={faculties}
        onClose={() => setEditOpen(false)}
        onSave={edit as (v: EnterpriseFormValues) => Promise<void>}
      />

      {/* FIX: bỏ prop enterpriseFaculty không có trong interface JobFormModal */}
      <JobFormModal
        open={jobModal.open}
        job={jobModal.job}
        entColor={ent.color}
        faculties={faculties}
        onClose={() => setJobModal({ open: false, job: null })}
        onSave={handleSaveJob}
      />
    </AdminLayout>
  );
}
