import { NextResponse } from 'next/server';
import { projects } from '@/data/portfolio-data';
import { getCounter, getCachedData, setCachedData, CACHE_TTL } from '@/lib/redis';

type ProjectStat = {
  id: string;
  title: string;
  views: number;
  featured?: boolean;
};

type StatsResult = {
  totalViews: number;
  projectCount: number;
  popularProjects: ProjectStat[];
  allProjects: ProjectStat[];
  timestamp: string;
};

const CACHE_KEY = 'projects:stats';

export async function GET() {
  try {
    const cachedStats = await getCachedData<StatsResult>(CACHE_KEY);
    
    if (cachedStats) {
      return NextResponse.json(cachedStats, {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    const stats = await Promise.all(
      projects.map(async (project) => {
        const viewKey = `project:${project.id}:views`;
        const views = await getCounter(viewKey);
        
        return {
          id: project.id,
          title: project.title,
          views,
          featured: project.featured,
        };
      })
    );

    const totalViews = stats.reduce((sum, stat) => sum + stat.views, 0);
    const popularProjects = [...stats]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const result = {
      totalViews,
      projectCount: projects.length,
      popularProjects,
      allProjects: stats,
      timestamp: new Date().toISOString(),
    };

    await setCachedData(CACHE_KEY, result, CACHE_TTL.SHORT);

    return NextResponse.json(result, {
      headers: { 'X-Cache': 'MISS' },
    });
  } catch (error) {
    console.error('Error getting project stats:', error);
    return NextResponse.json(
      { error: 'Failed to get project statistics' },
      { status: 500 }
    );
  }
}