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
  if (!limit) return 100;

  return Math.min(100, Math.round(((used || 0) / limit) * 100));
}

export function usageTone(
  used?: number | null,
  limit?: number | null,
): UsageTone {
  if (!limit) return "unlimited";

  const percentage = usagePercentage(used, limit);

  if (percentage >= 95) return "danger";
  if (percentage >= 75) return "warning";

  return "safe";
}