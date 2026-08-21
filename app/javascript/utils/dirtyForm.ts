export function normalizeString(value?: string | number | null): string {
  return String(value ?? "").trim();
}

export function normalizeNumber(value?: string | number | null): number {
  const numberValue = Number(value ?? 0);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

export function sameNumberArray(first: number[], second: number[]): boolean {
  const normalizedFirst = [...first].map(Number).sort((a, b) => a - b);
  const normalizedSecond = [...second].map(Number).sort((a, b) => a - b);

  if (normalizedFirst.length !== normalizedSecond.length) return false;

  return normalizedFirst.every(
    (value, index) => value === normalizedSecond[index],
  );
}

export function sameStringArray(first: string[], second: string[]): boolean {
  const normalizedFirst = [...first].map(String).sort();
  const normalizedSecond = [...second].map(String).sort();

  if (normalizedFirst.length !== normalizedSecond.length) return false;

  return normalizedFirst.every(
    (value, index) => value === normalizedSecond[index],
  );
}