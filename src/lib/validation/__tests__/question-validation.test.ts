/**
 * Unit tests for question validation functions
 * Requirements: 4.1, 4.3
 */

import { describe, it, expect } from 'vitest';
import {
  validateRequiredFields,
  validateQuestionOptions,
  validateQuestion,
  validateQuestionFilter,
} from '../question-validation';
import { Question, QuestionOption } from '@/types/question';

describe('Question Validation', () => {
  describe('validateRequiredFields', () => {
    it('should pass validation for valid question data', () => {
      const question: Partial<Question> = {
        text: 'What is 2 + 2?',
        type: 'multiple-choice',
        subject: 'Mathematics',
        topic: 'Arithmetic',
        difficulty: 'easy',
        points: 5,
        correctAnswer: 'opt1',
        status: 'draft',
      };

      const result = validateRequiredFields(question);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when text is missing', () => {
      const question: Partial<Question> = {
        type: 'multiple-choice',
        subject: 'Mathematics',
        topic: 'Arithmetic',
        difficulty: 'easy',
        points: 5,
        correctAnswer: 'opt1',
        status: 'draft',
      };

      const result = validateRequiredFields(question);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Question text is required');
    });

    it('should fail when type is invalid', () => {
      const question: Partial<Question> = {
        text: 'What is 2 + 2?',
        type: 'invalid-type' as any,
        subject: 'Mathematics',
        topic: 'Arithmetic',
        difficulty: 'easy',
        points: 5,
        correctAnswer: 'opt1',
        status: 'draft',
      };

      const result = validateRequiredFields(question);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Question type must be one of: multiple-choice, true-false, short-answer'
      );
    });

    it('should fail when points is negative', () => {
      const question: Partial<Question> = {
        text: 'What is 2 + 2?',
        type: 'multiple-choice',
        subject: 'Mathematics',
        topic: 'Arithmetic',
        difficulty: 'easy',
        points: -5,
        correctAnswer: 'opt1',
        status: 'draft',
      };

      const result = validateRequiredFields(question);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Points must be a non-negative number');
    });

    it('should fail when multiple required fields are missing', () => {
      const question: Partial<Question> = {
        text: 'What is 2 + 2?',
      };

      const result = validateRequiredFields(question);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateQuestionOptions', () => {
    it('should pass validation for valid multiple-choice options', () => {
      const options: QuestionOption[] = [
        { id: 'opt1', text: '3', isCorrect: false },
        { id: 'opt2', text: '4', isCorrect: true },
        { id: 'opt3', text: '5', isCorrect: false },
      ];

      const result = validateQuestionOptions('multiple-choice', options, 'opt2');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when multiple-choice has no options', () => {
      const result = validateQuestionOptions('multiple-choice', [], 'opt1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Multiple-choice questions must have at least one option');
    });

    it('should fail when no option is marked as correct', () => {
      const options: QuestionOption[] = [
        { id: 'opt1', text: '3', isCorrect: false },
        { id: 'opt2', text: '4', isCorrect: false },
      ];

      const result = validateQuestionOptions('multiple-choice', options, 'opt1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('At least one option must be marked as correct');
    });

    it('should fail when option is missing required fields', () => {
      const options: QuestionOption[] = [
        { id: '', text: '3', isCorrect: false },
        { id: 'opt2', text: '', isCorrect: true },
      ];

      const result = validateQuestionOptions('multiple-choice', options, 'opt2');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should pass validation for valid true-false options', () => {
      const options: QuestionOption[] = [
        { id: 'opt1', text: 'True', isCorrect: true },
        { id: 'opt2', text: 'False', isCorrect: false },
      ];

      const result = validateQuestionOptions('true-false', options, 'opt1');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when true-false does not have exactly 2 options', () => {
      const options: QuestionOption[] = [
        { id: 'opt1', text: 'True', isCorrect: true },
      ];

      const result = validateQuestionOptions('true-false', options, 'opt1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('True-false questions must have exactly 2 options');
    });

    it('should fail when true-false options are not "True" and "False"', () => {
      const options: QuestionOption[] = [
        { id: 'opt1', text: 'Yes', isCorrect: true },
        { id: 'opt2', text: 'No', isCorrect: false },
      ];

      const result = validateQuestionOptions('true-false', options, 'opt1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('True-false questions must have "True" and "False" options');
    });

    it('should pass validation for short-answer with no options', () => {
      const result = validateQuestionOptions('short-answer', undefined, 'correct answer');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when short-answer has options', () => {
      const options: QuestionOption[] = [
        { id: 'opt1', text: 'Answer', isCorrect: true },
      ];

      const result = validateQuestionOptions('short-answer', options, 'correct answer');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Short-answer questions should not have options');
    });

    it('should fail when correctAnswer does not match correct option IDs', () => {
      const options: QuestionOption[] = [
        { id: 'opt1', text: '3', isCorrect: false },
        { id: 'opt2', text: '4', isCorrect: true },
      ];

      const result = validateQuestionOptions('multiple-choice', options, 'opt3');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Correct answer must match the IDs of options marked as correct');
    });
  });

  describe('validateQuestion', () => {
    it('should pass validation for complete valid question', () => {
      const question: Partial<Question> = {
        text: 'What is 2 + 2?',
        type: 'multiple-choice',
        subject: 'Mathematics',
        topic: 'Arithmetic',
        difficulty: 'easy',
        points: 5,
        options: [
          { id: 'opt1', text: '3', isCorrect: false },
          { id: 'opt2', text: '4', isCorrect: true },
          { id: 'opt3', text: '5', isCorrect: false },
        ],
        correctAnswer: 'opt2',
        status: 'draft',
      };

      const result = validateQuestion(question);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when both required fields and options are invalid', () => {
      const question: Partial<Question> = {
        text: '',
        type: 'multiple-choice',
        subject: 'Mathematics',
        topic: 'Arithmetic',
        difficulty: 'easy',
        points: 5,
        options: [],
        correctAnswer: 'opt1',
        status: 'draft',
      };

      const result = validateQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateQuestionFilter', () => {
    it('should pass validation for valid filter', () => {
      const filter = {
        subject: 'Mathematics',
        difficulty: 'easy',
        status: 'active',
      };

      const result = validateQuestionFilter(filter);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when filter has invalid keys', () => {
      const filter = {
        invalidKey: 'value',
      };

      const result = validateQuestionFilter(filter);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid filter key: invalidKey');
    });

    it('should fail when difficulty value is invalid', () => {
      const filter = {
        difficulty: 'super-hard',
      };

      const result = validateQuestionFilter(filter);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Difficulty filter must be one of: easy, medium, hard');
    });

    it('should fail when status value is invalid', () => {
      const filter = {
        status: 'pending',
      };

      const result = validateQuestionFilter(filter);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Status filter must be one of: draft, active, archived');
    });

    it('should pass validation for empty filter', () => {
      const filter = {};

      const result = validateQuestionFilter(filter);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
