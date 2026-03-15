/**
 * Exam Session State Management Functions
 * Requirements: 2.1, 2.3, 2.5, 14.1, 14.2
 * 
 * Provides utility functions for managing exam session state
 */

import { ExamSession, ExamAnswer, QuestionState } from '@/types/exam-session';

/**
 * Calculates the question state for a given question index
 * Requirement 14.1, 14.2 - Question palette state
 */
export function getQuestionState(
  session: ExamSession,
  questionIndex: number
): QuestionState {
  const hasAnswer = session.answers.some((answer, idx) => idx === questionIndex);
  const isMarkedForReview = session.markedForReview.includes(questionIndex);
  const isCurrent = session.currentQuestionIndex === questionIndex;

  return {
    answered: hasAnswer,
    markedForReview: isMarkedForReview,
    current: isCurrent,
  };
}

/**
 * Gets question states for all questions in an exam
 * Requirement 14.1, 14.2 - Question palette display
 */
export function getAllQuestionStates(
  session: ExamSession,
  totalQuestions: number
): QuestionState[] {
  const states: QuestionState[] = [];

  for (let i = 0; i < totalQuestions; i++) {
    states.push(getQuestionState(session, i));
  }

  return states;
}

/**
 * Calculates progress as number of answered questions
 * Requirement 14.5 - Progress tracking
 */
export function calculateProgress(session: ExamSession, totalQuestions: number): {
  answered: number;
  total: number;
  percentage: number;
} {
  const answered = session.answers.length;
  const percentage = totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0;

  return {
    answered,
    total: totalQuestions,
    percentage,
  };
}

/**
 * Checks if a question has been answered
 * Requirement 2.5 - Answer preservation
 */
export function isQuestionAnswered(
  session: ExamSession,
  questionId: string
): boolean {
  return session.answers.some(answer => answer.questionId === questionId);
}

/**
 * Gets the answer for a specific question
 * Requirement 2.5 - Answer preservation across navigation
 */
export function getAnswerForQuestion(
  session: ExamSession,
  questionId: string
): ExamAnswer | undefined {
  return session.answers.find(answer => answer.questionId === questionId);
}

/**
 * Calculates total time spent on all questions
 */
export function calculateTotalTimeSpent(session: ExamSession): number {
  return session.answers.reduce((total, answer) => total + answer.timeSpent, 0);
}

/**
 * Calculates time elapsed since session start
 */
export function calculateTimeElapsed(session: ExamSession): number {
  const now = new Date();
  const startTime = new Date(session.startedAt);
  return Math.floor((now.getTime() - startTime.getTime()) / 1000); // seconds
}

/**
 * Checks if the exam timer has expired
 * Requirement 13.4 - Auto-submission on timer expiration
 */
export function isTimerExpired(session: ExamSession): boolean {
  return session.timeRemaining <= 0;
}

/**
 * Checks if the exam should show a warning (5 minutes remaining)
 * Requirement 13.2 - 5-minute warning
 */
export function shouldShowFiveMinuteWarning(session: ExamSession): boolean {
  const fiveMinutesInSeconds = 5 * 60;
  return session.timeRemaining <= fiveMinutesInSeconds && session.timeRemaining > 0;
}

/**
 * Checks if the exam should show urgency (1 minute remaining)
 * Requirement 13.3 - 1-minute urgency indicator
 */
export function shouldShowOneMinuteUrgency(session: ExamSession): boolean {
  const oneMinuteInSeconds = 60;
  return session.timeRemaining <= oneMinuteInSeconds && session.timeRemaining > 0;
}

/**
 * Formats time remaining in MM:SS format
 * Requirement 13.1 - Display time in MM:SS format
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds < 0) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

/**
 * Adds a question to the marked for review list
 * Requirement 14.6 - Mark questions for review
 */
export function markQuestionForReview(
  session: ExamSession,
  questionIndex: number
): number[] {
  if (session.markedForReview.includes(questionIndex)) {
    return session.markedForReview;
  }
  return [...session.markedForReview, questionIndex];
}

/**
 * Removes a question from the marked for review list
 * Requirement 14.6 - Unmark questions
 */
export function unmarkQuestionForReview(
  session: ExamSession,
  questionIndex: number
): number[] {
  return session.markedForReview.filter(idx => idx !== questionIndex);
}

/**
 * Toggles the marked for review state of a question
 * Requirement 14.6 - Toggle review marking
 */
export function toggleQuestionReviewMark(
  session: ExamSession,
  questionIndex: number
): number[] {
  if (session.markedForReview.includes(questionIndex)) {
    return unmarkQuestionForReview(session, questionIndex);
  }
  return markQuestionForReview(session, questionIndex);
}

/**
 * Gets the count of questions marked for review
 * Requirement 14.7 - Display marked questions count
 */
export function getMarkedForReviewCount(session: ExamSession): number {
  return session.markedForReview.length;
}

/**
 * Gets the count of unanswered questions
 * Requirement 14.5 - Progress tracking
 */
