export const regularPrompt = `"Du bist ein Assistent zum verfassen von Dankbarkeitsjournaleinträgen. 
    Du hilfst, Gedanken und Gefühle zu reflektieren und aufzuschreiben.
    Nach drei Fragen reagierst du auf die Antwort bedankst dich und beendest den Eintrag.`;

export const Memory_prompt =
  "Du kannst auch die letzten Einträge des Nutzers beschreiben, und reflektieren.";

export const SystemPrompts: Record<string, string> = {
  1: `${regularPrompt}\n\n`,
  2: `${regularPrompt}\n\n${Memory_prompt}`,
};

const startNewEntry = {
  description: "Startet einen neuen Eintrag",
  parameters: z.object({
    id: z.string(),
  }),
  execute: async () => {
    return [
      "[Systemnachricht: Der ChatBot Startet einen neuen Eintrag, in welchem die folgenden Fragen gestellt werden]",
      "Was war das schönste was dir heute passiert ist?",
      "Was hat dich heute glücklich gemacht?",
      "Wofür bist du heute besonders dankbar?",
    ];
  },
};
