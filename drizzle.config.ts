
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not found, using default PostgreSQL connection");
}

export default defineConfig({
  out: "./server/db/migrations",
  schema: ["./shared/db-tables.ts", "./shared/schema.ts"],
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/dha_database",
  },
  strict: true,
  verbose: true,
});
