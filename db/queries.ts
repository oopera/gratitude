"server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { chat, user, User } from "./schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

export async function getUser(name: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.name, name));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(name: string, password: string, type: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ name, password: hash, type });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

export async function saveChat({
  id,
  messages,
  type,
  userId,
}: {
  id: string;
  messages: any;
  type: string;
  userId: string;
}) {
  try {
    const selectedChats = await db.select().from(chat).where(eq(chat.id, id));

    if (selectedChats.length > 0) {
      return await db
        .update(chat)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chat.id, id));
    }

    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      messages: JSON.stringify(messages),
      type,
      userId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function getChats() {
  try {
    return await db.select().from(chat);
  } catch (error) {
    console.error("Failed to get chats from database");
    throw error;
  }
}

export async function getChatsByType({ type }: { type: string }) {
  try {
    return await db.select().from(chat).where(eq(chat.type, type));
  } catch (error) {
    console.error("Failed to get chats by type from database");
    throw error;
  }
}

export async function deleteChatsByType({ type }: { type: string }) {
  try {
    return await db.delete(chat).where(eq(chat.type, type));
  } catch (error) {
    console.error("Failed to delete chats by type from database");
    throw error;
  }
}

export async function getUsers() {
  try {
    return await db.select().from(user);
  } catch (error) {
    console.error("Failed to get users from database");
    throw error;
  }
}
