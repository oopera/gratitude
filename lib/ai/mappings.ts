export const getModelMapping = (
  cookieModelId: string
): Record<string, string> => {
  return {
    1: "1",
    2: "2",
    control: "control",
    admin: cookieModelId,
  };
};

export const modelMapping: Record<string, string> = {
  1: "Kondition 1",
  2: "Kondition 2",
  control: "Kontrolle",
  admin: "Admin",
};

export const tagMapping: Record<string, string> = {
  1: "Eintrag",
  2: "Eintrag",
  control: "Eintrag",
  admin: "Admin",
};
