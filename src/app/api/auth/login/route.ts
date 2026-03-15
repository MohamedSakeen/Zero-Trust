/**
 * Login API Route
 * Requirements: 1.1, 3.1
 * 
 * POST /api/auth/login
 * Authenticates users and returns JWT tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/db';
import { eq } from 'drizzle-orm';
import { verifyPassword, generateAccessToken, generateRefreshToken, validateEmail } from '@/lib/auth';
import { getRedisClient } from '@/lib/redis';
import { rateLimitMiddleware, recordFailedAttempt, recordSuccessfulAttempt } from '@/lib/rate-limit-middleware';
import type { AuthToken, User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResponse = await rateLimitMiddleware(request, 'login');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find user by email
    const [userRecord] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (userRecord.status !== 'active') {
      return NextResponse.json(
        { error: 'Account is inactive or suspended' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, userRecord.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
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

    // Generate tokens
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Calculate expiration time (24 hours from now)
    const expiresIn = 24 * 60 * 60; // 24 hours in seconds

    // Store session in Redis
    const redis = getRedisClient();
    await redis.connect().catch(() => {}); // Connect if not already connected
    
    const sessionKey = `session:${user.id}`;
    const sessionData = {
      userId: user.id,
      accessToken,
      refreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
    };
    
    await redis.setex(sessionKey, expiresIn, JSON.stringify(sessionData));

    // Update last login timestamp
    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    // Prepare response
    const authToken: AuthToken = {
      accessToken,
      refreshToken,
      expiresIn,
    };

    return NextResponse.json(
      {
        message: 'Login successful',
        user,
        token: authToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
