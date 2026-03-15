import { eq, and, gte, lte, inArray } from 'drizzle-orm';
import { db } from './index';
import { 
  users, 
  questions, 
  exams, 
  examQuestions, 
  examAssignments, 
  examSessions,
  examAnswers,
  proctoringSessions,
  proctoringPhotos,
  proctoringEvents,
  proctoringFlags,
  auditLogs
} from './schema';

/**
 * Common database queries for the University Exam Platform
 * These functions provide a clean API for database operations
 */

// ============================================================================
// User Queries
// ============================================================================

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
}

export async function getUsersByRole(role: 'student' | 'faculty' | 'admin') {
  return db.select().from(users).where(eq(users.role, role));
}

// ============================================================================
// Question Queries
// ============================================================================

export async function getQuestionById(id: string) {
  const [question] = await db.select().from(questions).where(eq(questions.id, id)).limit(1);
  return question;
}

export async function getQuestionsBySubject(subject: string) {
  return db.select().from(questions).where(eq(questions.subject, subject));
}

export async function getActiveQuestions() {
  return db.select().from(questions).where(eq(questions.status, 'active'));
}

// ============================================================================
// Exam Queries
// ============================================================================

export async function getExamById(id: string) {
  const [exam] = await db.select().from(exams).where(eq(exams.id, id)).limit(1);
  return exam;
}

export async function getExamsByCreator(creatorId: string) {
  return db.select().from(exams).where(eq(exams.createdBy, creatorId));
}

export async function getActiveExams() {
  const now = new Date();
  return db.select().from(exams).where(
    and(
      eq(exams.status, 'active'),
      lte(exams.startTime, now),
      gte(exams.endTime, now)
    )
  );
}

export async function getExamQuestions(examId: string) {
  return db
    .select({
      examQuestion: examQuestions,
      question: questions,
    })
    .from(examQuestions)
    .innerJoin(questions, eq(examQuestions.questionId, questions.id))
    .where(eq(examQuestions.examId, examId))
    .orderBy(examQuestions.order);
}

// ============================================================================
// Exam Assignment Queries
// ============================================================================

export async function getExamsAssignedToStudent(studentId: string) {
  return db
    .select({
      assignment: examAssignments,
      exam: exams,
    })
    .from(examAssignments)
    .innerJoin(exams, eq(examAssignments.examId, exams.id))
    .where(eq(examAssignments.studentId, studentId));
}

export async function getStudentsAssignedToExam(examId: string) {
  return db
    .select({
      assignment: examAssignments,
      student: users,
    })
    .from(examAssignments)
    .innerJoin(users, eq(examAssignments.studentId, users.id))
    .where(eq(examAssignments.examId, examId));
}

export async function isExamAssignedToStudent(examId: string, studentId: string) {
  const [assignment] = await db
    .select()
    .from(examAssignments)
    .where(
      and(
        eq(examAssignments.examId, examId),
        eq(examAssignments.studentId, studentId)
      )
    )
    .limit(1);
  return !!assignment;
}

// ============================================================================
// Exam Session Queries
// ============================================================================

export async function getExamSessionById(id: string) {
  const [session] = await db.select().from(examSessions).where(eq(examSessions.id, id)).limit(1);
  return session;
}

export async function getActiveExamSession(examId: string, studentId: string) {
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
  return session;
}

export async function getExamSessionsByExam(examId: string) {
  return db.select().from(examSessions).where(eq(examSessions.examId, examId));
}

// ============================================================================
// Exam Answer Queries
// ============================================================================

export async function getExamAnswers(sessionId: string) {
  return db.select().from(examAnswers).where(eq(examAnswers.sessionId, sessionId));
}

export async function getAnswerForQuestion(sessionId: string, questionId: string) {
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
  return answer;
}

// ============================================================================
// Proctoring Queries
// ============================================================================

export async function getProctoringSession(sessionId: string) {
  const [proctoring] = await db
    .select()
    .from(proctoringSessions)
    .where(eq(proctoringSessions.sessionId, sessionId))
    .limit(1);
  return proctoring;
}

export async function getProctoringPhotos(proctoringSessionId: string) {
  return db
    .select()
    .from(proctoringPhotos)
    .where(eq(proctoringPhotos.proctoringSessionId, proctoringSessionId))
    .orderBy(proctoringPhotos.capturedAt);
}

export async function getProctoringEvents(proctoringSessionId: string) {
  return db
    .select()
    .from(proctoringEvents)
    .where(eq(proctoringEvents.proctoringSessionId, proctoringSessionId))
    .orderBy(proctoringEvents.timestamp);
}

export async function getProctoringFlags(proctoringSessionId: string) {
  return db
    .select()
    .from(proctoringFlags)
    .where(eq(proctoringFlags.proctoringSessionId, proctoringSessionId))
    .orderBy(proctoringFlags.createdAt);
}

export async function getFlaggedProctoringSessions() {
  return db
    .select()
    .from(proctoringSessions)
    .where(eq(proctoringSessions.status, 'flagged'));
}

// ============================================================================
// Audit Log Queries
// ============================================================================

export async function getAuditLogs(limit = 100) {
  return db
    .select()
    .from(auditLogs)
    .orderBy(auditLogs.createdAt)
    .limit(limit);
}

export async function getAuditLogsByUser(userId: string, limit = 100) {
  return db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.performedBy, userId))
    .orderBy(auditLogs.createdAt)
    .limit(limit);
}

export async function getAuditLogsForTargetUser(userId: string, limit = 100) {
  return db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.targetUser, userId))
    .orderBy(auditLogs.createdAt)
    .limit(limit);
}
