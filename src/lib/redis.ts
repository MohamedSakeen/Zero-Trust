/**
 * Redis Configuration and Client
 * 
 * This module provides a singleton Redis client instance and configuration
 * for caching and session management throughout the application.
 */

import Redis from 'ioredis';

// Redis configuration from environment variables
const REDIS_CONFIG = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: (err: Error) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      // Reconnect when Redis is in readonly mode
      return true;
    }
    return false;
  },
};

// Singleton Redis client instance
let redisClient: Redis | null = null;

/**
 * Get or create Redis client instance
 * @returns Redis client instance
 */
export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(REDIS_CONFIG.url, {
      password: REDIS_CONFIG.password,
      db: REDIS_CONFIG.db,
      maxRetriesPerRequest: REDIS_CONFIG.maxRetriesPerRequest,
      retryStrategy: REDIS_CONFIG.retryStrategy,
      reconnectOnError: REDIS_CONFIG.reconnectOnError,
      lazyConnect: true, // Don't connect immediately
    });

    // Handle connection events
    redisClient.on('connect', () => {
      console.log('Redis client connected');
    });

    redisClient.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    redisClient.on('ready', () => {
      console.log('Redis client ready');
    });

    redisClient.on('close', () => {
      console.log('Redis client connection closed');
    });
  }

  return redisClient;
}

/**
 * Close Redis connection
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

/**
 * Check if Redis is connected
 */
export function isRedisConnected(): boolean {
  return redisClient?.status === 'ready';
}

export default getRedisClient;
