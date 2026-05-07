import type { Question } from "../types";

type Answers = Record<string, string | string[]>;

/**
 * Returns the sorted, filtered list of questions that should be visible
 * based on the current answers state.
 *
 * Usage:
 *   const visibleQuestions = useVisibleQuestions(form.questions, answers);
 *   // `answers` is a state: Record<questionId, value>
 */
export function useVisibleQuestions(
  questions: Question[],
  answers: Answers,
): Question[] {
  return questions
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((q) => {
      if (!q.visibleWhen) return true;

      const { questionId, operator, value } = q.visibleWhen;
      const ans = answers[questionId];

      if (operator === "equals") {
        return ans === value;
      }

      if (operator === "not_equals") {
        return ans !== value;
      }

      if (operator === "includes") {
        if (!Array.isArray(ans)) return false;
        if (Array.isArray(value)) {
          return value.some((v) => (ans as string[]).includes(v));
        }
        return (ans as string[]).includes(value as string);
      }

      return true;
    });
}
