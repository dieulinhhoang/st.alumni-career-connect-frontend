 import { THEMES } from "../constants";
import type { Theme } from "../types";

export function useTheme(themeId?: string): Theme {
  return THEMES.find((t) => t.id === themeId) ?? THEMES[0];
}