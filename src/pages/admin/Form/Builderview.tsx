import { useState } from "react";
import { useQuestionEditor } from "../../../feature/form/hooks/useQuestionEditor";
import type { Form } from "../../../feature/form/types";
import { ACCENT_COLORS } from "../../../feature/form/constants";
import { LeftToolbox } from "./builder/LeftToolbox";
import { CenterCanvas } from "./builder/CenterCanvas";
import { RightPanel } from "./builder/RightPanel";
import { DevicePreview } from "./builder/DevicePreview";
import { LogicTab } from "./builder/LogicTab";
import { IcBack, IcSave, IcCheck } from "./builder/Icons";
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
 
const TAB_ITEMS = [
  { key: "designer", label: "Thiết kế" },
  { key: "preview",  label: "Xem trước" },
  { key: "logic",    label: "Logic" },
];
 
export function BuilderView({ form, onSave, onBack }: BuilderViewProps) {
  const [activeTab, setActiveTab] = useState<string>("designer");
  const [name, setName] = useState(form?.name ?? "");
  const [desc, setDesc] = useState(form?.description ?? "");
  const [accent, setAccent] = useState(
    ACCENT_COLORS.includes(form?.themeId ?? "") ? form?.themeId ?? ACCENT_COLORS[0] : ACCENT_COLORS[0]
  );
  const [header, setHeader] = useState<HeaderFields>(
    (form as any)?.header ?? DEFAULT_HEADER
  );
  const [saved, setSaved] = useState(false);
 
  const {
    questions, activeId, setActiveId,
    addQuestion, insertQuestionAt, updateQuestion, duplicateQuestion, removeQuestion, moveQuestion,
    addOption, updateOption, removeOption
  } = useQuestionEditor(form?.questions ?? []);
 
  const handleAddFromBank = (bankQ: any) => {
    addQuestion(bankQ.type, bankQ.title, bankQ.options);
  };
 
  const handleSave = () => {
    onSave({ ...form!, name, description: desc, questions, themeId: accent, header } as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
 
  const renderContent = () => {
    switch (activeTab) {
      case "designer":
        return (
          <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
            <div style={{ height: "100%", overflowY: "auto", flexShrink: 0 }}>
              <LeftToolbox onAddQuestion={(type) => addQuestion(type as any)} />
            </div>
            <div style={{ flex: 1, height: "100%", overflow: "hidden" }}>
              <CenterCanvas
                name={name} desc={desc} accent={accent}
                questions={questions} activeId={activeId} setActiveId={setActiveId}
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
            <div style={{ height: "100%", overflowY: "auto", flexShrink: 0 }}>
              <RightPanel onAddFromBank={handleAddFromBank} accent={accent} onAccentChange={setAccent} />
            </div>
          </div>
        );
      case "preview":
        return <DevicePreview name={name} desc={desc} questions={questions} accent={accent} />;
      case "logic":
        return <LogicTab questions={questions} />;
      default:
        return null;
    }
  };
 
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #e5e7eb", padding: "0 16px", height: 48, flexShrink: 0, gap: 8 }}>
        <button onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 13, flexShrink: 0 }}>
          <IcBack /> Quay lại
        </button>
        <div style={{ display: "flex", flex: 1, justifyContent: "center", height: "100%" }}>
          {TAB_ITEMS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{
                height: "100%", padding: "0 18px", border: "none",
                borderBottom: activeTab === t.key ? `2px solid ${accent}` : "2px solid transparent",
                background: "none", cursor: "pointer", fontSize: 13.5,
                fontWeight: activeTab === t.key ? 600 : 400,
                color: activeTab === t.key ? accent : "#6b7280",
                transition: "all .15s",
              }}>
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={handleSave}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, flexShrink: 0, color: saved ? "#16a34a" : "#0a9688" }}>
          {saved ? <IcCheck /> : <IcSave />}
          {saved ? "Đã lưu" : "Lưu"}
        </button>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        {renderContent()}
      </div>
    </div>
  );
}