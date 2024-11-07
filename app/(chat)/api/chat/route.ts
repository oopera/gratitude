import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";

import { customModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import {
  deleteChatById,
  getChatById,
  getChatsByUserId,
  saveChat,
} from "@/db/queries";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();
  console.log(session, "session");
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user?.id;

  const coreMessages = convertToCoreMessages(messages);

  const result = await streamText({
    model: customModel,
    system:
      "Du bist ein Assistent zum verfassen von Dankbarkeitsjournaleinträgen. Du hilfst, Gedanken und Gefühle zu reflektieren und aufzuschreiben. Du kennst explizite Fragen und Anregungen, um den Nutzer zu unterstützen. Ein dankbarkeitstagebucheintrag ist automatisch beendet nach dem 3 Fragen beantwortet wurden. Du kannst auch die letzten Einträge des Nutzers beschreiben, und reflektieren.",
    messages: coreMessages,
    maxSteps: 5,
    tools: {
      startNewEntry: {
        description: "Startet einen neuen Eintrag",
        parameters: z.object({
          id: z.string(),
        }),
        execute: async () => {
          return [
            "[Systemnachricht: Der ChatBot wählt zufällig eine der folgenenden Fragen aus, um den Eintrag zu beginnen.]",
            "Was war das schönste was dir heute passiert ist?",
            "Was hat dich heute glücklich gemacht?",
            "Wofür bist du heute besonders dankbar?",
          ];
        },
      },
      recollect: {
        description:
          "Erinnert sich an die letzten Einträge des Nutzers. Entweder auf Nachfrage, oder wenn der Nutzer den anschein macht, dass er sich nicht mehr erinnert.",
        parameters: z.object({
          id: z.string(),
        }),
        execute: async () => {
          const chats = await getChatsByUserId({ id: userId });

          const recollection = chats.map((chat, index) => {
            return {
              index: index + 1,
              messages: chat.messages,
            };
          });

          console.log(recollection);

          return recollection;
        },
      },
    },
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
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

  console.log(result.toDataStreamResponse({}));

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
