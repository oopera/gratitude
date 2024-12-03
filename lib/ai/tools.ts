import { getChatsByUserId } from "@/db/queries";
import { z } from "zod";

export const recollect = (id: string) => ({
  description:
    "Erinnert sich an die letzten Einträge des Nutzers. Entweder auf Nachfrage, oder wenn der Nutzer den anschein macht, dass er sich nicht mehr erinnert.",
  parameters: z.object({
    id: z.string(),
  }),
  execute: async () => {
    const chats = await getChatsByUserId({ id });

    const recollection = chats.map((chat, index) => {
      return {
        index: index + 1,
        messages: chat.messages,
      };
    });

    return recollection;
  },
});

export const completeEntry = () => ({
  description: "Wenn du fertig bist, beende den Eintrag.",
  parameters: z.object({
    id: z.string(),
  }),
  execute: async () => {
    return true;
  },
});

export const SystemTools = ({
  selectedModelId,
  id,
}: {
  selectedModelId: string;
  id: string;
}) => {
  switch (selectedModelId) {
    case "1":
      return {
        // startNewEntry,
        completeEntry: completeEntry(),
      };
    case "2":
      return {
        // startNewEntry,
        recollect: recollect(id),
        completeEntry: completeEntry(),
      };
    default:
      return {};
  }
};
