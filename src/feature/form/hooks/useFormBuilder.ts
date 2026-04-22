//  create & edit form
import { useState, useEffect, useCallback } from "react";
import { getFormById, createForm, updateForm } from "../api";
import type { Form, Question, QuestionOption } from "../types";

export type BuilderMode = "create" | "edit";

const _genId = () => Math.random().toString(36).slice(2, 8);

const _newQuestion = (): Question => ({
  id:       _genId(),
  type:     "short",
  title:    "",
  required: false,
  options:  [],
});

export interface UseFormBuilderReturn {
  // meta
  name:    string;
  desc:    string;
  setName: (v: string) => void;
  setDesc: (v: string) => void;

  // questions
  questions:       Question[];
  activeId:        string | null;
  setActiveId:     (id: string | null) => void;
  activeQuestion:  Question | undefined;

  // question actions
  addQuestion:       () => void;
  duplicateQuestion: (id: string) => void;
  removeQuestion:    (id: string) => void;
  updateQuestion:    (id: string, patch: Partial<Question>) => void;
  moveUp:            (index: number) => void;
  moveDown:          (index: number) => void;

  // option actions
  addOption:    (questionId: string) => void;
  updateOption: (questionId: string, optionId: string, label: string) => void;
  removeOption: (questionId: string, optionId: string) => void;

  // load state (edit mode)
  loading:   boolean;
  loadError: string;

  // save state
  saving:     boolean;
  saved:      boolean;
  saveError:  string;
  handleSave: () => Promise<Form | null>;
}

export function useFormBuilder(
  mode: BuilderMode,
  formId?: number
): UseFormBuilderReturn {
  const initialQ = _newQuestion();

  const [name,     setName]     = useState("");
  const [desc,     setDesc]     = useState("");
  const [questions, setQs]      = useState<Question[]>([initialQ]);
  const [activeId, setActiveId] = useState<string | null>(initialQ.id);

  const [loading,   setLoading]   = useState(mode === "edit");
  const [loadError, setLoadError] = useState("");
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [saveError, setSaveError] = useState("");

  //  Load form khi edit mode 

  useEffect(() => {
    if (mode !== "edit" || !formId) return;
    let cancelled = false;

    setLoading(true);
    getFormById(formId)
      .then((form: import('../types').Form) => {
        if (cancelled) return;
        setName(form.name);
        setDesc(form.description);
        const qs = form.questions.length > 0 ? form.questions : [_newQuestion()];
        setQs(qs);
        setActiveId(qs[0]?.id ?? null);
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setLoadError(e instanceof Error ? e.message : "Không thể tải form.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [mode, formId]);

  //  Question helpers 

  const updateQ = useCallback((id: string, patch: Partial<Question>) =>
    setQs(qs => qs.map(q => q.id === id ? { ...q, ...patch } : q)), []);

  const addQuestion = useCallback(() => {
    const q = _newQuestion();
    setQs(qs => [...qs, q]);
    setActiveId(q.id);
  }, []);

  const duplicateQuestion = useCallback((id: string) => {
    setQs(qs => {
      const idx = qs.findIndex(q => q.id === id);
      if (idx === -1) return qs;
      const copy: Question = {
        ...qs[idx],
        id:      _genId(),
        options: (qs[idx].options ?? []).map((o: { id: string; label: string }) => ({ ...o, id: _genId() })),
      };
      const next = [...qs.slice(0, idx + 1), copy, ...qs.slice(idx + 1)];
      setActiveId(copy.id);
      return next;
    });
  }, []);

  const removeQuestion = useCallback((id: string) => {
    setQs(qs => {
      const next = qs.filter(q => q.id !== id);
      setActiveId(prev => prev === id ? (next[0]?.id ?? null) : prev);
      return next;
    });
  }, []);

  const updateQuestion = useCallback((id: string, patch: Partial<Question>) => {
    updateQ(id, patch);
  }, [updateQ]);

  const moveUp = useCallback((i: number) => {
    if (i === 0) return;
    setQs(qs => {
      const next = [...qs];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((i: number) => {
    setQs(qs => {
      if (i >= qs.length - 1) return qs;
      const next = [...qs];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  }, []);

  //  Option helpers 

  const addOption = useCallback((qid: string) => {
    setQs(qs => qs.map(q => {
      if (q.id !== qid) return q;
      const opts: QuestionOption[] = [...(q.options ?? []), { id: _genId(), label: "" }];
      return { ...q, options: opts };
    }));
  }, []);

  const updateOption = useCallback((qid: string, oid: string, label: string) => {
    setQs(qs => qs.map(q => {
      if (q.id !== qid) return q;
      return { ...q, options: (q.options ?? []).map((o: { id: string; label: string }) => o.id === oid ? { ...o, label } : o) };
    }));
  }, []);

  const removeOption = useCallback((qid: string, oid: string) => {
    setQs(qs => qs.map(q => {
      if (q.id !== qid) return q;
      return { ...q, options: (q.options ?? []).filter((o: { id: string }) => o.id !== oid) };
    }));
  }, []);

  //  Save 

  const handleSave = useCallback(async (): Promise<Form | null> => {
    if (!name.trim()) return null;
    setSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      let result: Form;
      if (mode === "create") {
        result = await createForm({ name, description: desc, questions });
      } else {
        result = await updateForm(formId!, { name, description: desc, questions });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      return result;
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Lưu thất bại.");
      return null;
    } finally {
      setSaving(false);
    }
  }, [mode, formId, name, desc, questions]);

  return {
    name, desc, setName, setDesc,
    questions,
    activeId, setActiveId,
    activeQuestion: questions.find(q => q.id === activeId),
    addQuestion, duplicateQuestion, removeQuestion, updateQuestion,
    moveUp, moveDown,
    addOption, updateOption, removeOption,
    loading, loadError,
    saving, saved, saveError, handleSave,
  };
}