/**
 * Authentication API Integration Tests
 * Requirements: 1.1, 3.1, 9.1
 * 
 * Tests the authentication API endpoints with actual HTTP requests
 * Note: Requires the Next.js dev server to be running
 * 
 * Run with: npx tsx src/lib/__tests__/auth-api-integration.test.ts
 */

import { testRegister, testLogin, testLogout, generateTestEmail } from './api-test-helper';

async function runTests() {
  console.log('🧪 Running Authentication API Integration Tests\n');
  console.log('⚠️  Make sure the Next.js dev server is running (npm run dev)\n');

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Register a new user
  console.log('Test 1: User Registration');
  try {
    const testEmail = generateTestEmail();
    const registerData = {
      email: testEmail,
      password: 'TestPass123',
      name: 'Test User',
      department: 'Computer Science',
    };

    const registerResponse = await testRegister(registerData);
    
    if (registerResponse.ok && registerResponse.status === 201) {
      console.log('✅ PASS: User registered successfully');
      console.log(`   User ID: ${registerResponse.data?.user?.id}`);
      testsPassed++;
    } else {
      console.log(`❌ FAIL: Registration failed with status ${registerResponse.status}`);
      console.log(`   Error: ${registerResponse.error}`);
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL: Exception during registration test');
    console.log(`   Error: ${error}`);
    testsFailed++;
  }

  // Test 2: Register with duplicate email
  console.log('\nTest 2: Duplicate Email Registration');
  try {
    const duplicateData = {
      email: 'student@university.edu', // From seed data
      password: 'TestPass123',
      name: 'Duplicate User',
      department: 'Computer Science',
    };

    const duplicateResponse = await testRegister(duplicateData);
    
    if (!duplicateResponse.ok && duplicateResponse.status === 409) {
      console.log('✅ PASS: Duplicate email rejected correctly');
      testsPassed++;
    } else {
      console.log(`❌ FAIL: Expected 409 status, got ${duplicateResponse.status}`);
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL: Exception during duplicate email test');
    console.log(`   Error: ${error}`);
    testsFailed++;
  }

  // Test 3: Register with weak password
  console.log('\nTest 3: Weak Password Registration');
  try {
    const weakPasswordData = {
      email: generateTestEmail(),
      password: 'weak',
      name: 'Test User',
      department: 'Computer Science',
    };

    const weakPasswordResponse = await testRegister(weakPasswordData);
    
    if (!weakPasswordResponse.ok && weakPasswordResponse.status === 400) {
      console.log('✅ PASS: Weak password rejected correctly');
      console.log(`   Error message: ${weakPasswordResponse.error}`);
      testsPassed++;
    } else {
      console.log(`❌ FAIL: Expected 400 status, got ${weakPasswordResponse.status}`);
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL: Exception during weak password test');
    console.log(`   Error: ${error}`);
    testsFailed++;
  }

  // Test 4: Login with valid credentials
  console.log('\nTest 4: Login with Valid Credentials');
  try {
    const loginData = {
      email: 'student@university.edu',
      password: 'password123',
    };

    const loginResponse = await testLogin(loginData);
    
    if (loginResponse.ok && loginResponse.status === 200) {
      console.log('✅ PASS: Login successful');
      console.log(`   User: ${loginResponse.data?.user?.name}`);
      console.log(`   Role: ${loginResponse.data?.user?.role}`);
      console.log(`   Token expires in: ${loginResponse.data?.token?.expiresIn}s`);
      testsPassed++;

      // Save token for logout test
      const accessToken = loginResponse.data?.token?.accessToken;

      // Test 5: Logout
      console.log('\nTest 5: Logout');
      try {
        const logoutResponse = await testLogout(accessToken);
        
        if (logoutResponse.ok && logoutResponse.status === 200) {
          console.log('✅ PASS: Logout successful');
          testsPassed++;
        } else {
          console.log(`❌ FAIL: Logout failed with status ${logoutResponse.status}`);
          testsFailed++;
        }
      } catch (error) {
        console.log('❌ FAIL: Exception during logout test');
        console.log(`   Error: ${error}`);
        testsFailed++;
      }
    } else {
      console.log(`❌ FAIL: Login failed with status ${loginResponse.status}`);
      console.log(`   Error: ${loginResponse.error}`);
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL: Exception during login test');
    console.log(`   Error: ${error}`);
    testsFailed++;
  }

  // Test 6: Login with invalid credentials
  console.log('\nTest 6: Login with Invalid Credentials');
  try {
    const invalidLoginData = {
      email: 'student@university.edu',
      password: 'wrongpassword',
    };

    const invalidLoginResponse = await testLogin(invalidLoginData);
    
    if (!invalidLoginResponse.ok && invalidLoginResponse.status === 401) {
      console.log('✅ PASS: Invalid credentials rejected correctly');
      testsPassed++;
    } else {
      console.log(`❌ FAIL: Expected 401 status, got ${invalidLoginResponse.status}`);
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL: Exception during invalid login test');
    console.log(`   Error: ${error}`);
    testsFailed++;
  }

  // Test 7: Login with non-existent user
  console.log('\nTest 7: Login with Non-existent User');
  try {
    const nonExistentLoginData = {
      email: 'nonexistent@test.com',
      password: 'password123',
    };

    const nonExistentLoginResponse = await testLogin(nonExistentLoginData);
    
    if (!nonExistentLoginResponse.ok && nonExistentLoginResponse.status === 401) {
      console.log('✅ PASS: Non-existent user rejected correctly');
      testsPassed++;
    } else {
      console.log(`❌ FAIL: Expected 401 status, got ${nonExistentLoginResponse.status}`);
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL: Exception during non-existent user test');
    console.log(`   Error: ${error}`);
    testsFailed++;
  }

  // Test 8: Logout without token
  console.log('\nTest 8: Logout without Token');
  try {
    const logoutResponse = await testLogout('');
    
    if (!logoutResponse.ok && logoutResponse.status === 401) {
      console.log('✅ PASS: Logout without token rejected correctly');
      testsPassed++;
    } else {
      console.log(`❌ FAIL: Expected 401 status, got ${logoutResponse.status}`);
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL: Exception during logout without token test');
    console.log(`   Error: ${error}`);
    testsFailed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Test Summary:');
  console.log(`  ✅ Passed: ${testsPassed}`);
  console.log(`  ❌ Failed: ${testsFailed}`);
  console.log(`  Total: ${testsPassed + testsFailed}`);
  console.log('='.repeat(50));

  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the output above.');
  }
}

// Run tests
runTests().catch(console.error);
