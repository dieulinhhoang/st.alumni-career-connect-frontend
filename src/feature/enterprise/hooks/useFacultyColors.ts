// Hook lấy màu các khoa từ FACULTY_COLOR_MAP (static, không cần API).
import { FACULTY_COLOR_MAP } from "../type";
import type { FacultyKey } from "../type";

export function useFacultyColors() {
  /** Trả về màu của khoa, fallback về tím mặc định */
  const getColor = (faculty: string): string =>
    FACULTY_COLOR_MAP[faculty as FacultyKey] ?? "#7c3aed";

  return { colors: FACULTY_COLOR_MAP, loaded: true, getColor };
}
