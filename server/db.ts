import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/db-schema.js";

// Get DATABASE_URL from environment - critical for Railway deployment
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ CRITICAL ERROR: DATABASE_URL environment variable is not set');
  console.error('This is required for PostgreSQL connection and Railway deployment');
  process.exit(1);
}

// Fix DATABASE_URL format if it's missing the protocol separator
if (databaseUrl.startsWith('postgresql:') && !databaseUrl.includes('://')) {
  // The URL is in the format postgresql:username:password@host... 
  // Convert it to postgresql://username:password@host...
  const urlParts = databaseUrl.substring('postgresql:'.length);
  databaseUrl = `postgresql://${urlParts}`;
  console.log('🔧 Fixed DATABASE_URL format for proper connection');
}

console.log('🔗 Connecting to PostgreSQL database...');

// Create PostgreSQL client with connection pooling
// Enhanced for Railway/Replit PostgreSQL connection
const client = postgres(databaseUrl, {
  max: 10, // Maximum connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: databaseUrl.includes('localhost') ? false : 'require', // Enable SSL for production
  transform: {
    undefined: null // Handle undefined values properly
  }
});

// Create Drizzle database instance with schema
export const db = drizzle(client, { schema });

// Connection health check function
export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  status: string;
  error?: string;
}> {
  try {
    // Test connection with a simple query
    await client`SELECT 1 as test`;
    return { connected: true, status: 'healthy' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Database connection failed:', errorMessage);
    return { 
      connected: false, 
      status: 'error', 
      error: errorMessage 
    };
  }
}

// Alias for compatibility with self-healing services
export const getConnectionStatus = checkDatabaseConnection;

// Initialize database connection and log status
async function initializeDatabase() {
  try {
    const connectionStatus = await checkDatabaseConnection();
    if (connectionStatus.connected) {
      console.log('✅ PostgreSQL database connected successfully');
      console.log('🔗 Database URL configured from environment variable');
    } else {
      console.error('❌ PostgreSQL database connection failed:', connectionStatus.error);
      throw new Error(`Database connection failed: ${connectionStatus.error}`);
    }
  } catch (error) {
    console.error('❌ CRITICAL: Database initialization failed:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

// Initialize connection immediately (non-blocking for self-healing services)
initializeDatabase().catch((error) => {
  console.warn('⚠️ Database connection not available at startup - services will run in fallback mode');
  console.warn('This is acceptable for self-healing architecture testing');
});

export default db;