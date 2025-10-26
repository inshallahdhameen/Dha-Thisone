import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, varchar, boolean, integer, jsonb, doublePrecision } from 'drizzle-orm/pg-core';

// Define table schemas
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('user').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  failedAttempts: integer('failed_attempts').default(0).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
});

export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  metadata: jsonb('metadata')
});

export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id').references(() => conversations.id).notNull(),
  content: text('content').notNull(),
  role: text('role').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const documents = pgTable('documents', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  processingStatus: text('processing_status').default('pending'),
  isEncrypted: boolean('is_encrypted').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  metadata: jsonb('metadata')
});

export const securityEvents = pgTable('security_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  eventType: text('event_type').notNull(),
  severity: text('severity').default('medium').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  metadata: jsonb('metadata')
});

export const fraudAlerts = pgTable('fraud_alerts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  alertType: text('alert_type').notNull(),
  severity: text('severity').notNull(),
  description: text('description').notNull(),
  isResolved: boolean('is_resolved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
  metadata: jsonb('metadata')
});

export const systemMetrics = pgTable('system_metrics', {
  id: text('id').primaryKey(),
  metricName: text('metric_name').notNull(),
  value: doublePrecision('value').notNull(),
  unit: text('unit').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  tags: jsonb('tags')
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  metadata: jsonb('metadata')
});

export const complianceEvents = pgTable('compliance_events', {
  id: text('id').primaryKey(),
  eventType: text('event_type').notNull(),
  regulation: text('regulation').notNull(),
  complianceStatus: text('compliance_status').notNull(),
  details: text('details').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  metadata: jsonb('metadata')
});

export const userBehaviorProfiles = pgTable('user_behavior_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  loginPatterns: jsonb('login_patterns').notNull(),
  riskScore: doublePrecision('risk_score').notNull(),
  anomalyThreshold: doublePrecision('anomaly_threshold').notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  metadata: jsonb('metadata')
});

