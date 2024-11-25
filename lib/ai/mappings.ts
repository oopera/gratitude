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
