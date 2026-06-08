import { useParams, useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../../../components/layout/AdminLayout";
import type { GraduationStudent } from "../../../feature/graduation/type";

const ANT_FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function Field({
  label,
  value,
  blue = false,
}: {
  label: string;
  value?: string | null;
  blue?: boolean;
}) {
  return (
    <div style={{ padding: "10px 0", borderBottom: "0.5px solid #e5e7eb" }}>
      <p style={{ margin: "0 0 2px", fontSize: 14, color: "#9ca3af" }}>{label}</p>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          color: blue ? "#185FA5" : "rgba(0,0,0,0.85)",
        }}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 10px",
        fontSize: 14,
        fontWeight: 500,
        color: "#9ca3af",
      }}
    >
      {children}
    </p>
  );
}

const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
};

const grid3: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
};

type StudentDetailData = GraduationStudent & {
  faculty_name?: string | null;
  training_industry_code?: string | null;
  training_industry_name?: string | null;
  major?: {
    code?: string | null;
    name?: string | null;
    faculty?: {
      name?: string | null;
    } | null;
  } | null;
};

export default function StudentDetail() {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as
    | { student?: StudentDetailData; graduationName?: string }
    | null;

  const student = state?.student;
  const graduationName = state?.graduationName ?? "Đợt tốt nghiệp";

  const card: React.CSSProperties = {
    background: "#fff",
    border: "0.5px solid #e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
    maxWidth: 760,
    fontFamily: ANT_FONT,
  };

  const studentName = student?.full_name ?? "";
  const genderLabel =
    student?.gender === "male" ? "Nam" : student?.gender === "female" ? "Nữ" : "Khác";

  const facultyName =
    student?.faculty_name ?? student?.major?.faculty?.name ?? undefined;

  const majorCode =
    student?.training_industry_code ?? student?.major?.code ?? undefined;

  const majorName =
    student?.training_industry_name ??
    student?.major?.name ??
    (student?.training_industry_id ? `ID: ${student.training_industry_id}` : undefined);

  return (
    <AdminLayout>
      <div style={{ padding: "1.5rem 0", fontFamily: ANT_FONT }}>
        <button
          onClick={() =>
            navigate(`/admin/graduation/${id}/${slug}/students`, {
              state: { graduationName },
            })
          }
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#6b7280",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginBottom: "1.5rem",
          }}
        >
          ← Danh sách sinh viên
        </button>

        {!student ? (
          <p style={{ color: "#9ca3af" }}>Không tìm thấy thông tin sinh viên.</p>
        ) : (
          <div style={card}>
            <div
              style={{
                padding: "1.5rem",
                borderBottom: "0.5px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#EEEDFE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#3C3489",
                  flexShrink: 0,
                }}
              >
                {getInitials(studentName)}
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 500,
                    color: "rgba(0,0,0,0.85)",
                  }}
                >
                  {studentName}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 4,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#6b7280" }}>{student.code}</span>
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: "#d1d5db",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      background: "#EEEDFE",
                      color: "#3C3489",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {graduationName}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: "1.25rem 1.5rem" }}>
              <SectionTitle>Thông tin cá nhân</SectionTitle>
              <div style={grid2}>
                <div style={{ paddingRight: 16 }}>
                  <Field label="Họ tên" value={student.full_name} />
                </div>
                <div style={{ paddingLeft: 16 }}>
                  <Field label="Giới tính" value={genderLabel} />
                </div>
                <div style={{ paddingRight: 16 }}>
                  <Field
                    label="Ngày sinh"
                    value={
                      student.dob
                        ? new Date(student.dob).toLocaleDateString("vi-VN")
                        : undefined
                    }
                  />
                </div>
                <div style={{ paddingLeft: 16 }}>
                  <Field label="CCCD" value={student.citizen_identification} />
                </div>
              </div>
            </div>

            <div style={{ padding: "0 1.5rem 1.25rem" }}>
              <SectionTitle>Liên hệ</SectionTitle>
              <div style={grid2}>
                <div style={{ paddingRight: 16 }}>
                  <Field label="Email" value={student.email} blue />
                </div>
                <div style={{ paddingLeft: 16 }}>
                  <Field label="SĐT" value={student.phone} />
                </div>
              </div>
            </div>

            <div style={{ padding: "0 1.5rem 1.5rem" }}>
              <SectionTitle>Ngành học</SectionTitle>
              <div style={grid3}>
                <div style={{ paddingRight: 16 }}>
                  <Field label="Khoa" value={facultyName} />
                </div>
                <div style={{ paddingInline: 8 }}>
                  <Field label="Mã ngành" value={majorCode} />
                </div>
                <div style={{ paddingLeft: 16 }}>
                  <Field label="Tên ngành" value={majorName} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}