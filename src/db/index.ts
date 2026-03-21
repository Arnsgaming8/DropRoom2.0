import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Pool error:", err);
});

export const db = drizzle(pool);
