import { useEffect, useState } from 'react';
import { fetchSurveyOptions } from '../api';
import type { SurveyOption } from '../api';

type UseSurveyOptionsReturn = {
  options: SurveyOption[];
  defaultSurveyId: string;
  deadline: string;
  loading: boolean;
};

export function useSurveyOptions(): UseSurveyOptionsReturn {
  const [options, setOptions] = useState<SurveyOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchSurveyOptions()
      .then((opts) => {
        if (!cancelled) setOptions(opts);
      })
      .catch(() => {
        if (!cancelled) setOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const defaultSurveyId = options[0]?.value ?? '';
  // Lấy deadline từ survey đang chọn (options[0] là mới nhất)
  const deadline = options[0]?.deadline ?? '';

  return { options, defaultSurveyId, deadline, loading };
}