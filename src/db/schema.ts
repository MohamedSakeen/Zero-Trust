import { pgTable, uuid, varchar, text, timestamp, integer, jsonb, boolean, pgEnum, index } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['student', 'faculty', 'admin']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'suspended']);
export const questionTypeEnum = pgEnum('question_type', ['multiple-choice', 'true-false', 'short-answer']);
export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);
export const questionStatusEnum = pgEnum('question_status', ['draft', 'active', 'archived']);
export const examStatusEnum = pgEnum('exam_status', ['draft', 'scheduled', 'active', 'completed', 'archived']);
export const sessionStatusEnum = pgEnum('session_status', ['in-progress', 'submitted', 'auto-submitted', 'abandoned']);
export const proctoringStatusEnum = pgEnum('proctoring_status', ['monitoring', 'flagged', 'reviewed', 'cleared']);
export const proctoringEventTypeEnum = pgEnum('proctoring_event_type', ['tab-switch', 'window-blur', 'copy-attempt', 'right-click', 'multiple-faces', 'no-face']);
export const proctoringFlagTypeEnum = pgEnum('proctoring_flag_type', ['identity-mismatch', 'multiple-faces', 'no-face', 'suspicious-activity', 'tab-switching']);
export const severityEnum = pgEnum('severity', ['low', 'medium', 'high']);
export const flagActionEnum = pgEnum('flag_action', ['cleared', 'warning', 'invalidated']);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull(),
  department: varchar('department', { length: 255 }),
  status: userStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lastLogin: timestamp('last_login'),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
  statusIdx: index('users_status_idx').on(table.status),
}));

// Questions Table
export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  text: text('text').notNull(),
  type: questionTypeEnum('type').notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  topic: varchar('topic', { length: 255 }).notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  points: integer('points').notNull(),
  options: jsonb('options'), // QuestionOption[]
  correctAnswer: jsonb('correct_answer').notNull(), // string | string[]
  explanation: text('explanation'),
  status: questionStatusEnum('status').notNull().default('draft'),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  version: integer('version').notNull().default(1),
}, (table) => ({
  subjectIdx: index('questions_subject_idx').on(table.subject),
  topicIdx: index('questions_topic_idx').on(table.topic),
  statusIdx: index('questions_status_idx').on(table.status),
  createdByIdx: index('questions_created_by_idx').on(table.createdBy),
}));

// Exams Table
export const exams = pgTable('exams', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  duration: integer('duration').notNull(), // minutes
  totalPoints: integer('total_points').notNull(),
  passingScore: integer('passing_score').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  settings: jsonb('settings').notNull(), // ExamSettings
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  status: examStatusEnum('status').notNull().default('draft'),
}, (table) => ({
  startTimeIdx: index('exams_start_time_idx').on(table.startTime),
  endTimeIdx: index('exams_end_time_idx').on(table.endTime),
  statusIdx: index('exams_status_idx').on(table.status),
  createdByIdx: index('exams_created_by_idx').on(table.createdBy),
  subjectIdx: index('exams_subject_idx').on(table.subject),
}));

// Exam_Questions Table (Junction)
export const examQuestions = pgTable('exam_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  examId: uuid('exam_id').notNull().references(() => exams.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id').notNull().references(() => questions.id),
  order: integer('order').notNull(),
  points: integer('points').notNull(),
}, (table) => ({
  examIdIdx: index('exam_questions_exam_id_idx').on(table.examId),
  questionIdIdx: index('exam_questions_question_id_idx').on(table.questionId),
}));

// Exam_Assignments Table
export const examAssignments = pgTable('exam_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  examId: uuid('exam_id').notNull().references(() => exams.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').notNull().references(() => users.id),
  assignedAt: timestamp('assigned_at').notNull().defaultNow(),
  assignedBy: uuid('assigned_by').notNull().references(() => users.id),
}, (table) => ({
  examIdIdx: index('exam_assignments_exam_id_idx').on(table.examId),
  studentIdIdx: index('exam_assignments_student_id_idx').on(table.studentId),
  examStudentIdx: index('exam_assignments_exam_student_idx').on(table.examId, table.studentId),
}));

// Exam_Sessions Table
export const examSessions = pgTable('exam_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  examId: uuid('exam_id').notNull().references(() => exams.id),
  studentId: uuid('student_id').notNull().references(() => users.id),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  submittedAt: timestamp('submitted_at'),
  timeRemaining: integer('time_remaining').notNull(), // seconds
  currentQuestionIndex: integer('current_question_index').notNull().default(0),
  status: sessionStatusEnum('status').notNull().default('in-progress'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  examIdIdx: index('exam_sessions_exam_id_idx').on(table.examId),
  studentIdIdx: index('exam_sessions_student_id_idx').on(table.studentId),
  statusIdx: index('exam_sessions_status_idx').on(table.status),
  examStudentIdx: index('exam_sessions_exam_student_idx').on(table.examId, table.studentId),
}));

