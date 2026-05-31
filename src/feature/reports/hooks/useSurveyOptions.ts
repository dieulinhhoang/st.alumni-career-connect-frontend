import { useEffect, useState } from 'react';
import { fetchSurveyOptions, fetchSurveyConfig } from '../api';
import type { SurveyOption } from '../api';

type UseSurveyOptionsReturn = {
  options: SurveyOption[];
  defaultSurveyId: string;
  deadline: string;
  loading: boolean;
};

export function useSurveyOptions(): UseSurveyOptionsReturn {
  const [options, setOptions] = useState<SurveyOption[]>([]);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([fetchSurveyOptions(), fetchSurveyConfig()])
      .then(([opts, config]) => {
        if (cancelled) return;
        setOptions(opts);
        setDeadline(config?.deadline ?? '');
      })
      .catch(() => {
        if (cancelled) return;
        // fallback: giữ mảng rỗng, UI tự xử lý
        setOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const defaultSurveyId = options[0]?.value ?? '';

  return { options, defaultSurveyId, deadline, loading };
}
