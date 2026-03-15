/**
 * Exam Validation Functions
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import { Exam, ExamSettings, ExamQuestion } from '@/types/exam';

/**
 * Validates exam date range
 * Requirement 5.4: End time must be after start time
 */
export function validateExamDates(startTime: Date, endTime: Date): { valid: boolean; error?: string } {
  if (!(startTime instanceof Date) || isNaN(startTime.getTime())) {
    return { valid: false, error: 'Invalid start time' };
  }

  if (!(endTime instanceof Date) || isNaN(endTime.getTime())) {
    return { valid: false, error: 'Invalid end time' };
  }

  if (endTime <= startTime) {
    return { valid: false, error: 'End time must be after start time' };
  }

  return { valid: true };
}

/**
 * Validates exam duration
 * Requirement 5.2: Duration must be positive
 */
export function validateExamDuration(duration: number): { valid: boolean; error?: string } {
  if (typeof duration !== 'number' || isNaN(duration)) {
    return { valid: false, error: 'Duration must be a number' };
  }

  if (duration <= 0) {
    return { valid: false, error: 'Duration must be greater than 0' };
  }

  if (duration > 1440) { // 24 hours
    return { valid: false, error: 'Duration cannot exceed 24 hours (1440 minutes)' };
  }

  return { valid: true };
}

/**
 * Validates question selection for an exam
 * Requirement 5.1: Questions must be selected from question bank
 */
export function validateQuestionSelection(questions: ExamQuestion[]): { valid: boolean; error?: string } {
  if (!Array.isArray(questions)) {
    return { valid: false, error: 'Questions must be an array' };
  }

  if (questions.length === 0) {
    return { valid: false, error: 'Exam must have at least one question' };
  }

  // Check for duplicate question IDs
  const questionIds = questions.map(q => q.questionId);
  const uniqueIds = new Set(questionIds);
  if (questionIds.length !== uniqueIds.size) {
    return { valid: false, error: 'Duplicate questions are not allowed' };
  }

  // Validate each question has required fields
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    
    if (!question.questionId || typeof question.questionId !== 'string') {
      return { valid: false, error: `Question at index ${i} has invalid questionId` };
    }

    if (typeof question.order !== 'number' || question.order < 0) {
      return { valid: false, error: `Question at index ${i} has invalid order` };
    }

    if (typeof question.points !== 'number' || question.points < 0) {
      return { valid: false, error: `Question at index ${i} has invalid points` };
    }
  }

  return { valid: true };
}

/**
 * Validates exam settings
 * Requirement 5.3: Exam settings must be valid
 */
export function validateExamSettings(settings: ExamSettings): { valid: boolean; error?: string } {
  if (!settings || typeof settings !== 'object') {
    return { valid: false, error: 'Settings must be an object' };
  }

  const requiredBooleanFields: (keyof ExamSettings)[] = [
    'randomizeQuestions',
    'randomizeOptions',
    'showResultsImmediately',
    'allowReview',
    'enableProctoring',
    'requireCamera',
    'preventTabSwitch',
    'autoSubmit'
  ];

  for (const field of requiredBooleanFields) {
    if (typeof settings[field] !== 'boolean') {
      return { valid: false, error: `Setting '${field}' must be a boolean` };
    }
  }

  // If proctoring is enabled, camera must be required
  if (settings.enableProctoring && !settings.requireCamera) {
    return { valid: false, error: 'Camera must be required when proctoring is enabled' };
  }

  return { valid: true };
}

/**
 * Validates complete exam data
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */
export function validateExam(exam: Partial<Exam>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate required fields
  if (!exam.title || typeof exam.title !== 'string' || exam.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!exam.description || typeof exam.description !== 'string') {
    errors.push('Description is required');
  }

  if (!exam.subject || typeof exam.subject !== 'string' || exam.subject.trim().length === 0) {
    errors.push('Subject is required');
  }

  // Validate duration
  if (exam.duration !== undefined) {
    const durationValidation = validateExamDuration(exam.duration);
    if (!durationValidation.valid) {
      errors.push(durationValidation.error!);
    }
  } else {
    errors.push('Duration is required');
  }

  // Validate dates
  if (exam.startTime && exam.endTime) {
    const dateValidation = validateExamDates(exam.startTime, exam.endTime);
    if (!dateValidation.valid) {
      errors.push(dateValidation.error!);
    }
  } else {
    if (!exam.startTime) errors.push('Start time is required');
    if (!exam.endTime) errors.push('End time is required');
  }

  // Validate points
  if (exam.totalPoints !== undefined) {
    if (typeof exam.totalPoints !== 'number' || exam.totalPoints <= 0) {
      errors.push('Total points must be greater than 0');
    }
  } else {
    errors.push('Total points is required');
  }

  if (exam.passingScore !== undefined) {
    if (typeof exam.passingScore !== 'number' || exam.passingScore < 0) {
      errors.push('Passing score must be non-negative');
    }
    if (exam.totalPoints && exam.passingScore > exam.totalPoints) {
      errors.push('Passing score cannot exceed total points');
    }
  } else {
    errors.push('Passing score is required');
  }

  // Validate questions
  if (exam.questions) {
    const questionValidation = validateQuestionSelection(exam.questions);
    if (!questionValidation.valid) {
      errors.push(questionValidation.error!);
    }
  } else {
    errors.push('Questions are required');
  }

  // Validate settings
  if (exam.settings) {
    const settingsValidation = validateExamSettings(exam.settings);
    if (!settingsValidation.valid) {
      errors.push(settingsValidation.error!);
    }
  } else {
    errors.push('Settings are required');
  }

  // Validate assigned students
  if (exam.assignedTo !== undefined) {
    if (!Array.isArray(exam.assignedTo)) {
      errors.push('AssignedTo must be an array');
    } else if (exam.assignedTo.length === 0) {
      errors.push('Exam must be assigned to at least one student');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates exam availability based on current time
 * Requirements: 1.3, 1.4, 1.5
 */
export function validateExamAvailability(exam: Exam, currentTime: Date = new Date()): {
  available: boolean;
  reason?: string;
} {
  const now = currentTime.getTime();
  const start = exam.startTime.getTime();
  const end = exam.endTime.getTime();

  if (now < start) {
    return {
      available: false,
      reason: 'Exam has not started yet'
    };
  }

  if (now > end) {
    return {
      available: false,
      reason: 'Exam has expired'
    };
  }

  if (exam.status !== 'active' && exam.status !== 'scheduled') {
    return {
      available: false,
      reason: `Exam is ${exam.status}`
    };
  }

  return { available: true };
}
