/**
 * Token Refresh API Route
 * Requirements: 1.1, 3.1
 * 
 * POST /api/auth/refresh
 * Refreshes access token using a valid refresh token
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/db';
import { eq } from 'drizzle-orm';
import { verifyToken, generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { getRedisClient } from '@/lib/redis';
import type { AuthToken, User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    // Validate input
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Verify refresh token
    let payload;
    try {
      payload = await verifyToken(refreshToken);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Verify token type
    if (payload.type !== 'refresh') {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 401 }
      );
    }

    // Fetch user from database
    const [userRecord] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is active
    if (userRecord.status !== 'active') {
      return NextResponse.json(
        { error: 'Account is inactive or suspended' },
        { status: 403 }
      );
    }

    // Verify session exists in Redis
    const redis = getRedisClient();
    await redis.connect().catch(() => {}); // Connect if not already connected
    
    const sessionKey = `session:${userRecord.id}`;
    const sessionData = await redis.get(sessionKey);

    if (!sessionData) {
      return NextResponse.json(
        { error: 'Session expired, please log in again' },
        { status: 401 }
      );
    }

    // Parse session data and verify refresh token matches
    const session = JSON.parse(sessionData);
    if (session.refreshToken !== refreshToken) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Create user object (without password hash)
    const user: User = {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role,
      department: userRecord.department || undefined,
      createdAt: userRecord.createdAt,
      updatedAt: userRecord.updatedAt,
    };

    // Generate new tokens
    const newAccessToken = await generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    // Calculate expiration time (24 hours from now)
    const expiresIn = 24 * 60 * 60; // 24 hours in seconds

    // Update session in Redis
    const newSessionData = {
      userId: user.id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
    };
    
    await redis.setex(sessionKey, expiresIn, JSON.stringify(newSessionData));

    // Prepare response
    const authToken: AuthToken = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    };

    return NextResponse.json(
      {
        message: 'Token refreshed successfully',
        token: authToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
