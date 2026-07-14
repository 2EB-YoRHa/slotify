type DateTimeValue = string | Date | null | undefined;

export function parseLocalDateTime(value: DateTimeValue): Date | null {
  if (!value) return null;

  return new Date(String(value).replace(/Z$/, ""));
}

export function formatDate(value: DateTimeValue): string {
  const date = parseLocalDateTime(value);
  if (!date) return "-";

  return date.toLocaleDateString([], {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatTime(value: DateTimeValue): string {
  const date = parseLocalDateTime(value);
  if (!date) return "-";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(value: DateTimeValue): string {
  const date = parseLocalDateTime(value);
  if (!date) return "-";

  return date.toLocaleString([], {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function duration(
  startValue: DateTimeValue,
  endValue: DateTimeValue
): string {
  const start = parseLocalDateTime(startValue);
  const end = parseLocalDateTime(endValue);

  if (!start || !end) return "-";

  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) {
    return `${Math.round(diffHours * 60)} min`;
  }

  if (Number.isInteger(diffHours)) {
    return `${diffHours}h 00m`;
  }

  const hours = Math.floor(diffHours);
  const minutes = Math.round((diffHours - hours) * 60);

  return `${hours}h ${minutes}m`;
}