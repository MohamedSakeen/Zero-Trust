/**
 * Redis Health Check API Route
 * 
 * This endpoint checks if Redis is connected and operational.
 * Useful for monitoring and debugging.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient, isRedisConnected } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const redis = getRedisClient();
    
    // Try to connect if not already connected
    if (!isRedisConnected()) {
      await redis.connect();
    }

    // Test Redis with a ping
    const pingResult = await redis.ping();
    
    // Test set and get operations
    const testKey = 'health-check-test';
    const testValue = Date.now().toString();
    
    await redis.set(testKey, testValue, 'EX', 10); // Expire in 10 seconds
    const retrievedValue = await redis.get(testKey);
    
    const isOperational = pingResult === 'PONG' && retrievedValue === testValue;
    
    // Clean up test key
    await redis.del(testKey);

    return NextResponse.json({
      status: 'healthy',
      redis: {
        connected: isRedisConnected(),
        operational: isOperational,
        ping: pingResult,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Redis health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        redis: {
          connected: false,
          operational: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 503 }
    );
  }
}
