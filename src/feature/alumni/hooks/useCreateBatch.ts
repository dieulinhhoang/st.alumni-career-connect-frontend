import { useState } from 'react';
import { createBatch } from '../api';
import { CreateBatchPayload, SurveyBatch } from '../types';

export function useCreateBatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (payload: CreateBatchPayload): Promise<SurveyBatch | null> => {
    setLoading(true);
    setError(null);
    try {
      const newBatch = await createBatch(payload);
      return newBatch;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Creation failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}