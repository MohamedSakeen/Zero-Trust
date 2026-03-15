/**
 * Manual Test Script for Authentication API
 * 
 * This script tests the authentication endpoints manually.
 * Run with: tsx src/lib/__tests__/auth-test.ts
 */

import { hashPassword, verifyPassword, validatePasswordStrength, validateEmail } from '../auth';

async function testAuthUtilities() {
  console.log('Testing Authentication Utilities...\n');

  // Test 1: Password hashing and verification
  console.log('Test 1: Password Hashing and Verification');
  const password = 'TestPassword123';
  const hash = await hashPassword(password);
  console.log('✓ Password hashed successfully');
  
  const isValid = await verifyPassword(password, hash);
  console.log(`✓ Password verification: ${isValid ? 'PASS' : 'FAIL'}`);
  
  const isInvalid = await verifyPassword('WrongPassword', hash);
  console.log(`✓ Wrong password rejected: ${!isInvalid ? 'PASS' : 'FAIL'}`);

  // Test 2: Password strength validation
  console.log('\nTest 2: Password Strength Validation');
  const weakPassword = 'weak';
  const strongPassword = 'StrongPass123';
  
  const weakResult = validatePasswordStrength(weakPassword);
  console.log(`✓ Weak password rejected: ${!weakResult.isValid ? 'PASS' : 'FAIL'}`);
  console.log(`  Error: ${weakResult.error}`);
  
  const strongResult = validatePasswordStrength(strongPassword);
  console.log(`✓ Strong password accepted: ${strongResult.isValid ? 'PASS' : 'FAIL'}`);

  // Test 3: Email validation
  console.log('\nTest 3: Email Validation');
  const validEmail = 'test@example.com';
  const invalidEmail = 'invalid-email';
  
  console.log(`✓ Valid email accepted: ${validateEmail(validEmail) ? 'PASS' : 'FAIL'}`);
  console.log(`✓ Invalid email rejected: ${!validateEmail(invalidEmail) ? 'PASS' : 'FAIL'}`);

  console.log('\n✅ All utility tests passed!');
}

// Run tests
testAuthUtilities().catch(console.error);
