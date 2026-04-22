import { useState, useEffect, useCallback } from 'react';
import { getBatchById, updateBatch, getBatchStats } from '../api';
import { SurveyBatch } from '../types';

export function useBatch(id: number) {
  const [batch, setBatch] = useState<SurveyBatch | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBatch = useCallback(async () => {
    setLoading(true);
    try {
      const [b, s] = await Promise.all([
        getBatchById(id),
        getBatchStats(id),
      ]);
      setBatch(b);
      setStats(s);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load batch');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const update = useCallback(async (updates: Partial<SurveyBatch>) => {
    try {
      const updated = await updateBatch(id, updates);
      setBatch(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    }
  }, [id]);

  useEffect(() => {
    fetchBatch();
  }, [fetchBatch]);

  return { batch, stats, loading, error, reload: fetchBatch, update };
}