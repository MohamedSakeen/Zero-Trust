/**
 * Question and Question Bank Type Definitions
 * Requirements: 4.1, 4.2, 4.3, 4.6, 4.7
 */

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  options?: QuestionOption[];
  correctAnswer: string | string[];
  explanation?: string;
  status: 'draft' | 'active' | 'archived';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionFilter {
  subject?: string;
  topic?: string;
  difficulty?: string;
  status?: string;
  searchTerm?: string;
}

export interface BulkUploadResult {
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
}

// Database record type
export interface QuestionRecord {
  id: string; // UUID
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  options: any; // jsonb - QuestionOption[]
  correct_answer: any; // jsonb - string | string[]
  explanation: string | null;
  status: 'draft' | 'active' | 'archived';
  created_by: string; // FK to users
  created_at: Date;
  updated_at: Date;
  version: number;
}
