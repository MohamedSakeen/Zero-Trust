/**
 * Exam Session Database Access Layer
 * Requirements: 2.1, 2.3, 2.5
 * 
 * Provides CRUD operations for exam sessions and answers
 */

import { eq, and, inArray, desc } from 'drizzle-orm';
import { db } from '@/db';
import { examSessions, examAnswers, exams } from '@/db/schema';
import { 
  ExamSession, 
  ExamAnswer, 
  ExamSessionRecord, 
  ExamAnswerRecord,
  QuestionState 
} from '@/types/exam-session';

/**
 * Creates a new exam session when a student starts an exam
 * Requirement 2.1 - Initialize exam session
 */
export async function createExamSession(
  examId: string,
  studentId: string,
  durationInMinutes: number
): Promise<ExamSession> {
  // Get exam to verify it exists
  const [exam] = await db.select().from(exams).where(eq(exams.id, examId));
  
  if (!exam) {
    throw new Error(`Exam not found: ${examId}`);
  }

  // Create session
  const [session] = await db
    .insert(examSessions)
    .values({
      examId,
      studentId,
      timeRemaining: durationInMinutes * 60, // Convert minutes to seconds
      currentQuestionIndex: 0,
      status: 'in-progress',
    })
    .returning();

  return mapSessionRecordToSession(session, []);
}

/**
 * Retrieves an exam session by ID
 * Requirement 2.1
 */
export async function getExamSessionById(sessionId: string): Promise<ExamSession | null> {
  const [session] = await db
    .select()
    .from(examSessions)
    .where(eq(examSessions.id, sessionId))
    .limit(1);

  if (!session) {
    return null;
  }

  // Fetch all answers for this session
  const answers = await db
    .select()
    .from(examAnswers)
    .where(eq(examAnswers.sessionId, sessionId));

  return mapSessionRecordToSession(session, answers);
}

/**
 * Retrieves the active session for a student and exam
 * Requirement 2.1
 */
export async function getActiveSessionForStudent(
  examId: string,
  studentId: string
): Promise<ExamSession | null> {
  const [session] = await db
    .select()
    .from(examSessions)
    .where(
      and(
        eq(examSessions.examId, examId),
        eq(examSessions.studentId, studentId),
        eq(examSessions.status, 'in-progress')
      )
    )
    .limit(1);

  if (!session) {
    return null;
  }

  // Fetch all answers for this session
  const answers = await db
    .select()
    .from(examAnswers)
    .where(eq(examAnswers.sessionId, session.id));

  return mapSessionRecordToSession(session, answers);
}

/**
 * Saves or updates an answer for a question in an exam session
 * Requirement 2.3 - Answer persistence on selection
 */
export async function saveAnswer(
  sessionId: string,
  questionId: string,
  answer: string | string[],
  timeSpent: number
): Promise<ExamAnswer> {
  // Check if answer already exists
  const [existingAnswer] = await db
    .select()
    .from(examAnswers)
    .where(
      and(
        eq(examAnswers.sessionId, sessionId),
        eq(examAnswers.questionId, questionId)
      )
    )
    .limit(1);

  let savedAnswer;

  if (existingAnswer) {
    // Update existing answer
    [savedAnswer] = await db
      .update(examAnswers)
      .set({
        answer,
        timeSpent,
        answeredAt: new Date(),
      })
      .where(eq(examAnswers.id, existingAnswer.id))
      .returning();
  } else {
    // Insert new answer
    [savedAnswer] = await db
      .insert(examAnswers)
      .values({
        sessionId,
        questionId,
        answer,
        timeSpent,
      })
      .returning();
  }

  return mapAnswerRecordToAnswer(savedAnswer);
}

/**
 * Retrieves all answers for a session
 * Requirement 2.5 - Answer preservation across navigation
 */
export async function getSessionAnswers(sessionId: string): Promise<ExamAnswer[]> {
  const answers = await db
    .select()
    .from(examAnswers)
    .where(eq(examAnswers.sessionId, sessionId));

  return answers.map(mapAnswerRecordToAnswer);
}

/**
 * Retrieves a specific answer for a question in a session
 * Requirement 2.5 - Answer preservation across navigation
 */
export async function getAnswer(
  sessionId: string,
  questionId: string
): Promise<ExamAnswer | null> {
  const [answer] = await db
    .select()
    .from(examAnswers)
    .where(
      and(
        eq(examAnswers.sessionId, sessionId),
        eq(examAnswers.questionId, questionId)
      )
    )
    .limit(1);

  return answer ? mapAnswerRecordToAnswer(answer) : null;
}

/**
 * Updates the current question index for a session
 * Requirement 2.5 - Navigation state management
 */
export async function updateCurrentQuestionIndex(
  sessionId: string,
  questionIndex: number
): Promise<void> {
  await db
    .update(examSessions)
    .set({
      currentQuestionIndex: questionIndex,
      updatedAt: new Date(),
    })
    .where(eq(examSessions.id, sessionId));
}

/**
 * Updates the time remaining for a session
 * Requirement 2.2 - Timer management
 */
export async function updateTimeRemaining(
  sessionId: string,
  timeRemaining: number
): Promise<void> {
  await db
    .update(examSessions)
    .set({
      timeRemaining,
      updatedAt: new Date(),
    })
    .where(eq(examSessions.id, sessionId));
}

