/**
 * Verify Database and Redis Setup
 * 
 * This script verifies that the database and Redis are properly configured
 * Run with: npx tsx src/lib/__tests__/verify-setup.ts
 */

import { db, users } from '@/db';
import { getRedisClient } from '@/lib/redis';
import { count } from 'drizzle-orm';

async function verifySetup() {
  console.log('🔍 Verifying Database and Redis Setup\n');

  let allChecksPass = true;

  // Check 1: Database connection
  console.log('Check 1: Database Connection');
  try {
    const result = await db.select({ count: count() }).from(users);
    console.log(`✅ PASS: Database connected successfully`);
    console.log(`   Users in database: ${result[0].count}`);
  } catch (error) {
    console.log('❌ FAIL: Database connection failed');
    console.log(`   Error: ${error}`);
    allChecksPass = false;
  }

  // Check 2: Redis connection
  console.log('\nCheck 2: Redis Connection');
  try {
    const redis = getRedisClient();
    await redis.connect();
    await redis.set('test-key', 'test-value', 'EX', 10);
    const value = await redis.get('test-key');
    
    if (value === 'test-value') {
      console.log('✅ PASS: Redis connected and working');
      await redis.del('test-key');
    } else {
      console.log('❌ FAIL: Redis not working correctly');
      allChecksPass = false;
    }
  } catch (error) {
    console.log('❌ FAIL: Redis connection failed');
    console.log(`   Error: ${error}`);
    console.log('   Make sure Redis is running: redis-server');
    allChecksPass = false;
  }

  // Check 3: Environment variables
  console.log('\nCheck 3: Environment Variables');
  const requiredEnvVars = ['DATABASE_URL', 'NEXTAUTH_SECRET'];
  let envVarsOk = true;

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar} is set`);
    } else {
      console.log(`❌ ${envVar} is NOT set`);
      envVarsOk = false;
      allChecksPass = false;
    }
  }

  if (envVarsOk) {
    console.log('✅ PASS: All required environment variables are set');
  } else {
    console.log('❌ FAIL: Some environment variables are missing');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (allChecksPass) {
    console.log('✅ All checks passed! System is ready.');
    console.log('\nNext steps:');
    console.log('  1. Run database migrations: npm run db:migrate:run');
    console.log('  2. Seed the database: npm run db:seed');
    console.log('  3. Start the dev server: npm run dev');
    console.log('  4. Run API tests: npx tsx src/lib/__tests__/auth-api-integration.test.ts');
  } else {
    console.log('❌ Some checks failed. Please fix the issues above.');
  }
  console.log('='.repeat(50));

  process.exit(allChecksPass ? 0 : 1);
}

verifySetup().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
