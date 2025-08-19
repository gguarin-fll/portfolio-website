import { createClient } from 'redis';

/**
 * Optimized Redis configuration based on Redis Copilot recommendations
 * for Next.js serverless functions
 */

// Connection pool configuration for serverless
const CONNECTION_TIMEOUT = 5000;

type RedisClientType = ReturnType<typeof createClient>;

let redisClient: RedisClientType | null = null;
let connectionPromise: Promise<RedisClientType> | null = null;

/**
 * Create Redis client with optimal settings for serverless
 * Based on Redis Copilot's connection pool recommendations
 */
function createRedisClient(): RedisClientType {
  const client = createClient({
    url: process.env.REDIS_URL,
    socket: {
      connectTimeout: CONNECTION_TIMEOUT,
      reconnectStrategy: (retries) => {
        if (retries > 3) return false;
        return Math.min(retries * 100, 1000);
      },
    },
  });

  client.on('error', (err) => {
    console.error('Redis Client Error:', err);
    // In serverless, we'll create a new connection on next request
    redisClient = null;
    connectionPromise = null;
  });

  client.on('connect', () => {
    console.log('Redis Client Connected (Optimized Pool)');
  });

  return client;
}

/**
 * Get or create Redis connection with connection pooling
 * Implements singleton pattern for serverless reuse
 */
export async function getRedisClient(): Promise<RedisClientType> {
  // If we have a connection promise in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  // If we have an active client, return it
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  // Create new connection
  connectionPromise = (async () => {
    redisClient = createRedisClient();
    await redisClient.connect();
    connectionPromise = null;
    return redisClient;
  })();

  return connectionPromise;
}

/**
 * Cache TTL strategies based on Redis Copilot recommendations
 */
export const OPTIMIZED_TTL = {
  // Portfolio data that changes rarely - cache for 1 day
  STATIC_DATA: 86400,
  
  // API responses - cache for 5 minutes
  API_RESPONSE: 300,
  
  // User-specific data - cache for 1 hour
  USER_DATA: 3600,
  
  // View counts - no expiry (persistent)
  VIEW_COUNT: -1,
} as const;

/**
 * Optimized caching functions using simple key-value (not JSON)
 * as recommended by Redis Copilot for this use case
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient();
    const data = await client.get(key);
    
    if (data) {
      // Track cache hits for monitoring
      client.incr('stats:cache:hits').catch(() => {});
      return JSON.parse(data);
    }
    
    // Track cache misses
    client.incr('stats:cache:misses').catch(() => {});
    return null;
  } catch (error) {
    console.error(`Redis GET error for key ${key}:`, error);
    return null;
  }
}

export async function setCachedData<T>(
  key: string,
  data: T,
  ttl: number = OPTIMIZED_TTL.API_RESPONSE
): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const serialized = JSON.stringify(data);
    
    if (ttl > 0) {
      await client.setEx(key, ttl, serialized);
    } else {
      await client.set(key, serialized);
    }
    
    return true;
  } catch (error) {
    console.error(`Redis SET error for key ${key}:`, error);
    return false;
  }
}

/**
 * Optimized view counter using INCR (atomic operation)
 */
export async function incrementViewCount(projectId: string): Promise<number> {
  try {
    const client = await getRedisClient();
    const key = `project:${projectId}:views`;
    const count = await client.incr(key);
    
    // Track total views for monitoring
    client.incr('stats:views:total').catch(() => {});
    
    return count;
  } catch (error) {
    console.error(`Redis INCR error for project ${projectId}:`, error);
    return 0;
  }
}

/**
 * Get cache statistics for monitoring
 * Based on Redis Copilot's monitoring recommendations
 */
export async function getCacheStats() {
  try {
    const client = await getRedisClient();
    
    const [hits, misses, totalViews, info] = await Promise.all([
      client.get('stats:cache:hits'),
      client.get('stats:cache:misses'),
      client.get('stats:views:total'),
      client.info('memory'),
    ]);
    
    const hitRate = hits && misses 
      ? (parseInt(hits) / (parseInt(hits) + parseInt(misses))) * 100 
      : 0;
    
    return {
      cacheHits: parseInt(hits || '0'),
      cacheMisses: parseInt(misses || '0'),
      cacheHitRate: hitRate.toFixed(2) + '%',
      totalViews: parseInt(totalViews || '0'),
      memoryInfo: info,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
}

/**
 * Gracefully close Redis connection (for cleanup)
 */
export async function closeRedisConnection() {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
    connectionPromise = null;
  }
}