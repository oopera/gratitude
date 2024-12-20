import { Message } from "ai";

import { auth } from "@/app/(auth)/auth";
import { saveChat } from "@/db/queries";

export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedModelId,
  }: { id: string; messages: Array<Message>; selectedModelId: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await saveChat({
      id,
      messages,
      type: selectedModelId,
      userId: session.user.id,
    });

    return new Response("Chat saved", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
