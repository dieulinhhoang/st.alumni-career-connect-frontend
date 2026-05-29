import { useState, useEffect, useCallback } from "react";
import {
  fetchEnterprises,
  createEnterprise,
  updateEnterprise,
  verifyEnterprise,
  setPartnerStatus,
} from "../api";
import type { Enterprise, EnterpriseFormValues, PartnerStatus } from "../type";

// Hook quản lý toàn bộ state & side-effects cho danh sách doanh nghiệp.
// Hỗ trợ filter theo facultyId và pagination server-side.

export interface UseEnterprisesOptions {
  facultyId?: string;
  page?: number;
  size?: number;
}

export interface UseEnterprisesReturn {
  enterprises: Enterprise[];
  loading: boolean;
  error: string | null;
  total: number;
  pagination: { page: number; size: number };
  reload: () => void;
  setFacultyId: (id: string | undefined) => void;
  setPage: (page: number) => void;
  addEnterprise: (payload: EnterpriseFormValues) => Promise<Enterprise>;
  editEnterprise: (id: string, payload: Partial<Enterprise>) => Promise<Enterprise>;
  verify: (id: string) => Promise<Enterprise>;
  togglePartnerStatus: (id: string, status: PartnerStatus) => Promise<Enterprise>;
}

export function useEnterprises(options?: UseEnterprisesOptions): UseEnterprisesReturn {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [facultyId, setFacultyIdState] = useState<string | undefined>(options?.facultyId);
  const [page, setPageState] = useState(options?.page ?? 0);
  const [size, setSize] = useState(options?.size ?? 10);

  const setFacultyId = useCallback((id: string | undefined) => {
    setFacultyIdState(id);
    setPageState(0);
  }, []);

  const setPage = useCallback((p: number) => {
    setPageState(p);
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: UseEnterprisesOptions = {
        facultyId: facultyId && facultyId !== "" ? facultyId : undefined,
        page,
        size,
      };

      const raw = await fetchEnterprises(params);

      // normalizeList trả về array nhưng BE có thể ra { items: [], total: N }
      // Nếu BE trả object có `items` và `total`, ta gán đúng
      if (Array.isArray(raw)) {
        setEnterprises(raw);
        setTotal(raw.length);
      } else if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        if (Array.isArray(obj.items)) {
          setEnterprises(obj.items as Enterprise[]);
          setTotal((obj.total as number) ?? obj.items.length);
        } else if (Array.isArray(obj.data)) {
          setEnterprises(obj.data as Enterprise[]);
          setTotal((obj.total as number) ?? obj.data.length);
        } else if (Array.isArray(obj.results)) {
          setEnterprises(obj.results as Enterprise[]);
          setTotal((obj.total as number) ?? obj.results.length);
        }
      }
    } catch (e) {
      setError("Không thể tải danh sách doanh nghiệp");
    } finally {
      setLoading(false);
    }
  }, [facultyId, page, size]);

  useEffect(() => { load(); }, [load]);

  // Create
  const addEnterprise = useCallback(async (payload: EnterpriseFormValues) => {
    const newEnt = await createEnterprise(payload);
    setEnterprises(prev => [newEnt, ...prev]);
    setTotal(prev => prev + 1);
    return newEnt;
  }, []);

  // Update
  const editEnterprise = useCallback(async (id: string, payload: Partial<Enterprise>) => {
    const updated = await updateEnterprise(id, payload);
    setEnterprises(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  }, []);

  // Verify
  const verify = useCallback(async (id: string) => {
    const updated = await verifyEnterprise(id);
    setEnterprises(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  }, []);

  // Toggle partner status
  const togglePartnerStatus = useCallback(async (id: string, status: PartnerStatus) => {
    const updated = await setPartnerStatus(id, status);
    setEnterprises(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  }, []);

  return {
    enterprises,
    loading,
    error,
    total,
    pagination: { page, size },
    reload: load,
    setFacultyId,
    setPage,
    addEnterprise,
    editEnterprise,
    verify,
    togglePartnerStatus,
  };
}
