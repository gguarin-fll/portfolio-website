import { NextResponse } from 'next/server';
import { connectRedis } from '@/lib/redis';

export async function POST() {
  try {
    const client = await connectRedis();
    
    const keys = await client.keys('*');
    
    if (keys.length > 0) {
      await client.del(keys);
    }
    
    return NextResponse.json({ 
      success: true, 
      clearedKeys: keys.length,
      message: `Cleared ${keys.length} cache entries` 
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}