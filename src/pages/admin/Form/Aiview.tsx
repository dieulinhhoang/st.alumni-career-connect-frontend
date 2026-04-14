import { useState, useRef } from "react";
import { Button, Input, Space, Tag, message, Spin } from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  UploadOutlined,
  ReloadOutlined,
  FileOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { Form } from "../../../feature/form/types";
import { generateFormWithAI } from "../../../feature/form/hooks/useAI";
import { Q_TYPES, SUGGESTIONS } from "../../../feature/form/constants";

const { TextArea } = Input;

type AIStatus = "idle" | "loading" | "success" | "error";

interface AIViewProps {
  onSave: (form: Omit<Form, "id" | "created_at" | "themeId">) => void;
  onBack: () => void;
}

const T = "#0f766e";

export function AIView({ onSave, onBack }: AIViewProps) {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<AIStatus>("idle");
  const [result, setResult] = useState<Omit<Form, "id" | "created_at" | "themeId"> | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const [editName, setEN] = useState(false);
  const [tempName, setTN] = useState("");
  const [fileInfo, setFI] = useState<{ name: string; size: string } | null>(null);
  const [fileText, setFT] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFI({ name: f.name, size: (f.size / 1024).toFixed(1) });
    try {
      const text = await f.text();
      setFT(text.slice(0, 8000));
    } catch {
      setFT(null);
    }
  };

  const generate = async () => {
    if (!prompt.trim() && !fileText) return;
    setStatus("loading");
    setErrMsg("");
    setResult(null);
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
    setResult((r) => (r ? { ...r, questions: r.questions.filter((q) => q.id !== id) } : r));

  return (
    <div className="page">
      {/* TOP BAR */}
      <div className="topbar">
        <Space size={12}>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            Quay lại
          </Button>
          <div>
            <div className="eyebrow" style={{ marginBottom: 3 }}>
              Công cụ AI
            </div>
            <div className="page-title" style={{ fontSize: 18 }}>
              Tạo form bằng AI
            </div>
          </div>
        </Space>
        {status === "success" && result && (
          <Button type="primary" onClick={() => onSave(result)}>
            Lưu & chọn giao diện →
          </Button>
        )}
      </div>

      {/* SPLIT */}
      <div className="ai-split">
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Prompt */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <div className="field-label" style={{ marginBottom: 8 }}>
              Mô tả yêu cầu form
            </div>
            <TextArea
              rows={5}
              placeholder="Ví dụ: Tạo form khảo sát việc làm cựu sinh viên sau tốt nghiệp..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") generate();
              }}
              style={{ marginBottom: 10, resize: "none" }}
            />
            <div className="sugs-row">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="sug-btn" onClick={() => setPrompt(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* File upload */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <div className="field-label" style={{ marginBottom: 8 }}>
              Tài liệu đính kèm
              <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: 4 }}>
                — PDF, DOC, TXT
              </span>
            </div>

            {fileInfo ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  background: "#f0fdf9",
                  borderRadius: 8,
                  border: "1px solid #99f6e4",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: T,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  <FileOutlined />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                    {fileInfo.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#6b7280" }}>
                    {fileInfo.size} KB · Đã đọc nội dung
                  </div>
                </div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setFI(null);
                    setFT(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                />
              </div>
            ) : (
              <div className="upload-zone" onClick={() => fileRef.current?.click()}>
                <div style={{ color: "#9ca3af", marginBottom: 8 }}>
                  <UploadOutlined />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>
                  Kéo thả hoặc click để chọn
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>PDF, DOC, DOCX, TXT</div>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: "none" }}
              onChange={handleFile}
            />
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 12, color: "#9ca3af" }}>Ctrl + Enter để tạo nhanh</span>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={generate}
              disabled={status === "loading" || (!prompt.trim() && !fileText)}
            >
              {status === "loading" ? "Đang tạo..." : "Tạo form"}
            </Button>
          </div>

          {status === "error" && (
            <div className="error-box">
              <span>⚠</span> {errMsg}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="ai-panel-right">
          {status === "idle" && (
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #e8eaed",
                padding: "52px 32px",
                textAlign: "center",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  margin: "0 auto 16px",
                  background: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                }}
              >
                ⚡
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Kết quả sẽ xuất hiện ở đây
              </div>
              <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.7 }}>
                Điền mô tả hoặc upload file,
                <br />
                rồi nhấn <strong style={{ color: "#6b7280" }}>Tạo form</strong>.
              </div>
            </div>
          )}

          {status === "loading" && (
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #e8eaed",
                padding: "52px 32px",
                textAlign: "center",
              }}
            >
              <Spin size="large" />
              <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginTop: 16 }}>
                AI đang phân tích yêu cầu...
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                Thường mất 3–5 giây
              </div>
            </div>
          )}

          {status === "success" && result && (
            <div className="ai-result-preview">
              {/* Header */}
              <div className="ai-result-header">
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    {editName ? (
                      <Input
                        autoFocus
                        value={tempName}
                        onChange={(e) => setTN(e.target.value)}
                        onBlur={() => {
                          setResult((r) => (r ? { ...r, name: tempName } : r));
                          setEN(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setResult((r) => (r ? { ...r, name: tempName } : r));
                            setEN(false);
                          }
                        }}
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          padding: "4px 8px",
                          border: "1px solid #e8eaed",
                          borderRadius: 5,
                          outline: "none",
                          fontFamily: "inherit",
                          width: "100%",
                        }}
                      />
                    ) : (
                      <div
                        className="result-name"
                        onClick={() => {
                          setTN(result.name);
                          setEN(true);
                        }}
                        style={{ cursor: "text" }}
                      >
                        {result.name}
                        <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>
                          ✎
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "#6b7280",
                        marginTop: 4,
                        lineHeight: 1.5,
                      }}
                    >
                      {result.description}
                    </div>
                  </div>
                  <Tag color="blue">{result.questions.length} câu</Tag>
                </div>
              </div>

              {/* Questions */}
              <div style={{ maxHeight: "calc(100vh - 360px)", overflowY: "auto" }}>
                {result.questions.map((q, i) => {
                  const qt = Q_TYPES.find((t) => t.value === q.type);
                  return (
                    <div
                      key={q.id}
                      className="ai-q-item"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <div className="ai-q-num">{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#111827",
                            marginBottom: 5,
                            lineHeight: 1.5,
                          }}
                        >
                          {q.title}
                        </div>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          <span className="fc-tag">
                            {qt?.icon} {qt?.label}
                          </span>
                          {q.required && <span className="fc-tag danger">Bắt buộc</span>}
                        </div>
                        {(q.options ?? []).length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 4,
                              marginTop: 7,
                            }}
                          >
                            {q.options.map((o) => (
                              <span key={o.id} className="opt-pill">
                                {o.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeQ(q.id)}
                        title="Xóa"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "10px 14px",
                  borderTop: "1px solid #f0f2f5",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  alignItems: "center",
                  background: "#fafafa",
                }}
              >
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setResult(null);
                    setStatus("idle");
                  }}
                >
                  Tạo lại
                </Button>
                <Button type="primary" onClick={() => onSave(result)}>
                  Lưu & chọn giao diện →
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}