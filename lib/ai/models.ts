// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "1",
    label: "Kondition 1",
    apiIdentifier: "gpt-4o",
    description: "Standard chatGPT mit Dankbarkeitsjournal Prompt.",
  },
  {
    id: "2",
    label: "Kondition 2",
    apiIdentifier: "gpt-4o",
    description: "chatGPT mit Dankbarkeitsjournal und Erinnerung.",
  },
  {
    id: "control",
    label: "Kontrolle",
    apiIdentifier: "no-gpt",
    description: "Manuelles Tagebuch",
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "control";
