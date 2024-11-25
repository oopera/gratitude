// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "condition_one",
    label: "Kondition 1",
    apiIdentifier: "gpt-4o-mini",
    description: "Standard chatGPT mit Dankbarkeitsjournal Prompt.",
  },
  {
    id: "condition_two",
    label: "Kondition 2",
    apiIdentifier: "gpt-4o",
    description:
      "chatGPT mit Dankbarkeitsjournal und Aktivem Konstruktivem Reagieren",
  },
  {
    id: "condition_three",
    label: "Kondition 3",
    apiIdentifier: "gpt-4o-mini",
    description:
      "chatGPT mit Dankbarkeitsjournal, Aktivem Konstruktivem Reagieren und Erinnerung.",
  },
  {
    id: "control",
    label: "Kontrolle",
    apiIdentifier: "no-gpt",
    description: "Manuelles Tagebuch",
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "control";
