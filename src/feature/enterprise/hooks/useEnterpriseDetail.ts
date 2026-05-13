//Hook cho trang chi tiết: load 1 enterprise + toàn bộ jobs của nó.
import { useState, useEffect, useCallback } from "react";
import {
  getEnterpriseById,
  updateEnterprise,
  updateEnterpriseVerified,
  setEnterprisePartnerStatus,
} from "../api";
import type { Enterprise, PartnerStatus } from "../type";

export function useEnterpriseDetail(id: string | undefined) {
  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  //  Load

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getEnterpriseById(id);
      setEnterprise(data);
    } catch {
      setError("Không tìm thấy doanh nghiệp");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  //  Update

  const edit = useCallback(async (payload: Partial<Enterprise>) => {
    if (!enterprise) return;
    const updated = await updateEnterprise(enterprise.id, payload as any);
    setEnterprise(updated);
    return updated;
  }, [enterprise]);

  //  Verify

  const verify = useCallback(async (verified: boolean) => {
    if (!enterprise) return;
    const updated = await updateEnterpriseVerified(enterprise.id, verified);
    setEnterprise(updated);
  }, [enterprise]);

  //  Toggle partner status

  const togglePartnerStatus = useCallback(async (status: PartnerStatus) => {
    if (!enterprise) return;
    const updated = await setEnterprisePartnerStatus(enterprise.id, status);
    setEnterprise(updated);
  }, [enterprise]);

  return {
    enterprise,
    loading,
    error,
    reload: load,
    edit,
    verify,
    togglePartnerStatus,
  };
}
