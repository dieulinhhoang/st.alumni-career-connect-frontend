import { Button, Space } from "antd";
import { ArrowLeftOutlined, FileOutlined } from "@ant-design/icons";
import { THEMES } from "../../../feature/form/constants";
import type { Form } from "../../../feature/form/types";
import { PDFCanvas } from "./builder/Form";
import type { Survey, Question, Section, SurveyHeader, SurveyFooter } from "../../../feature/form/types";

function getTheme(themeId?: string) {
  return THEMES.find((t) => t.id === themeId) ?? THEMES[0];
}


function mapFormToSurvey(form: Form): Survey {
  // Dùng sections từ form nếu có, fallback tạo 1 section mặc định
  const sections: Section[] =
    (form as any).sections?.length > 0
      ? (form as any).sections
      : [{ id: "default_section", title: "Nội dung khảo sát", order: 0 }];

  const defaultSectionId = sections[0].id;
  let order = 0;

  const questions: Question[] = form.questions.map((oldQ) => {
    let newType: Question["type"] = "text";
    switch (oldQ.type) {
      case "short":   newType = "text";           break;
      case "long":    newType = "text";           break;
      case "radio":   newType = "multiple-choice"; break;
      case "checkbox": newType = "checkbox";      break;
      case "dropdown": newType = "select";        break;
      case "select":  newType = "select";         break;
      case "date":    newType = "date";           break;
      case "address": newType = "address";        break;
      case "email":   newType = "text";           break;
      case "tel":     newType = "text";           break;
      // case "rating":  newType = "rating" as any;  break;
      default:        newType = "text";
    }

    const newOptions = oldQ.options
      ? oldQ.options.map((opt: any) => (typeof opt === "string" ? opt : opt.label))
      : undefined;

    return {
      id: oldQ.id,
      type: newType,
      title: oldQ.title,
      placeholder: newType === "text" ? "Câu trả lời của bạn" : undefined,
      options: newOptions,
      required: oldQ.required,
      sectionId: oldQ.sectionId || defaultSectionId,
      order: order++,
    };
  });

  const defaultHeader: SurveyHeader = {
    logoUrl:
      (form as any).logoUrl ||
      "https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png",
    ministry: (form as any).header?.ministry ?? "BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG",
    academy:  (form as any).header?.academy  ?? "HỌC VIỆN NÔNG NGHIỆP VIỆT NAM",
    address:  (form as any).header?.address  ?? "Xã Gia Lâm, Thành phố Hà Nội",
    phone:    (form as any).header?.phone    ?? "024.62617586",
    fax:      (form as any).header?.fax      ?? "024.62617586",
    showDate: true,
  };

  const defaultFooter: SurveyFooter = {
    primaryText:   (form as any).footer?.primaryText   ?? "Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!",
    secondaryText: (form as any).footer?.secondaryText ?? "Kính chúc Anh/Chị sức khỏe và thành công!",
  };

  return {
    id: form.id?.toString() || "",
    title: form.name,
    description: form.description,
    sections,
    questions,
    defaultHeader,
    defaultFooter,
  };
}

interface PreviewProps {
  form: Form | null;
  compact?: boolean;
  onBack?: () => void;
  initialValues?: Record<string, any>;
  onSubmit?: (answers: Record<string, any>) => void;
}

export function SurveyPreview({ form, compact = false, initialValues, onSubmit }: PreviewProps) {
  if (!form) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: 32,
          color: "#9ca3af",
          gap: 12,
        }}
      >
        <FileOutlined style={{ fontSize: 40 }} />
        <span style={{ fontSize: 13, fontWeight: 500 }}>Chưa có nội dung để xem trước</span>
      </div>
    );
  }

  const th = getTheme(form.themeId);
  const survey = mapFormToSurvey(form);
  const descParagraphs = survey.description ? survey.description.split(/\n\s*\n/) : [];
  // ✅ FIX: Pass logicRules xuống PDFCanvas để render đúng logic điều kiện
  const logicRules = (form as any).logicRules ?? [];

  return (
    <PDFCanvas
      surveyTitle={survey.title}
      descriptionParagraphs={descParagraphs}
      sections={survey.sections}
      questions={survey.questions}
      accent={th.accent}
      header={survey.defaultHeader}
      footer={survey.defaultFooter}
      interactive={!compact}
      headerOnly={false}
      logoUrl={survey.defaultHeader.logoUrl}
      logoSize={compact ? 36 : 120}
      initialValues={initialValues}
      onSubmit={onSubmit}
      logicRules={logicRules}
    />
  );
}

interface StandaloneProps {
  form: Form | null;
  onBack: () => void;
}

export default function PreviewView({ form, onBack }: StandaloneProps) {
  const th = form ? getTheme(form.themeId) : THEMES[0];
  return (
    <div style={{ minHeight: "100vh", background: th.bg ?? "#f5f5f5" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          padding: "0 20px",
          borderBottom: "1px solid #e5e7eb",
          height: 48,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Space size={12}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} aria-label="Quay lại" />
          <div style={{ width: 1, height: 18, background: "#e5e7eb" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>
            Xem trước
          </span>
        </Space>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: th.accent }} />
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SurveyPreview form={form} compact={false} />
      </div>
    </div>
  );
}