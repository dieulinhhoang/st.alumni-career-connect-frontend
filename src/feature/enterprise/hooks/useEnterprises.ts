import { useState, useEffect, useCallback } from "react";
import {
  listEnterprises,
  createEnterprise,
  updateEnterprise,
  updateEnterpriseVerified,
  setEnterprisePartnerStatus,
} from "../api";
import type { Enterprise, EnterpriseFormValues, PartnerStatus } from "../type";

// Hook quản lý toàn bộ state & side-effects cho danh sách doanh nghiệp.
export function useEnterprises() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listEnterprises();
      setEnterprises(data);
    } catch (e) {
      setError("Không thể tải danh sách doanh nghiệp");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Create
  const addEnterprise = useCallback(async (payload: EnterpriseFormValues) => {
    const newEnt = await createEnterprise(payload);
    setEnterprises(prev => [newEnt, ...prev]);
    return newEnt;
  }, []);

  // Update
  const editEnterprise = useCallback(async (id: string, payload: EnterpriseFormValues) => {
    const updated = await updateEnterprise(id, payload);
    setEnterprises(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  }, []);

  // Verify
  const verify = useCallback(async (id: string, verified: boolean) => {
    const updated = await updateEnterpriseVerified(id, verified);
    setEnterprises(prev => prev.map(e => e.id === id ? updated : e));
  }, []);

  // Toggle partner status
  const togglePartnerStatus = useCallback(async (id: string, status: PartnerStatus) => {
    const updated = await setEnterprisePartnerStatus(id, status);
    setEnterprises(prev => prev.map(e => e.id === id ? updated : e));
  }, []);

  return {
    enterprises,
    loading,
    error,
    reload: load,
    addEnterprise,
    editEnterprise,
    verify,
    togglePartnerStatus,
  };
}
