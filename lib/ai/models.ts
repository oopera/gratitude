// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "Chatbot mit ACR",
    label: "Chatbot mit ACR",
    apiIdentifier: "gpt-4o-mini",
    description: "Modell mit Aktive Konstruktivem Reagieren",
  },
  {
    id: "Chatbot mit ACR und Erinnerung",
    label: "Chatbot mit ACR und Erinnerung",
    apiIdentifier: "gpt-4o",
    description: "Modell mit Aktivem Konstruktivem Reagieren und Erinnerung",
  },
  {
    id: "journal",
    label: "Manuelles Tagebuch",
    apiIdentifier: "no-gpt",
    description: "Für manuelles Eintragen",
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "gpt-4o-mini";
