import { NextResponse } from 'next/server';
import { connectRedis } from '@/lib/redis';

interface RedisHealth {
  status: 'healthy' | 'unhealthy';
  redis: {
    connected: boolean;
    responseTime?: number;
    error?: string;
  };
  timestamp: string;
}

export async function GET() {
  const startTime = Date.now();
  const health: RedisHealth = {
    status: 'unhealthy',
    redis: {
      connected: false,
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const client = await connectRedis();
    await client.ping();
    
    const responseTime = Date.now() - startTime;
    
    health.status = 'healthy';
    health.redis = {
      connected: true,
      responseTime,
    };
    
    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    health.redis.error = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(health, { status: 503 });
  }
}