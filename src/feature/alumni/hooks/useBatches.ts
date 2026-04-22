import { useState, useEffect, useCallback } from 'react';
import { getBatches, deleteBatch } from '../api';
import { SurveyBatch } from '../types';

export function useBatches() {
  const [batches, setBatches] = useState<SurveyBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBatches();
      setBatches(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteBatch(id);
      setBatches(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  return { batches, loading, error, reload: fetchBatches, deleteBatch: handleDelete };
}