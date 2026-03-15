/**
 * Exam Database Access Layer
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import { db } from '@/db';
import { exams, examQuestions, examAssignments } from '@/db/schema';
import { eq, and, gte, lte, inArray, desc } from 'drizzle-orm';
import { Exam, ExamQuestion, ExamSettings, ExamAssignment } from '@/types/exam';
import { validateExam, validateExamDates } from '../validation/exam-validation';

/**
 * Creates a new exam in the database
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.6
 */
export async function createExam(examData: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exam> {
  // Validate exam data
  const validation = validateExam(examData);
  if (!validation.valid) {
    throw new Error(`Exam validation failed: ${validation.errors.join(', ')}`);
  }

  // Start transaction
  return await db.transaction(async (tx) => {
    // Insert exam
    const [exam] = await tx.insert(exams).values({
      title: examData.title,
      description: examData.description,
      subject: examData.subject,
      duration: examData.duration,
      totalPoints: examData.totalPoints,
      passingScore: examData.passingScore,
      startTime: examData.startTime,
      endTime: examData.endTime,
      settings: examData.settings,
      createdBy: examData.createdBy,
      status: examData.status,
    }).returning();

    // Insert exam questions
    if (examData.questions && examData.questions.length > 0) {
      await tx.insert(examQuestions).values(
        examData.questions.map(q => ({
          examId: exam.id,
          questionId: q.questionId,
          order: q.order,
          points: q.points,
        }))
      );
    }

    // Insert exam assignments
    if (examData.assignedTo && examData.assignedTo.length > 0) {
      await tx.insert(examAssignments).values(
        examData.assignedTo.map(studentId => ({
          examId: exam.id,
          studentId: studentId,
          assignedBy: examData.createdBy,
        }))
      );
    }

    // Fetch complete exam with questions and assignments
    return await getExamById(exam.id, tx);
  });
}

/**
 * Retrieves an exam by ID
 * Requirement 5.1
 */
export async function getExamById(examId: string, transaction?: any): Promise<Exam> {
  const txn = transaction || db;

  const [exam] = await txn.select().from(exams).where(eq(exams.id, examId));

  if (!exam) {
    throw new Error(`Exam not found: ${examId}`);
  }

  // Fetch exam questions
  const questions = await txn
    .select()
    .from(examQuestions)
    .where(eq(examQuestions.examId, examId))
    .orderBy(examQuestions.order);

  // Fetch exam assignments
  const assignments = await txn
    .select()
    .from(examAssignments)
    .where(eq(examAssignments.examId, examId));

  return {
    id: exam.id,
    title: exam.title,
    description: exam.description,
    subject: exam.subject,
    duration: exam.duration,
    totalPoints: exam.totalPoints,
    passingScore: exam.passingScore,
    startTime: exam.startTime,
    endTime: exam.endTime,
    questions: questions.map(q => ({
      questionId: q.questionId,
      order: q.order,
      points: q.points,
    })),
    assignedTo: assignments.map(a => a.studentId),
    settings: exam.settings as ExamSettings,
    createdBy: exam.createdBy,
    createdAt: exam.createdAt,
    updatedAt: exam.updatedAt,
    status: exam.status,
  };
}

/**
 * Updates an existing exam
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */
export async function updateExam(
  examId: string,
  updates: Partial<Omit<Exam, 'id' | 'createdAt' | 'createdBy'>>
): Promise<Exam> {
  // Validate date range if both dates are provided
  if (updates.startTime && updates.endTime) {
    const dateValidation = validateExamDates(updates.startTime, updates.endTime);
    if (!dateValidation.valid) {
      throw new Error(dateValidation.error);
    }
  }

  return await db.transaction(async (tx) => {
    // Update exam basic info
    const examUpdates: any = {};
    if (updates.title !== undefined) examUpdates.title = updates.title;
    if (updates.description !== undefined) examUpdates.description = updates.description;
    if (updates.subject !== undefined) examUpdates.subject = updates.subject;
    if (updates.duration !== undefined) examUpdates.duration = updates.duration;
    if (updates.totalPoints !== undefined) examUpdates.totalPoints = updates.totalPoints;
    if (updates.passingScore !== undefined) examUpdates.passingScore = updates.passingScore;
    if (updates.startTime !== undefined) examUpdates.startTime = updates.startTime;
    if (updates.endTime !== undefined) examUpdates.endTime = updates.endTime;
    if (updates.settings !== undefined) examUpdates.settings = updates.settings;
    if (updates.status !== undefined) examUpdates.status = updates.status;

    if (Object.keys(examUpdates).length > 0) {
      examUpdates.updatedAt = new Date();
      await tx.update(exams).set(examUpdates).where(eq(exams.id, examId));
    }

    // Update questions if provided
    if (updates.questions !== undefined) {
      // Delete existing questions
      await tx.delete(examQuestions).where(eq(examQuestions.examId, examId));

      // Insert new questions
      if (updates.questions.length > 0) {
        await tx.insert(examQuestions).values(
          updates.questions.map(q => ({
            examId: examId,
            questionId: q.questionId,
            order: q.order,
            points: q.points,
          }))
        );
      }
    }

    // Update assignments if provided
    if (updates.assignedTo !== undefined) {
      // Get current exam to find createdBy
      const [currentExam] = await tx.select().from(exams).where(eq(exams.id, examId));
      
      // Delete existing assignments
      await tx.delete(examAssignments).where(eq(examAssignments.examId, examId));

      // Insert new assignments
      if (updates.assignedTo.length > 0) {
        await tx.insert(examAssignments).values(
          updates.assignedTo.map(studentId => ({
            examId: examId,
            studentId: studentId,
            assignedBy: currentExam.createdBy,
          }))
        );
      }
    }

    // Fetch and return updated exam
    return await getExamById(examId, tx);
  });
}

/**
 * Deletes an exam
 * Requirement 5.1
 */
export async function deleteExam(examId: string): Promise<void> {
  await db.transaction(async (tx) => {
    // Delete exam (cascade will handle related records)
    const result = await tx.delete(exams).where(eq(exams.id, examId));
    
    if (result.rowCount === 0) {
      throw new Error(`Exam not found: ${examId}`);
    }
  });
}

/**
 * Retrieves exams created by a specific faculty member
 * Requirement 5.1
 */
export async function getExamsByCreator(creatorId: string): Promise<Exam[]> {
  const examList = await db
    .select()
    .from(exams)
    .where(eq(exams.createdBy, creatorId))
    .orderBy(desc(exams.createdAt));

  // Fetch complete exam data for each exam
  return await Promise.all(examList.map(exam => getExamById(exam.id)));
}

/**
 * Retrieves exams assigned to a specific student
 * Requirement 1.2
 */
export async function getExamsForStudent(studentId: string): Promise<Exam[]> {
  const assignments = await db
    .select()
    .from(examAssignments)
    .where(eq(examAssignments.studentId, studentId));

  const examIds = assignments.map(a => a.examId);

  if (examIds.length === 0) {
    return [];
  }

  const examList = await db
    .select()
    .from(exams)
    .where(inArray(exams.id, examIds))
    .orderBy(desc(exams.startTime));

  // Fetch complete exam data for each exam
  return await Promise.all(examList.map(exam => getExamById(exam.id)));
}

/**
 * Retrieves active exams within a time range
 * Requirements: 1.3, 1.4, 1.5
 */
export async function getActiveExams(currentTime: Date = new Date()): Promise<Exam[]> {
  const examList = await db
    .select()
    .from(exams)
    .where(
      and(
        lte(exams.startTime, currentTime),
        gte(exams.endTime, currentTime),
        eq(exams.status, 'active')
      )
    )
    .orderBy(exams.startTime);

  // Fetch complete exam data for each exam
  return await Promise.all(examList.map(exam => getExamById(exam.id)));
}

/**
 * Checks if a student is assigned to an exam
 * Requirement 1.6
 */
export async function isStudentAssignedToExam(examId: string, studentId: string): Promise<boolean> {
  const [assignment] = await db
    .select()
    .from(examAssignments)
    .where(
      and(
        eq(examAssignments.examId, examId),
        eq(examAssignments.studentId, studentId)
      )
    );

  return !!assignment;
}

/**
 * Assigns students to an exam
 * Requirement 5.5
 */
export async function assignStudentsToExam(assignment: ExamAssignment): Promise<void> {
  await db.transaction(async (tx) => {
    // Check if exam exists
    const [exam] = await tx.select().from(exams).where(eq(exams.id, assignment.examId));
    if (!exam) {
      throw new Error(`Exam not found: ${assignment.examId}`);
    }

    // Insert assignments
    await tx.insert(examAssignments).values(
      assignment.studentIds.map(studentId => ({
        examId: assignment.examId,
        studentId: studentId,
        assignedBy: assignment.assignedBy,
      }))
    );
  });
}

/**
 * Removes student assignments from an exam
 * Requirement 5.5
 */
export async function unassignStudentsFromExam(examId: string, studentIds: string[]): Promise<void> {
  await db
    .delete(examAssignments)
    .where(
      and(
        eq(examAssignments.examId, examId),
        inArray(examAssignments.studentId, studentIds)
      )
    );
}

/**
 * Updates exam status
 * Requirement 5.1
 */
export async function updateExamStatus(
  examId: string,
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'archived'
): Promise<void> {
  await db
    .update(exams)
    .set({ status, updatedAt: new Date() })
    .where(eq(exams.id, examId));
}

/**
 * Retrieves all exams with optional filtering
 * Requirement 5.1
 */
export async function getAllExams(filters?: {
  status?: string;
  subject?: string;
  createdBy?: string;
}): Promise<Exam[]> {
  let query = db.select().from(exams);

  const conditions = [];
  if (filters?.status) {
    conditions.push(eq(exams.status, filters.status as any));
  }
  if (filters?.subject) {
    conditions.push(eq(exams.subject, filters.subject));
  }
  if (filters?.createdBy) {
    conditions.push(eq(exams.createdBy, filters.createdBy));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  const examList = await query.orderBy(desc(exams.createdAt));

  // Fetch complete exam data for each exam
  return await Promise.all(examList.map(exam => getExamById(exam.id)));
}
