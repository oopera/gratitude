export const getModelMapping = (
  cookieModelId: string
): Record<string, string> => {
  return {
    condition_one: "condition_one",
    condition_two: "condition_two",
    condition_three: "condition_three",
    control: "control",
    admin: cookieModelId,
  };
};
