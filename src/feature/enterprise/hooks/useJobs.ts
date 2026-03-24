
import { useState, useEffect, useCallback } from "react";
import { fetchJobsByEnterprise, createJob, updateJob, deleteJob } from "../api";
import type { Job, JobFormValues } from "../type";
// Hook quản lý state & side-effects cho danh sách tin tuyển dụng của một doanh nghiệp.
// Cần truyền vào enterpriseId để hook biết lấy tin của doanh nghiệp nào.
export function useJobs(enterpriseId: string | undefined) {
  const [jobs, setJobs]     = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

// Load
  const load = useCallback(async () => {
    if (!enterpriseId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchJobsByEnterprise(enterpriseId);
      setJobs(data);
    } catch {
      setError("Không thể tải danh sách tin tuyển dụng");
    } finally {
      setLoading(false);
    }
  }, [enterpriseId]);

  useEffect(() => { load(); }, [load]);

  //Create 

  const addJob = useCallback(async (payload: JobFormValues) => {
    if (!enterpriseId) return;
    const newJob = await createJob(enterpriseId, payload);
    setJobs(prev => [newJob, ...prev]);
    return newJob;
  }, [enterpriseId]);

  // Update 

  const editJob = useCallback(async (jobId: string, payload: Partial<Job>) => {
    if (!enterpriseId) return;
    const updated = await updateJob(enterpriseId, jobId, payload);
    setJobs(prev => prev.map(j => j.id === jobId ? updated : j));
    return updated;
  }, [enterpriseId]);

  //   Delete 

  const removeJob = useCallback(async (jobId: string) => {
    if (!enterpriseId) return;
    await deleteJob(enterpriseId, jobId);
    setJobs(prev => prev.filter(j => j.id !== jobId));
  }, [enterpriseId]);

  //Derived 

  const activeJobs = jobs.filter(j => j.status === "active");
  const closedJobs = jobs.filter(j => j.status === "closed");

  return {
    jobs,
    activeJobs,
    closedJobs,
    loading,
    error,
    reload: load,
    addJob,
    editJob,
    removeJob,
  };
}