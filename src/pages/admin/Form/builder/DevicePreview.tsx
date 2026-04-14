import { useState } from "react";
import { PDFCanvas } from "./PDFCanvas";
import { IcDesktop, IcTablet, IcMobile } from "./Icons";
import type { Question } from "../../../../feature/form/types";

type Device = "desktop" | "tablet" | "mobile";

const DEVICE_CONFIG: Record<Device, { width: number | string; label: string; icon: React.ReactNode }> = {
  desktop: { width: "100%", label: "Desktop", icon: <IcDesktop /> },
  tablet: { width: 768, label: "Tablet", icon: <IcTablet /> },
  mobile: { width: 390, label: "Mobile", icon: <IcMobile /> },
};

interface DevicePreviewProps {
  name: string;
  desc: string;
  questions: Question[];
  accent: string;
}

export function DevicePreview({ name, desc, questions, accent }: DevicePreviewProps) {
  const [device, setDevice] = useState<Device>("desktop");
  const cfg = DEVICE_CONFIG[device];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0 8px", borderBottom: "1px solid #e5e7eb", flexShrink: 0, background: "#fff" }}>
        {(["desktop", "tablet", "mobile"] as Device[]).map(d => (
          <button key={d} onClick={() => setDevice(d)}
            style={{ display: "flex", alignItems: "center", gap: 5, height: 30, padding: "0 14px", borderRadius: 6, border: `1px solid ${device === d ? accent : "#e5e7eb"}`, background: device === d ? accent + "12" : "#fff", color: device === d ? accent : "#6b7280", fontSize: 12.5, fontWeight: device === d ? 700 : 500, cursor: "pointer", transition: "all .15s", fontFamily: "inherit" }}>
            {DEVICE_CONFIG[d].icon}
            {DEVICE_CONFIG[d].label}
            {d !== "desktop" && <span style={{ fontSize: 11, color: device === d ? accent : "#9ca3af" }}>{DEVICE_CONFIG[d].width}px</span>}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", background: "#e8e8e8", display: "flex", justifyContent: "center", padding: "24px 16px" }}>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {device !== "desktop" && (
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}>
              {DEVICE_CONFIG[device].label} — {DEVICE_CONFIG[device].width}px
            </div>
          )}
          <div style={{
            width: cfg.width,
            maxWidth: "100%",
            background: "#f5f5f5",
            borderRadius: device !== "desktop" ? 16 : 0,
            boxShadow: device !== "desktop" ? "0 8px 32px rgba(0,0,0,.18), 0 0 0 2px #ccc" : "none",
            overflow: "hidden",
            border: device !== "desktop" ? "8px solid #1a1a1a" : "none",
          }}>
            {device === "mobile" && <div style={{ height: 24, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 60, height: 6, borderRadius: 3, background: "#333" }} /></div>}
            {device === "tablet" && <div style={{ height: 12, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#444" }} /></div>}
            <div style={{ maxHeight: device === "desktop" ? "calc(100vh - 220px)" : 600, overflowY: "auto" }}>
              <PDFCanvas
                  surveyTitle={name}
                  descriptionParagraphs={desc ? [desc] : []}
                  sections={[]}
                  questions={questions}
                  accent={accent}
                  header={{ ministry: "", academy: "", address: "", phone: "", showDate: false }}
                  footer={{ primaryText: "", secondaryText: "" }}
                  interactive={false}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}