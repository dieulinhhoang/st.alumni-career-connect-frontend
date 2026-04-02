import { useState, useRef } from "react";
import type { Form } from "../../../feature/form/types";
import { generateFormWithAI } from "../../../feature/form/hooks/useAI";
import { Q_TYPES, SUGGESTIONS } from "../../../feature/form/constants";

type AIStatus = "idle" | "loading" | "success" | "error";

interface AIViewProps {
  onSave: (form: Omit<Form, "id" | "created_at" | "themeId">) => void;
  onBack: () => void;
}

const IcBack    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>;
const IcTrash   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IcBolt    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcUpload  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IcRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;

export function AIView({ onSave, onBack }: AIViewProps) {
  const [prompt,  setPrompt]  = useState("");
  const [status,  setStatus]  = useState<AIStatus>("idle");
  const [result,  setResult]  = useState<Omit<Form, "id" | "created_at" | "themeId"> | null>(null);
  const [errMsg,  setErrMsg]  = useState("");
  const [editName, setEN]     = useState(false);
  const [tempName, setTN]     = useState("");
  const [fileInfo, setFI]     = useState<{ name: string; size: string } | null>(null);
  const [fileText, setFT]     = useState<string | null>(null);
  const fileRef               = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFI({ name: f.name, size: (f.size / 1024).toFixed(1) });
    try {
      const text = await f.text();
      setFT(text.slice(0, 8000));
    } catch { setFT(null); }
  };

  const generate = async () => {
    if (!prompt.trim() && !fileText) return;
    setStatus("loading"); setErrMsg(""); setResult(null);
    try {
      const parsed = await generateFormWithAI(prompt, fileText);
      setResult(parsed);
      setStatus("success");
    } catch {
      setErrMsg("Không thể tạo form. Thử lại hoặc kiểm tra kết nối.");
      setStatus("error");
    }
  };

  const removeQ = (id: string) =>
    setResult((r) => r ? { ...r, questions: r.questions.filter((q) => q.id !== id) } : r);

  return (
    <div className="page">
      {/* ─── TOP BAR ─── */}
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack}><IcBack /> Quay lại</button>
          <div>
            <div className="page-eyebrow">Công cụ AI</div>
            <div className="page-title" style={{ fontSize: 17 }}>Tạo form bằng AI</div>
          </div>
        </div>
        {status === "success" && result && (
          <button className="btn btn-primary" onClick={() => onSave(result)}>
            Lưu & chọn giao diện →
          </button>
        )}
      </div>

      {/* ─── SPLIT PANEL ─── */}
      <div className="ai-split">

        {/* LEFT: Input panel */}
        <div className="ai-panel-left" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Header badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 14px", borderRadius: 8,
            background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
            border: "1px solid #bfdbfe", width: "fit-content",
          }}>
            <IcBolt />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1d4ed8", letterSpacing: ".03em" }}>
              Claude AI · Anthropic
            </span>
          </div>

          {/* Prompt */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <div className="field-label" style={{ marginBottom: 8 }}>Mô tả yêu cầu form</div>
            <textarea
              className="inp"
              rows={5}
              placeholder="Ví dụ: Tạo form khảo sát việc làm cựu sinh viên Học viện Nông nghiệp sau tốt nghiệp..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") generate(); }}
              style={{ marginBottom: 10 }}
            />
            <div className="sugs-row">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="sug-btn" onClick={() => setPrompt(s)}>{s}</button>
              ))}
            </div>
          </div>

          {/* File upload */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <div className="field-label" style={{ marginBottom: 8 }}>
              Tài liệu đính kèm <span style={{ fontWeight: 400, color: "#9ca3af" }}>— PDF, DOC, TXT</span>
            </div>
            {fileInfo ? (
              <div style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0",
              }}>
                <div style={{ width: 32, height: 32, background: "#16a34a", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 14 }}>📄</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{fileInfo.name}</div>
                  <div style={{ fontSize: 11.5, color: "#6b7280" }}>{fileInfo.size} KB · Đã đọc nội dung</div>
                </div>
                <button
                  className="icon-btn danger"
                  onClick={() => { setFI(null); setFT(null); if (fileRef.current) fileRef.current.value = ""; }}
                  title="Xóa file"
                >
                  <IcTrash />
                </button>
              </div>
            ) : (
              <div className="upload-zone" onClick={() => fileRef.current?.click()}>
                <IcUpload />
                <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginTop: 6 }}>Kéo thả hoặc click để chọn</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>PDF, DOC, DOCX, TXT</div>
              </div>
            )}
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} onChange={handleFile} />
          </div>

          {/* Generate button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>Ctrl + Enter để tạo nhanh</span>
            <button
              className="btn btn-primary"
              onClick={generate}
              disabled={status === "loading" || (!prompt.trim() && !fileText)}
              style={{ gap: 8 }}
            >
              <IcBolt />
              {status === "loading" ? "Đang tạo..." : "Tạo form"}
            </button>
          </div>

          {status === "error" && (
            <div className="error-box">⚠ {errMsg}</div>
          )}
        </div>

        {/* RIGHT: Preview panel */}
        <div className="ai-panel-right">
          {status === "idle" && (
            <div style={{
              background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
              padding: "48px 32px", textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,.06)",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14, margin: "0 auto 16px",
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
              }}>⚡</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
                Kết quả sẽ xuất hiện ở đây
              </div>
              <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.7 }}>
                Điền mô tả hoặc upload file,<br />rồi nhấn <strong style={{ color: "#6b7280" }}>Tạo form</strong> để bắt đầu.
              </div>
            </div>
          )}

          {status === "loading" && (
            <div style={{
              background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
              padding: "48px 32px", textAlign: "center",
            }}>
              <div className="ai-dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginTop: 16 }}>AI đang phân tích yêu cầu...</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Thường mất 3–5 giây</div>
            </div>
          )}

          {status === "success" && result && (
            <div className="ai-result-preview">
              {/* Result header */}
              <div className="ai-result-header">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    {editName ? (
                      <input
                        className="inp result-name-inp"
                        autoFocus
                        value={tempName}
                        onChange={(e) => setTN(e.target.value)}
                        onBlur={() => { setResult((r) => r ? { ...r, name: tempName } : r); setEN(false); }}
                        onKeyDown={(e) => { if (e.key === "Enter") { setResult((r) => r ? { ...r, name: tempName } : r); setEN(false); } }}
                      />
                    ) : (
                      <div className="result-name" onClick={() => { setTN(result.name); setEN(true); }}>
                        {result.name}
                        <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>✎</span>
                      </div>
                    )}
                    <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 4, lineHeight: 1.5 }}>{result.description}</div>
                  </div>
                  <span className="count-badge blue">{result.questions.length} câu</span>
                </div>
              </div>

              {/* Question list */}
              <div style={{ maxHeight: "calc(100vh - 340px)", overflowY: "auto" }}>
                {result.questions.map((q, i) => {
                  const qt = Q_TYPES.find((t) => t.value === q.type);
                  return (
                    <div key={q.id} className="ai-q-item" style={{ animationDelay: `${i * 0.04}s` }}>
                      <div className="ai-q-num">{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 500, color: "#111827", marginBottom: 5, lineHeight: 1.5 }}>
                          {q.title}
                        </div>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          <span className="fc-tag">{qt?.icon} {qt?.label}</span>
                          {q.required && <span className="fc-tag danger">Bắt buộc</span>}
                        </div>
                        {(q.options ?? []).length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 7 }}>
                            {q.options.map((o) => <span key={o.id} className="opt-pill">{o.label}</span>)}
                          </div>
                        )}
                      </div>
                      <button className="icon-btn danger" onClick={() => removeQ(q.id)} title="Xóa câu hỏi">
                        <IcTrash />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer actions */}
              <div style={{
                padding: "12px 16px", borderTop: "1px solid #f3f4f6",
                display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center",
                background: "#fafafa",
              }}>
                <button
                  className="btn btn-sm"
                  style={{ gap: 6 }}
                  onClick={() => { setResult(null); setStatus("idle"); }}
                >
                  <IcRefresh /> Tạo lại
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => onSave(result)}>
                  Lưu & chọn giao diện →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}