/**
 * Submits an exam session
 * Requirement 2.7 - Exam submission
 */
export async function submitExamSession(
  sessionId: string,
  autoSubmitted: boolean = false
): Promise<ExamSession> {
  const status = autoSubmitted ? 'auto-submitted' : 'submitted';

  const [session] = await db
    .update(examSessions)
    .set({
      status,
      submittedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(examSessions.id, sessionId))
    .returning();

  // Fetch all answers for this session
  const answers = await db
    .select()
    .from(examAnswers)
    .where(eq(examAnswers.sessionId, sessionId));

  return mapSessionRecordToSession(session, answers);
}

/**
 * Retrieves all sessions for a specific exam
 * Used for live results and analytics
 */
export async function getSessionsForExam(examId: string): Promise<ExamSession[]> {
  const sessions = await db
    .select()
    .from(examSessions)
    .where(eq(examSessions.examId, examId))
    .orderBy(desc(examSessions.startedAt));

  // Fetch answers for all sessions
  const sessionIds = sessions.map(s => s.id);
  const allAnswers = sessionIds.length > 0
    ? await db
        .select()
        .from(examAnswers)
        .where(inArray(examAnswers.sessionId, sessionIds))
    : [];

  // Group answers by session
  const answersBySession = new Map<string, typeof allAnswers>();
  for (const answer of allAnswers) {
    if (!answersBySession.has(answer.sessionId)) {
      answersBySession.set(answer.sessionId, []);
    }
    answersBySession.get(answer.sessionId)!.push(answer);
  }

  return sessions.map(session => 
    mapSessionRecordToSession(session, answersBySession.get(session.id) || [])
  );
}

/**
 * Retrieves all sessions for a specific student
 */
export async function getSessionsForStudent(studentId: string): Promise<ExamSession[]> {
  const sessions = await db
    .select()
    .from(examSessions)
    .where(eq(examSessions.studentId, studentId))
    .orderBy(desc(examSessions.startedAt));

  // Fetch answers for all sessions
  const sessionIds = sessions.map(s => s.id);
  const allAnswers = sessionIds.length > 0
    ? await db
        .select()
        .from(examAnswers)
        .where(inArray(examAnswers.sessionId, sessionIds))
    : [];

  // Group answers by session
  const answersBySession = new Map<string, typeof allAnswers>();
  for (const answer of allAnswers) {
    if (!answersBySession.has(answer.sessionId)) {
      answersBySession.set(answer.sessionId, []);
    }
    answersBySession.get(answer.sessionId)!.push(answer);
  }

  return sessions.map(session => 
    mapSessionRecordToSession(session, answersBySession.get(session.id) || [])
  );
}

/**
 * Checks if a student has already started or completed an exam
 */
export async function hasStudentStartedExam(
  examId: string,
  studentId: string
): Promise<boolean> {
  const [session] = await db
    .select()
    .from(examSessions)
    .where(
      and(
        eq(examSessions.examId, examId),
        eq(examSessions.studentId, studentId)
      )
    )
    .limit(1);

  return !!session;
}

/**
 * Grades an answer by comparing with correct answer
 * Updates the answer record with correctness and points earned
 */
export async function gradeAnswer(
  answerId: string,
  isCorrect: boolean,
  pointsEarned: number
): Promise<void> {
  await db
    .update(examAnswers)
    .set({
      isCorrect,
      pointsEarned,
    })
    .where(eq(examAnswers.id, answerId));
}

/**
 * Bulk grades all answers for a session
 * Returns the total points earned
 */
export async function gradeSessionAnswers(
  sessionId: string,
  gradingResults: Array<{ questionId: string; isCorrect: boolean; pointsEarned: number }>
): Promise<number> {
  let totalPoints = 0;

  for (const result of gradingResults) {
    const [answer] = await db
      .select()
      .from(examAnswers)
      .where(
        and(
          eq(examAnswers.sessionId, sessionId),
          eq(examAnswers.questionId, result.questionId)
        )
      )
      .limit(1);

    if (answer) {
      await gradeAnswer(answer.id, result.isCorrect, result.pointsEarned);
      totalPoints += result.pointsEarned;
    }
  }

  return totalPoints;
}

/**
 * Helper function to map database record to ExamSession type
 */
function mapSessionRecordToSession(
  record: any,
  answers: any[]
): ExamSession {
  return {
    id: record.id,
    examId: record.examId || record.exam_id,
    studentId: record.studentId || record.student_id,
    startedAt: new Date(record.startedAt || record.started_at),
    submittedAt: record.submittedAt || record.submitted_at ? new Date(record.submittedAt || record.submitted_at) : undefined,
    timeRemaining: record.timeRemaining || record.time_remaining,
    currentQuestionIndex: record.currentQuestionIndex || record.current_question_index,
    answers: answers.map(mapAnswerRecordToAnswer),
    markedForReview: [], // This will be managed in client state or separate table if needed
    status: record.status,
    proctoring: {
      photos: [],
      events: [],
    }, // Proctoring data will be fetched separately when needed
  };
}

/**
 * Helper function to map database record to ExamAnswer type
 */
function mapAnswerRecordToAnswer(record: any): ExamAnswer {
  return {
    questionId: record.questionId || record.question_id,
    answer: record.answer,
    answeredAt: new Date(record.answeredAt || record.answered_at),
    timeSpent: record.timeSpent || record.time_spent,
  };
}
