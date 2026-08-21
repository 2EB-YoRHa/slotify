export type UsageTone = "safe" | "warning" | "danger" | "unlimited";

export function normalizePlan(value?: string | null): string {
  if (!value) return "starter";

  return value.toLowerCase().replace(/\s+/g, "_");
}

export function formatPlan(value?: string | null): string {
  if (!value) return "Starter";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

export function formatStatus(value?: string | null): string {
  if (!value) return "Not Configured";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatLimit(value?: number | null): string {
  if (value === null || value === undefined) return "Unlimited";

  return String(value);
}

export function formatUsage(
  used?: number | null,
  limit?: number | null,
): string {
  return `${used || 0} / ${formatLimit(limit)}`;
}

export function usagePercentage(
  used?: number | null,
  limit?: number | null,
): number {
  if (limit === null || limit === undefined) return 100;
  if (limit <= 0) return 0;

  return Math.min(100, Math.round(((used || 0) / limit) * 100));
}

export function usageTone(
  used?: number | null,
  limit?: number | null,
): UsageTone {
  if (limit === null || limit === undefined) return "unlimited";

  if (limit <= 0) return "danger";
  if ((used || 0) > limit) return "danger";

  const percentage = usagePercentage(used, limit);

  if (percentage >= 95) return "danger";
  if (percentage >= 75) return "warning";

  return "safe";
}

export function overLimitAmount(
  used?: number | null,
  limit?: number | null,
): number {
  if (limit === null || limit === undefined) return 0;

  return Math.max((used || 0) - limit, 0);
}