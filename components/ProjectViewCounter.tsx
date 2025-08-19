'use client';

import { useEffect } from 'react';
import { useProjectViews } from '@/hooks/useProjectViews';
import { Eye } from 'lucide-react';

interface ProjectViewCounterProps {
  projectId: string;
  autoIncrement?: boolean;
}

export default function ProjectViewCounter({ 
  projectId, 
  autoIncrement = false 
}: ProjectViewCounterProps) {
  const { views, incrementView, loading } = useProjectViews(projectId);

  useEffect(() => {
    if (autoIncrement) {
      incrementView();
    }
  }, [autoIncrement]);

  if (loading) {
    return (
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Eye className="w-4 h-4" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm text-gray-500">
      <Eye className="w-4 h-4" />
      <span>{views} {views === 1 ? 'view' : 'views'}</span>
    </div>
  );
}