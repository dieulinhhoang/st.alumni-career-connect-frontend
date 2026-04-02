import { useState, useEffect, useCallback, useRef } from "react";
import { getForms, deleteForm, duplicateForm } from "../api";
import type { Form, GetFormsParams } from "../types";

export interface UseFormListReturn {
  forms:           Form[];
  total:           number;
  loading:         boolean;
  error:           string;
  search:          string;
  setSearch:       (v: string) => void;
  reload:          () => void;
  handleDelete:    (id: number) => Promise<void>;
  handleDuplicate: (id: number) => Promise<void>;
}

export function useFormList(initialParams?: GetFormsParams): UseFormListReturn {
  const [forms,   setForms]   = useState<Form[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearchRaw] = useState(initialParams?.search ?? "");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchForms = useCallback(async (q: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await getForms({ search: q, page: 1, pageSize: 50 });
      setForms(res.data);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể tải danh sách form.");
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch lần đầu
  useEffect(() => { fetchForms(search); }, []); // eslint-disable-line

  const setSearch = useCallback((v: string) => {
    setSearchRaw(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchForms(v), 300);
  }, [fetchForms]);

  const reload = useCallback(() => fetchForms(search), [fetchForms, search]);

  const handleDelete = useCallback(async (id: number) => {
    // optimistic update
    setForms(prev => prev.filter(f => f.id !== id));
    setTotal(prev => prev - 1);
    try {
      await deleteForm(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xóa thất bại.");
      reload(); // rollback
    }
  }, [reload]);

  const handleDuplicate = useCallback(async (id: number) => {
    try {
      const newForm = await duplicateForm(id);
      setForms(prev => [newForm, ...prev]);
      setTotal(prev => prev + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nhân bản thất bại.");
    }
  }, []);

  return {
    forms, total, loading, error,
    search, setSearch,
    reload, handleDelete, handleDuplicate,
  };
}