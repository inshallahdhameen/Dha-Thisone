import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  users,
  conversations,
  messages,
  documents,
  securityEvents,
  fraudAlerts,
  systemMetrics,
  auditLogs,
  complianceEvents,
  userBehaviorProfiles,
  selfHealingActions,
  securityIncidents,
  systemHealthSnapshots,
  errorCorrections,
  healthCheckResults,
  failoverEvents,
  performanceBaselines,
  alertRules,
  circuitBreakerStates,
  uptimeIncidents,
  autonomousOperations,
  maintenanceTasks,
  governmentComplianceAudits,
  securityMetrics,
  biometricProfiles,
  dhaApplicants,
  dhaDocuments,
  dhaDocumentVerifications,
  aiBotSessions,
  aiCommandInterfaces
} from '../../../shared/db-tables.js';

export async function up(db: PostgresJsDatabase) {
  // Users table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      is_active BOOLEAN NOT NULL DEFAULT true,
      failed_attempts INTEGER NOT NULL DEFAULT 0,
      last_login_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP
    );
  `);

  // Conversations table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      last_message_at TIMESTAMP NOT NULL DEFAULT now(),
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      metadata JSONB
    );
  `);

  // Messages table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id),
      content TEXT NOT NULL,
      role TEXT NOT NULL,
      metadata JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // Documents table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      processing_status TEXT NOT NULL DEFAULT 'pending',
      is_encrypted BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      metadata JSONB
    );
  `);

  // Security events table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS security_events (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      event_type TEXT NOT NULL,
      severity TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      metadata JSONB
    );
  `);

  // Fraud alerts table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS fraud_alerts (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      alert_type TEXT NOT NULL,
      severity TEXT NOT NULL,
      description TEXT NOT NULL,
      is_resolved BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      resolved_at TIMESTAMP,
      metadata JSONB
    );
  `);

  // System metrics table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS system_metrics (
      id TEXT PRIMARY KEY,
      metric_name TEXT NOT NULL,
      value DOUBLE PRECISION NOT NULL,
      unit TEXT NOT NULL,
      timestamp TIMESTAMP NOT NULL DEFAULT now(),
      tags JSONB
    );
  `);

  // Audit logs table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      old_value JSONB,
      new_value JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      metadata JSONB
    );
  `);

  // Compliance events table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS compliance_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      regulation TEXT NOT NULL,
      compliance_status TEXT NOT NULL,
      details TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      metadata JSONB
    );
  `);

  // User behavior profiles table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_behavior_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      login_patterns JSONB NOT NULL,
      risk_score DOUBLE PRECISION NOT NULL,
      anomaly_threshold DOUBLE PRECISION NOT NULL,
      last_updated TIMESTAMP NOT NULL DEFAULT now(),
      metadata JSONB
    );
  `);

  // Self-healing actions table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS self_healing_actions (
      id TEXT PRIMARY KEY,
      action_type TEXT NOT NULL,
      trigger TEXT NOT NULL,
      status TEXT NOT NULL,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP,
      success BOOLEAN,
      details JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // Security incidents table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS security_incidents (
      id TEXT PRIMARY KEY,
      incident_type TEXT NOT NULL,
      severity TEXT NOT NULL,
      status TEXT NOT NULL,
      description TEXT NOT NULL,
      detection_time TIMESTAMP NOT NULL,
      resolution_time TIMESTAMP,
      impacted_systems JSONB,
      metadata JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // System health snapshots table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS system_health_snapshots (
      id TEXT PRIMARY KEY,
      cpu_usage DOUBLE PRECISION NOT NULL,
      memory_usage DOUBLE PRECISION NOT NULL,
      disk_usage DOUBLE PRECISION NOT NULL,
      network_latency DOUBLE PRECISION NOT NULL,
      active_connections INTEGER NOT NULL,
      error_rate DOUBLE PRECISION NOT NULL,
      timestamp TIMESTAMP NOT NULL DEFAULT now(),
      metadata JSONB
    );
  `);

  // Error corrections table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS error_corrections (
      id TEXT PRIMARY KEY,
      error_type TEXT NOT NULL,
      correction_type TEXT NOT NULL,
      status TEXT NOT NULL,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP,
      success BOOLEAN,
      details JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // Health check results table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS health_check_results (
      id TEXT PRIMARY KEY,
      check_id TEXT NOT NULL,
      status TEXT NOT NULL,
      response_time INTEGER NOT NULL,
      details JSONB,
      timestamp TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // Failover events table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS failover_events (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      trigger_type TEXT NOT NULL,
      status TEXT NOT NULL,
      trigger_time TIMESTAMP NOT NULL,
      completion_time TIMESTAMP,
      success BOOLEAN,
      details JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // Performance baselines table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS performance_baselines (
      id TEXT PRIMARY KEY,
      service_name TEXT NOT NULL,
      metric_name TEXT NOT NULL,
      baseline_value DOUBLE PRECISION NOT NULL,
      upper_threshold DOUBLE PRECISION NOT NULL,
      lower_threshold DOUBLE PRECISION NOT NULL,
      last_updated TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      metadata JSONB
    );
  `);

  // Alert rules table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS alert_rules (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      conditions JSONB NOT NULL,
      actions JSONB NOT NULL,
      enabled BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP
    );
  `);

  // Circuit breaker states table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS circuit_breaker_states (
      id TEXT PRIMARY KEY,
      service_name TEXT NOT NULL UNIQUE,
      state TEXT NOT NULL,
      failure_count INTEGER NOT NULL DEFAULT 0,
      last_state_change TIMESTAMP NOT NULL,
      metadata JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // Uptime incidents table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS uptime_incidents (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      incident_type TEXT NOT NULL,
      severity TEXT NOT NULL,
      status TEXT NOT NULL,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP,
      resolution TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // Autonomous operations table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS autonomous_operations (
      id TEXT PRIMARY KEY,
      operation_type TEXT NOT NULL,
      status TEXT NOT NULL,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP,
      details JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // Maintenance tasks table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS maintenance_tasks (
      id TEXT PRIMARY KEY,
      task_type TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      scheduled_time TIMESTAMP NOT NULL,
      completion_time TIMESTAMP,
      details JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // Government compliance audits table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS government_compliance_audits (
      id TEXT PRIMARY KEY,
      audit_type TEXT NOT NULL,
      department TEXT NOT NULL,
      compliance_status TEXT NOT NULL,
      findings JSONB,
      recommendations JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      completed_at TIMESTAMP
    );
  `);

  // Security metrics table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS security_metrics (
      id TEXT PRIMARY KEY,
      metric_name TEXT NOT NULL,
      value DOUBLE PRECISION NOT NULL,
      category TEXT NOT NULL,
      timestamp TIMESTAMP NOT NULL,
      metadata JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // Biometric profiles table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS biometric_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      fingerprints JSONB,
      facial_data JSONB,
      iris_scans JSONB,
      voice_print JSONB,
      last_verified TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP
    );
  `);

  // DHA applicants table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS dha_applicants (
      id TEXT PRIMARY KEY,
      id_number VARCHAR(13) NOT NULL UNIQUE,
      passport_number VARCHAR(50) UNIQUE,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      date_of_birth TIMESTAMP NOT NULL,
      gender VARCHAR(20) NOT NULL,
      nationality VARCHAR(100) NOT NULL,
      contact_number VARCHAR(20),
      email_address VARCHAR(255),
      physical_address JSONB,
      biometric_id TEXT REFERENCES biometric_profiles(id),
      verification_status VARCHAR(50) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP
    );
  `);

  // DHA documents table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS dha_documents (
      id TEXT PRIMARY KEY,
      applicant_id TEXT NOT NULL REFERENCES dha_applicants(id),
      document_type VARCHAR(100) NOT NULL,
      document_number VARCHAR(100) NOT NULL UNIQUE,
      issue_date TIMESTAMP NOT NULL,
      expiry_date TIMESTAMP,
      status VARCHAR(50) NOT NULL,
      security_features JSONB,
      digital_signature TEXT,
      document_data JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP
    );
  `);

  // DHA document verifications table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS dha_document_verifications (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL REFERENCES dha_documents(id),
      verification_code VARCHAR(100) NOT NULL UNIQUE,
      verification_type VARCHAR(100) NOT NULL,
      verification_result VARCHAR(50) NOT NULL,
      verified_by TEXT REFERENCES users(id),
      verification_timestamp TIMESTAMP NOT NULL,
      details JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // AI bot sessions table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ai_bot_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      session_type VARCHAR(100) NOT NULL,
      context JSONB NOT NULL,
      session_active BOOLEAN NOT NULL DEFAULT true,
      last_activity TIMESTAMP NOT NULL,
      metadata JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // AI command interfaces table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ai_command_interfaces (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES ai_bot_sessions(id),
      command_type VARCHAR(100) NOT NULL,
      parameters JSONB NOT NULL,
      execution_status VARCHAR(50) NOT NULL,
      result JSONB,
      error_details JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);
}

export async function down(db: PostgresJsDatabase) {
  // Drop tables in reverse order of creation to handle foreign key constraints
  const tables = [
    'ai_command_interfaces',
    'ai_bot_sessions',
    'dha_document_verifications',
    'dha_documents',
    'dha_applicants',
    'biometric_profiles',
    'security_metrics',
    'government_compliance_audits',
    'maintenance_tasks',
    'autonomous_operations',
    'uptime_incidents',
    'circuit_breaker_states',
    'alert_rules',
    'performance_baselines',
    'failover_events',
    'health_check_results',
    'error_corrections',
    'system_health_snapshots',
    'security_incidents',
    'self_healing_actions',
    'user_behavior_profiles',
    'compliance_events',
    'audit_logs',
    'system_metrics',
    'fraud_alerts',
    'security_events',
    'documents',
    'messages',
    'conversations',
    'users'
  ];

  for (const table of tables) {
    await db.execute(sql`DROP TABLE IF EXISTS ${sql.identifier(table)} CASCADE;`);
  }
}