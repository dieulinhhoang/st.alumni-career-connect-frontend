import api from '../../libs/api';
import type {
	FilterState,
	CurrentUser,
	Stats,
	MajorSummaryRow,
	GraduateRow,
	ResponseRow,
	FacultySubmissionRow,
	ReportMeta,
} from './types';

export type ReportApiResponse = {
	currentUser: CurrentUser;
	stats: Stats;
	majorRows: MajorSummaryRow[];
	graduateRows: GraduateRow[];
	responseRows: ResponseRow[];
	facultyRows: FacultySubmissionRow[];
	reportMeta: ReportMeta;
};

export type SurveyOption = {
	value: string;
	label: string;
};

export type SurveyConfig = {
	options: SurveyOption[];
	deadline: string;
};

/**
 * Fetch comprehensive report data for the alumni survey.
 */
export async function fetchReportData(
	filters: FilterState,
	userIndex: number
): Promise<ReportApiResponse> {
	const res = await api.post('/reports', {
		filters,
		userIndex,
	});
	return res.data;
}

/**
 * Fetch available survey batch options from ended batches.
 * Replaces the old /surveys/options endpoint which did not exist on the backend.
 */
export async function fetchSurveyOptions(): Promise<SurveyOption[]> {
	const res = await api.get('/statistics/batches');
	const batches: Array<{ id: number; title: string; year?: number; graduationPeriod?: string }> =
		res.data ?? [];

	return batches.map((b) => ({
		value: String(b.id),
		label: b.graduationPeriod
			? `${b.title} (${b.graduationPeriod})`
			: b.year
			? `${b.title} (${b.year})`
			: b.title,
	}));
}

/**
 * Fetch survey config including deadline.
 * /surveys/config does not exist on the backend; derive deadline from the
 * most-recently-ended batch instead (endDate of the first result).
 */
export async function fetchSurveyConfig(): Promise<SurveyConfig> {
	const res = await api.get('/statistics/batches');
	const batches: Array<{ id: number; title: string; endDate?: string }> = res.data ?? [];

	const options: SurveyOption[] = batches.map((b) => ({
		value: String(b.id),
		label: b.title,
	}));

	// Use the end date of the most recent batch as the "deadline"
	const deadline = batches[0]?.endDate ?? '';

	return { options, deadline };
}