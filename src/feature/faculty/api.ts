import type { Faculty, Major, ClassItem } from "./types";
import {api} from "../../libs/api";

/**
 * Fetch list of all faculties.
 */
export async function fetchFaculties(): Promise<Faculty[]> {
	const res = await api.get("/faculties");
	return res.data ?? [];
}

/**
 * Fetch a single faculty by slug.
 * @param slug - Faculty slug
 */
export async function fetchFacultyBySlug(slug: string): Promise<Faculty | null> {
	const res = await api.get(`/faculties/${slug}`);
	return res.data ?? null;
}

/**
 * Fetch all majors belonging to a faculty.
 * @param facultySlug - Faculty slug
 */
export async function fetchMajorsByFacultySlug(
	facultySlug: string
): Promise<Major[]> {
	const res = await api.get("/majors", { params: { faculty_slug: facultySlug } });
	return res.data ?? [];
}

/**
 * Fetch a single major by slug.
 * @param majorSlug - Major slug
 */
export async function fetchMajorBySlug(majorSlug: string): Promise<Major | null> {
	const res = await api.get(`/majors/${majorSlug}`);
	return res.data ?? null;
}

/**
 * Fetch all classes belonging to a major.
 * @param majorSlug - Major slug
 */
export async function fetchClassesByMajorSlug(
	majorSlug: string
): Promise<ClassItem[]> {
	const res = await api.get("/classes", { params: { major_slug: majorSlug } });
	return res.data ?? [];
}
