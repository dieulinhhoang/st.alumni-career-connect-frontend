// Hook lấy màu các khoa từ API.
import { useState, useEffect } from "react";
import type { FacultyKey } from "../type";

export function useFacultyColors() {
  const [colors, setColors] = useState<Partial<Record<FacultyKey, string>>>({});
  const [loaded, setLoaded] = useState(false);

  // useEffect(() => {
  //   fetchFacultyColors().then(data => {
  //     setColors(data);
  //     setLoaded(true);
  //   });
  // }, []);

  /** Trả về màu của khoa, fallback về xanh mặc định */
  const getColor = (faculty: string): string =>
    colors[faculty as FacultyKey] ?? "#2563eb";

  return { colors, loaded, getColor };
}