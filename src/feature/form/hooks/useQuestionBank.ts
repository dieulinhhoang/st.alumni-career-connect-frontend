import { useState, useEffect, useCallback } from "react";
import { getQuestionBank } from "../api";
import type { BankQuestion } from "../api";

export interface UseQuestionBankReturn {
  questions: BankQuestion[];
  loading: boolean;
  error: string;
  search: string;
  setSearch: (v: string) => void;
  reload: () => void;
}

export function useQuestionBank(): UseQuestionBankReturn {
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearchRaw] = useState("");

  const fetchBank = useCallback(async (q?: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await getQuestionBank(q ? { search: q } : undefined);
      setQuestions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể tải thư viện câu hỏi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBank(); }, [fetchBank]);

  const setSearch = useCallback((v: string) => {
    setSearchRaw(v);
    fetchBank(v || undefined);
  }, [fetchBank]);

  return {
    questions,
    loading,
    error,
    search,
    setSearch,
    reload: () => fetchBank(search || undefined),
  };
}
