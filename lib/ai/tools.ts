import { getChatsByUserId } from "@/db/queries";
import { z } from "zod";

export const recollect = (id: string) => ({
  description:
    "Erinnert sich an die letzten Einträge des Nutzers. Entweder auf Nachfrage, oder wenn der Nutzer den anschein macht er bräuchte Unterstützung.",
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
  description:
    "Beendet den Eintrag nachdem der Nutzer alle Fragen beantwortet hat.",
  parameters: z.object({
    id: z.string(),
  }),
  execute: async () => {
    return "Der Nutzer kann hiernach nicht mehr antworten, weise nicht darauf hin dass die Konversation weitergeführt werden kann.";
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
        completeEntry: completeEntry(),
      };
    case "2":
      return {
        recollect: recollect(id),
        completeEntry: completeEntry(),
      };
    default:
      return {};
  }
};
