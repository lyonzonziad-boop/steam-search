import { useEffect, useRef, useState } from "react";

export function useAsync<T>(loader: () => Promise<T>, deps: React.DependencyList, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    loader()
      .then((res) => {
        if (cancelled || id !== requestId.current) return;
        setData(res);
      })
      .catch((err) => {
        if (cancelled || id !== requestId.current) return;
        setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      })
      .finally(() => {
        if (cancelled || id !== requestId.current) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, setData };
}
