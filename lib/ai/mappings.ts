export const getModelMapping = (
  cookieModelId: string
): Record<string, string> => {
  return {
    1: "1",
    2: "2",
    3: "3",
    control: "control",
    admin: cookieModelId,
  };
};

export const modelMapping: Record<string, string> = {
  1: "Kondition 1",
  2: "Kondition 2",
  3: "Kondition 3",
  control: "Kontrolle",
  admin: "Admin",
};

export const tagMapping: Record<string, string> = {
  1: "Chat",
  2: "Chat",
  3: "Chat",
  control: "Journal",
  admin: "Admin",
};
