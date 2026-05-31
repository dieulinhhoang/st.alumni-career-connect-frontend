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
 * Fetch available survey batch options (replaces hardcoded SURVEY_OPTIONS)
 */
export async function fetchSurveyOptions(): Promise<SurveyOption[]> {
	const res = await api.get('/surveys/options');
	return res.data ?? [];
}

/**
 * Fetch survey config including deadline
 */
export async function fetchSurveyConfig(): Promise<SurveyConfig> {
	const res = await api.get('/surveys/config');
	return res.data;
}
