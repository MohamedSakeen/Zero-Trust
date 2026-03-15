/**
 * Rate Limiting Middleware
 * Requirements: 10.8
 * 
 * Implements rate limiting for authentication endpoints to prevent brute force attacks.
 * Uses Redis to track failed login attempts and block excessive requests.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from './redis';

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  // Maximum failed attempts before blocking
  MAX_FAILED_ATTEMPTS: 5,
  // Time window in seconds (15 minutes)
  WINDOW_SECONDS: 15 * 60,
  // Block duration in seconds (30 minutes)
  BLOCK_DURATION_SECONDS: 30 * 60,
} as const;

/**
 * Rate limit result interface
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt?: number;
  retryAfter?: number;
}

/**
 * Get client identifier from request
 * Uses IP address or a combination of IP and user agent for identification
 */
function getClientIdentifier(request: NextRequest): string {
  // Get IP address from various headers (for proxy/load balancer scenarios)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return ip;
}

/**
 * Get rate limit key for Redis
 */
function getRateLimitKey(identifier: string, endpoint: string): string {
  return `rate-limit:${identifier}:${endpoint}`;
}

/**
 * Get block key for Redis
 */
function getBlockKey(identifier: string, endpoint: string): string {
  return `rate-limit-block:${identifier}:${endpoint}`;
}

/**
 * Check if client is currently blocked
 */
async function isBlocked(
  identifier: string,
  endpoint: string
): Promise<{ blocked: boolean; retryAfter?: number }> {
  const redis = getRedisClient();
  await redis.connect();
  
  const blockKey = getBlockKey(identifier, endpoint);
  const ttl = await redis.ttl(blockKey);
  
  if (ttl > 0) {
    return { blocked: true, retryAfter: ttl };
  }
  
  return { blocked: false };
}

/**
 * Block client for specified duration
 */
async function blockClient(
  identifier: string,
  endpoint: string,
  durationSeconds: number = RATE_LIMIT_CONFIG.BLOCK_DURATION_SECONDS
): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  const blockKey = getBlockKey(identifier, endpoint);
  await redis.setex(blockKey, durationSeconds, '1');
}

/**
 * Increment failed attempt counter
 */
async function incrementFailedAttempts(
  identifier: string,
  endpoint: string
): Promise<number> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = getRateLimitKey(identifier, endpoint);
  const count = await redis.incr(key);
  
  // Set expiration on first attempt
  if (count === 1) {
    await redis.expire(key, RATE_LIMIT_CONFIG.WINDOW_SECONDS);
  }
  
  return count;
}

/**
 * Get current failed attempt count
 */
async function getFailedAttempts(
  identifier: string,
  endpoint: string
): Promise<number> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = getRateLimitKey(identifier, endpoint);
  const value = await redis.get(key);
  
  return value ? parseInt(value, 10) : 0;
}

/**
 * Reset failed attempt counter
 */
async function resetFailedAttempts(
  identifier: string,
  endpoint: string
): Promise<void> {
  const redis = getRedisClient();
  await redis.connect();
  
  const key = getRateLimitKey(identifier, endpoint);
  await redis.del(key);
}

/**
 * Check rate limit for authentication endpoint
 * 
 * @param request - Next.js request object
 * @param endpoint - Endpoint identifier (e.g., 'login', 'register')
 * @returns Rate limit result
 */
export async function checkAuthRateLimit(
  request: NextRequest,
  endpoint: string = 'auth'
): Promise<RateLimitResult> {
  try {
    const identifier = getClientIdentifier(request);
    
    // Check if client is currently blocked
    const { blocked, retryAfter } = await isBlocked(identifier, endpoint);
    
    if (blocked) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter,
      };
    }
    
    // Get current failed attempts
    const failedAttempts = await getFailedAttempts(identifier, endpoint);
    const remaining = Math.max(0, RATE_LIMIT_CONFIG.MAX_FAILED_ATTEMPTS - failedAttempts);
    
    // Check if limit exceeded
    if (failedAttempts >= RATE_LIMIT_CONFIG.MAX_FAILED_ATTEMPTS) {
      // Block the client
      await blockClient(identifier, endpoint);
      
      return {
        allowed: false,
        remaining: 0,
        retryAfter: RATE_LIMIT_CONFIG.BLOCK_DURATION_SECONDS,
      };
    }
    
    return {
      allowed: true,
      remaining,
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // On error, allow the request (fail open)
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.MAX_FAILED_ATTEMPTS,
    };
  }
}

/**
 * Record failed authentication attempt
 * 
 * @param request - Next.js request object
 * @param endpoint - Endpoint identifier
 * @returns Updated rate limit result
 */
export async function recordFailedAttempt(
  request: NextRequest,
  endpoint: string = 'auth'
): Promise<RateLimitResult> {
  try {
    const identifier = getClientIdentifier(request);
    
    // Increment failed attempts
    const failedAttempts = await incrementFailedAttempts(identifier, endpoint);
    const remaining = Math.max(0, RATE_LIMIT_CONFIG.MAX_FAILED_ATTEMPTS - failedAttempts);
    
    // Check if we should block the client
    if (failedAttempts >= RATE_LIMIT_CONFIG.MAX_FAILED_ATTEMPTS) {
      await blockClient(identifier, endpoint);
      
      return {
        allowed: false,
        remaining: 0,
        retryAfter: RATE_LIMIT_CONFIG.BLOCK_DURATION_SECONDS,
      };
    }
    
    return {
      allowed: true,
      remaining,
    };
  } catch (error) {
    console.error('Record failed attempt error:', error);
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.MAX_FAILED_ATTEMPTS,
    };
  }
}

/**
 * Record successful authentication (resets counter)
 * 
 * @param request - Next.js request object
 * @param endpoint - Endpoint identifier
 */
export async function recordSuccessfulAttempt(
  request: NextRequest,
  endpoint: string = 'auth'
): Promise<void> {
  try {
    const identifier = getClientIdentifier(request);
    await resetFailedAttempts(identifier, endpoint);
  } catch (error) {
    console.error('Record successful attempt error:', error);
  }
}

/**
 * Rate limiting middleware wrapper
 * Returns a 429 response if rate limit is exceeded
 * 
 * @param request - Next.js request object
 * @param endpoint - Endpoint identifier
 * @returns NextResponse if blocked, null if allowed
 */
export async function rateLimitMiddleware(
  request: NextRequest,
  endpoint: string = 'auth'
): Promise<NextResponse | null> {
  const result = await checkAuthRateLimit(request, endpoint);
  
  if (!result.allowed) {
    const response = NextResponse.json(
      {
        error: 'Too many attempts, please try again later',
        retryAfter: result.retryAfter,
      },
      { status: 429 }
    );
    
    // Add Retry-After header
    if (result.retryAfter) {
      response.headers.set('Retry-After', result.retryAfter.toString());
    }
    
    return response;
  }
  
  return null;
}

/**
 * Export configuration for testing
 */
export const RATE_LIMIT_TEST_CONFIG = RATE_LIMIT_CONFIG;
