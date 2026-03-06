/**
 * Simple in-memory cache for API responses
 * Provides caching with optional TTL (time-to-live)
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // time-to-live in milliseconds
}

type CacheData<T> = T | null;

// Default TTL: 5 minutes
const DEFAULT_TTL = 5 * 60 * 1000;

// In-memory cache store
const cacheStore = new Map<string, CacheEntry<unknown>>();

/**
 * Get cached data if available and not expired
 */
export function getCached<T>(key: string): CacheData<T> | null {
  const entry = cacheStore.get(key) as CacheEntry<T> | undefined;
  
  if (!entry) {
    return null;
  }
  
  // Check if cache is expired
  if (Date.now() - entry.timestamp > entry.ttl) {
    cacheStore.delete(key);
    return null;
  }
  
  return entry.data;
}

/**
 * Set cached data with optional custom TTL
 */
export function setCached<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  cacheStore.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Clear specific cache entry
 */
export function clearCache(key: string): void {
  cacheStore.delete(key);
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
  cacheStore.clear();
}

/**
 * Check if cache exists and is valid (not expired)
 */
export function hasValidCache(key: string): boolean {
  return getCached(key) !== null;
}

/**
 * Get cache age in milliseconds
 */
export function getCacheAge(key: string): number | null {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  return Date.now() - entry.timestamp;
}

