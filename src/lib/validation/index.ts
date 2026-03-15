/**
 * Validation Functions Exports
 * Central export point for all validation functions
 */

// Question validation
export {
  validateQuestion,
  validateMultipleChoiceOptions,
  validateTrueFalseAnswer,
  validateBulkQuestionData,
  validateQuestionUpdate,
  type ValidationResult,
} from './question-validation';

// Exam validation
export {
  validateExamDates,
  validateExamDuration,
  validateQuestionSelection,
  validateExamSettings,
  validateExam,
  validateExamAvailability,
} from './exam-validation';
