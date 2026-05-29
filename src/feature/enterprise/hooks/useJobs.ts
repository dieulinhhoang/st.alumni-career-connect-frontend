import { useState, useEffect, useCallback } from "react";
import { fetchJobsByEnterprise, createJob, updateJob, deleteJob } from "../api";
import type { Job, JobFormValues, JobStatus } from "../type";

// Hook quản lý state & side-effects cho danh sách tin tuyển dụng của một doanh nghiệp.
// Cần truyền vào enterpriseId để hook biết lấy tin của doanh nghiệp nào.
export function useJobs(enterpriseId: string | undefined) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra job có quá hạn nộp không
  function isExpired(job: Job): boolean {
    if (!job.deadline || job.status === "closed") return false;
    try {
      const deadlineDate = new Date(job.deadline);
      if (Number.isNaN(deadlineDate.getTime())) return false;
      return deadlineDate < new Date();
    } catch {
      return false;
    }
  }

  // Load
  const load = useCallback(async () => {
    if (!enterpriseId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchJobsByEnterprise(enterpriseId);
      // Tự động chuyển status sang "closed" nếu quá hạn deadline
      const normalized = data.map((job) =>
        isExpired(job)
          ? { ...job, status: "closed" as JobStatus }
          : job
      );
      // Nếu có job được chuyển sang closed, gọi update từng job
      const expiredJobs = normalized.filter(
        (job, i) => isExpired(data[i]) && data[i].status === "active"
      );
      setJobs(normalized);
      if (expiredJobs.length > 0) {
        // fire-and-forget update status cho các job hết hạn
        expiredJobs.forEach((job) => {
          if (job.id)
            updateJob(enterpriseId, job.id, { status: "closed" }).catch(
              () => {}
            );
        });
      }
    } catch {
      setError("Không thể tải danh sách tin tuyển dụng");
    } finally {
      setLoading(false);
    }
  }, [enterpriseId]);

  useEffect(() => {
    load();
  }, [load]);

  // Create
  const addJob = useCallback(async (payload: JobFormValues) => {
    if (!enterpriseId) return;
    const newJob = await createJob(enterpriseId, payload);
    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  }, [enterpriseId]);

  // Update
  const editJob = useCallback(async (jobId: string, payload: Partial<Job>) => {
    if (!enterpriseId) return;
    const updated = await updateJob(enterpriseId, jobId, payload);
    setJobs((prev) =>
      prev
        .map((j) => (j.id === jobId ? updated : j))
        .map((job) =>
          isExpired(job) ? { ...job, status: "closed" as JobStatus } : job
        )
    );
    return updated;
  }, [enterpriseId]);

  // Delete
  const removeJob = useCallback(async (jobId: string) => {
    if (!enterpriseId) return;
    await deleteJob(enterpriseId, jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }, [enterpriseId]);

  // Derived
  const activeJobs = jobs.filter(
    (j) => j.status === "active" && !isExpired(j)
  );
  const closedJobs = jobs.filter(
    (j) => j.status === "closed" || isExpired(j)
  );

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