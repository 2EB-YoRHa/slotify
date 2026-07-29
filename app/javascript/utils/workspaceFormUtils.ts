export const workspaceTypes = [
  { value: "meeting_room", label: "Meeting Room" },
  { value: "private_office", label: "Private Office" },
  { value: "open_desk", label: "Open Desk" },
  { value: "training_room", label: "Training Room" },
  { value: "phone_booth", label: "Phone Booth" },
];

export function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`workspace.${field}`];
}

export function getBaseError(
  errors: Record<string, string | string[] | undefined>,
): string | null {
  const error = errors.base || errors["workspace.base"];

  if (!error) return null;

  return Array.isArray(error) ? error.join(", ") : error;
}

export function formatMoney(value: string | number | null | undefined): string {
  return `$${Number(value || 0).toFixed(2)}`;
}