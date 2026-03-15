/**
 * Redis Cache Utility Functions
 * 
 * This module provides utility functions for caching and session management
 * using Redis. It implements the cache structure defined in the design document.
 */

import { getRedisClient } from './redis';

// Cache key prefixes
const CACHE_KEYS = {
  SESSION: 'session',
  EXAM_SESSION: 'exam-session',
  LIVE_RESULTS: 'live-results',
  RATE_LIMIT: 'rate-limit',
} as const;

// TTL constants (in seconds)
const TTL = {
  SESSION: 24 * 60 * 60, // 24 hours
  EXAM_SESSION_BUFFER: 60 * 60, // 1 hour buffer after exam duration
  LIVE_RESULTS: 60 * 60, // 1 hour
  RATE_LIMIT: 60, // 1 minute
} as const;

/**
 * Session Storage Interface
 */
export interface SessionData {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * Active Exam Session Interface
 */
export interface ExamSessionCache {
  sessionId: string;
  examId: string;
  studentId: string;
  startedAt: number;
  timeRemaining: number;
  currentQuestionIndex: number;
}

/**
 * Live Results Cache Interface
 */
export interface LiveResultsCache {
  examId: string;
  totalStudents: number;
  studentsInProgress: number;
  studentsCompleted: number;
  lastUpdated: number;
}

/**
 * Session Storage Functions
 */

/**
 * Store user session in Redis
 * @param userId - User ID
 * @param sessionData - Session data to store
 * @returns Promise<void>
 */
export async function setSession(
  userId: string,
  sessionData: SessionData
): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = `${CACHE_KEYS.SESSION}:${userId}`;
  await redis.setex(key, TTL.SESSION, JSON.stringify(sessionData));
}

/**
 * Get user session from Redis
 * @param userId - User ID
 * @returns Promise<SessionData | null>
 */
export async function getSession(userId: string): Promise<SessionData | null> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = `${CACHE_KEYS.SESSION}:${userId}`;
  const data = await redis.get(key);
  
  if (!data) {
    return null;
  }
  
  return JSON.parse(data) as SessionData;
}

/**
 * Delete user session from Redis
 * @param userId - User ID
 * @returns Promise<void>
 */
export async function deleteSession(userId: string): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = `${CACHE_KEYS.SESSION}:${userId}`;
  await redis.del(key);
}

/**
 * Refresh session TTL
 * @param userId - User ID
 * @returns Promise<void>
 */
export async function refreshSession(userId: string): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = `${CACHE_KEYS.SESSION}:${userId}`;
  await redis.expire(key, TTL.SESSION);
}

/**
 * Active Exam Session Functions
 */

/**
 * Store active exam session in Redis
 * @param sessionId - Exam session ID
 * @param sessionData - Exam session data
 * @param examDurationMinutes - Exam duration in minutes
 * @returns Promise<void>
 */
export async function setExamSession(
  sessionId: string,
  sessionData: ExamSessionCache,
  examDurationMinutes: number
): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = `${CACHE_KEYS.EXAM_SESSION}:${sessionId}`;
  const ttl = examDurationMinutes * 60 + TTL.EXAM_SESSION_BUFFER;
  
  await redis.setex(key, ttl, JSON.stringify(sessionData));
}

/**
 * Get active exam session from Redis
 * @param sessionId - Exam session ID
 * @returns Promise<ExamSessionCache | null>
 */
export async function getExamSession(
  sessionId: string
): Promise<ExamSessionCache | null> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = `${CACHE_KEYS.EXAM_SESSION}:${sessionId}`;
  const data = await redis.get(key);
  
  if (!data) {
    return null;
  }
  
  return JSON.parse(data) as ExamSessionCache;
}

/**
 * Update exam session data
 * @param sessionId - Exam session ID
 * @param updates - Partial exam session data to update
 * @returns Promise<void>
 */
export async function updateExamSession(
  sessionId: string,
  updates: Partial<ExamSessionCache>
): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  const existingData = await getExamSession(sessionId);
  
  if (!existingData) {
    throw new Error(`Exam session ${sessionId} not found`);
  }
  
  const updatedData = { ...existingData, ...updates };
  const key = `${CACHE_KEYS.EXAM_SESSION}:${sessionId}`;
  const ttl = await redis.ttl(key);
  
  if (ttl > 0) {
    await redis.setex(key, ttl, JSON.stringify(updatedData));
  } else {
    // If TTL expired, set with default buffer
    await redis.setex(key, TTL.EXAM_SESSION_BUFFER, JSON.stringify(updatedData));
  }
}

/**
 * Delete exam session from Redis
 * @param sessionId - Exam session ID
 * @returns Promise<void>
 */
export async function deleteExamSession(sessionId: string): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = `${CACHE_KEYS.EXAM_SESSION}:${sessionId}`;
  await redis.del(key);
}

/**
 * Live Results Cache Functions
 */

/**
 * Store live results in Redis
 * @param examId - Exam ID
 * @param resultsData - Live results data
 * @returns Promise<void>
 */
