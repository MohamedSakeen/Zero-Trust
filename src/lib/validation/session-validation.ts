/**
 * Exam Session Validation Functions
 * Requirements: 2.1, 2.3, 2.7
 */

import { ExamSession, ExamAnswer } from '@/types/exam-session';

/**
 * Validates exam session creation data
 * Requirement 2.1
 */
export function validateSessionCreation(
  examId: string,
  studentId: string,
  durationInMinutes: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!examId || examId.trim().length === 0) {
    errors.push('Exam ID is required');
  }

  if (!studentId || studentId.trim().length === 0) {
    errors.push('Student ID is required');
  }

  if (durationInMinutes <= 0) {
    errors.push('Duration must be greater than 0');
  }

  if (durationInMinutes > 600) {
    errors.push('Duration cannot exceed 600 minutes (10 hours)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates answer data before saving
 * Requirement 2.3
 */
export function validateAnswerData(
  sessionId: string,
  questionId: string,
  answer: string | string[],
  timeSpent: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!sessionId || sessionId.trim().length === 0) {
    errors.push('Session ID is required');
  }

  if (!questionId || questionId.trim().length === 0) {
    errors.push('Question ID is required');
  }

  if (answer === null || answer === undefined) {
    errors.push('Answer is required');
  } else if (Array.isArray(answer)) {
    if (answer.length === 0) {
      errors.push('Answer array cannot be empty');
    }
  } else if (typeof answer === 'string') {
    if (answer.trim().length === 0) {
      errors.push('Answer cannot be empty');
    }
  } else {
    errors.push('Answer must be a string or array of strings');
  }

  if (timeSpent < 0) {
    errors.push('Time spent cannot be negative');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates session submission
 * Requirement 2.7
 */
export function validateSessionSubmission(
  session: ExamSession
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!session) {
    errors.push('Session is required');
    return { valid: false, errors };
  }

  if (session.status !== 'in-progress') {
    errors.push('Only in-progress sessions can be submitted');
  }

  if (session.submittedAt) {
    errors.push('Session has already been submitted');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates time remaining update
 * Requirement 2.2
 */
export function validateTimeUpdate(
  timeRemaining: number
): { valid: boolean; error?: string } {
  if (timeRemaining < 0) {
    return { valid: false, error: 'Time remaining cannot be negative' };
  }

  return { valid: true };
}

/**
 * Validates question index for navigation
 * Requirement 2.4
 */
export function validateQuestionIndex(
  questionIndex: number,
  totalQuestions: number
): { valid: boolean; error?: string } {
  if (questionIndex < 0) {
    return { valid: false, error: 'Question index cannot be negative' };
  }

  if (questionIndex >= totalQuestions) {
    return { valid: false, error: 'Question index exceeds total questions' };
  }

  return { valid: true };
}

/**
 * Validates session state for operations
 */
export function validateSessionState(
  session: ExamSession,
  operation: 'answer' | 'navigate' | 'submit'
): { valid: boolean; error?: string } {
  if (!session) {
    return { valid: false, error: 'Session not found' };
  }

  if (session.status !== 'in-progress') {
    return { valid: false, error: `Cannot ${operation} - session is ${session.status}` };
  }

  if (session.timeRemaining <= 0 && operation !== 'submit') {
    return { valid: false, error: 'Time has expired' };
  }

  return { valid: true };
}