export function getUnansweredCount(session: ExamSession, totalQuestions: number): number {
  return totalQuestions - session.answers.length;
}

/**
 * Checks if all questions have been answered
 * Requirement 2.7 - Submission readiness check
 */
export function areAllQuestionsAnswered(session: ExamSession, totalQuestions: number): boolean {
  return session.answers.length === totalQuestions;
}

/**
 * Validates if a session can be submitted
 * Requirement 2.7 - Submission validation
 */
export function canSubmitSession(session: ExamSession): boolean {
  // Can submit if session is in progress
  return session.status === 'in-progress';
}

/**
 * Checks if a session is completed (submitted or auto-submitted)
 */
export function isSessionCompleted(session: ExamSession): boolean {
  return session.status === 'submitted' || session.status === 'auto-submitted';
}

/**
 * Checks if a session is active (in progress)
 */
export function isSessionActive(session: ExamSession): boolean {
  return session.status === 'in-progress';
}

/**
 * Creates a summary of the session state
 */
export function getSessionSummary(session: ExamSession, totalQuestions: number) {
  const progress = calculateProgress(session, totalQuestions);
  const timeElapsed = calculateTimeElapsed(session);
  const markedCount = getMarkedForReviewCount(session);
  const unansweredCount = getUnansweredCount(session, totalQuestions);

  return {
    sessionId: session.id,
    examId: session.examId,
    studentId: session.studentId,
    status: session.status,
    startedAt: session.startedAt,
    submittedAt: session.submittedAt,
    timeRemaining: session.timeRemaining,
    timeElapsed,
    currentQuestionIndex: session.currentQuestionIndex,
    progress,
    markedForReviewCount: markedCount,
    unansweredCount,
    isCompleted: isSessionCompleted(session),
    isActive: isSessionActive(session),
    canSubmit: canSubmitSession(session),
  };
}

/**
 * Validates answer data before saving
 * Requirement 2.3 - Answer validation
 */
export function validateAnswer(
  answer: string | string[],
  questionType: 'multiple-choice' | 'true-false' | 'short-answer'
): { valid: boolean; error?: string } {
  if (questionType === 'multiple-choice') {
    if (Array.isArray(answer)) {
      if (answer.length === 0) {
        return { valid: false, error: 'At least one option must be selected' };
      }
      return { valid: true };
    }
    if (typeof answer === 'string' && answer.trim().length > 0) {
      return { valid: true };
    }
    return { valid: false, error: 'Invalid answer format for multiple choice' };
  }

  if (questionType === 'true-false') {
    if (typeof answer === 'string' && (answer === 'true' || answer === 'false')) {
      return { valid: true };
    }
    return { valid: false, error: 'Answer must be "true" or "false"' };
  }

  if (questionType === 'short-answer') {
    if (typeof answer === 'string' && answer.trim().length > 0) {
      return { valid: true };
    }
    return { valid: false, error: 'Answer cannot be empty' };
  }

  return { valid: false, error: 'Unknown question type' };
}

/**
 * Prepares answer data for offline caching
 * Requirement 2.8 - Offline answer caching
 */
export function prepareAnswerForCache(
  sessionId: string,
  questionId: string,
  answer: string | string[],
  timeSpent: number
): {
  sessionId: string;
  questionId: string;
  answer: string | string[];
  timeSpent: number;
  cachedAt: number;
} {
  return {
    sessionId,
    questionId,
    answer,
    timeSpent,
    cachedAt: Date.now(),
  };
}

/**
 * Gets cached answers from localStorage
 * Requirement 2.8 - Offline answer retrieval
 */
export function getCachedAnswers(sessionId: string): Array<{
  questionId: string;
  answer: string | string[];
  timeSpent: number;
  cachedAt: number;
}> {
  if (typeof window === 'undefined') return [];

  try {
    const cacheKey = `exam-session-${sessionId}-answers`;
    const cached = localStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error('Error retrieving cached answers:', error);
    return [];
  }
}

/**
 * Saves answer to localStorage cache
 * Requirement 2.8 - Offline answer caching
 */
export function cacheAnswer(
  sessionId: string,
  questionId: string,
  answer: string | string[],
  timeSpent: number
): void {
  if (typeof window === 'undefined') return;

  try {
    const cacheKey = `exam-session-${sessionId}-answers`;
    const cached = getCachedAnswers(sessionId);
    
    // Remove existing answer for this question if any
    const filtered = cached.filter(a => a.questionId !== questionId);
    
    // Add new answer
    const newAnswer = prepareAnswerForCache(sessionId, questionId, answer, timeSpent);
    filtered.push(newAnswer);
    
    localStorage.setItem(cacheKey, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error caching answer:', error);
  }
}

/**
 * Clears cached answers for a session
 * Requirement 2.8 - Cache cleanup after sync
 */
export function clearCachedAnswers(sessionId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const cacheKey = `exam-session-${sessionId}-answers`;
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('Error clearing cached answers:', error);
  }
}
