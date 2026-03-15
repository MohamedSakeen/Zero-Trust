/**
 * User Validation Functions
 * Requirements: 1.1, 3.1, 9.1
 * 
 * Provides validation for user data including email format and password strength
 */

/**
 * Email validation regex pattern
 * Validates standard email format: local@domain.tld
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password strength requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
const PASSWORD_NUMBER_REGEX = /[0-9]/;
const PASSWORD_SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates email format
 * @param email - Email address to validate
 * @returns ValidationResult with isValid flag and error messages
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates password strength according to security requirements
 * @param password - Password to validate
 * @returns ValidationResult with isValid flag and error messages
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
  }

  if (!PASSWORD_UPPERCASE_REGEX.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!PASSWORD_LOWERCASE_REGEX.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!PASSWORD_NUMBER_REGEX.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!PASSWORD_SPECIAL_CHAR_REGEX.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates user registration data
 * @param data - Registration data to validate
 * @returns ValidationResult with isValid flag and error messages
 */
export function validateRegistrationData(data: {
  email: string;
  password: string;
  name: string;
  department: string;
}): ValidationResult {
  const errors: string[] = [];

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors);
  }

  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  // Validate department
  if (!data.department || data.department.trim().length === 0) {
    errors.push('Department is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates user role
 * @param role - Role to validate
 * @returns ValidationResult with isValid flag and error messages
 */
export function validateUserRole(role: string): ValidationResult {
  const validRoles = ['student', 'faculty', 'admin'];
  const errors: string[] = [];

  if (!role) {
    errors.push('Role is required');
  } else if (!validRoles.includes(role)) {
    errors.push(`Role must be one of: ${validRoles.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
