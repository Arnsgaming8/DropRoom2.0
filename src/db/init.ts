import { db } from "./index";
import { rooms } from "./schema";

async function initDb() {
  try {
    await db.select().from(rooms).limit(1);
    console.log("Database connected");
  } catch (error: any) {
    console.log("DB init error:", error?.message || error);
  }
}

initDb();
