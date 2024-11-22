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
    label: "Condition One",
    apiIdentifier: "gpt-4o-mini",
    description: "Modell mit Aktive Konstruktivem Reagieren",
  },
  {
    id: "condition_two",
    label: "Condition Two",
    apiIdentifier: "gpt-4o",
    description: "Modell mit Aktivem Konstruktivem Reagieren und Erinnerung",
  },
  {
    id: "control",
    label: "Control",
    apiIdentifier: "no-gpt",
    description: "Manuelles Tagebuch",
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "control";
