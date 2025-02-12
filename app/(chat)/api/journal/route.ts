import { Message } from "ai";

import { auth } from "@/app/(auth)/auth";
import { saveChat } from "@/db/queries";

export async function POST(request: Request) {
  const {
    id,
    messages,
    type,
    condition,
  }: { id: string; messages: Array<Message>; type: string; condition: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.user?.id || !session.user?.name) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await saveChat({
      id,
      messages,
      type: type,
      condition: condition,
      userId: session.user.id,
      userName: session.user.name,
    });

    return new Response("Chat saved", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
