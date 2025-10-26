import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database URL fallback if not provided in environment
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost:5432/dha_database";

// Initialize postgres client
const db = postgres(DATABASE_URL);

// Initialize drizzle
const drizzleDb = drizzle(db);

// Run migrations
async function main() {
  console.log("Running migrations...");
  
  try {
    await migrate(drizzleDb, { migrationsFolder: path.join(__dirname, "migrations") });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }

  // Close the database connection
  await db.end();
}

main();