//  "FPT Software" "fpt-software"
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function findBySlug<T extends { name: string }>(list: T[], slug: string): T | undefined {
  return list.find(e => toSlug(e.name) === slug);
}