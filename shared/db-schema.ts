import { pgTable, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Helper for default ID
const defaultId = () => createId();

// Helper for current timestamp
const now = () => new Date();

// User Management
export const users = pgTable('users', {
  id: text('id').primaryKey().$default(defaultId),
  username: text('username').notNull().unique(),
  email: text('email').unique(),
  password: text('password').notNull(),
  role: text('role').default('user').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  failedAttempts: integer('failed_attempts').default(0).notNull(),
  lockedUntil: timestamp('locked_until'),
  lastFailedAttempt: timestamp('last_failed_attempt'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Conversation Management 
export const conversations = pgTable('conversations', {
  id: text('id').primaryKey().$default(defaultId),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: text('id').primaryKey().$default(defaultId),
  conversationId: text('conversation_id').notNull().references(() => conversations.id),
  content: text('content').notNull(),
  role: text('role').default('user').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Document Management
export const documents = pgTable('documents', {
  id: text('id').primaryKey().$default(defaultId),
  userId: text('user_id').references(() => users.id),
  type: text('type').notNull(),
  status: text('status').default('generated').notNull(),
  content: text('content'),
  metadata: jsonb('metadata'),
  processingStatus: text('processing_status').default('pending'),
  isEncrypted: boolean('is_encrypted').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Event Tracking
export const securityEvents = pgTable('security_events', {
  id: text('id').primaryKey().$default(defaultId),
  userId: text('user_id').references(() => users.id),
  eventType: text('event_type').notNull(),
  severity: text('severity').default('medium').notNull(),
  description: text('description').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const systemMetrics = pgTable('system_metrics', {
  id: text('id').primaryKey().$default(defaultId),
  metricType: text('metric_type').notNull(),
  value: integer('value').notNull(),
  tags: jsonb('tags'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Audit & Compliance
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey().$default(defaultId),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const complianceEvents = pgTable('compliance_events', {
  id: text('id').primaryKey().$default(defaultId),
  eventType: text('event_type').notNull(),
  userId: text('user_id').references(() => users.id),
  complianceStatus: text('compliance_status').notNull(),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User Behavior & Health
export const userBehaviorProfiles = pgTable('user_behavior_profiles', {
  id: text('id').primaryKey().$default(defaultId),
  userId: text('user_id').notNull().references(() => users.id),
  riskScore: integer('risk_score').default(0).notNull(),
  behaviorPattern: jsonb('behavior_pattern'),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Self-healing Architecture
export const selfHealingActions = pgTable('self_healing_actions', {
  id: text('id').primaryKey().$default(defaultId),
  actionType: text('action_type').notNull(),
  status: text('status').notNull(),
  details: jsonb('details'),
  startTime: timestamp('start_time').defaultNow().notNull(),
  endTime: timestamp('end_time'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const systemHealthSnapshots = pgTable('system_health_snapshots', {
  id: text('id').primaryKey().$default(defaultId),
  overallHealth: text('overall_health').notNull(),
  metrics: jsonb('metrics').notNull(),
  issues: jsonb('issues'),
  recommendations: jsonb('recommendations'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Export types for TypeScript
export type {
  User,
  Conversation,
  Message,
  Document,
  SecurityEvent,
  SystemMetric,
  AuditLog,
  ComplianceEvent,
  UserBehaviorProfile,
  SelfHealingAction,
  SystemHealthSnapshot,
} from './schema.js';