// Exam_Answers Table
export const examAnswers = pgTable('exam_answers', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => examSessions.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id').notNull().references(() => questions.id),
  answer: jsonb('answer').notNull(), // string | string[]
  isCorrect: boolean('is_correct'),
  pointsEarned: integer('points_earned'),
  answeredAt: timestamp('answered_at').notNull().defaultNow(),
  timeSpent: integer('time_spent').notNull(), // seconds
}, (table) => ({
  sessionIdIdx: index('exam_answers_session_id_idx').on(table.sessionId),
  questionIdIdx: index('exam_answers_question_id_idx').on(table.questionId),
}));

// Proctoring_Sessions Table
export const proctoringSessions = pgTable('proctoring_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => examSessions.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').notNull().references(() => users.id),
  examId: uuid('exam_id').notNull().references(() => exams.id),
  riskScore: integer('risk_score').notNull().default(0), // 0-100
  status: proctoringStatusEnum('status').notNull().default('monitoring'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  sessionIdIdx: index('proctoring_sessions_session_id_idx').on(table.sessionId),
  studentIdIdx: index('proctoring_sessions_student_id_idx').on(table.studentId),
  examIdIdx: index('proctoring_sessions_exam_id_idx').on(table.examId),
  statusIdx: index('proctoring_sessions_status_idx').on(table.status),
}));

// Proctoring_Photos Table
export const proctoringPhotos = pgTable('proctoring_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  proctoringSessionId: uuid('proctoring_session_id').notNull().references(() => proctoringSessions.id, { onDelete: 'cascade' }),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  faceCount: integer('face_count').notNull(),
  verified: boolean('verified').notNull().default(false),
  capturedAt: timestamp('captured_at').notNull().defaultNow(),
}, (table) => ({
  proctoringSessionIdIdx: index('proctoring_photos_session_id_idx').on(table.proctoringSessionId),
}));

// Proctoring_Events Table
export const proctoringEvents = pgTable('proctoring_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  proctoringSessionId: uuid('proctoring_session_id').notNull().references(() => proctoringSessions.id, { onDelete: 'cascade' }),
  type: proctoringEventTypeEnum('type').notNull(),
  details: text('details').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
}, (table) => ({
  proctoringSessionIdIdx: index('proctoring_events_session_id_idx').on(table.proctoringSessionId),
  timestampIdx: index('proctoring_events_timestamp_idx').on(table.timestamp),
}));

// Proctoring_Flags Table
export const proctoringFlags = pgTable('proctoring_flags', {
  id: uuid('id').primaryKey().defaultRandom(),
  proctoringSessionId: uuid('proctoring_session_id').notNull().references(() => proctoringSessions.id, { onDelete: 'cascade' }),
  type: proctoringFlagTypeEnum('type').notNull(),
  severity: severityEnum('severity').notNull(),
  description: text('description').notNull(),
  reviewed: boolean('reviewed').notNull().default(false),
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  action: flagActionEnum('action'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  proctoringSessionIdIdx: index('proctoring_flags_session_id_idx').on(table.proctoringSessionId),
  reviewedIdx: index('proctoring_flags_reviewed_idx').on(table.reviewed),
  severityIdx: index('proctoring_flags_severity_idx').on(table.severity),
}));

// Audit_Logs Table
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  action: varchar('action', { length: 255 }).notNull(),
  performedBy: uuid('performed_by').notNull().references(() => users.id),
  targetUser: uuid('target_user').references(() => users.id),
  details: jsonb('details').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  performedByIdx: index('audit_logs_performed_by_idx').on(table.performedBy),
  targetUserIdx: index('audit_logs_target_user_idx').on(table.targetUser),
  createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
  actionIdx: index('audit_logs_action_idx').on(table.action),
}));

// Question_Version_History Table
export const questionVersionHistory = pgTable('question_version_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  questionId: uuid('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  text: text('text').notNull(),
  type: questionTypeEnum('type').notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  topic: varchar('topic', { length: 255 }).notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  points: integer('points').notNull(),
  options: jsonb('options'),
  correctAnswer: jsonb('correct_answer').notNull(),
  explanation: text('explanation'),
  status: questionStatusEnum('status').notNull(),
  modifiedBy: uuid('modified_by').notNull().references(() => users.id),
  modifiedAt: timestamp('modified_at').notNull().defaultNow(),
}, (table) => ({
  questionIdIdx: index('question_version_history_question_id_idx').on(table.questionId),
  versionIdx: index('question_version_history_version_idx').on(table.version),
  modifiedAtIdx: index('question_version_history_modified_at_idx').on(table.modifiedAt),
}));
