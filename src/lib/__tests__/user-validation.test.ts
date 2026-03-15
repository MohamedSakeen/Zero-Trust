/**
 * Unit Tests for User Validation Functions
 * Requirements: 1.1, 3.1, 9.1
 */

import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateRegistrationData,
  validateUserRole,
} from '../user-validation';

describe('validateEmail', () => {
  it('should validate correct email formats', () => {
    const validEmails = [
      'user@example.com',
      'test.user@domain.co.uk',
      'admin+tag@university.edu',
      'student123@school.org',
    ];

    validEmails.forEach((email) => {
      const result = validateEmail(email);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  it('should reject invalid email formats', () => {
    const invalidEmails = [
      'notanemail',
      '@example.com',
      'user@',
      'user @example.com',
      'user@example',
    ];

    invalidEmails.forEach((email) => {
      const result = validateEmail(email);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });
  });

  it('should reject empty email', () => {
    const result = validateEmail('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Email is required');
  });

  it('should reject whitespace-only email', () => {
    const result = validateEmail('   ');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Email is required');
  });
});

describe('validatePassword', () => {
  it('should validate strong passwords', () => {
    const strongPasswords = [
      'Password123!',
      'Secure@Pass1',
      'MyP@ssw0rd',
      'Test1234!@#$',
    ];

    strongPasswords.forEach((password) => {
      const result = validatePassword(password);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  it('should reject password shorter than 8 characters', () => {
    const result = validatePassword('Pass1!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long');
  });

  it('should reject password without uppercase letter', () => {
    const result = validatePassword('password123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  it('should reject password without lowercase letter', () => {
    const result = validatePassword('PASSWORD123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });

  it('should reject password without number', () => {
    const result = validatePassword('Password!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  it('should reject password without special character', () => {
    const result = validatePassword('Password123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character');
  });

  it('should reject empty password', () => {
    const result = validatePassword('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password is required');
  });

  it('should return multiple errors for weak password', () => {
    const result = validatePassword('weak');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});

describe('validateRegistrationData', () => {
  const validData = {
    email: 'student@university.edu',
    password: 'SecurePass123!',
    name: 'John Doe',
    department: 'Computer Science',
  };

  it('should validate correct registration data', () => {
    const result = validateRegistrationData(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject invalid email', () => {
    const result = validateRegistrationData({
      ...validData,
      email: 'invalid-email',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('email'))).toBe(true);
  });

  it('should reject weak password', () => {
    const result = validateRegistrationData({
      ...validData,
      password: 'weak',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should reject empty name', () => {
    const result = validateRegistrationData({
      ...validData,
      name: '',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name is required');
  });

  it('should reject name shorter than 2 characters', () => {
    const result = validateRegistrationData({
      ...validData,
      name: 'A',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name must be at least 2 characters long');
  });

  it('should reject empty department', () => {
    const result = validateRegistrationData({
      ...validData,
      department: '',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Department is required');
  });

  it('should return multiple errors for invalid data', () => {
    const result = validateRegistrationData({
      email: 'invalid',
      password: 'weak',
      name: '',
      department: '',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(3);
  });
});

describe('validateUserRole', () => {
  it('should validate valid roles', () => {
    const validRoles = ['student', 'faculty', 'admin'];

    validRoles.forEach((role) => {
      const result = validateUserRole(role);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  it('should reject invalid role', () => {
    const result = validateUserRole('invalid-role');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Role must be one of: student, faculty, admin');
  });

  it('should reject empty role', () => {
    const result = validateUserRole('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Role is required');
  });
});
