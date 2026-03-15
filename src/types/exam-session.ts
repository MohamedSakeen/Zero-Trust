/**
 * Exam Session and Exam Taking Type Definitions
 * Requirements: 2.1, 2.3, 2.5, 2.6, 2.8, 13.1, 13.2, 14.1, 14.2
 */

export interface ExamSession {
  id: string;
  examId: string;
  studentId: string;
  startedAt: Date;
  submittedAt?: Date;
  timeRemaining: number; // seconds
  currentQuestionIndex: number;
  answers: ExamAnswer[];
  markedForReview: number[];
  status: 'in-progress' | 'submitted' | 'auto-submitted' | 'abandoned';
  proctoring: ProctoringData;
}

export interface ExamAnswer {
  questionId: string;
  answer: string | string[];
  answeredAt: Date;
  timeSpent: number; // seconds
}

export interface ProctoringData {
  photos: ProctoringPhoto[];
  events: ProctoringEvent[];
}

export interface ProctoringPhoto {
  timestamp: Date;
  imageUrl: string;
  faceCount: number;
  verified: boolean;
}

export interface ProctoringEvent {
  type: 'tab-switch' | 'window-blur' | 'copy-attempt' | 'right-click' | 'multiple-faces' | 'no-face';
  timestamp: Date;
  details: string;
}

export interface QuestionState {
  answered: boolean;
  markedForReview: boolean;
  current: boolean;
}

// Database record types
export interface ExamSessionRecord {
  id: string; // UUID
  exam_id: string; // FK to exams
  student_id: string; // FK to users
  started_at: Date;
  submitted_at: Date | null;
  time_remaining: number; // seconds
  current_question_index: number;
  status: 'in-progress' | 'submitted' | 'auto-submitted' | 'abandoned';
  created_at: Date;
  updated_at: Date;
}

export interface ExamAnswerRecord {
  id: string; // UUID
  session_id: string; // FK to exam_sessions
  question_id: string; // FK to questions
  answer: any; // jsonb - string | string[]
  is_correct: boolean | null;
  points_earned: number | null;
  answered_at: Date;
  time_spent: number; // seconds
}
