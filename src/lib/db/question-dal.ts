/**
 * Question Data Access Layer
 * Requirements: 4.1, 4.3
 * 
 * Provides CRUD operations for questions with version history tracking
 */

import { eq, and, or, like, inArray, sql } from 'drizzle-orm';
import { db } from '@/db';
import { questions, questionVersionHistory, examQuestions } from '@/db/schema';
import { Question, QuestionFilter } from '@/types/question';
import { validateQuestion, validateQuestionUpdate } from '../validation/question-validation';

/**
 * Creates a new question in the database
 * Validates question data before insertion
 */
export async function createQuestion(
  questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'version'>
): Promise<Question> {
  // Validate question data
  const validation = validateQuestion(questionData);
  if (!validation.isValid) {
    throw new Error(`Question validation failed: ${validation.errors.join(', ')}`);
  }

  // Insert question
  const [newQuestion] = await db
    .insert(questions)
    .values({
      text: questionData.text,
      type: questionData.type,
      subject: questionData.subject,
      topic: questionData.topic,
      difficulty: questionData.difficulty,
      points: questionData.points,
      options: questionData.options || null,
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation || null,
      status: questionData.status,
      createdBy: questionData.createdBy,
      version: 1,
    })
    .returning();

  return mapQuestionRecordToQuestion(newQuestion);
}

/**
 * Retrieves a question by ID
 */
export async function getQuestionById(id: string): Promise<Question | null> {
  const [question] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id))
    .limit(1);

  return question ? mapQuestionRecordToQuestion(question) : null;
}

/**
 * Retrieves questions with optional filtering
 */
