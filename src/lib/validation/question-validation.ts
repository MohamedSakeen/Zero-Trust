/**
 * Question Validation Functions
 * Requirements: 4.1, 4.3
 * 
 * Validates question data before database operations
 */

import { Question, QuestionOption } from '@/types/question';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a question object for required fields and data integrity
 */
export function validateQuestion(question: Partial<Question>): ValidationResult {
  const errors: string[] = [];

  // Required field validation
  if (!question.text || question.text.trim().length === 0) {
    errors.push('Question text is required');
  }

  if (!question.type) {
    errors.push('Question type is required');
  } else if (!['multiple-choice', 'true-false', 'short-answer'].includes(question.type)) {
    errors.push('Invalid question type. Must be multiple-choice, true-false, or short-answer');
  }

  if (!question.subject || question.subject.trim().length === 0) {
    errors.push('Subject is required');
  }

  if (!question.topic || question.topic.trim().length === 0) {
    errors.push('Topic is required');
  }

  if (!question.difficulty) {
    errors.push('Difficulty level is required');
  } else if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
    errors.push('Invalid difficulty level. Must be easy, medium, or hard');
  }

  if (question.points === undefined || question.points === null) {
    errors.push('Points value is required');
  } else if (question.points < 0) {
    errors.push('Points must be a non-negative number');
  }

  if (!question.correctAnswer) {
    errors.push('Correct answer is required');
  }

  if (!question.status) {
    errors.push('Status is required');
  } else if (!['draft', 'active', 'archived'].includes(question.status)) {
    errors.push('Invalid status. Must be draft, active, or archived');
  }

  // Type-specific validation
  if (question.type === 'multiple-choice') {
    const optionErrors = validateMultipleChoiceOptions(question.options);
    errors.push(...optionErrors);
  }

  if (question.type === 'true-false') {
    const tfErrors = validateTrueFalseAnswer(question.correctAnswer);
    errors.push(...tfErrors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates multiple choice question options
 */
export function validateMultipleChoiceOptions(options?: QuestionOption[]): string[] {
  const errors: string[] = [];

  if (!options || options.length === 0) {
    errors.push('Multiple choice questions must have at least one option');
    return errors;
  }

  if (options.length < 2) {
    errors.push('Multiple choice questions must have at least 2 options');
  }

  // Check for empty option text
  const emptyOptions = options.filter(opt => !opt.text || opt.text.trim().length === 0);
  if (emptyOptions.length > 0) {
    errors.push('All options must have text');
  }

  // Check for at least one correct answer
  const correctOptions = options.filter(opt => opt.isCorrect);
  if (correctOptions.length === 0) {
    errors.push('At least one option must be marked as correct');
  }

  // Check for duplicate option IDs
  const optionIds = options.map(opt => opt.id);
  const uniqueIds = new Set(optionIds);
  if (optionIds.length !== uniqueIds.size) {
    errors.push('Option IDs must be unique');
  }

  return errors;
}

/**
 * Validates true/false question answer
 */
export function validateTrueFalseAnswer(correctAnswer: any): string[] {
  const errors: string[] = [];

  if (typeof correctAnswer === 'string') {
    const normalized = correctAnswer.toLowerCase();
    if (normalized !== 'true' && normalized !== 'false') {
      errors.push('True/false answer must be "true" or "false"');
    }
  } else if (typeof correctAnswer === 'boolean') {
    // Boolean values are valid
  } else {
    errors.push('True/false answer must be a boolean or string');
  }

  return errors;
}

/**
 * Validates question data for bulk upload
 */
export function validateBulkQuestionData(data: any, rowNumber: number): ValidationResult {
  const errors: string[] = [];

  // Check if data is an object
  if (!data || typeof data !== 'object') {
    errors.push(`Row ${rowNumber}: Invalid data format`);
    return { isValid: false, errors };
  }

  // Validate using standard validation
  const validation = validateQuestion(data);
  
  // Prefix errors with row number
  const prefixedErrors = validation.errors.map(err => `Row ${rowNumber}: ${err}`);

  return {
    isValid: validation.isValid,
    errors: prefixedErrors,
  };
}

/**
 * Validates question update data
 * Ensures version number is incremented
 */
export function validateQuestionUpdate(
  existingQuestion: Question,
  updates: Partial<Question>
): ValidationResult {
  const errors: string[] = [];

  // Merge existing question with updates for full validation
  const updatedQuestion = { ...existingQuestion, ...updates };
  
  const validation = validateQuestion(updatedQuestion);
  errors.push(...validation.errors);

  // Ensure version is incremented
  if (updates.version !== undefined && updates.version <= existingQuestion.version) {
    errors.push('Version number must be incremented');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
