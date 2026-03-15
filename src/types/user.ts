/**
 * User and Authentication Type Definitions
 * Requirements: 1.1, 3.1, 9.1
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  department: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserManagement {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  department?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface UserFilter {
  role?: string;
  department?: string;
  status?: string;
  searchTerm?: string;
}

export interface AuditLogEntry {
  id: string;
  action: 'user-created' | 'user-updated' | 'user-deleted' | 'role-changed' | 'password-reset';
  performedBy: string;
  targetUser: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
}

export interface PasswordReset {
  userId: string;
  temporaryPassword: string;
  expiresAt: Date;
  mustChangeOnLogin: boolean;
}

// Database record types
export interface UserRecord {
  id: string; // UUID
  email: string; // unique
  password_hash: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  department: string | null;
  status: 'active' | 'inactive' | 'suspended';
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
}
