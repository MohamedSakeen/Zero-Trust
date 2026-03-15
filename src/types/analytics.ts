/**
 * Result Analytics and Reporting Type Definitions
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7
 */

export interface LiveExamStatus {
  examId: string;
  examTitle: string;
  totalStudents: number;
  studentsInProgress: number;
  studentsCompleted: number;
  studentsNotStarted: number;
  averageScore: number;
  averageTimeSpent: number;
  lastUpdated: Date;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  status: 'not-started' | 'in-progress' | 'completed';
  questionsAnswered: number;
  totalQuestions: number;
  progressPercentage: number;
  currentScore?: number;
  timeElapsed: number;
  lastActivity: Date;
}

export interface LiveResultsUpdate {
  type: 'student-started' | 'answer-submitted' | 'exam-completed' | 'score-updated';
  studentId: string;
  data: Partial<StudentProgress>;
  timestamp: Date;
}

export interface ExamAnalytics {
  examId: string;
  examTitle: string;
  totalStudents: number;
  completedStudents: number;
  averageScore: number;
  medianScore: number;
  standardDeviation: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  averageTimeSpent: number;
  scoreDistribution: ScoreDistribution[];
  questionAnalysis: QuestionAnalysis[];
  generatedAt: Date;
}

export interface ScoreDistribution {
  range: string; // e.g., "0-10", "11-20"
  count: number;
  percentage: number;
}

export interface QuestionAnalysis {
  questionId: string;
  questionText: string;
  totalAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skipped: number;
  correctPercentage: number;
  averageTimeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ExportOptions {
  format: 'csv' | 'pdf';
  includeDetails: boolean;
  includeAnalytics: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
