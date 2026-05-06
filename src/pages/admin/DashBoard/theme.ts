export const COLOR = {
  primary:   "#4f46e5",   
  primaryLight: "#6366f1",
  success:   "#059669",
  warning:   "#d97706",
  danger:    "#dc2626",
  pink:      "#db2777",

  // Text — tăng contrast rõ hơn
  textDark:  "#0f172a",
  textBase:  "#1e293b",
  textMuted: "#475569",   
  textFaint: "#94a3b8",

  // Surface — phân tầng rõ hơn
  border:     "#e2e8f0",   
  borderSoft: "#f1f5f9",
  bgCard:     "#ffffff",
  bgMuted:    "#f8fafc",
  bgFilter:   "#f1f5f9",
} as const;

export const RADIUS = {
  sm:  6,
  md:  10,
  lg:  14,
  xl:  18,
  pill: 100,
} as const;

export const SHADOW = {
  card:  "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
  hover: "0 4px 12px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.08)",
  sm:    "0 1px 3px rgba(0,0,0,0.08)",
} as const;