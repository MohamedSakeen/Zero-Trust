/**
 * User Database Access Layer
 * Requirements: 1.1, 3.1, 9.1
 * 
 * Provides CRUD operations for user management
 */

import { eq, and, or, like, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { users, auditLogs } from '@/db/schema';
import { User, UserManagement, UserFilter, RegisterData } from '@/types';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Converts a database user record to a User object
 */
function dbUserToUser(dbUser: typeof users.$inferSelect): User {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    department: dbUser.department || undefined,
    createdAt: dbUser.createdAt,
    updatedAt: dbUser.updatedAt,
  };
}

/**
 * Converts a database user record to a UserManagement object
 */
function dbUserToUserManagement(dbUser: typeof users.$inferSelect): UserManagement {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    department: dbUser.department || undefined,
    status: dbUser.status,
    createdAt: dbUser.createdAt,
    updatedAt: dbUser.updatedAt,
    lastLogin: dbUser.lastLogin || undefined,
  };
}

/**
 * Creates a new user in the database
 * @param data - User registration data
 * @param performedBy - ID of user performing the action (for audit log)
 * @param ipAddress - IP address of the request (for audit log)
 * @returns Created user object
 */
export async function createUser(
  data: RegisterData & { role?: 'student' | 'faculty' | 'admin' },
  performedBy?: string,
  ipAddress?: string
): Promise<User> {
  // Hash the password
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      email: data.email.toLowerCase().trim(),
      passwordHash,
      name: data.name.trim(),
      role: data.role || 'student',
      department: data.department.trim(),
      status: 'active',
    })
    .returning();

  // Create audit log if performedBy is provided
  if (performedBy && ipAddress) {
    await db.insert(auditLogs).values({
      action: 'user-created',
      performedBy,
      targetUser: newUser.id,
      details: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        department: newUser.department,
      },
      ipAddress,
    });
  }

  return dbUserToUser(newUser);
}

/**
 * Gets a user by ID
 * @param id - User ID
 * @returns User object or null if not found
 */
export async function getUserById(id: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user ? dbUserToUser(user) : null;
}

/**
 * Gets a user by email
 * @param email - User email
 * @returns User object or null if not found
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);
  return user ? dbUserToUser(user) : null;
}

/**
 * Gets a user with password hash by email (for authentication)
 * @param email - User email
 * @returns User record with password hash or null if not found
 */
export async function getUserWithPasswordByEmail(
  email: string
): Promise<(typeof users.$inferSelect) | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);
  return user || null;
}

/**
 * Updates a user's information
 * @param id - User ID
 * @param data - Updated user data
 * @param performedBy - ID of user performing the action (for audit log)
 * @param ipAddress - IP address of the request (for audit log)
 * @returns Updated user object or null if not found
 */
export async function updateUser(
  id: string,
  data: Partial<{
    name: string;
    department: string;
    role: 'student' | 'faculty' | 'admin';
    status: 'active' | 'inactive' | 'suspended';
  }>,
  performedBy?: string,
  ipAddress?: string
): Promise<User | null> {
  const [updatedUser] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  if (!updatedUser) {
    return null;
  }

  // Create audit log if performedBy is provided
  if (performedBy && ipAddress) {
    await db.insert(auditLogs).values({
      action: 'user-updated',
      performedBy,
      targetUser: id,
      details: data,
      ipAddress,
    });
  }

  return dbUserToUser(updatedUser);
}

/**
 * Updates a user's password
 * @param id - User ID
 * @param newPassword - New password (will be hashed)
 * @param performedBy - ID of user performing the action (for audit log)
 * @param ipAddress - IP address of the request (for audit log)
 * @returns True if successful, false if user not found
 */
export async function updateUserPassword(
  id: string,
  newPassword: string,
  performedBy?: string,
  ipAddress?: string
): Promise<boolean> {
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  const [updatedUser] = await db
    .update(users)
    .set({
      passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  if (!updatedUser) {
    return false;
  }

  // Create audit log if performedBy is provided
  if (performedBy && ipAddress) {
    await db.insert(auditLogs).values({
      action: 'password-reset',
      performedBy,
      targetUser: id,
      details: { action: 'password-reset' },
      ipAddress,
    });
  }

  return true;
}

/**
 * Updates a user's last login timestamp
 * @param id - User ID
 * @returns True if successful, false if user not found
 */
export async function updateLastLogin(id: string): Promise<boolean> {
  const [updatedUser] = await db
    .update(users)
    .set({
      lastLogin: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return !!updatedUser;
}

/**
 * Deletes a user from the database
 * @param id - User ID
 * @param performedBy - ID of user performing the action (for audit log)
 * @param ipAddress - IP address of the request (for audit log)
 * @returns True if successful, false if user not found
 */
export async function deleteUser(
  id: string,
  performedBy?: string,
  ipAddress?: string
): Promise<boolean> {
  // Get user details before deletion for audit log
  const user = await getUserById(id);
  if (!user) {
    return false;
  }

  const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning();

  if (!deletedUser) {
    return false;
  }

  // Create audit log if performedBy is provided
  if (performedBy && ipAddress) {
    await db.insert(auditLogs).values({
      action: 'user-deleted',
      performedBy,
      targetUser: id,
      details: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ipAddress,
    });
  }

  return true;
}

/**
 * Gets all users with optional filtering
 * @param filter - Optional filter criteria
 * @returns Array of UserManagement objects
 */
export async function getUsers(filter?: UserFilter): Promise<UserManagement[]> {
  let query = db.select().from(users);

  // Apply filters
  const conditions = [];

  if (filter?.role) {
    conditions.push(eq(users.role, filter.role as 'student' | 'faculty' | 'admin'));
  }

  if (filter?.department) {
    conditions.push(eq(users.department, filter.department));
  }

  if (filter?.status) {
    conditions.push(eq(users.status, filter.status as 'active' | 'inactive' | 'suspended'));
  }

  if (filter?.searchTerm) {
    const searchPattern = `%${filter.searchTerm}%`;
    conditions.push(
      or(
        like(users.name, searchPattern),
        like(users.email, searchPattern)
      )
    );
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  const results = await query;
  return results.map(dbUserToUserManagement);
}

/**
 * Gets users by role
 * @param role - User role
 * @returns Array of User objects
 */
export async function getUsersByRole(role: 'student' | 'faculty' | 'admin'): Promise<User[]> {
  const results = await db.select().from(users).where(eq(users.role, role));
  return results.map(dbUserToUser);
}

/**
 * Checks if an email already exists in the database
 * @param email - Email to check
 * @param excludeUserId - Optional user ID to exclude from check (for updates)
 * @returns True if email exists, false otherwise
 */
export async function emailExists(email: string, excludeUserId?: string): Promise<boolean> {
  const conditions = [eq(users.email, email.toLowerCase().trim())];
  
  if (excludeUserId) {
    conditions.push(eq(users.id, excludeUserId));
  }

  const [user] = await db
    .select()
    .from(users)
    .where(excludeUserId ? and(...conditions) : conditions[0])
    .limit(1);

  return !!user && (!excludeUserId || user.id !== excludeUserId);
}

/**
 * Verifies a password against a stored hash
 * @param password - Plain text password
 * @param hash - Stored password hash
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
