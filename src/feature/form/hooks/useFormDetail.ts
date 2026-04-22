import { useState, useEffect, useCallback } from "react";
import { getFormById } from "../api";
import type { Form } from "../types";

export interface UseFormDetailReturn {
  form:    Form | null;
  loading: boolean;
  error:   string;
  reload:  () => void;
}

export function useFormDetail(formId: number): UseFormDetailReturn {
  const [form,    setForm]    = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const fetchForm = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getFormById(formId);
      setForm(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : `Không thể tải form #${formId}.`);
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => { fetchForm(); }, [fetchForm]);

  return { form, loading, error, reload: fetchForm };
}