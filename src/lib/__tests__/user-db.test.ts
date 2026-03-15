/**
 * Unit Tests for User Database Access Layer
 * Requirements: 1.1, 3.1, 9.1
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '@/db';
import { users, auditLogs } from '@/db/schema';
import {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  updateUserPassword,
  deleteUser,
  getUsers,
  getUsersByRole,
  emailExists,
  verifyPassword,
  getUserWithPasswordByEmail,
} from '../user-db';
import { eq } from 'drizzle-orm';

describe('User Database Access Layer', () => {
  // Clean up test data after each test
  afterEach(async () => {
    await db.delete(auditLogs);
    await db.delete(users);
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User',
        department: 'Computer Science',
      };

      const user = await createUser(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email.toLowerCase());
      expect(user.name).toBe(userData.name);
      expect(user.role).toBe('student'); // default role
      expect(user.department).toBe(userData.department);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should create user with specified role', async () => {
      const userData = {
        email: 'faculty@example.com',
        password: 'SecurePass123!',
        name: 'Faculty User',
        department: 'Mathematics',
        role: 'faculty' as const,
      };

      const user = await createUser(userData);

      expect(user.role).toBe('faculty');
    });

    it('should normalize email to lowercase', async () => {
      const userData = {
        email: 'TEST@EXAMPLE.COM',
        password: 'SecurePass123!',
        name: 'Test User',
        department: 'Computer Science',
      };

      const user = await createUser(userData);

      expect(user.email).toBe('test@example.com');
    });

    it('should create audit log when performedBy is provided', async () => {
      const adminUser = await createUser({
        email: 'admin@example.com',
        password: 'AdminPass123!',
        name: 'Admin User',
        department: 'Administration',
        role: 'admin',
      });

      const userData = {
        email: 'student@example.com',
        password: 'SecurePass123!',
        name: 'Student User',
        department: 'Computer Science',
      };

      await createUser(userData, adminUser.id, '127.0.0.1');

      const logs = await db.select().from(auditLogs).where(eq(auditLogs.action, 'user-created'));
      expect(logs.length).toBeGreaterThan(0);
    });
  });

  describe('getUserById', () => {
    it('should retrieve user by ID', async () => {
      const created = await createUser({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User',
        department: 'Computer Science',
      });

      const user = await getUserById(created.id);

      expect(user).toBeDefined();
      expect(user?.id).toBe(created.id);
      expect(user?.email).toBe(created.email);
    });

    it('should return null for non-existent user', async () => {
      const user = await getUserById('00000000-0000-0000-0000-000000000000');
      expect(user).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should retrieve user by email', async () => {
      const created = await createUser({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User',
        department: 'Computer Science',
      });

      const user = await getUserByEmail('test@example.com');

      expect(user).toBeDefined();
      expect(user?.email).toBe(created.email);
    });

    it('should be case-insensitive', async () => {
      await createUser({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User',
        department: 'Computer Science',
      });

      const user = await getUserByEmail('TEST@EXAMPLE.COM');

      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
    });

    it('should return null for non-existent email', async () => {
      const user = await getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('getUserWithPasswordByEmail', () => {
    it('should retrieve user with password hash', async () => {
      await createUser({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User',
        department: 'Computer Science',
      });

      const user = await getUserWithPasswordByEmail('test@example.com');

      expect(user).toBeDefined();
      expect(user?.passwordHash).toBeDefined();
      expect(user?.passwordHash.length).toBeGreaterThan(0);
    });
  });

  describe('updateUser', () => {
    it('should update user information', async () => {
      const created = await createUser({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User',
        department: 'Computer Science',
      });

      const updated = await updateUser(created.id, {
        name: 'Updated Name',
        department: 'Mathematics',
      });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe('Updated Name');
      expect(updated?.department).toBe('Mathematics');
    });

    it('should return null for non-existent user', async () => {
      const updated = await updateUser('00000000-0000-0000-0000-000000000000', {
        name: 'Updated Name',
      });

      expect(updated).toBeNull();
    });
  });

  describe('updateUserPassword', () => {
    it('should update user password', async () => {
      const created = await createUser({
        email: 'test@example.com',
        password: 'OldPass123!',
        name: 'Test User',
        department: 'Computer Science',
      });

      const success = await updateUserPassword(created.id, 'NewPass123!');

      expect(success).toBe(true);

      // Verify new password works
      const user = await getUserWithPasswordByEmail('test@example.com');
      const isValid = await verifyPassword('NewPass123!', user!.passwordHash);
      expect(isValid).toBe(true);
    });

    it('should return false for non-existent user', async () => {
      const success = await updateUserPassword(
        '00000000-0000-0000-0000-000000000000',
        'NewPass123!'
      );

      expect(success).toBe(false);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const created = await createUser({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User',
        department: 'Computer Science',
      });

      const success = await deleteUser(created.id);

      expect(success).toBe(true);

      const user = await getUserById(created.id);
      expect(user).toBeNull();
    });

    it('should return false for non-existent user', async () => {
      const success = await deleteUser('00000000-0000-0000-0000-000000000000');
      expect(success).toBe(false);
    });
  });

  describe('getUsers', () => {
    beforeEach(async () => {
      await createUser({
        email: 'student1@example.com',
        password: 'Pass123!',
        name: 'Student One',
        department: 'Computer Science',
        role: 'student',
      });

      await createUser({
        email: 'student2@example.com',
        password: 'Pass123!',
        name: 'Student Two',
        department: 'Mathematics',
        role: 'student',
      });

      await createUser({
        email: 'faculty@example.com',
        password: 'Pass123!',
        name: 'Faculty Member',
        department: 'Computer Science',
        role: 'faculty',
      });
    });

    it('should retrieve all users without filter', async () => {
      const allUsers = await getUsers();
      expect(allUsers.length).toBe(3);
    });

    it('should filter by role', async () => {
      const students = await getUsers({ role: 'student' });
      expect(students.length).toBe(2);
      expect(students.every((u) => u.role === 'student')).toBe(true);
    });

    it('should filter by department', async () => {
      const csUsers = await getUsers({ department: 'Computer Science' });
      expect(csUsers.length).toBe(2);
      expect(csUsers.every((u) => u.department === 'Computer Science')).toBe(true);
    });

    it('should filter by search term', async () => {
      const results = await getUsers({ searchTerm: 'Student One' });
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Student One');
    });
  });

  describe('getUsersByRole', () => {
    beforeEach(async () => {
      await createUser({
        email: 'student@example.com',
        password: 'Pass123!',
        name: 'Student',
        department: 'CS',
        role: 'student',
      });

      await createUser({
        email: 'faculty@example.com',
        password: 'Pass123!',
        name: 'Faculty',
        department: 'CS',
        role: 'faculty',
      });
    });

    it('should retrieve users by role', async () => {
      const students = await getUsersByRole('student');
      expect(students.length).toBe(1);
      expect(students[0].role).toBe('student');
    });
  });

  describe('emailExists', () => {
    it('should return true for existing email', async () => {
      await createUser({
        email: 'test@example.com',
        password: 'Pass123!',
        name: 'Test',
        department: 'CS',
      });

      const exists = await emailExists('test@example.com');
      expect(exists).toBe(true);
    });

    it('should return false for non-existent email', async () => {
      const exists = await emailExists('nonexistent@example.com');
      expect(exists).toBe(false);
    });

    it('should be case-insensitive', async () => {
      await createUser({
        email: 'test@example.com',
        password: 'Pass123!',
        name: 'Test',
        department: 'CS',
      });

      const exists = await emailExists('TEST@EXAMPLE.COM');
      expect(exists).toBe(true);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const user = await getUserWithPasswordByEmail('test@example.com');
      if (!user) {
        await createUser({
          email: 'test@example.com',
          password: 'SecurePass123!',
          name: 'Test',
          department: 'CS',
        });
      }

      const userWithPassword = await getUserWithPasswordByEmail('test@example.com');
      const isValid = await verifyPassword('SecurePass123!', userWithPassword!.passwordHash);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      await createUser({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test',
        department: 'CS',
      });

      const user = await getUserWithPasswordByEmail('test@example.com');
      const isValid = await verifyPassword('WrongPassword!', user!.passwordHash);

      expect(isValid).toBe(false);
    });
  });
});
