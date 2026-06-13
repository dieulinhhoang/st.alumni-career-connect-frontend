import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card, Col, Row, Tag, Button, Badge, Divider, Space, Modal, Spin,
} from "antd";
import {
  ArrowLeftOutlined, GlobalOutlined, MailOutlined, PhoneOutlined,
  PlusOutlined, EnvironmentOutlined, SafetyCertificateOutlined,
  PauseCircleOutlined, PlayCircleOutlined, EditOutlined, TeamOutlined,
} from "@ant-design/icons";

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

const DEFAULT_FACULTY_COLOR = "#1d4ed8";

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
    activeJobs,
    closedJobs,
    addJob,
    editJob,
    removeJob,
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
    jobTab === "active" ? activeJobs : jobTab === "closed" ? closedJobs : jobs;

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
            border: "1px solid #dbeafe",
            overflow: "hidden",
            padding: 0,
          }}
        >
          <div
            style={{
              height: 80,
              background: `linear-gradient(135deg, ${ent.color}18, ${ent.color}35)`,
              margin: "-24px -24px 0",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", right: 16, top: 12, display: "flex", gap: 6 }}>
              <Tag color={ent.partnerStatus === "active" ? "blue" : "error"}>
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
                  border: `2px solid ${ent.color}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  marginTop: -28,
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 900, color: ent.color }}>
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
                icon={<PlusOutlined />}
                type="primary"
                style={{ background: ent.color, border: "none", borderRadius: 8 }}
                onClick={() => setJobModal({ open: true, job: null })}
              >
                {/* Thêm tin tuyển dụng */}
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
                style={{ borderRadius: 14, border: "1px solid #dbeafe" }}
                title={<span style={{ fontSize: 14, fontWeight: 700 }}>Thông tin liên hệ</span>}
              >
                {[
                  { icon: <GlobalOutlined style={{ color: ent.color }} />, label: "Website", value: ent.website },
                  { icon: <MailOutlined style={{ color: ent.color }} />, label: "Email", value: ent.email },
                  { icon: <PhoneOutlined style={{ color: ent.color }} />, label: "Điện thoại", value: ent.phone },
                  { icon: <EnvironmentOutlined style={{ color: ent.color }} />, label: "Địa chỉ", value: ent.address },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    <div style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>{item.icon}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.label}</div>
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
                    </div>
                  </div>
                ))}
                <Divider style={{ margin: "8px 0 12px" }} />
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Đối tác từ</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: ent.color }}>{ent.joinedDate}</div>
              </Card>

              <Card
                style={{ borderRadius: 14, border: "1px solid #dbeafe" }}
                title={<span style={{ fontSize: 14, fontWeight: 700 }}>Khoa đối tác</span>}
              >
                {enterpriseFaculties.length === 0 ? (
                  <span style={{ color: "#9ca3af", fontSize: 13 }}>Chưa có khoa liên kết</span>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {enterpriseFaculties.map((f) => {
                      const color = f.color ?? DEFAULT_FACULTY_COLOR;
                      return (
                        <span
                          key={f.id}
                          style={{
                            padding: "5px 14px",
                            borderRadius: 100,
                            fontSize: 12,
                            fontWeight: 600,
                            background: `${color}15`,
                            color: color,
                            border: `1px solid ${color}30`,
                          }}
                        >
                          {f.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </Card>

              <Card
                style={{ borderRadius: 14, border: "1px solid #dbeafe" }}
                title={<span style={{ fontSize: 14, fontWeight: 700 }}>Thống kê tuyển dụng</span>}
              >
                <Row gutter={[12, 12]}>
                  {[
                    { label: "Tổng tin", value: jobs.length, color: ent.color, bg: ent.color + "12" },
                    { label: "Đang tuyển", value: activeJobs.length, color: "#059669", bg: "#d1fae5" },
                    { label: "Đã đóng", value: closedJobs.length, color: "#d97706", bg: "#fef3c7" },
                  ].map((s) => (
                    <Col key={s.label} span={8}>
                      <div style={{ textAlign: "center", padding: "10px 6px", borderRadius: 10, background: s.bg }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: s.color, marginTop: 2 }}>{s.label}</div>
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
                style={{ borderRadius: 14, border: "1px solid #dbeafe" }}
                title={<span style={{ fontSize: 14, fontWeight: 700 }}>Giới thiệu</span>}
              >
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0 }}>
                  {ent.description}
                </p>
              </Card>

              <Card
                style={{ borderRadius: 14, border: "1px solid #dbeafe" }}
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Tin tuyển dụng</span>
                    <Badge count={activeJobs.length} style={{ backgroundColor: ent.color }} />
                  </div>
                }
                extra={
                  <Space size={4} wrap>
                    {[
                      { key: "all", label: "Tất cả", count: jobs.length },
                      { key: "active", label: "Đang tuyển", count: activeJobs.length },
                      { key: "closed", label: "Đã đóng", count: closedJobs.length },
                    ].map((tab) => (
                      <Button
                        key={tab.key}
                        size="small"
                        type={jobTab === tab.key ? "primary" : "default"}
                        style={jobTab === tab.key ? { background: ent.color, border: "none" } : {}}
                        onClick={() => setJobTab(tab.key)}
                      >
                        {tab.label} ({tab.count})
                      </Button>
                    ))}
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
                      style={{ marginTop: 12, background: ent.color, border: "none" }}
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
