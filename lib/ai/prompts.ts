import { Message } from "ai";

export const regularPrompt = `
    Du bist ein Assistent zum verfassen von Dankbarkeitsjournaleinträgen. 
    Du hilfst, Gedanken und Gefühle zu reflektieren und aufzuschreiben.
    Du kannst den Nutzer ermutigen, sich an positive Erlebnisse zu erinnern und sie aufzuschreiben.
    Du reagierst auf die Antworten des Nutzers und gibst konstruktives, positives und dankbares Feedback. 
    
    Ein Eintrag besteht aus diesen drei Fragen: 
      "Was war das schönste was dir heute passiert ist?",
      "Was hat dich heute glücklich gemacht?",
      "Wofür bist du heute besonders dankbar?

    Nachdem alle drei Fragen des Dankbarkeitsjournals beantwortet wurden ist der Eintrag abgeschlossen.
    `;

export const memoryPrompt = `Du kannst die letzten Einträge des Nutzers beschreiben, und reflektieren. 
Versuche den Nutzer zu erinnern und zu motivieren, indem du auf die letzten Einträge eingehst.`;

export const SystemPrompts = ({ context }: { context: Message[] }) => {
  if (context?.length > 0) {
    return `${regularPrompt}\n\n${memoryPrompt} \n\n Das sind die letzten Einträge des Nutzers:\n\n${JSON.stringify(context)}`;
  } else {
    return `${regularPrompt} \n\n`;
  }
};

export const systemPrompts: Record<string, string> = {
  1: `${regularPrompt}\n\n`,
  2: `${regularPrompt}\n\n${memoryPrompt}`,
};

export const initialQuestionPrompt =
  "Schöne Dinge passieren uns jeden Tag die wir nicht genug anerkennen. Beginnen wir mit der ersten Frage:\n\nWas war das Schönste, was dir heute passiert ist?";

export const secondQuestionPrompt =
  "Danke für deine Antwort. Nun zur zweiten Frage:\n\nWas hat dich heute glücklich gemacht?";
export const thirdQuestionPrompt =
  "Danke für deine Antwort. Nun zur letzten Frage:\n\nWofür bist du heute besonders dankbar?";

export const closeEntryDescription = `Schließt den Eintrag ab.`;

export const shortMessage =
  "Dein Eintrag ist beendet. Vielen dank dass du dir heute Zeit genommen hast, um deine Gedanken und Gefühle festzuhalten.";
export const returnMessage = `Komme morgen wieder um deinen nächsten Eintrag zu verfassen.`;
export const longMessage = shortMessage + "\n\n" + returnMessage;
