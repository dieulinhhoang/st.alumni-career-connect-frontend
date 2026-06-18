import { useState, useEffect, useCallback } from 'react'
import api from '../../../libs/api'

export interface Applicant {
  id: number
  fullName: string
  email: string
  phone: string
  message: string
  appliedAt: string
  job?: { id: number; title: string }
}

export function useApplicants(enterpriseId: string | undefined) {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!enterpriseId) return
    setLoading(true)
    try {
      const res = await api.get(`/job-applications/by-enterprise/${enterpriseId}`, {
        params: { size: 100 },
      })
      setApplicants(res.data?.items ?? [])
    } catch {
      setApplicants([])
    } finally {
      setLoading(false)
    }
  }, [enterpriseId])

  useEffect(() => { load() }, [load])

  return { applicants, loading, reload: load }
}
