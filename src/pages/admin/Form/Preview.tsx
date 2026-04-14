import { useState } from "react";
import { Button, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { THEMES } from "../../../feature/form/constants";
import type { Form, Question as OldQuestion } from "../../../feature/form/types";
import { PDFCanvas } from "./builder/PDFCanvas";
import type { Survey, Question, Section, SurveyHeader, SurveyFooter } from "../../../feature/form/types";

function getTheme(themeId?: string) {
  return THEMES.find((t) => t.id === themeId) ?? THEMES[0];
}

function mapFormToSurvey(form: Form): Survey {
  const sections: Section[] = [];
  const questions: Question[] = [];
  let currentSectionId = "";
  let order = 0;

  for (const oldQ of form.questions) {
    const match = oldQ.title.match(/^(\d+)\./);
    let sectionId = currentSectionId;
    if (match) {
      const num = parseInt(match[1]);
      if (num === 1) {
        const newSection: Section = {
          id: `section_${Date.now()}_${sections.length}`,
          title: "Phần I. Thông tin cá nhân",
          order: sections.length,
        };
        sections.push(newSection);
        currentSectionId = newSection.id;
        sectionId = newSection.id;
      } else if (num === 11) {
        const newSection: Section = {
          id: `section_${Date.now()}_${sections.length}`,
          title: "Phần II. Nội dung khảo sát",
          order: sections.length,
        };
        sections.push(newSection);
        currentSectionId = newSection.id;
        sectionId = newSection.id;
      }
    }
    if (!sectionId && sections.length === 0) {
      const defaultSection: Section = {
        id: "default_section",
        title: "Chung",
        order: 0,
      };
      sections.push(defaultSection);
      sectionId = defaultSection.id;
      currentSectionId = sectionId;
    } else if (!sectionId) {
      sectionId = currentSectionId;
    }

    let newType: Question["type"] = "text";
    switch (oldQ.type) {
      case "short":
        newType = "text";
        break;
      case "long":
        newType = "text";
        break;
      case "radio":
        newType = "multiple-choice";
        break;
      case "checkbox":
        newType = "checkbox";
        break;
      case "dropdown":
        newType = "select";
        break;
      case "date":
        newType = "date";
        break;
      case "address":
        newType = "address";
        break;
      default:
        newType = "text";
    }

    const newOptions = oldQ.options
      ? oldQ.options.map((opt: any) => (typeof opt === "string" ? opt : opt.label))
      : undefined;

    const newQuestion: Question = {
      id: oldQ.id,
      type: newType,
      title: oldQ.title.replace(/^\d+\.\s*/, ""),
      placeholder: newType === "text" ? "Câu trả lời của bạn" : undefined,
      options: newOptions,
      required: oldQ.required,
      sectionId: sectionId,
      order: order++,
    };
    questions.push(newQuestion);
  }

  const defaultHeader: SurveyHeader = {
    logoUrl:
      "https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Nong-Nghiep-Viet-Nam-VNUA-300x300.png",
    ministry: "BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG",
    academy: "HỌC VIỆN NÔNG NGHIỆP VIỆT NAM",
    address: "Xã Gia Lâm, Thành phố Hà Nội",
    phone: "024.62617586",
    fax: "024.62617586",
    showDate: true,
  };

  const defaultFooter: SurveyFooter = {
    primaryText: "Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!",
    secondaryText: "Kính chúc Anh/Chị sức khỏe và thành công!",
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
}

export function SurveyPreview({ form, compact = false }: PreviewProps) {
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
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack}>
            Quay lại
          </Button>
          <div style={{ width: 1, height: 18, background: "#e5e7eb" }} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase",
            }}
          >
            Xem trước
          </span>
        </Space>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: th.accent,
          }}
        />
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SurveyPreview form={form} compact={false} />
      </div>
    </div>
  );
}