import { NextResponse } from 'next/server';
import { projects, skills, experience, presentations } from '@/data/portfolio-data';
import { getCachedData, setCachedData, CACHE_TTL } from '@/lib/redis';

const CACHE_KEY = 'portfolio:data';

export async function GET() {
  try {
    const cachedData = await getCachedData(CACHE_KEY);
    
    if (cachedData) {
      console.log('Serving from Redis cache');
      return NextResponse.json(cachedData, {
        headers: {
          'X-Cache': 'HIT',
        },
      });
    }

    console.log('Cache miss, serving fresh data');
    const portfolioData = {
      projects,
      skills,
      experience,
      presentations,
      timestamp: new Date().toISOString(),
    };

    await setCachedData(CACHE_KEY, portfolioData, CACHE_TTL.LONG);

    return NextResponse.json(portfolioData, {
      headers: {
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error in portfolio API:', error);
    
    const portfolioData = {
      projects,
      skills,
      experience,
      presentations,
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(portfolioData, {
      headers: {
        'X-Cache': 'ERROR',
      },
    });
  }
}