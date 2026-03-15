/**
 * Register API Route
 * Requirements: 1.1, 9.1
 * 
 * POST /api/auth/register
 * Registers new student users
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, users, auditLogs } from '@/db';
import { eq } from 'drizzle-orm';
import { hashPassword, validateEmail, validatePasswordStrength } from '@/lib/auth';
import type { RegisterData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json();
    const { email, password, name, department } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user (students only for public registration)
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        name,
        department: department || null,
        role: 'student', // Public registration is for students only
        status: 'active',
      })
      .returning();

    // Get client IP for audit log
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Create audit log entry
    await db.insert(auditLogs).values({
      action: 'user-created',
      performedBy: newUser.id, // Self-registration
      targetUser: newUser.id,
      details: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        registrationType: 'self-registration',
      },
      ipAddress: clientIp,
    });

    // Return user data (without password hash)
    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          department: newUser.department,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
