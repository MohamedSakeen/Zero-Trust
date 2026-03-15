/**
 * Authentication Utilities
 * Requirements: 1.1, 3.1, 9.1, 10.6
 * 
 * Provides JWT token generation/validation and password hashing utilities
 */

import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload as JoseJWTPayload } from 'jose';
import type { User } from '@/types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'default-secret-key-change-in-production'
);
const JWT_ALGORITHM = 'HS256';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '24h'; // 24 hours
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

export interface JWTPayload extends JoseJWTPayload {
  userId: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  type: 'access' | 'refresh';
}

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if password matches hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT access token
 * @param user - User object
 * @returns JWT access token
 */
export async function generateAccessToken(user: User): Promise<string> {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'access',
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Generate JWT refresh token
 * @param user - User object
 * @returns JWT refresh token
 */
export async function generateRefreshToken(user: User): Promise<string> {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'refresh',
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode JWT token
 * @param token - JWT token
 * @returns Decoded payload
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with isValid flag and error message
 */
export function validatePasswordStrength(password: string): { isValid: boolean; error?: string } {
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  return { isValid: true };
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns True if email is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
