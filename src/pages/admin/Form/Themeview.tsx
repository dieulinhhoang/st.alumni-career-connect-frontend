import { useState } from "react";
import { Button, Card, Row, Col, Space, Tag, Input } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import type { Form, Theme } from "../../../feature/form/types";
import { THEMES, ACCENT_COLORS, FONTS, RADIUS_OPTIONS } from "../../../feature/form/constants";

interface ThemeViewProps {
  form: Form | null;
  onSave: (form: Form) => void;
  onBack: () => void;
}

export function ThemeView({ form, onSave, onBack }: ThemeViewProps) {
  const [themeId, setThemeId] = useState(form?.themeId ?? "purple");
  const [customAcc, setCA] = useState<string | null>(null);
  const [customFont, setCF] = useState<string | null>(null);
  const [customRad, setCR] = useState<string | null>(null);

  const baseTheme = THEMES.find((t: { id: string; name?: string }) => t.id === themeId) ?? THEMES[0];
  const accent = customAcc ?? baseTheme.accent;
  const font = customFont ?? baseTheme.font;
  const radius = customRad ?? baseTheme.radius;
  const bg = baseTheme.bg;

  const handleSave = () => {
    const updated: Form = {
      ...form!,
      themeId,
      _customTheme:
        customAcc || customFont || customRad ? { accent, font, radius, bg } : null,
    };
    onSave(updated);
  };

  return (
    <div className="page">
      <div className="topbar">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
           
          </Button>
          <div>
            <div className="eyebrow">Cấu hình giao diện</div>
            <div className="page-title" style={{ fontSize: 16, marginBottom: 0 }}>
              Chọn theme · {form?.name}
            </div>
          </div>
        </Space>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          Lưu theme
        </Button>
      </div>

      <Row gutter={20}>
        {/* LEFT: controls */}
        <Col xs={24} md={8}>
          <Card style={{ marginBottom: 16 }} size="small" title="Preset themes">
            <Row gutter={[8, 8]}>
              {THEMES.map(
                (t: {
                  id: string;
                  name: string;
                  accent: string;
                  header: string;
                  bg: string;
                  font: string;
                  radius: string;
                }) => (
                  <Col key={t.id} xs={12} sm={8}>
                    <div
                      className={`theme-card${themeId === t.id ? " selected" : ""}`}
                      style={
                        themeId === t.id
                          ? { borderColor: t.accent, "--sel": t.accent } as React.CSSProperties
                          : {}
                      }
                      onClick={() => {
                        setThemeId(t.id);
                        setCA(null);
                        setCF(null);
                        setCR(null);
                      }}
                    >
                      <div
                        style={{
                          height: 48,
                          background: t.header,
                          borderRadius: "8px 8px 0 0",
                        }}
                      />
                      <div
                        style={{
                          height: 20,
                          background: t.bg,
                          borderRadius: "0 0 8px 8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 6,
                            borderRadius: 3,
                            background: t.accent,
                            opacity: 0.5,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          padding: "7px 10px",
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: "#0f172a",
                          textAlign: "center",
                        }}
                      >
                        {t.name}
                      </div>
                    </div>
                  </Col>
                )
              )}
            </Row>
          </Card>

          <Card style={{ marginBottom: 16 }} size="small" title="Màu chủ đạo">
            <Space wrap size={8} style={{ marginBottom: 12 }}>
              {ACCENT_COLORS.map((c: string) => (
                <div
                  key={c}
                  onClick={() => setCA(c)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: c,
                    cursor: "pointer",
                    border: accent === c ? "3px solid #fff" : "2px solid transparent",
                    boxShadow: accent === c ? `0 0 0 2px ${c}` : undefined,
                    transform: accent === c ? "scale(1.12)" : "scale(1)",
                    transition: "all .15s",
                  }}
                />
              ))}
            </Space>
            <Space>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Tùy chỉnh:</span>
              <Input
                type="color"
                value={accent}
                onChange={(e) => setCA(e.target.value)}
                style={{ width: 36, height: 30, padding: 2, cursor: "pointer" }}
              />
              <span style={{ fontSize: 12, fontFamily: "monospace", color: "#475569" }}>
                {accent}
              </span>
            </Space>
          </Card>

          <Card style={{ marginBottom: 16 }} size="small" title="Font chữ">
            <Space wrap>
              {FONTS.map((f: { name: string; val: string }) => (
                <Button
                  key={f.name}
                  type={font === f.val ? "primary" : "default"}
                  style={{ fontFamily: f.val }}
                  onClick={() => setCF(f.val)}
                >
                  {f.name}
                </Button>
              ))}
            </Space>
          </Card>

          <Card size="small" title="Bo góc">
            <Space>
              {RADIUS_OPTIONS.map((r: { name: string; val: string }) => (
                <Button
                  key={r.val}
                  type={radius === r.val ? "primary" : "default"}
                  onClick={() => setCR(r.val)}
                >
                  {r.name}
                </Button>
              ))}
            </Space>
          </Card>
        </Col>

        {/* RIGHT: live preview */}
        <Col xs={24} md={16}>
          <Card size="small" title="Xem trước live">
            <div style={{ background: bg, borderRadius: 12, padding: 16 }}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: `${radius} ${radius} 4px 4px`,
                  overflow: "hidden",
                  marginBottom: 10,
                  boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                }}
              >
                <div style={{ height: 8, background: accent }} />
                <div style={{ padding: "14px 18px 12px", fontFamily: font }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#202124",
                      marginBottom: 4,
                      fontFamily: font,
                    }}
                  >
                    {form?.name ?? "Tên form của bạn"}
                  </div>
                  <div style={{ fontSize: 12, color: "#444746" }}>
                    {form?.description ?? "Mô tả form ở đây"}
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 4,
                  padding: "14px 18px",
                  boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                  fontFamily: font,
                }}
              >
                <div style={{ fontSize: 13.5, color: "#202124", marginBottom: 10 }}>
                  Họ và tên <span style={{ color: "#d93025" }}>*</span>
                </div>
                <div
                  style={{
                    borderBottom: `2px solid ${accent}`,
                    paddingBottom: 4,
                    fontSize: 13,
                    color: "#5f6368",
                  }}
                >
                  Nguyễn Văn A
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <Button
                  type="primary"
                  style={{ background: accent }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                  }}
                >
                  Gửi
                </Button>
              </div>
            </div>
          </Card>

          <Card size="small" title="Cấu hình hiện tại" style={{ marginTop: 16 }}>
            <Row gutter={[0, 8]}>
              {[
                ["Preset", THEMES.find((t: { id: string; name?: string }) => t.id === themeId)?.name],
                ["Accent", accent],
                ["Font", font.split(",")[0].replace(/'/g, "")],
                ["Bo góc", radius],
              ].map(([k, v]) => (
                <Col span={24} key={k}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "#64748b" }}>{k}</span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#0f172a",
                        fontFamily: k === "Font" ? font : undefined,
                      }}
                    >
                      {v}
                    </span>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}