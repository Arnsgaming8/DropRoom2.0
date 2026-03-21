import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

console.log("DB config present:", !!connectionString);

const pool = new Pool({
  connectionString,
});

pool.on("error", (err) => {
  console.error("Pool error:", err);
});

export const db = drizzle(pool);
