import type { Question } from "../types";

export const genId = (): string => Math.random().toString(36).slice(2, 8);

// Gom các câu hỏi cùng rowGroup thành mảng con để render 2-3 câu trên 1 hàng.
// Dùng chung cho builder canvas và preview.
export function groupByRow(qs: Question[]): (Question | Question[])[] {
  const result: (Question | Question[])[] = [];
  const groups = new Map<string, Question[]>();
  for (const q of qs) {
    if (!q.rowGroup) {
      result.push(q);
      continue;
    }
    const group = groups.get(q.rowGroup);
    if (group) {
      group.push(q);
    } else {
      const fresh = [q];
      groups.set(q.rowGroup, fresh);
      result.push(fresh);
    }
  }
  return result;
}
