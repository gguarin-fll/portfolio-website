import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const client = createClient({
  url: redisUrl,
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

client.on('connect', () => {
  console.log('Redis Client Connected');
});

export async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

export async function disconnectRedis() {
  if (client.isOpen) {
    await client.disconnect();
  }
}

export const CACHE_TTL = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 3600,       // 1 hour
  DAY: 86400,       // 1 day
};

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    await connectRedis();
    const data = await client.get(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error(`Error getting cached data for key ${key}:`, error);
    return null;
  }
}

export async function setCachedData<T>(
  key: string,
  data: T,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<void> {
  try {
    await connectRedis();
    await client.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting cached data for key ${key}:`, error);
  }
}

export async function incrementCounter(key: string): Promise<number> {
  try {
    await connectRedis();
    const count = await client.incr(key);
    return count;
  } catch (error) {
    console.error(`Error incrementing counter for key ${key}:`, error);
    return 0;
  }
}

export async function getCounter(key: string): Promise<number> {
  try {
    await connectRedis();
    const count = await client.get(key);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error(`Error getting counter for key ${key}:`, error);
    return 0;
  }
}

export default client;