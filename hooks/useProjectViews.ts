import { useState, useEffect, useCallback } from 'react';

interface UseProjectViewsReturn {
  views: number;
  loading: boolean;
  error: Error | null;
  incrementView: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useProjectViews(projectId: string): UseProjectViewsReturn {
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchViews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/projects/${projectId}/views`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch view count');
      }
      
      const data = await response.json();
      setViews(data.views);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const incrementView = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/views`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to increment view count');
      }
      
      const data = await response.json();
      setViews(data.views);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, [projectId]);

  useEffect(() => {
    fetchViews();
  }, [fetchViews]);

  return {
    views,
    loading,
    error,
    incrementView,
    refetch: fetchViews,
  };
}

export function useProjectStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/projects/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch project statistics');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}