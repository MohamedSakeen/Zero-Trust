/**
 * Redis Cache Usage Examples
 * 
 * This file demonstrates how to use the Redis cache utilities.
 * These examples can be used as reference or converted to actual tests.
 */

import {
  setSession,
  getSession,
  deleteSession,
  setExamSession,
  getExamSession,
  updateExamSession,
  setLiveResults,
  getLiveResults,
  updateLiveResults,
  checkRateLimit,
  setCacheValue,
  getCacheValue,
} from '../redis-cache';

/**
 * Example: Session Management
 */
export async function sessionManagementExample() {
  const userId = 'user-123';

  // Store session
  await setSession(userId, {
    userId,
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'refresh-token-xyz',
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  // Retrieve session
  const session = await getSession(userId);
  console.log('Retrieved session:', session);

  // Delete session (logout)
  await deleteSession(userId);
  console.log('Session deleted');
}

/**
 * Example: Exam Session Caching
 */
export async function examSessionExample() {
  const sessionId = 'exam-session-456';
  const examDurationMinutes = 60;

  // Store exam session
  await setExamSession(
    sessionId,
    {
      sessionId,
      examId: 'exam-789',
      studentId: 'student-123',
      startedAt: Date.now(),
      timeRemaining: 3600, // 60 minutes in seconds
      currentQuestionIndex: 0,
    },
    examDurationMinutes
  );

  // Get exam session
  const examSession = await getExamSession(sessionId);
  console.log('Retrieved exam session:', examSession);

  // Update exam session (student answers question 5)
  await updateExamSession(sessionId, {
    currentQuestionIndex: 5,
    timeRemaining: 3300, // 55 minutes remaining
  });

  console.log('Exam session updated');
}

/**
 * Example: Live Results Caching
 */
export async function liveResultsExample() {
  const examId = 'exam-789';

  // Initialize live results
  await setLiveResults(examId, {
    examId,
    totalStudents: 50,
    studentsInProgress: 30,
    studentsCompleted: 20,
    lastUpdated: Date.now(),
  });

  // Get live results
  const results = await getLiveResults(examId);
  console.log('Live results:', results);

  // Update when a student completes the exam
  await updateLiveResults(examId, {
    studentsInProgress: 29,
    studentsCompleted: 21,
  });

  console.log('Live results updated');
}

/**
 * Example: Rate Limiting
 */
export async function rateLimitingExample() {
  const userId = 'user-123';
  const endpoint = '/api/auth/login';
  const maxAttempts = 5;

  // Simulate multiple login attempts
  for (let i = 1; i <= 7; i++) {
    const { allowed, remaining } = await checkRateLimit(
      userId,
      endpoint,
      maxAttempts
    );

    console.log(`Attempt ${i}:`, {
      allowed,
      remaining,
      message: allowed
        ? `Request allowed. ${remaining} attempts remaining.`
        : 'Rate limit exceeded. Please try again later.',
    });

    if (!allowed) {
      // In a real API, return 429 Too Many Requests
      break;
    }
  }
}

/**
 * Example: Generic Cache Operations
 */
export async function genericCacheExample() {
  // Cache user preferences
  await setCacheValue(
    'user-preferences:user-123',
    {
      theme: 'dark',
      language: 'en',
      notifications: true,
    },
    3600 // 1 hour TTL
  );

  // Retrieve cached preferences
  const preferences = await getCacheValue('user-preferences:user-123');
  console.log('User preferences:', preferences);

  // Cache exam questions for quick access
  await setCacheValue(
    'exam-questions:exam-789',
    [
      { id: 'q1', text: 'What is 2+2?', type: 'multiple-choice' },
      { id: 'q2', text: 'What is the capital of France?', type: 'short-answer' },
    ],
    1800 // 30 minutes TTL
  );

  const questions = await getCacheValue('exam-questions:exam-789');
  console.log('Cached questions:', questions);
}

/**
 * Example: Complete Exam Flow
 */
export async function completeExamFlowExample() {
  const studentId = 'student-123';
  const examId = 'exam-789';
  const sessionId = 'session-456';

  console.log('=== Starting Exam Flow ===');

  // 1. Student logs in - create session
  await setSession(studentId, {
    userId: studentId,
    accessToken: 'token-abc',
    refreshToken: 'refresh-xyz',
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });
  console.log('✓ Student logged in');

  // 2. Student starts exam - create exam session
  await setExamSession(
    sessionId,
    {
      sessionId,
      examId,
      studentId,
      startedAt: Date.now(),
      timeRemaining: 3600,
      currentQuestionIndex: 0,
    },
    60
  );
  console.log('✓ Exam session started');

  // 3. Initialize live results
  await setLiveResults(examId, {
    examId,
    totalStudents: 50,
    studentsInProgress: 1,
    studentsCompleted: 0,
    lastUpdated: Date.now(),
  });
  console.log('✓ Live results initialized');

  // 4. Student answers questions - update exam session
  await updateExamSession(sessionId, {
    currentQuestionIndex: 10,
    timeRemaining: 2400,
  });
  console.log('✓ Student progress updated');

  // 5. Student completes exam - update live results
  await updateLiveResults(examId, {
    studentsInProgress: 0,
    studentsCompleted: 1,
  });
  console.log('✓ Exam completed, live results updated');

  // 6. Verify final state
  const finalSession = await getExamSession(sessionId);
  const finalResults = await getLiveResults(examId);

  console.log('=== Final State ===');
  console.log('Exam session:', finalSession);
  console.log('Live results:', finalResults);
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  try {
    console.log('\n--- Session Management Example ---');
    await sessionManagementExample();

    console.log('\n--- Exam Session Example ---');
    await examSessionExample();

    console.log('\n--- Live Results Example ---');
    await liveResultsExample();

    console.log('\n--- Rate Limiting Example ---');
    await rateLimitingExample();

    console.log('\n--- Generic Cache Example ---');
    await genericCacheExample();

    console.log('\n--- Complete Exam Flow Example ---');
    await completeExamFlowExample();

    console.log('\n✓ All examples completed successfully');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Uncomment to run examples:
// runAllExamples();