export async function getQuestions(filter?: QuestionFilter): Promise<Question[]> {
  let query = db.select().from(questions);

  // Build where conditions
  const conditions = [];

  if (filter?.subject) {
    conditions.push(eq(questions.subject, filter.subject));
  }

  if (filter?.topic) {
    conditions.push(eq(questions.topic, filter.topic));
  }

  if (filter?.difficulty) {
    conditions.push(eq(questions.difficulty, filter.difficulty as any));
  }

  if (filter?.status) {
    conditions.push(eq(questions.status, filter.status as any));
  }

  if (filter?.searchTerm) {
    conditions.push(
      or(
        like(questions.text, `%${filter.searchTerm}%`),
        like(questions.subject, `%${filter.searchTerm}%`),
        like(questions.topic, `%${filter.searchTerm}%`)
      )
    );
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  const results = await query;
  return results.map(mapQuestionRecordToQuestion);
}

/**
 * Updates a question and creates a version history entry
 * Requirements: 4.3 - Preserve version history
 */
export async function updateQuestion(
  id: string,
  updates: Partial<Omit<Question, 'id' | 'createdAt' | 'createdBy'>>,
  modifiedBy: string
): Promise<Question> {
  // Get existing question
  const existingQuestion = await getQuestionById(id);
  if (!existingQuestion) {
    throw new Error(`Question with ID ${id} not found`);
  }

  // Validate update
  const validation = validateQuestionUpdate(existingQuestion, updates);
  if (!validation.isValid) {
    throw new Error(`Question update validation failed: ${validation.errors.join(', ')}`);
  }

  // Create version history entry before updating
  await db.insert(questionVersionHistory).values({
    questionId: id,
    version: existingQuestion.version,
    text: existingQuestion.text,
    type: existingQuestion.type,
    subject: existingQuestion.subject,
    topic: existingQuestion.topic,
    difficulty: existingQuestion.difficulty,
    points: existingQuestion.points,
    options: existingQuestion.options || null,
    correctAnswer: existingQuestion.correctAnswer,
    explanation: existingQuestion.explanation || null,
    status: existingQuestion.status,
    modifiedBy,
  });

  // Update question with incremented version
  const [updatedQuestion] = await db
    .update(questions)
    .set({
      ...updates,
      version: existingQuestion.version + 1,
      updatedAt: new Date(),
    })
    .where(eq(questions.id, id))
    .returning();

  return mapQuestionRecordToQuestion(updatedQuestion);
}

/**
 * Deletes a question if it's not used in any active exams
 * Requirements: 4.4 - Prevent deletion if used in active exams
 */
export async function deleteQuestion(id: string): Promise<{ success: boolean; message: string }> {
  // Check if question is used in any exams
  const usedInExams = await db
    .select({ examId: examQuestions.examId })
    .from(examQuestions)
    .where(eq(examQuestions.questionId, id));

  if (usedInExams.length > 0) {
    const examIds = usedInExams.map(e => e.examId).join(', ');
    return {
      success: false,
      message: `Cannot delete question - used in exams: ${examIds}`,
    };
  }

  // Delete question (version history will be cascade deleted)
  await db.delete(questions).where(eq(questions.id, id));

  return {
    success: true,
    message: 'Question deleted successfully',
  };
}

/**
 * Archives a question (soft delete alternative)
 */
export async function archiveQuestion(id: string, modifiedBy: string): Promise<Question> {
  return updateQuestion(id, { status: 'archived' }, modifiedBy);
}

/**
 * Retrieves version history for a question
 */
export async function getQuestionVersionHistory(questionId: string) {
  return db
    .select()
    .from(questionVersionHistory)
    .where(eq(questionVersionHistory.questionId, questionId))
    .orderBy(sql`${questionVersionHistory.version} DESC`);
}

/**
 * Retrieves a specific version of a question
 */
export async function getQuestionVersion(questionId: string, version: number) {
  const [versionRecord] = await db
    .select()
    .from(questionVersionHistory)
    .where(
      and(
        eq(questionVersionHistory.questionId, questionId),
        eq(questionVersionHistory.version, version)
      )
    )
    .limit(1);

  return versionRecord;
}

/**
 * Bulk creates questions
 * Returns results with success/failure counts
 */
export async function bulkCreateQuestions(
  questionsData: Array<Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'version'>>
): Promise<{
  successful: number;
  failed: number;
  errors: Array<{ row: number; message: string }>;
  createdQuestions: Question[];
}> {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as Array<{ row: number; message: string }>,
    createdQuestions: [] as Question[],
  };

  for (let i = 0; i < questionsData.length; i++) {
    try {
      const question = await createQuestion(questionsData[i]);
      results.createdQuestions.push(question);
      results.successful++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        row: i + 1,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

/**
 * Gets questions by multiple IDs
 */
export async function getQuestionsByIds(ids: string[]): Promise<Question[]> {
  if (ids.length === 0) return [];

  const results = await db
    .select()
    .from(questions)
    .where(inArray(questions.id, ids));

  return results.map(mapQuestionRecordToQuestion);
}

/**
 * Counts questions matching a filter
 */
export async function countQuestions(filter?: QuestionFilter): Promise<number> {
  const conditions = [];

  if (filter?.subject) {
    conditions.push(eq(questions.subject, filter.subject));
  }

  if (filter?.topic) {
    conditions.push(eq(questions.topic, filter.topic));
  }

  if (filter?.difficulty) {
    conditions.push(eq(questions.difficulty, filter.difficulty as any));
  }

  if (filter?.status) {
    conditions.push(eq(questions.status, filter.status as any));
  }

  if (filter?.searchTerm) {
    conditions.push(
      or(
        like(questions.text, `%${filter.searchTerm}%`),
        like(questions.subject, `%${filter.searchTerm}%`),
        like(questions.topic, `%${filter.searchTerm}%`)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(questions)
    .where(whereClause);

  return result?.count || 0;
}

/**
 * Helper function to map database record to Question type
 */
function mapQuestionRecordToQuestion(record: any): Question {
  return {
    id: record.id,
    text: record.text,
    type: record.type,
    subject: record.subject,
    topic: record.topic,
    difficulty: record.difficulty,
    points: record.points,
    options: record.options,
    correctAnswer: record.correctAnswer,
    explanation: record.explanation,
    status: record.status,
    createdBy: record.createdBy,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
    version: record.version,
  };
}
