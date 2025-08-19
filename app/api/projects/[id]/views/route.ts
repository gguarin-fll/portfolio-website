import { NextRequest, NextResponse } from 'next/server';
import { incrementCounter, getCounter } from '@/lib/redis';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const viewKey = `project:${projectId}:views`;
    
    const newCount = await incrementCounter(viewKey);
    
    return NextResponse.json({ 
      projectId,
      views: newCount,
      success: true 
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const viewKey = `project:${projectId}:views`;
    
    const count = await getCounter(viewKey);
    
    return NextResponse.json({ 
      projectId,
      views: count 
    });
  } catch (error) {
    console.error('Error getting view count:', error);
    return NextResponse.json(
      { error: 'Failed to get view count' },
      { status: 500 }
    );
  }
}