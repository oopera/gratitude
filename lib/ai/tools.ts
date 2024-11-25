import { getChatsByUserId } from "@/db/queries";
import { z } from "zod";

const startNewEntry = {
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
};

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
  description: "Beendet den Eintrag",
  parameters: z.object({
    id: z.string(),
  }),
});

export const SystemTools = (selectedModelId: string, id: string) => {
  switch (selectedModelId) {
    case "condition_one":
      return {
        startNewEntry,
        completeEntry: completeEntry(),
      };
    case "condition_two":
      return {
        startNewEntry,
        completeEntry: completeEntry(),
      };
    case "condition_three":
      return {
        startNewEntry,
        recollect: recollect(id),
        completeEntry: completeEntry(),
      };
    default:
      return {};
  }
};
