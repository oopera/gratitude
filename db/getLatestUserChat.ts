"server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "./queries";
import { Chat, chat, user } from "./schema";

export async function getLatestUserChat(name: string): Promise<Array<Chat>> {
  try {
    const [currentUser] = await db
      .select()
      .from(user)
      .where(eq(user.name, name));
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, currentUser.id))
      .orderBy(desc(chat.createdAt))
      .limit(1);
  } catch (error) {
    return [];
  }
}
