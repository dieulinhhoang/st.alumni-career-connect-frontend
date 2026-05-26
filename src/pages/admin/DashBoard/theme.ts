export const COLOR = {
  // VNUA green — đậm, nông nghiệp, uy tín
  primary:      "#1a5c38",   // deep forest green
  primaryLight: "#237a4b",
  primaryMid:   "#2d9e61",
  primaryTint:  "#e8f5ee",   // very light green bg

  // Accents
  gold:    "#b07d2e",        // earthy warm gold
  goldBg:  "#fdf4e3",
  success: "#2a7d4f",
  warning: "#9a6118",
  danger:  "#c0392b",
  pink:    "#8c4774",

  // Text — high contrast, clean
  textDark:  "#111c14",
  textBase:  "#1e3326",
  textMuted: "#4a6358",
  textFaint: "#849e91",

  // Surface
  border:      "#d6e4dc",
  borderSoft:  "#eaf3ee",
  bgCard:      "#ffffff",
  bgPage:      "#f7faf8",    // very subtle warm-green tinted page
  bgMuted:     "#f1f7f3",
  bgFilter:    "#ebf4ef",
} as const;

export const RADIUS = {
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  pill: 100,
} as const;

export const SHADOW = {
  card:  "0 1px 2px rgba(26,92,56,0.06), 0 2px 8px rgba(26,92,56,0.05)",
  hover: "0 4px 12px rgba(26,92,56,0.10), 0 8px 24px rgba(26,92,56,0.07)",
  sm:    "0 1px 3px rgba(0,0,0,0.06)",
} as const;