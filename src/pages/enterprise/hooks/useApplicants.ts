import { useState, useEffect, useCallback } from 'react'
import api from '../../../libs/api'

export type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'rejected'

export interface Applicant {
  id: number
  fullName: string
  email: string
  phone: string
  message: string
  appliedAt: string
  status: ApplicationStatus
  job?: { id: number; title: string }
}

export function useApplicants(enterpriseId: string | undefined) {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async (filters?: { jobId?: number; status?: ApplicationStatus }) => {
    if (!enterpriseId) return
    setLoading(true)
    try {
      const res = await api.get(`/job-applications/by-enterprise/${enterpriseId}`, {
        params: { size: 100, ...filters },
      })
      setApplicants(res.data?.items ?? [])
    } catch {
      setApplicants([])
    } finally {
      setLoading(false)
    }
  }, [enterpriseId])

  useEffect(() => { load() }, [load])

  const updateStatus = useCallback(async (id: number, status: ApplicationStatus) => {
    await api.patch(`/job-applications/${id}/status`, { status })
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }, [])

  return { applicants, loading, reload: load, updateStatus }
}
