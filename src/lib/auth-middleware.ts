/**
 * Authentication Middleware
 * Requirements: 1.1, 3.1
 * 
 * Provides middleware functions for protecting API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyToken, type JWTPayload } from '@/lib/auth';
import { getRedisClient } from '@/lib/redis';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Verify authentication and attach user to request
 * @param request - Next.js request object
 * @returns User payload or null if not authenticated
 */
export async function authenticate(request: NextRequest): Promise<JWTPayload | null> {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return null;
    }

    // Verify token
    const payload = await verifyToken(token);

    // Check if session exists in Redis
    const redis = getRedisClient();
    await redis.connect().catch(() => {}); // Connect if not already connected
    
    const sessionKey = `session:${payload.userId}`;
    const sessionData = await redis.get(sessionKey);

    if (!sessionData) {
      return null; // Session expired or doesn't exist
    }

    return payload;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Middleware to require authentication
 * @param handler - Route handler function
 * @returns Wrapped handler with authentication check
 */
export function requireAuth(
  handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = await authenticate(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return handler(request, user);
  };
}

/**
 * Middleware to require specific role
 * @param roles - Allowed roles
 * @param handler - Route handler function
 * @returns Wrapped handler with role check
 */
export function requireRole(
  roles: Array<'student' | 'faculty' | 'admin'>,
  handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = await authenticate(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!roles.includes(user.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to access this resource' },
        { status: 403 }
      );
    }

    return handler(request, user);
  };
}

/**
 * Get current user from request
 * @param request - Next.js request object
 * @returns User payload or null
 */
export async function getCurrentUser(request: NextRequest): Promise<JWTPayload | null> {
  return authenticate(request);
}
