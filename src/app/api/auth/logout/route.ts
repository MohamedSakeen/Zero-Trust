/**
 * Logout API Route
 * Requirements: 1.1, 3.1
 * 
 * POST /api/auth/logout
 * Logs out users by invalidating their session
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { getRedisClient } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    let payload;
    try {
      payload = await verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Delete session from Redis
    const redis = getRedisClient();
    await redis.connect().catch(() => {}); // Connect if not already connected
    
    const sessionKey = `session:${payload.userId}`;
    await redis.del(sessionKey);

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
