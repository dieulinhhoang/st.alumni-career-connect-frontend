import { useState } from "react";
import type { Form, Question, QuestionOption } from "../types";

//  HELPERS 
export const genId = (): string => Math.random().toString(36).slice(2, 8);

export const newQuestion = (): Question => ({
  id: genId(),
  type: "short",
  title: "",
  required: false,
  options: [],
});

export const newOption = (): QuestionOption => ({ id: genId(), label: "" });

//  useFormList 
export function useFormList(initial: Form[]) {
  const [forms, setForms] = useState<Form[]>(initial);

  const saveForm = (form: Form) => {
    setForms((prev) => {
      const exists = prev.some((f) => f.id === form.id);
      if (exists) return prev.map((f) => (f.id === form.id ? form : f));
      const newForm: Form = {
        ...form,
        id: Date.now(),
        created_at: new Date().toISOString().slice(0, 10),
      };
      return [newForm, ...prev];
    });
  };

  const deleteForm = (id: number) => setForms((prev) => prev.filter((f) => f.id !== id));

  const dupForm = (form: Form) => {
    const copy: Form = {
      ...form,
      id: Date.now(),
      name: form.name + " (bản sao)",
      created_at: new Date().toISOString().slice(0, 10),
    };
    setForms((prev) => [copy, ...prev]);
  };

  const saveTheme = (form: Form) =>
    setForms((prev) => prev.map((f) => (f.id === form.id ? form : f)));

  return { forms, saveForm, deleteForm, dupForm, saveTheme };
}

//  useQuestionEditor 
export function useQuestionEditor(initial: Question[]) {
  const [questions, setQs] = useState<Question[]>(
    initial.length ? initial : [newQuestion()]
  );
  const [activeId, setActiveId] = useState<string>(
    initial.length ? initial[0].id : questions[0]?.id
  );

  const activeQ = questions.find((q) => q.id === activeId) ?? null;

  const updateQ = (id: string, patch: Partial<Question>) =>
    setQs((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const addQ = () => {
    const q = newQuestion();
    setQs((qs) => [...qs, q]);
    setActiveId(q.id);
  };

  const dupQ = (id: string) =>
    setQs((qs) => {
      const idx = qs.findIndex((q) => q.id === id);
      if (idx < 0) return qs;
      const copy: Question = {
        ...qs[idx],
        id: genId(),
        options: (qs[idx].options ?? []).map((o: { id: string; label: string }) => ({ ...o, id: genId() })),
      };
      const next = [...qs.slice(0, idx + 1), copy, ...qs.slice(idx + 1)];
      setActiveId(copy.id);
      return next;
    });

  const removeQ = (id: string) =>
    setQs((qs) => {
      const next = qs.filter((q) => q.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? "");
      return next.length ? next : [newQuestion()];
    });

  const moveUp = (i: number) => {
    if (i === 0) return;
    setQs((qs) => {
      const n = [...qs];
      [n[i - 1], n[i]] = [n[i], n[i - 1]];
      return n;
    });
  };

  const moveDown = (i: number) =>
    setQs((qs) => {
      if (i >= qs.length - 1) return qs;
      const n = [...qs];
      [n[i], n[i + 1]] = [n[i + 1], n[i]];
      return n;
    });

  //  Option helpers 
  const addOpt = (qid: string) =>
    setQs((qs) =>
      qs.map((q) =>
        q.id !== qid ? q : { ...q, options: [...(q.options ?? []), newOption()] }
      )
    );

  const updOpt = (qid: string, oid: string, label: string) =>
    setQs((qs) =>
      qs.map((q) =>
        q.id !== qid
          ? q
          : { ...q, options: (q.options ?? []).map((o: { id: string; label: string }) => (o.id === oid ? { ...o, label } : o)) }
      )
    );

  const removeOpt = (qid: string, oid: string) =>
    setQs((qs) =>
      qs.map((q) =>
        q.id !== qid ? q : { ...q, options: (q.options ?? []).filter((o: { id: string }) => o.id !== oid) }
      )
    );

  return {
    questions,
    activeId,
    setActiveId,
    activeQ,
    updateQ,
    addQ,
    dupQ,
    removeQ,
    moveUp,
    moveDown,
    addOpt,
    updOpt,
    removeOpt,
  };
}