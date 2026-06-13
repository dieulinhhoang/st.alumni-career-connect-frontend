import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { fetchSubmissionStatus, submitReport, withdrawReport } from '../api';
import type { SubmissionStatus } from '../types';

type UseSubmissionStatusReturn = {
  status: SubmissionStatus;
  loading: boolean;
  submit: () => Promise<void>;
  withdraw: () => Promise<void>;
};

/** Trạng thái nộp báo cáo của 1 khoa trong 1 đợt khảo sát — đồng bộ với backend. */
export function useSubmissionStatus(
  batchId?: string,
  facultyId?: string,
): UseSubmissionStatusReturn {
  const [status, setStatus] = useState<SubmissionStatus>('draft');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!batchId || !facultyId) {
      setStatus('draft');
      return;
    }

    let cancelled = false;
    fetchSubmissionStatus(batchId, facultyId)
      .then((res) => {
        if (!cancelled) setStatus(res.status);
      })
      .catch(() => {
        if (!cancelled) setStatus('draft');
      });

    return () => { cancelled = true; };
  }, [batchId, facultyId]);

  const submit = useCallback(async () => {
    if (!batchId || !facultyId) return;
    setLoading(true);
    try {
      await submitReport(batchId, facultyId);
      setStatus('submitted');
      message.success('Đã nộp báo cáo lên trường.');
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Nộp báo cáo thất bại.');
    } finally {
      setLoading(false);
    }
  }, [batchId, facultyId]);

  const withdraw = useCallback(async () => {
    if (!batchId || !facultyId) return;
    setLoading(true);
    try {
      await withdrawReport(batchId, facultyId);
      setStatus('draft');
      message.success('Đã thu hồi báo cáo.');
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Thu hồi báo cáo thất bại.');
    } finally {
      setLoading(false);
    }
  }, [batchId, facultyId]);

  return { status, loading, submit, withdraw };
}
