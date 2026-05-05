import { useState } from "react";
import type { Question, QuestionOption } from "../types";

export const genId = (): string => Math.random().toString(36).slice(2, 8);
export const newOption = (): QuestionOption => ({ id: genId(), label: "" });

export const newQuestion = (
  sectionId: string,
  title?: string,
  type?: Question["type"],
  options?: QuestionOption[]
): Question => ({
  id: genId(),
  type: type ?? "short",
  title: title ?? "",
  required: false,
  options: options ?? [],
  sectionId,
  order: 0,
});

export function useQuestionEditor(initial: Question[]) {
  const [questions, setQs] = useState<Question[]>(initial);
  const [activeId, setActiveId] = useState<string | null>(
    initial.length ? initial[0].id : null
  );

  // Thêm câu hỏi mới vào một section cụ thể
  const addQuestion = (
    sectionId: string,
    type?: Question["type"],
    title?: string,
    options?: QuestionOption[]
  ) => {
    const q = newQuestion(sectionId, title, type, options);
    setQs((prev) => [...prev, q]);
    setActiveId(q.id);
    return q.id;
  };

  // Chèn câu hỏi vào vị trí bất kỳ (kéo thả) — cần sectionId
  const insertQuestionAt = (
    index: number,
    sectionId: string,
    type?: Question["type"],
    title?: string,
    options?: QuestionOption[]
  ) => {
    const q = newQuestion(sectionId, title, type, options);
    setQs((prev) => {
      const next = [...prev];
      next.splice(index, 0, q);
      return next;
    });
    setActiveId(q.id);
    return q.id;
  };

  const updateQuestion = (id: string, patch: Partial<Question>) =>
    setQs((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const duplicateQuestion = (id: string) => {
    setQs((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx === -1) return prev;
      const copy: Question = {
        ...prev[idx],
        id: genId(),
        options: prev[idx].options.map((o) => ({ ...o, id: genId() })),
      };
      const next = [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
      setActiveId(copy.id);
      return next;
    });
  };

  const removeQuestion = (id: string) => {
    setQs((prev) => {
      const next = prev.filter((q) => q.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  };

  const moveQuestion = (id: string, direction: 'up' | 'down') => {
  setQs((prev) => {
    const idx = prev.findIndex((q) => q.id === id)
    if (idx === -1) return prev
    const toIndex = direction === 'up' ? idx - 1 : idx + 1
    if (toIndex < 0 || toIndex >= prev.length) return prev
    const next = [...prev]
    const [moved] = next.splice(idx, 1)
    next.splice(toIndex, 0, moved)
    return next
  })
}
  // Option helpers
  const addOption = (qid: string) => {
    setQs((prev) =>
      prev.map((q) =>
        q.id === qid ? { ...q, options: [...(q.options ?? []), newOption()] } : q
      )
    );
  };
  const updateOption = (qid: string, oid: string, label: string) => {
    setQs((prev) =>
      prev.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.map((o) => (o.id === oid ? { ...o, label } : o)) }
          : q
      )
    );
  };
  const removeOption = (qid: string, oid: string) => {
    setQs((prev) =>
      prev.map((q) =>
        q.id === qid ? { ...q, options: q.options.filter((o) => o.id !== oid) } : q
      )
    );
  };

  return {
    questions,
    activeId,
    setActiveId,
    addQuestion,
    insertQuestionAt,
    updateQuestion,
    duplicateQuestion,
    removeQuestion,
    moveQuestion,
    addOption,
    updateOption,
    removeOption,
  };
}