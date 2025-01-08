import { convertToCoreMessages, CoreTool, Message, streamText } from "ai";

import { customModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import { deleteChatById, getChatById, saveChat } from "@/db/queries";
import { SystemPrompts } from "@/lib/ai/prompts";
import { SystemTools } from "@/lib/ai/tools";
export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedModelId,
    condition,
  }: {
    id: string;
    messages: Array<Message>;
    selectedModelId: string;
    condition: string;
  } = await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const result = await streamText({
    model: customModel,
    system: SystemPrompts[selectedModelId],
    messages: coreMessages,
    temperature: 0.15,
    maxSteps: 5,
    tools: SystemTools({ selectedModelId, id: session.user.id }) as Record<
      string,
      CoreTool<any, any>
    >,
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id && session.user.name) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            type: selectedModelId,
            userId: session.user.id,
            userName: session.user.name,
          });
        } catch (error) {
          console.error("Failed to save chat");
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