export async function setLiveResults(
  examId: string,
  resultsData: LiveResultsCache
): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = `${CACHE_KEYS.LIVE_RESULTS}:${examId}`;
  await redis.setex(key, TTL.LIVE_RESULTS, JSON.stringify(resultsData));
}

/**
 * Get live results from Redis
 * @param examId - Exam ID
 * @returns Promise<LiveResultsCache | null>
 */
export async function getLiveResults(
  examId: string
): Promise<LiveResultsCache | null> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = `${CACHE_KEYS.LIVE_RESULTS}:${examId}`;
  const data = await redis.get(key);
  
  if (!data) {
    return null;
  }
  
  return JSON.parse(data) as LiveResultsCache;
}

/**
 * Update live results cache
 * @param examId - Exam ID
 * @param updates - Partial live results data to update
 * @returns Promise<void>
 */
export async function updateLiveResults(
  examId: string,
  updates: Partial<LiveResultsCache>
): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  const existingData = await getLiveResults(examId);
  
  if (!existingData) {
    // If no existing data, create new entry with defaults
    const newData: LiveResultsCache = {
      examId,
      totalStudents: 0,
      studentsInProgress: 0,
      studentsCompleted: 0,
      lastUpdated: Date.now(),
      ...updates,
    };
    await setLiveResults(examId, newData);
  } else {
    const updatedData = {
      ...existingData,
      ...updates,
      lastUpdated: Date.now(),
    };
    await setLiveResults(examId, updatedData);
  }
}

/**
 * Delete live results from Redis
 * @param examId - Exam ID
 * @returns Promise<void>
 */
export async function deleteLiveResults(examId: string): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = `${CACHE_KEYS.LIVE_RESULTS}:${examId}`;
  await redis.del(key);
}

/**
 * Rate Limiting Functions
 */

/**
 * Check and increment rate limit counter
 * @param userId - User ID
 * @param endpoint - API endpoint
 * @param limit - Maximum number of requests allowed
 * @returns Promise<{ allowed: boolean; remaining: number }>
 */
export async function checkRateLimit(
  userId: string,
  endpoint: string,
  limit: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = `${CACHE_KEYS.RATE_LIMIT}:${userId}:${endpoint}`;
  
  // Get current count
  const current = await redis.get(key);
  const count = current ? parseInt(current, 10) : 0;
  
  if (count >= limit) {
    return { allowed: false, remaining: 0 };
  }
  
  // Increment counter
  const newCount = await redis.incr(key);
  
  // Set TTL if this is the first request
  if (newCount === 1) {
    await redis.expire(key, TTL.RATE_LIMIT);
  }
  
  return {
    allowed: true,
    remaining: Math.max(0, limit - newCount),
  };
}

/**
 * Reset rate limit for a user and endpoint
 * @param userId - User ID
 * @param endpoint - API endpoint
 * @returns Promise<void>
 */
export async function resetRateLimit(
  userId: string,
  endpoint: string
): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = `${CACHE_KEYS.RATE_LIMIT}:${userId}:${endpoint}`;
  await redis.del(key);
}

/**
 * Get remaining rate limit count
 * @param userId - User ID
 * @param endpoint - API endpoint
 * @param limit - Maximum number of requests allowed
 * @returns Promise<number>
 */
export async function getRateLimitRemaining(
  userId: string,
  endpoint: string,
  limit: number = 60
): Promise<number> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = `${CACHE_KEYS.RATE_LIMIT}:${userId}:${endpoint}`;
  const current = await redis.get(key);
  const count = current ? parseInt(current, 10) : 0;
  
  return Math.max(0, limit - count);
}

/**
 * Generic Cache Functions
 */

/**
 * Set a generic cache value
 * @param key - Cache key
 * @param value - Value to cache
 * @param ttl - Time to live in seconds (optional)
 * @returns Promise<void>
 */
export async function setCacheValue(
  key: string,
  value: any,
  ttl?: number
): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  const serialized = JSON.stringify(value);
  
  if (ttl) {
    await redis.setex(key, ttl, serialized);
  } else {
    await redis.set(key, serialized);
  }
}

/**
 * Get a generic cache value
 * @param key - Cache key
 * @returns Promise<any | null>
 */
export async function getCacheValue<T = any>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  await redis.connect();
  
  const data = await redis.get(key);
  
  if (!data) {
    return null;
  }
  
  return JSON.parse(data) as T;
}

/**
 * Delete a generic cache value
 * @param key - Cache key
 * @returns Promise<void>
 */
export async function deleteCacheValue(key: string): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  await redis.del(key);
}

/**
 * Clear all cache entries matching a pattern
 * @param pattern - Key pattern (e.g., "session:*")
 * @returns Promise<number> - Number of keys deleted
 */
export async function clearCachePattern(pattern: string): Promise<number> {
  const redis = getRedisClient();
  await redis.connect();
  
  const keys = await redis.keys(pattern);
  
  if (keys.length === 0) {
    return 0;
  }
  
  await redis.del(...keys);
  return keys.length;
}
