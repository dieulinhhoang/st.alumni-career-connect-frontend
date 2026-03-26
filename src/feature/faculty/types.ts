export interface Faculty {
  id: string;
  slug: string;
  name: string;
  abbr: string;
  color: string;
  majors: number;
  classes: number;
  students: number;
}

export interface Major {
  id: string;
  slug: string;
  facultySlug: string;
  name: string;
  code: string;
  khoa: number[];
  classes: number;
  students: number;
}

export interface ClassItem {
  id: string;
  name: string;
  khoa: number;
  students: number;
  advisor: string;
}