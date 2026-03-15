/**
 * Central export file for all type definitions
 * University Exam Platform
 */

// User and Authentication types
export type {
  User,
  AuthState,
  RegisterData,
  AuthToken,
  UserManagement,
  UserFilter,
  AuditLogEntry,
  PasswordReset,
  UserRecord,
} from './user';

// Question and Question Bank types
export type {
  Question,
  QuestionOption,
  QuestionFilter,
  BulkUploadResult,
  QuestionRecord,
} from './question';

// Exam and Exam Management types
export type {
  Exam,
  ExamQuestion,
  ExamSettings,
  ExamAssignment,
  ExamRecord,
  ExamQuestionRecord,
  ExamAssignmentRecord,
} from './exam';

// Exam Session and Exam Taking types
export type {
  ExamSession,
  ExamAnswer,
  ProctoringData,
  QuestionState,
  ExamSessionRecord,
  ExamAnswerRecord,
} from './exam-session';

// Proctoring types
export type {
  ProctoringSession,
  ProctoringPhoto,
  ProctoringEvent,
  ProctoringFlag,
  CameraPermission,
  ProctoringSessionRecord,
  ProctoringPhotoRecord,
  ProctoringEventRecord,
  ProctoringFlagRecord,
} from './proctoring';

// Analytics and Results types
export type {
  LiveExamStatus,
  StudentProgress,
  LiveResultsUpdate,
  ExamAnalytics,
  ScoreDistribution,
  QuestionAnalysis,
  ExportOptions,
} from './analytics';

// WebSocket and Real-Time Communication types
export type {
  WebSocketMessage,
  WebSocketConnection,
  WebSocketConfig,
  SubscriptionTopic,
} from './websocket';
