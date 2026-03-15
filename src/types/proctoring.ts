/**
 * Proctoring System Type Definitions
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7
 */

export interface ProctoringSession {
  sessionId: string;
  studentId: string;
  examId: string;
  startedAt: Date;
  photos: ProctoringPhoto[];
  events: ProctoringEvent[];
  flags: ProctoringFlag[];
  riskScore: number; // 0-100
  status: 'monitoring' | 'flagged' | 'reviewed' | 'cleared';
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

export interface ProctoringFlag {
  id: string;
  type: 'identity-mismatch' | 'multiple-faces' | 'no-face' | 'suspicious-activity' | 'tab-switching';
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  description: string;
  reviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  action?: 'cleared' | 'warning' | 'invalidated';
}

export interface CameraPermission {
  granted: boolean;
  requestedAt: Date;
  deniedReason?: string;
}

// Database record types
export interface ProctoringSessionRecord {
  id: string; // UUID
  session_id: string; // FK to exam_sessions
  student_id: string; // FK to users
  exam_id: string; // FK to exams
  risk_score: number; // 0-100
  status: 'monitoring' | 'flagged' | 'reviewed' | 'cleared';
  created_at: Date;
  updated_at: Date;
}

export interface ProctoringPhotoRecord {
  id: string; // UUID
  proctoring_session_id: string; // FK to proctoring_sessions
  image_url: string;
  face_count: number;
  verified: boolean;
  captured_at: Date;
}

export interface ProctoringEventRecord {
  id: string; // UUID
  proctoring_session_id: string; // FK to proctoring_sessions
  type: 'tab-switch' | 'window-blur' | 'copy-attempt' | 'right-click' | 'multiple-faces' | 'no-face';
  details: string;
  timestamp: Date;
}

export interface ProctoringFlagRecord {
  id: string; // UUID
  proctoring_session_id: string; // FK to proctoring_sessions
  type: 'identity-mismatch' | 'multiple-faces' | 'no-face' | 'suspicious-activity' | 'tab-switching';
  severity: 'low' | 'medium' | 'high';
  description: string;
  reviewed: boolean;
  reviewed_by: string | null; // FK to users
  reviewed_at: Date | null;
  action: 'cleared' | 'warning' | 'invalidated' | null;
  created_at: Date;
}
