// Unified schema that re-exports everything from db-tables
export * from './db-tables.js';

// Common enums and constants
export enum ComplianceEventType {
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  AUDIT_TRAIL = 'AUDIT_TRAIL'
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  AUTH_ATTEMPT = 'AUTH_ATTEMPT',
  ACCESS_DENIED = 'ACCESS_DENIED',
  DOCUMENT_GENERATE = 'DOCUMENT_GENERATE',
  DOCUMENT_VERIFY = 'DOCUMENT_VERIFY',
  BIOMETRIC_VERIFY = 'BIOMETRIC_VERIFY',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  SETTINGS_CHANGE = 'SETTINGS_CHANGE'
}

export enum SecurityLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GOVERNMENT = 'government',
  SYSTEM = 'system',
  AUDITOR = 'auditor'
}

export enum DocumentType {
  PASSPORT = 'passport',
  ID_CARD = 'id_card',
  BIRTH_CERT = 'birth_certificate',
  MARRIAGE_CERT = 'marriage_certificate',
  DEATH_CERT = 'death_certificate',
  CITIZENSHIP = 'citizenship',
  VISA = 'visa',
  ASYLUM = 'asylum',
  WORK_PERMIT = 'work_permit',
  STUDY_PERMIT = 'study_permit'
}

export enum DocumentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  GENERATED = 'generated',
  VERIFIED = 'verified',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  ERROR = 'error'
}

export enum VerificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  VERIFIED = 'verified',
  FAILED = 'failed',
  BLOCKED = 'blocked'
}

export enum AISessionType {
  DOCUMENT_PROCESSING = 'document_processing',
  BIOMETRIC_VERIFICATION = 'biometric_verification',
  CUSTOMER_SUPPORT = 'customer_support',
  GOVERNMENT_SERVICE = 'government_service',
  SYSTEM_MONITORING = 'system_monitoring'
}

export enum ExecutionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  TIMEOUT = 'timeout'
}

export enum SystemHealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  CRITICAL = 'critical',
  UNKNOWN = 'unknown'
}

// Constants
export const SYSTEM_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 5,
  PASSWORD_MIN_LENGTH: 12,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  BIOMETRIC_MATCH_THRESHOLD: 0.85,
  ANOMALY_DETECTION_THRESHOLD: 0.95,
  HEALTH_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes
  CIRCUIT_BREAKER_THRESHOLD: 5,
  CIRCUIT_BREAKER_TIMEOUT: 30 * 1000 // 30 seconds
};