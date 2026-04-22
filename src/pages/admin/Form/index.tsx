import { useState } from "react";
import { MOCK_FORMS, THEMES } from "../../../feature/form/constants";
import type { Form, Theme } from "../../../feature/form/types";
import { BuilderView } from "./Builderview";
import PreviewView from "./Preview";
import ListView from "./Listview";
import { DeleteModal } from "./Deletemodal";
import { AIView } from "./Aiview";
import "./survey.css";
import AdminLayout from "../../../components/layout/AdminLayout";

/* ─── Theme Picker Modal ─── */

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
        {/* Header */}
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              marginBottom: 14,
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

        {/* Theme Grid */}
        <div className="theme-grid-modal">
          {THEMES.map((t) => (
            <div
              key={t.id}
              className={`theme-swatch-modal${selected === t.id ? " active" : ""}`}
              onClick={() => setSelected(t.id)}
              style={selected === t.id ? { borderColor: t.accent } : {}}
            >
              <div className="theme-swatch-modal-top" style={{ background: t.header }} />
              <div className="theme-swatch-modal-bot" style={{ background: t.bg }}>
                <div
                  style={{
                    width: 20,
                    height: 5,
                    borderRadius: 3,
                    background: t.accent,
                    opacity: 0.7,
                  }}
                />
              </div>
              <div className="theme-swatch-modal-label" style={selected === t.id ? { color: t.accent } : {}}>
                {t.name}
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 8,
            marginBottom: 22,
            background: th.bg ?? "#f1f3f4",
            border: "1px solid #e8eaed",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: th.accent,
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{th.name}</div>
            <div style={{ fontSize: 11.5, color: "#6b7280", fontFamily: "Geist Mono, monospace" }}>
              {th.accent}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <button
            style={{
              height: 30,
              padding: "0 14px",
              borderRadius: 15,
              border: "none",
              background: th.accent,
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "default",
              fontFamily: "inherit",
            }}
          >
            Gửi
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={onSkip}>
            Bỏ qua
          </button>
          <button className="btn btn-primary" onClick={() => onSelect(selected)}>
            Áp dụng →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Survey Page ─── */

export default function SurveyPage() {
  const [forms, setForms] = useState<Form[]>(MOCK_FORMS);
  const [view, setView] = useState<"list" | "builder" | "ai" | "preview">("list");
  const [activeForm, setActiveForm] = useState<Form | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Form | undefined>(undefined);
  const [pendingThemeForm, setPendingThemeForm] = useState<Form | null>(null);

  const handleSaveFromBuilder = (form: Form) => {
    setForms((prev) => {
      const exists = prev.some((f) => f.id === form.id);
      if (exists) return prev.map((f) => (f.id === form.id ? form : f));
      return [{ ...form, id: Date.now(), created_at: new Date().toISOString().slice(0, 10) }, ...prev];
    });
    setView("list");
  };

  const handleSaveFromAI = (partial: Omit<Form, "id" | "created_at" | "themeId">) => {
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
    setForms((prev) => {
      const exists = prev.some((f) => f.id === pendingThemeForm.id);
      if (exists) return prev.map((f) => (f.id === pendingThemeForm.id ? pendingThemeForm : f));
      return [pendingThemeForm, ...prev];
    });
    setPendingThemeForm(null);
  };

  const handleDelete = (id: number) => setDeleteTarget(forms.find((f) => f.id === id));

  const confirmDelete = () => {
    if (deleteTarget?.id != null) setForms((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    setDeleteTarget(undefined);
  };

  const handleDup = (form: Form) => {
    const copy: Form = {
      ...form,
      id: Date.now(),
      name: form.name + " (bản sao)",
      created_at: new Date().toISOString().slice(0, 10),
    };
    setForms((prev) => [copy, ...prev]);
  };

  const newBlankForm: Form = {
    id: null,
    name: "",
    description: "",
    questions: [],
    themeId: "blue",
  };

  if (view === "builder") {
    return (
      <AdminLayout>
        <BuilderView form={activeForm} onSave={handleSaveFromBuilder} onBack={() => setView("list")} />
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
            setActiveForm(newBlankForm);
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
      </>
    </AdminLayout>
  );
}