export const selfHealingActions = pgTable('self_healing_actions', {
  id: text('id').primaryKey(),
  actionType: text('action_type').notNull(),
  trigger: text('trigger').notNull(),
  status: text('status').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  success: boolean('success'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const securityIncidents = pgTable('security_incidents', {
  id: text('id').primaryKey(),
  incidentType: text('incident_type').notNull(),
  severity: text('severity').notNull(),
  status: text('status').notNull(),
  description: text('description').notNull(),
  detectionTime: timestamp('detection_time').notNull(),
  resolutionTime: timestamp('resolution_time'),
  impactedSystems: jsonb('impacted_systems'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const systemHealthSnapshots = pgTable('system_health_snapshots', {
  id: text('id').primaryKey(),
  cpuUsage: doublePrecision('cpu_usage').notNull(),
  memoryUsage: doublePrecision('memory_usage').notNull(),
  diskUsage: doublePrecision('disk_usage').notNull(),
  networkLatency: doublePrecision('network_latency').notNull(),
  activeConnections: integer('active_connections').notNull(),
  errorRate: doublePrecision('error_rate').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  metadata: jsonb('metadata')
});

export const errorCorrections = pgTable('error_corrections', {
  id: text('id').primaryKey(),
  errorType: text('error_type').notNull(),
  correctionType: text('correction_type').notNull(),
  status: text('status').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  success: boolean('success'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const healthCheckResults = pgTable('health_check_results', {
  id: text('id').primaryKey(),
  checkId: text('check_id').notNull(),
  status: text('status').notNull(),
  responseTime: integer('response_time').notNull(),
  details: jsonb('details'),
  timestamp: timestamp('timestamp').defaultNow().notNull()
});

export const failoverEvents = pgTable('failover_events', {
  id: text('id').primaryKey(),
  serviceId: text('service_id').notNull(),
  triggerType: text('trigger_type').notNull(),
  status: text('status').notNull(),
  triggerTime: timestamp('trigger_time').notNull(),
  completionTime: timestamp('completion_time'),
  success: boolean('success'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const performanceBaselines = pgTable('performance_baselines', {
  id: text('id').primaryKey(),
  serviceName: text('service_name').notNull(),
  metricName: text('metric_name').notNull(),
  baselineValue: doublePrecision('baseline_value').notNull(),
  upperThreshold: doublePrecision('upper_threshold').notNull(),
  lowerThreshold: doublePrecision('lower_threshold').notNull(),
  lastUpdated: timestamp('last_updated').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  metadata: jsonb('metadata')
});

export const alertRules = pgTable('alert_rules', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  conditions: jsonb('conditions').notNull(),
  actions: jsonb('actions').notNull(),
  enabled: boolean('enabled').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
});

export const circuitBreakerStates = pgTable('circuit_breaker_states', {
  id: text('id').primaryKey(),
  serviceName: text('service_name').notNull().unique(),
  state: text('state').notNull(),
  failureCount: integer('failure_count').default(0).notNull(),
  lastStateChange: timestamp('last_state_change').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const uptimeIncidents = pgTable('uptime_incidents', {
  id: text('id').primaryKey(),
  serviceId: text('service_id').notNull(),
  incidentType: text('incident_type').notNull(),
  severity: text('severity').notNull(),
  status: text('status').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  resolution: text('resolution'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const autonomousOperations = pgTable('autonomous_operations', {
  id: text('id').primaryKey(),
  operationType: text('operation_type').notNull(),
  status: text('status').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const maintenanceTasks = pgTable('maintenance_tasks', {
  id: text('id').primaryKey(),
  taskType: text('task_type').notNull(),
  status: text('status').notNull(),
  priority: text('priority').notNull(),
  scheduledTime: timestamp('scheduled_time').notNull(),
  completionTime: timestamp('completion_time'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const governmentComplianceAudits = pgTable('government_compliance_audits', {
  id: text('id').primaryKey(),
  auditType: text('audit_type').notNull(),
  department: text('department').notNull(),
  complianceStatus: text('compliance_status').notNull(),
  findings: jsonb('findings'),
  recommendations: jsonb('recommendations'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at')
});

export const securityMetrics = pgTable('security_metrics', {
  id: text('id').primaryKey(),
  metricName: text('metric_name').notNull(),
  value: doublePrecision('value').notNull(),
  category: text('category').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const biometricProfiles = pgTable('biometric_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  fingerprints: jsonb('fingerprints'),
  facialData: jsonb('facial_data'),
  irisScans: jsonb('iris_scans'),
  voicePrint: jsonb('voice_print'),
  lastVerified: timestamp('last_verified'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
});

export const dhaApplicants = pgTable('dha_applicants', {
  id: text('id').primaryKey(),
  idNumber: varchar('id_number', { length: 13 }).notNull().unique(),
  passportNumber: varchar('passport_number', { length: 50 }).unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  gender: varchar('gender', { length: 20 }).notNull(),
  nationality: varchar('nationality', { length: 100 }).notNull(),
  contactNumber: varchar('contact_number', { length: 20 }),
  emailAddress: varchar('email_address', { length: 255 }),
  physicalAddress: jsonb('physical_address'),
  biometricId: text('biometric_id').references(() => biometricProfiles.id),
  verificationStatus: varchar('verification_status', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
});

export const dhaDocuments = pgTable('dha_documents', {
  id: text('id').primaryKey(),
  applicantId: text('applicant_id').references(() => dhaApplicants.id).notNull(),
  documentType: varchar('document_type', { length: 100 }).notNull(),
  documentNumber: varchar('document_number', { length: 100 }).notNull().unique(),
  issueDate: timestamp('issue_date').notNull(),
  expiryDate: timestamp('expiry_date'),
  status: varchar('status', { length: 50 }).notNull(),
  securityFeatures: jsonb('security_features'),
  digitalSignature: text('digital_signature'),
  documentData: jsonb('document_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
});

export const dhaDocumentVerifications = pgTable('dha_document_verifications', {
  id: text('id').primaryKey(),
  documentId: text('document_id').references(() => dhaDocuments.id).notNull(),
  verificationCode: varchar('verification_code', { length: 100 }).notNull().unique(),
  verificationType: varchar('verification_type', { length: 100 }).notNull(),
  verificationResult: varchar('verification_result', { length: 50 }).notNull(),
  verifiedBy: text('verified_by').references(() => users.id),
  verificationTimestamp: timestamp('verification_timestamp').notNull(),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const aiBotSessions = pgTable('ai_bot_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  sessionType: varchar('session_type', { length: 100 }).notNull(),
  context: jsonb('context').notNull(),
  sessionActive: boolean('session_active').default(true).notNull(),
  lastActivity: timestamp('last_activity').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const aiCommandInterfaces = pgTable('ai_command_interfaces', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').references(() => aiBotSessions.id).notNull(),
  commandType: varchar('command_type', { length: 100 }).notNull(),
  parameters: jsonb('parameters').notNull(),
  executionStatus: varchar('execution_status', { length: 50 }).notNull(),
  result: jsonb('result'),
  errorDetails: jsonb('error_details'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Export types for TypeScript usage
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

export type SecurityEvent = typeof securityEvents.$inferSelect;
export type InsertSecurityEvent = typeof securityEvents.$inferInsert;

export type FraudAlert = typeof fraudAlerts.$inferSelect;
export type InsertFraudAlert = typeof fraudAlerts.$inferInsert;

export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertSystemMetric = typeof systemMetrics.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

export type ComplianceEvent = typeof complianceEvents.$inferSelect;
export type InsertComplianceEvent = typeof complianceEvents.$inferInsert;

export type UserBehaviorProfile = typeof userBehaviorProfiles.$inferSelect;
export type InsertUserBehaviorProfile = typeof userBehaviorProfiles.$inferInsert;

export type SelfHealingAction = typeof selfHealingActions.$inferSelect;
export type InsertSelfHealingAction = typeof selfHealingActions.$inferInsert;

export type SecurityIncident = typeof securityIncidents.$inferSelect;
export type InsertSecurityIncident = typeof securityIncidents.$inferInsert;

export type SystemHealthSnapshot = typeof systemHealthSnapshots.$inferSelect;
export type InsertSystemHealthSnapshot = typeof systemHealthSnapshots.$inferInsert;

export type ErrorCorrection = typeof errorCorrections.$inferSelect;
export type InsertErrorCorrection = typeof errorCorrections.$inferInsert;

export type HealthCheckResult = typeof healthCheckResults.$inferSelect;
export type InsertHealthCheckResult = typeof healthCheckResults.$inferInsert;

export type FailoverEvent = typeof failoverEvents.$inferSelect;
export type InsertFailoverEvent = typeof failoverEvents.$inferInsert;

export type PerformanceBaseline = typeof performanceBaselines.$inferSelect;
export type InsertPerformanceBaseline = typeof performanceBaselines.$inferInsert;

export type AlertRule = typeof alertRules.$inferSelect;
export type InsertAlertRule = typeof alertRules.$inferInsert;

export type CircuitBreakerState = typeof circuitBreakerStates.$inferSelect;
export type InsertCircuitBreakerState = typeof circuitBreakerStates.$inferInsert;

export type UptimeIncident = typeof uptimeIncidents.$inferSelect;
export type InsertUptimeIncident = typeof uptimeIncidents.$inferInsert;

export type AutonomousOperation = typeof autonomousOperations.$inferSelect;
export type InsertAutonomousOperation = typeof autonomousOperations.$inferInsert;

export type MaintenanceTask = typeof maintenanceTasks.$inferSelect;
export type InsertMaintenanceTask = typeof maintenanceTasks.$inferInsert;

export type GovernmentComplianceAudit = typeof governmentComplianceAudits.$inferSelect;
export type InsertGovernmentComplianceAudit = typeof governmentComplianceAudits.$inferInsert;

export type SecurityMetric = typeof securityMetrics.$inferSelect;
export type InsertSecurityMetric = typeof securityMetrics.$inferInsert;

export type BiometricProfile = typeof biometricProfiles.$inferSelect;
export type InsertBiometricProfile = typeof biometricProfiles.$inferInsert;

export type DhaApplicant = typeof dhaApplicants.$inferSelect;
export type InsertDhaApplicant = typeof dhaApplicants.$inferInsert;

export type DhaDocument = typeof dhaDocuments.$inferSelect;
export type InsertDhaDocument = typeof dhaDocuments.$inferInsert;

export type DhaDocumentVerification = typeof dhaDocumentVerifications.$inferSelect;
export type InsertDhaDocumentVerification = typeof dhaDocumentVerifications.$inferInsert;

export type AiBotSession = typeof aiBotSessions.$inferSelect;
export type InsertAiBotSession = typeof aiBotSessions.$inferInsert;

export type AiCommandInterface = typeof aiCommandInterfaces.$inferSelect;
export type InsertAiCommandInterface = typeof aiCommandInterfaces.$inferInsert;