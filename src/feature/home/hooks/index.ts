import { useState, useEffect, useCallback, useRef } from "react";
import { statsApi, enterpriseApi, jobsApi } from "../api";
import type {
  UseQueryState,
  SurveyStats,
  Enterprise,
  JobPosting,
  ApiStatus,
} from "../type.ts";

 
function useQuery<T>(fetcher: () => Promise<{ data: T }>, deps: unknown[] = []): UseQueryState<T> {
  const [state, setState] = useState<UseQueryState<T>>({ data: null, status: "idle", error: null });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: "loading", error: null }));
    fetcher()
      .then(({ data }) => { if (!cancelled) setState({ data, status: "success", error: null }); })
      .catch((err: Error) => { if (!cancelled) setState((s) => ({ ...s, status: "error", error: err.message })); });
    return () => { cancelled = true; };
   }, deps);

  return state;
}

 
export function useSurveyStats(): UseQueryState<SurveyStats> {
  return useQuery(() => statsApi.getOverall(), []);
}

export function useSurveyStatsByYear(year: number): UseQueryState<SurveyStats> {
  return useQuery(() => statsApi.getByYear(year), [year]);
}

 
export function useEnterprises(pageSize = 12) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Enterprise[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<ApiStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (p: number) => {
    setStatus("loading");
    try {
      const res = await enterpriseApi.list(p, pageSize);
      setItems((prev) => (p === 1 ? res.data : [...prev, ...res.data]));
      setTotal(res.total);
      setStatus("success");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  }, [pageSize]);

  useEffect(() => { fetchPage(1); }, [fetchPage]);

  const loadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    fetchPage(next);
  }, [page, fetchPage]);

  return { items, total, status, error, hasMore: items.length < total, loadMore };
}

 
export function useJobs(filters?: { major?: string; location?: string }) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<JobPosting[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<ApiStatus>("idle");

  const filtersRef = useRef(filters);
  useEffect(() => {
    if (JSON.stringify(filtersRef.current) !== JSON.stringify(filters)) {
      filtersRef.current = filters;
      setPage(1);
      setItems([]);
    }
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    jobsApi.list({ page, pageSize: 9, ...filters })
      .then((res) => {
        if (!cancelled) {
          setItems((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
          setTotal(res.total);
          setStatus("success");
        }
      })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, JSON.stringify(filters)]);

  return { items, total, status, hasMore: items.length < total, loadMore: () => setPage((p) => p + 1) };
}

 
export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}

export function useCountUp(target: number, duration = 1800, delay = 400) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setCount(Math.round(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return count;
}