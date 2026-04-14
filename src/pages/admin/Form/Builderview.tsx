import { useState, useEffect } from "react";
import { Button, Tabs, message } from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  CheckOutlined,
  AppstoreOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import { useQuestionEditor } from "../../../feature/form/hooks/useQuestionEditor";
import type { Form } from "../../../feature/form/types";
import { ACCENT_COLORS } from "../../../feature/form/constants";
import { LeftToolbox } from "./builder/LeftToolbox";
import { CenterCanvas } from "./builder/CenterCanvas";
import { RightPanel } from "./builder/RightPanel";
import { DevicePreview } from "./builder/DevicePreview";
import { LogicTab } from "./builder/LogicTab";

interface HeaderFields {
  orgUnit: string;
  orgName: string;
  address: string;
  phone: string;
}

const DEFAULT_HEADER: HeaderFields = {
  orgUnit: "Bộ Nông nghiệp và Môi trường",
  orgName: "Học viện Nông nghiệp Việt Nam",
  address: "Xã Gia Lâm, Thành phố Hà Nội",
  phone: "Điện thoại: 024.62617586 — Fax: 024.62617586",
};

interface BuilderViewProps {
  form: Form | null;
  onSave: (form: Form) => void;
  onBack: () => void;
}

export function BuilderView({ form, onSave, onBack }: BuilderViewProps) {
  const [activeTab, setActiveTab] = useState<string>("designer");
  const [name, setName] = useState(form?.name ?? "");
  const [desc, setDesc] = useState(form?.description ?? "");
  const [accent, setAccent] = useState(
    ACCENT_COLORS.includes(form?.themeId ?? "")
      ? form?.themeId ?? ACCENT_COLORS[0]
      : ACCENT_COLORS[0]
  );
  const [header, setHeader] = useState<HeaderFields>((form as any)?.header ?? DEFAULT_HEADER);
  const [saved, setSaved] = useState(false);

  // Responsive
  const [winWidth, setWinWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const isMobile = winWidth < 768;
  const isTablet = winWidth >= 768 && winWidth < 1024;

  const [leftOpen, setLeftOpen] = useState(!isMobile && !isTablet);
  const [rightOpen, setRightOpen] = useState(!isMobile && !isTablet);

  useEffect(() => {
    if (isMobile || isTablet) {
      setLeftOpen(false);
      setRightOpen(false);
    }
  }, [isMobile, isTablet]);

  const {
    questions,
    activeId,
    setActiveId,
    addQuestion,
    insertQuestionAt,
    updateQuestion,
    duplicateQuestion,
    removeQuestion,
    moveQuestion,
    addOption,
    updateOption,
    removeOption,
  } = useQuestionEditor(form?.questions ?? []);

  const handleSave = () => {
    onSave({ ...form!, name, description: desc, questions, themeId: accent, header } as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const MOBILE_BAR_H = isMobile && activeTab === "designer" ? 52 : 0;

  // Drawer overlay (mobile)
  const DrawerOverlay = ({
    side,
    open,
    onClose,
    children,
  }: {
    side: "left" | "right";
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }) => {
    if (!open) return null;
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(0,0,0,.4)",
          backdropFilter: "blur(2px)",
          display: "flex",
          alignItems: "stretch",
          justifyContent: side === "left" ? "flex-start" : "flex-end",
        }}
        onClick={onClose}
      >
        <div
          style={{
            width: 280,
            maxWidth: "85vw",
            height: "100%",
            background: "#fff",
            boxShadow:
              side === "left"
                ? "4px 0 28px rgba(0,0,0,.15)"
                : "-4px 0 28px rgba(0,0,0,.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  };

  const renderDesigner = () => (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", position: "relative" }}>
      {/* LEFT */}
      {isMobile ? (
        <DrawerOverlay side="left" open={leftOpen} onClose={() => setLeftOpen(false)}>
          <LeftToolbox
            onAddQuestion={(t) => {
              addQuestion(t as any);
              setLeftOpen(false);
            }}
            asDrawer
            onToggle={() => setLeftOpen(false)}
          />
        </DrawerOverlay>
      ) : (
        <div style={{ height: "100%", overflowY: "auto", flexShrink: 0 }}>
          <LeftToolbox
            onAddQuestion={(type) => addQuestion(type as any)}
            open={leftOpen}
            onToggle={() => setLeftOpen((o) => !o)}
          />
        </div>
      )}

      {/* CENTER */}
      <div
        style={{
          flex: 1,
          height: "100%",
          overflow: "hidden",
          minWidth: 0,
          paddingBottom: MOBILE_BAR_H,
        }}
      >
        <CenterCanvas
          name={name}
          desc={desc}
          accent={accent}
          questions={questions}
          activeId={activeId}
          setActiveId={setActiveId}
          onUpdateQuestion={updateQuestion}
          onDuplicate={duplicateQuestion}
          onRemove={removeQuestion}
          onMove={moveQuestion}
          onAddOption={addOption}
          onUpdateOption={updateOption}
          onRemoveOption={removeOption}
          onInsertQuestion={insertQuestionAt as any}
          header={header}
          onHeaderChange={setHeader}
          onNameChange={setName}
          onDescChange={setDesc}
        />
      </div>

      {/* RIGHT */}
      {isMobile ? (
        <DrawerOverlay side="right" open={rightOpen} onClose={() => setRightOpen(false)}>
          <RightPanel
            onAddFromBank={(q) => {
              addQuestion((q as any).type, (q as any).title, (q as any).options);
              setRightOpen(false);
            }}
            accent={accent}
            onAccentChange={setAccent}
            asDrawer
            onToggle={() => setRightOpen(false)}
          />
        </DrawerOverlay>
      ) : (
        <div style={{ height: "100%", overflowY: "auto", flexShrink: 0 }}>
          <RightPanel
            onAddFromBank={(q) => addQuestion((q as any).type, (q as any).title, (q as any).options)}
            accent={accent}
            onAccentChange={setAccent}
            open={rightOpen}
            onToggle={() => setRightOpen((o) => !o)}
          />
        </div>
      )}

      {/* MOBILE BOTTOM BAR */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: MOBILE_BAR_H,
            background: "#fff",
            borderTop: "1px solid #e8eaed",
            display: "flex",
            alignItems: "center",
            zIndex: 100,
            boxShadow: "0 -2px 12px rgba(0,0,0,.06)",
          }}
        >
          <button
            onClick={() => {
              setRightOpen(false);
              setLeftOpen((o) => !o);
            }}
            style={{
              flex: 1,
              height: "100%",
              border: "none",
              borderRight: "1px solid #f0f0f0",
              background: leftOpen ? `${accent}12` : "#fff",
              color: leftOpen ? accent : "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: leftOpen ? 700 : 500,
            }}
          >
            <AppstoreOutlined /> Câu hỏi
          </button>
          <button
            onClick={() => {
              setLeftOpen(false);
              setRightOpen((o) => !o);
            }}
            style={{
              flex: 1,
              height: "100%",
              border: "none",
              background: rightOpen ? `${accent}12` : "#fff",
              color: rightOpen ? accent : "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: rightOpen ? 700 : 500,
            }}
          >
            <BgColorsOutlined /> Thư viện
          </button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "designer":
        return renderDesigner();
      case "preview":
        return <DevicePreview name={name} desc={desc} questions={questions} accent={accent} />;
      case "logic":
        return <LogicTab questions={questions} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
        background: "#fff",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #e8eaed",
          padding: "0 12px",
          height: 48,
          flexShrink: 0,
          gap: 4,
          background: "#fff",
        }}
      >
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack}>
          {!isMobile && <span>Quay lại</span>}
        </Button>

        {/* Tabs */}
        <div style={{ display: "flex", flex: 1, justifyContent: "center", height: "100%", gap: 2 }}>
          {[
            { key: "designer", label: "Thiết kế" },
            { key: "preview", label: "Xem trước" },
            { key: "logic", label: "Logic" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                height: "100%",
                padding: isMobile ? "0 12px" : "0 18px",
                border: "none",
                borderBottom:
                  activeTab === t.key ? `2px solid ${accent}` : "2px solid transparent",
                background: "none",
                cursor: "pointer",
                fontSize: isMobile ? 12.5 : 13.5,
                fontWeight: activeTab === t.key ? 700 : 400,
                color: activeTab === t.key ? accent : "#6b7280",
                transition: "all .12s",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
                letterSpacing: "-.01em",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Save button */}
        <Button
          type={saved ? "default" : "primary"}
          icon={saved ? <CheckOutlined /> : <SaveOutlined />}
          onClick={handleSave}
          style={{
            background: saved ? "#f0fdf4" : undefined,
            color: saved ? "#16a34a" : undefined,
            borderColor: saved ? "#bbf7d0" : undefined,
          }}
        >
          {!isMobile && <span>{saved ? "Đã lưu" : "Lưu"}</span>}
        </Button>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: "hidden" }}>{renderContent()}</div>
    </div>
  );
}