import { useEffect, useState } from 'react';

export function useFetch(requestFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const result = await requestFn();
        if (!cancelled) setData(result.data ?? result);
      } catch (requestError) {
        if (!cancelled) setError(requestError);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return { data, loading, error };
}
