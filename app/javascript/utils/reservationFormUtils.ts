import type { TimeSlot } from "./timeSlots";

export function extractDate(value: string): string {
  return value.split("T")[0];
}

export function extractTime(value: string): string {
  const timePart = value.split("T")[1] || "";

  return timePart.slice(0, 5);
}

export function buildDateTime(date: string, time: string): string {
  return `${date}T${time}`;
}

export function localDateValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function findSlotByDateTimes(
  startTime: string,
  endTime: string,
  slots: TimeSlot[],
): TimeSlot {
  const start = extractTime(startTime);
  const end = extractTime(endTime);

  return (
    slots.find((slot) => slot.start === start && slot.end === end) || slots[0]
  );
}

export function calculateEstimatedTotal(
  hourlyRate: number,
  startTime: string,
  endTime: string,
): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const hours = Math.max(0, (end - start) / 3600000);

  return hourlyRate * hours;
}

export function violatesMinimumNotice(
  startTime: string,
  minNoticeMinutes?: number | null,
): boolean {
  const notice = Number(minNoticeMinutes || 0);

  if (!notice) return false;

  const start = new Date(startTime).getTime();
  const minimumStart = Date.now() + notice * 60000;

  return Number.isFinite(start) && start < minimumStart;
}

export function violatesWeekendRule(
  startTime: string,
  allowWeekendBookings?: boolean | null,
): boolean {
  if (allowWeekendBookings !== false) return false;

  const date = new Date(startTime);
  const day = date.getDay();

  return day === 0 || day === 6;
}

export function normalizeError(error?: string | string[]): string[] {
  if (!error) return [];

  return Array.isArray(error) ? error : [error];
}

export function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}