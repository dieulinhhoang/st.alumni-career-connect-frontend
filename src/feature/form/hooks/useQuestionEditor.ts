import { useState } from "react";
import type { Question, QuestionOption } from "../types";

export const genId = (): string => Math.random().toString(36).slice(2, 8);
export const newOption = (): QuestionOption => ({ id: genId(), label: "" });

export const newQuestion = (title?: string, type?: Question["type"], options?: QuestionOption[]): Question => ({
  id: genId(),
  type: type ?? "short",
  title: title ?? "",
  required: false,
  options: options ?? [],
});

export function useQuestionEditor(initial: Question[]) {
  const [questions, setQs] = useState<Question[]>(initial.length ? initial : [newQuestion()]);
  const [activeId, setActiveId] = useState<string>(initial.length ? initial[0].id : questions[0]?.id);

  // Thêm câu hỏi mới (có thể tùy chỉnh title, type, options)
  const addQuestion = (type?: Question["type"], title?: string, options?: QuestionOption[]) => {
    const q = newQuestion(title, type, options);
    setQs(prev => [...prev, q]);
    setActiveId(q.id);
  };

  // Chèn câu hỏi vào vị trí bất kỳ (dùng cho kéo thả)
  const insertQuestionAt = (index: number, type?: Question["type"], title?: string, options?: QuestionOption[]) => {
    const q = newQuestion(title, type, options);
    setQs(prev => {
      const newList = [...prev];
      newList.splice(index, 0, q);
      return newList;
    });
    setActiveId(q.id);
  };

  const updateQuestion = (id: string, patch: Partial<Question>) =>
    setQs(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q));

  const duplicateQuestion = (id: string) => {
    setQs(prev => {
      const idx = prev.findIndex(q => q.id === id);
      if (idx === -1) return prev;
      const copy: Question = {
        ...prev[idx],
        id: genId(),
        options: prev[idx].options.map(o => ({ ...o, id: genId() })),
      };
      const newList = [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
      setActiveId(copy.id);
      return newList;
    });
  };

  const removeQuestion = (id: string) => {
    setQs(prev => {
      const newList = prev.filter(q => q.id !== id);
      if (activeId === id) setActiveId(newList[0]?.id ?? null);
      return newList.length ? newList : [newQuestion()];
    });
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setQs(prev => {
      const newList = [...prev];
      const [moved] = newList.splice(fromIndex, 1);
      newList.splice(toIndex, 0, moved);
      return newList;
    });
  };

  // Option helpers
  const addOption = (qid: string) => {
    setQs(prev => prev.map(q => q.id === qid ? { ...q, options: [...(q.options ?? []), newOption()] } : q));
  };
  const updateOption = (qid: string, oid: string, label: string) => {
    setQs(prev => prev.map(q => q.id === qid ? {
      ...q,
      options: q.options.map(o => o.id === oid ? { ...o, label } : o)
    } : q));
  };
  const removeOption = (qid: string, oid: string) => {
    setQs(prev => prev.map(q => q.id === qid ? {
      ...q,
      options: q.options.filter(o => o.id !== oid)
    } : q));
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