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
import axios from 'axios';

export type ReportApiResponse = {
	currentUser: CurrentUser;
	stats: Stats;
	majorRows: MajorSummaryRow[];
	graduateRows: GraduateRow[];
	responseRows: ResponseRow[];
	facultyRows: FacultySubmissionRow[];
	reportMeta: ReportMeta;
};
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})
/**
 * Fetch comprehensive report data for the alumni survey.
 * @param filters - Filter criteria for the report
 * @param userIndex - Index to select current user (for demo scope switching)
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
