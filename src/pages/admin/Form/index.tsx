import { useState, useEffect, useCallback, useRef } from "react";
import { MOCK_FORMS, THEMES } from "../../../feature/form/constants";
import type { Form, Question, Section } from "../../../feature/form/types";
import { BuilderView } from "./Builderview";
import PreviewView from "./Preview";
import ListView from "./Listview";
import { DeleteModal } from "./Deletemodal";
import { AIView } from "./Aiview";
import "./survey.css";
import AdminLayout from "../../../components/layout/AdminLayout";

const DRAFT_KEY = "survey_draft_list";

function loadDraft(): Form[] | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Form[];
  } catch {
    return null;
  }
}

function saveDraft(forms: Form[]) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(forms));
  } catch {

  }
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
}

interface ThemePickerProps {
  formName: string;
  currentThemeId: string;
  onSelect: (themeId: string) => void;
  onSkip: () => void;
}

function ThemePicker({ formName, currentThemeId, onSelect, onSkip }: ThemePickerProps) {
  const [selected, setSelected] = useState(currentThemeId);
  const th = THEMES.find((t) => t.id === selected) ?? THEMES[0];

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, marginBottom: 14,
            }}
          >
            🎨
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#0d1117", marginBottom: 6, letterSpacing: "-.02em" }}>
            Chọn giao diện
          </div>
          <div style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.65 }}>
            Chọn màu sắc cho <strong style={{ color: "#374151" }}>"{formName}"</strong>.
            Bạn có thể thay đổi sau trong trình biên soạn.
          </div>
        </div>

        <div className="theme-grid-modal">
          {THEMES.map((t) => (
            <div
              key={t.id}
              className={`theme-swatch-modal${selected === t.id ? " active" : ""}`}
              onClick={() => setSelected(t.id)}
              role="radio"
              aria-checked={selected === t.id}
              aria-label={t.name}
              style={selected === t.id ? { borderColor: t.accent } : {}}
            >
              <div className="theme-swatch-modal-top" style={{ background: t.header }} />
              <div className="theme-swatch-modal-bot" style={{ background: t.bg }}>
                <div style={{ width: 20, height: 5, borderRadius: 3, background: t.accent, opacity: 0.7 }} />
              </div>
              <div className="theme-swatch-modal-label" style={selected === t.id ? { color: t.accent } : {}}>
                {t.name}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "12px 14px", borderRadius: 8, marginBottom: 22,
            background: th.bg ?? "#f1f3f4", border: "1px solid #e8eaed",
            display: "flex", alignItems: "center", gap: 12,
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: th.accent, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{th.name}</div>
            <div style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>{th.accent}</div>
          </div>
          <div style={{ flex: 1 }} />
          <button
            style={{
              height: 30, padding: "0 14px", borderRadius: 15, border: "none",
              background: th.accent, color: "#fff", fontSize: 12, fontWeight: 600,
              cursor: "default", fontFamily: "inherit",
            }}
          >
            Gửi
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={onSkip}>Bỏ qua</button>
          <button className="btn btn-primary" onClick={() => onSelect(selected)}>Áp dụng →</button>
        </div>
      </div>
    </div>
  );
}

function DraftBanner({ onRestore, onDiscard }: { onRestore: () => void; onDiscard: () => void }) {
  return (
    <div
      style={{
        position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
        zIndex: 500, background: "#1e293b", color: "#fff",
        borderRadius: 12, padding: "12px 18px",
        display: "flex", alignItems: "center", gap: 14,
        boxShadow: "0 8px 32px rgba(0,0,0,.25)",
        fontSize: 13, fontWeight: 500,
        animation: "fade-in-up .3s ease",
        maxWidth: "90vw",
      }}
    >
      <span>💾 Tìm thấy bản nháp chưa lưu</span>
      <button
        onClick={onRestore}
        style={{
          background: "#3b82f6", border: "none", color: "#fff",
          borderRadius: 7, padding: "5px 14px", cursor: "pointer",
          fontSize: 12, fontWeight: 700, fontFamily: "inherit",
        }}
      >
        Khôi phục
      </button>
      <button
        onClick={onDiscard}
        style={{
          background: "transparent", border: "1px solid rgba(255,255,255,.3)",
          color: "rgba(255,255,255,.8)", borderRadius: 7, padding: "5px 12px",
          cursor: "pointer", fontSize: 12, fontFamily: "inherit",
        }}
      >
        Bỏ qua
      </button>
    </div>
  );
}

export default function SurveyPage() {
  const [forms, setForms] = useState<Form[]>(MOCK_FORMS);
  const [view, setView] = useState<"list" | "builder" | "ai" | "preview">("list");
  const [activeForm, setActiveForm] = useState<Form | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Form | undefined>(undefined);
  const [pendingThemeForm, setPendingThemeForm] = useState<Form | null>(null);
  const [draftAvailable, setDraftAvailable] = useState<Form[] | null>(() => loadDraft());

  const hasUserEdited = useRef(false);

  useEffect(() => {
    if (!hasUserEdited.current) return;
    const timer = setTimeout(() => saveDraft(forms), 2000);
    return () => clearTimeout(timer);
  }, [forms]);

  const handleSaveFromBuilder = (form: Form) => {
    hasUserEdited.current = true;
    setForms((prev) => {
      const exists = prev.some((f) => f.id === form.id);
      if (exists) return prev.map((f) => (f.id === form.id ? form : f));
      return [{ ...form, id: Date.now(), created_at: new Date().toISOString().slice(0, 10) }, ...prev];
    });
    setView("list");
  };

  const handleSaveFromAI = (partial: Omit<Form, "id" | "created_at" | "themeId">) => {
    hasUserEdited.current = true;
    const newForm: Form = {
      ...partial,
      id: Date.now(),
      created_at: new Date().toISOString().slice(0, 10),
      themeId: "blue",
    } as any;
    setPendingThemeForm(newForm);
    setView("list");
  };

  const handleThemeSelected = (themeId: string) => {
    if (!pendingThemeForm) return;
    hasUserEdited.current = true;
    const finalForm = { ...pendingThemeForm, themeId };
    setForms((prev) => {
      const exists = prev.some((f) => f.id === finalForm.id);
      if (exists) return prev.map((f) => (f.id === finalForm.id ? finalForm : f));
      return [finalForm, ...prev];
    });
    setPendingThemeForm(null);
    setActiveForm(finalForm);
    setView("builder");
  };

  const handleThemeSkip = () => {
    if (!pendingThemeForm) return;
    hasUserEdited.current = true;
    setForms((prev) => {
      const exists = prev.some((f) => f.id === pendingThemeForm.id);
      if (exists) return prev.map((f) => (f.id === pendingThemeForm.id ? pendingThemeForm : f));
      return [pendingThemeForm, ...prev];
    });
    setPendingThemeForm(null);
  };

  const handleDelete = (id: number) =>
    setDeleteTarget(forms.find((f) => f.id === id));

  const confirmDelete = () => {
    if (deleteTarget?.id != null) {
      hasUserEdited.current = true;
      setForms((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    }
    setDeleteTarget(undefined);
  };

  const handleDup = (form: Form) => {
    hasUserEdited.current = true;
    const copy: Form = {
      ...form,
      id: Date.now(),
      name: form.name + " (bản sao)",
      created_at: new Date().toISOString().slice(0, 10),
    };
    setForms((prev) => [copy, ...prev]);
  };

  const makeBlankForm = useCallback((): Form => {
    const sectionId = `section_${Date.now()}`;
    const defaultSection: Section = { id: sectionId, title: "Phần 1", order: 0 };
    const defaultQuestion: Question = {
      id: `q_${Date.now()}`,
      type: "short",
      title: "Câu hỏi 1",
      placeholder: "Câu trả lời của bạn",
      required: false,
      sectionId,
      order: 0,
      options: [],
    };
    return {
      id: null,
      name: "",
      description: "",
      sections: [defaultSection],
      questions: [defaultQuestion],
      themeId: "blue",
      header: {
        ministry: "Bộ Nông nghiệp và Môi trường",
        academy: "Học viện Nông nghiệp Việt Nam",
        address: "Xã Gia Lâm, Thành phố Hà Nội",
        phone: "024.62617586",
        showDate: true,
      },
      footer: {
        primaryText: "Xin trân trọng cảm ơn sự hợp tác của Anh/Chị!",
        secondaryText: "Kính chúc Anh/Chị sức khỏe và thành công!",
      },
    } as any;
  }, []);

  if (view === "builder") {
    return (
      <AdminLayout>
        <BuilderView
          form={activeForm}
          onSave={handleSaveFromBuilder}
          onBack={() => setView("list")}
        />
      </AdminLayout>
    );
  }

  if (view === "ai") {
    return (
      <AdminLayout>
        <AIView onSave={handleSaveFromAI} onBack={() => setView("list")} />
      </AdminLayout>
    );
  }

  if (view === "preview") {
    return (
      <AdminLayout>
        <PreviewView form={activeForm} onBack={() => setView("list")} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <>
        <ListView
          forms={forms}
          onCreate={() => {
            const blank = makeBlankForm();
            setActiveForm(blank);
            setView("builder");
          }}
          onAI={() => setView("ai")}
          onEdit={(f) => {
            setActiveForm(f);
            setView("builder");
          }}
          onPreview={(f) => {
            setActiveForm(f);
            setView("preview");
          }}
          onTheme={(f) => {
            setActiveForm(f);
            setView("builder");
          }}
          onDup={handleDup}
          onDelete={handleDelete}
        />

        {pendingThemeForm && (
          <ThemePicker
            formName={pendingThemeForm.name}
            currentThemeId={pendingThemeForm.themeId ?? "blue"}
            onSelect={handleThemeSelected}
            onSkip={handleThemeSkip}
          />
        )}

        {deleteTarget && (
          <DeleteModal
            form={deleteTarget}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(undefined)}
          />
        )}

        {}
        {draftAvailable && (
          <DraftBanner
            onRestore={() => {
              setForms(draftAvailable);
              setDraftAvailable(null);
            }}
            onDiscard={() => {
              clearDraft();
              setDraftAvailable(null);
            }}
          />
        )}
      </>
    </AdminLayout>
  );
}