/**
 * Exam and Exam Management Type Definitions
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.8
 */

export interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: number; // minutes
  totalPoints: number;
  passingScore: number;
  startTime: Date;
  endTime: Date;
  questions: ExamQuestion[];
  assignedTo: string[]; // student IDs
  settings: ExamSettings;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'archived';
}

export interface ExamQuestion {
  questionId: string;
  order: number;
  points: number;
}

export interface ExamSettings {
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  showResultsImmediately: boolean;
  allowReview: boolean;
  enableProctoring: boolean;
  requireCamera: boolean;
  preventTabSwitch: boolean;
  autoSubmit: boolean;
}

export interface ExamAssignment {
  examId: string;
  studentIds: string[];
  groupIds?: string[];
  assignedAt: Date;
  assignedBy: string;
}

// Database record types
export interface ExamRecord {
  id: string; // UUID
  title: string;
  description: string;
  subject: string;
  duration: number; // minutes
  total_points: number;
  passing_score: number;
  start_time: Date;
  end_time: Date;
  settings: any; // jsonb - ExamSettings
  created_by: string; // FK to users
  created_at: Date;
  updated_at: Date;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'archived';
}

export interface ExamQuestionRecord {
  id: string; // UUID
  exam_id: string; // FK to exams
  question_id: string; // FK to questions
  order: number;
  points: number;
}

export interface ExamAssignmentRecord {
  id: string; // UUID
  exam_id: string; // FK to exams
  student_id: string; // FK to users
  assigned_at: Date;
  assigned_by: string; // FK to users
}
