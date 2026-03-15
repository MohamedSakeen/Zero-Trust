/**
 * Question Repository - Database Access Layer
 * Requirements: 4.1, 4.3
 * 
 * Provides CRUD operations for questions with version history support
 */

import { eq, and, or, like, inArray, sql } from 'drizzle-orm';
import { db } from '@/db';
import { questions, questionVersionHistory, examQuestions } from '@/db/schema';
import { Question, QuestionFilter } from '@/types/question';
import { validateQuestion } from '../validation/question-validation';

export interface CreateQuestionInput {
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  options?: Array<{ id: string; text: string; isCorrect: boolean }>;
  correctAnswer: string | string[];
  explanation?: string;
  status: 'draft' | 'active' | 'archived';
  createdBy: string;
}

export interface UpdateQuestionInput {
  id: string;
  text?: string;
  type?: 'multiple-choice' | 'true-false' | 'short-answer';
  subject?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  points?: number;
  options?: Array<{ id: string; text: string; isCorrect: boolean }>;
  correctAnswer?: string | string[];
  explanation?: string;
  status?: 'draft' | 'active' | 'archived';
  modifiedBy: string;
}

/**
 * Creates a new question in the database
 * Validates the question before insertion
 */
export async function createQuestion(input: CreateQuestionInput): Promise<Question> {
  // Validate question
  const validationResult = validateQuestion(input as Partial<Question>);
  if (!validationResult.isValid) {
    throw new Error(`Validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`);
  }

  const [newQuestion] = await db
    .insert(questions)
    .values({
      text: input.text,
      type: input.type,
      subject: input.subject,
      topic: input.topic,
      difficulty: input.difficulty,
      points: input.points,
      options: input.options ? JSON.stringify(input.options) : null,
      correctAnswer: JSON.stringify(input.correctAnswer),
      explanation: input.explanation || null,
      status: input.status,
      createdBy: input.createdBy,
      version: 1,
    })
    .returning();

  return mapQuestionRecordToQuestion(newQuestion);
}

/**
 * Updates an existing question and creates a version history entry
 * Requirements: 4.3 - Preserve version history
 */
export async function updateQuestion(input: UpdateQuestionInput): Promise<Question> {
  // Get current question
  const [currentQuestion] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, input.id))
    .limit(1);

  if (!currentQuestion) {
    throw new Error(`Question with ID ${input.id} not found`);
  }

  // Create version history entry before updating
  await db.insert(questionVersionHistory).values({
    questionId: currentQuestion.id,
    version: currentQuestion.version,
    text: currentQuestion.text,
    type: currentQuestion.type,
    subject: currentQuestion.subject,
    topic: currentQuestion.topic,
    difficulty: currentQuestion.difficulty,
    points: currentQuestion.points,
    options: currentQuestion.options,
    correctAnswer: currentQuestion.correctAnswer,
    explanation: currentQuestion.explanation,
    status: currentQuestion.status,
    modifiedBy: input.modifiedBy,
  });

  // Prepare update data
  const updateData: any = {
    updatedAt: new Date(),
    version: currentQuestion.version + 1,
  };

  if (input.text !== undefined) updateData.text = input.text;
  if (input.type !== undefined) updateData.type = input.type;
  if (input.subject !== undefined) updateData.subject = input.subject;
  if (input.topic !== undefined) updateData.topic = input.topic;
  if (input.difficulty !== undefined) updateData.difficulty = input.difficulty;
  if (input.points !== undefined) updateData.points = input.points;
  if (input.options !== undefined) updateData.options = JSON.stringify(input.options);
  if (input.correctAnswer !== undefined) updateData.correctAnswer = JSON.stringify(input.correctAnswer);
  if (input.explanation !== undefined) updateData.explanation = input.explanation;
  if (input.status !== undefined) updateData.status = input.status;

  // Validate merged question
  const mergedQuestion = { ...currentQuestion, ...updateData };
  const validationResult = validateQuestion(mergedQuestion as Partial<Question>);
  if (!validationResult.isValid) {
    throw new Error(`Validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`);
  }

  // Update question
  const [updatedQuestion] = await db
    .update(questions)
    .set(updateData)
    .where(eq(questions.id, input.id))
    .returning();

  return mapQuestionRecordToQuestion(updatedQuestion);
}

/**
 * Deletes a question if it's not used in any active exam
 * Requirements: 4.4 - Prevent deletion if used in active exams
 */
export async function deleteQuestion(id: string): Promise<{ success: boolean; message: string }> {
  // Check if question is used in any exam
  const usedInExams = await db
    .select({ examId: examQuestions.examId })
    .from(examQuestions)
    .where(eq(examQuestions.questionId, id));

  if (usedInExams.length > 0) {
    return {
      success: false,
      message: `Cannot delete question - used in ${usedInExams.length} exam(s)`,
    };
  }

  // Delete question (cascade will handle version history)
  await db.delete(questions).where(eq(questions.id, id));

  return {
    success: true,
    message: 'Question deleted successfully',
  };
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
 * Requirements: 4.6 - Categorize questions by subject, difficulty, topic
 */
export async function getQuestions(filter?: QuestionFilter): Promise<Question[]> {
  let query = db.select().from(questions);

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
      )!
    );
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)!) as any;
  }

  const results = await query;
  return results.map(mapQuestionRecordToQuestion);
}

/**
 * Retrieves version history for a question
 */
export async function getQuestionVersionHistory(questionId: string) {
  const history = await db
    .select()
    .from(questionVersionHistory)
    .where(eq(questionVersionHistory.questionId, questionId))
    .orderBy(sql`${questionVersionHistory.version} DESC`);

  return history.map(record => ({
    id: record.id,
    questionId: record.questionId,
    version: record.version,
    text: record.text,
    type: record.type,
    subject: record.subject,
    topic: record.topic,
    difficulty: record.difficulty,
    points: record.points,
    options: record.options ? JSON.parse(record.options as string) : undefined,
    correctAnswer: JSON.parse(record.correctAnswer as string),
    explanation: record.explanation || undefined,
    status: record.status,
    modifiedBy: record.modifiedBy,
    modifiedAt: record.modifiedAt,
  }));
}

/**
 * Retrieves a specific version of a question
 */
export async function getQuestionVersion(questionId: string, version: number) {
  const [record] = await db
    .select()
    .from(questionVersionHistory)
    .where(
      and(
        eq(questionVersionHistory.questionId, questionId),
        eq(questionVersionHistory.version, version)
      )
    )
    .limit(1);

  if (!record) {
    return null;
  }

  return {
    id: record.id,
    questionId: record.questionId,
    version: record.version,
    text: record.text,
    type: record.type,
    subject: record.subject,
    topic: record.topic,
    difficulty: record.difficulty,
    points: record.points,
    options: record.options ? JSON.parse(record.options as string) : undefined,
    correctAnswer: JSON.parse(record.correctAnswer as string),
    explanation: record.explanation || undefined,
    status: record.status,
    modifiedBy: record.modifiedBy,
    modifiedAt: record.modifiedAt,
  };
}

/**
 * Checks if a question is used in any active exams
 */
export async function isQuestionUsedInActiveExams(questionId: string): Promise<boolean> {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(examQuestions)
    .where(eq(examQuestions.questionId, questionId));

  return (result?.count ?? 0) > 0;
}

/**
 * Maps database record to Question type
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
    options: record.options ? JSON.parse(record.options) : undefined,
    correctAnswer: JSON.parse(record.correctAnswer),
    explanation: record.explanation || undefined,
    status: record.status,
    createdBy: record.createdBy,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    version: record.version,
  };
}
