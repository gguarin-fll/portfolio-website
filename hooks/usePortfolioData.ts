import { useState, useEffect } from 'react';
import { Project, Skill, Experience, Presentation } from '@/types';

interface PortfolioData {
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  presentations: Presentation[];
  timestamp: string;
}

interface UsePortfolioDataReturn {
  data: PortfolioData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  cacheStatus: 'HIT' | 'MISS' | 'ERROR' | null;
}

export function usePortfolioData(): UsePortfolioDataReturn {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [cacheStatus, setCacheStatus] = useState<'HIT' | 'MISS' | 'ERROR' | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/portfolio');
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
      }
      
      const cacheHeader = response.headers.get('X-Cache');
      setCacheStatus(cacheHeader as 'HIT' | 'MISS' | 'ERROR' | null);
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    cacheStatus,
  };
}