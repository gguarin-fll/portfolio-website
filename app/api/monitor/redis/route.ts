import { NextResponse } from 'next/server';
import { getCacheStats } from '@/lib/redis-optimized';

/**
 * Redis monitoring endpoint based on Redis Copilot's recommendations
 * Tracks: Memory usage, Command latency, Connection count, Cache hit/miss ratio
 */
export async function GET() {
  try {
    const stats = await getCacheStats();
    
    if (!stats) {
      return NextResponse.json(
        { error: 'Unable to fetch Redis stats' },
        { status: 503 }
      );
    }
    
    // Parse memory info for key metrics
    const memoryLines = stats.memoryInfo.split('\r\n');
    const memoryMetrics: Record<string, string> = {};
    
    memoryLines.forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        memoryMetrics[key] = value;
      }
    });
    
    // Alert thresholds based on Redis Copilot recommendations
    const alerts = [];
    
    // Memory usage alert (if > 80% of max memory)
    const usedMemory = parseInt(memoryMetrics['used_memory'] || '0');
    const maxMemory = parseInt(memoryMetrics['maxmemory'] || '104857600'); // 100MB default
    const memoryUsagePercent = (usedMemory / maxMemory) * 100;
    
    if (memoryUsagePercent > 80) {
      alerts.push({
        level: 'warning',
        message: `High memory usage: ${memoryUsagePercent.toFixed(2)}%`,
      });
    }
    
    // Cache hit rate alert (if < 70%)
    const hitRate = parseFloat(stats.cacheHitRate);
    if (hitRate < 70 && stats.cacheHits + stats.cacheMisses > 100) {
      alerts.push({
        level: 'warning',
        message: `Low cache hit rate: ${stats.cacheHitRate}`,
      });
    }
    
    // Connection count from info
    const connectedClients = parseInt(memoryMetrics['connected_clients'] || '0');
    if (connectedClients > 50) {
      alerts.push({
        level: 'warning',
        message: `High connection count: ${connectedClients}`,
      });
    }
    
    const response = {
      status: alerts.length > 0 ? 'warning' : 'healthy',
      timestamp: new Date().toISOString(),
      metrics: {
        memory: {
          used: usedMemory,
          max: maxMemory,
          usagePercent: memoryUsagePercent.toFixed(2) + '%',
          humanReadable: {
            used: formatBytes(usedMemory),
            max: formatBytes(maxMemory),
          },
        },
        cache: {
          hits: stats.cacheHits,
          misses: stats.cacheMisses,
          hitRate: stats.cacheHitRate,
          totalRequests: stats.cacheHits + stats.cacheMisses,
        },
        connections: {
          current: connectedClients,
          threshold: 50,
        },
        views: {
          total: stats.totalViews,
        },
      },
      alerts,
      thresholds: {
        memoryUsage: '80%',
        cacheHitRate: '70%',
        connectionCount: 50,
        commandLatency: '100ms',
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Redis monitoring error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch monitoring data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}