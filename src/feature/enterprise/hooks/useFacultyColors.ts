// Hook lấy màu các khoa từ API.
import { useState, useEffect } from "react";
import { fetchFacultyColors } from "../api";
import type { FacultyKey } from "../type";

export function useFacultyColors() {
  const [colors, setColors] = useState<Partial<Record<FacultyKey, string>>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchFacultyColors().then(data => {
      setColors(data);
      setLoaded(true);
    });
  }, []);

  /** Trả về màu của khoa, fallback về tím mặc định */
  const getColor = (faculty: string): string =>
    colors[faculty as FacultyKey] ?? "#7c3aed";

  return { colors, loaded, getColor };
}