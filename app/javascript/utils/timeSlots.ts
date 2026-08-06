import type { BookingTimeSlot } from "../types/bookingTimeSlot";

export type TimeSlot = {
  label: string;
  start: string;
  end: string;
  durationHours: number;
  source?: "standard" | "custom";
  id?: number;
};

const DEFAULT_OPENING_HOUR = 9;
const DEFAULT_CLOSING_HOUR = 17;
const DEFAULT_MAX_HOURS = 4;

const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function generateTimeSlots(
  maxReservationHours?: number | null,
): TimeSlot[] {
  const maxHours = normalizeMaxHours(maxReservationHours);
  const slots: TimeSlot[] = [];

  for (
    let startHour = DEFAULT_OPENING_HOUR;
    startHour < DEFAULT_CLOSING_HOUR;
    startHour += 1
  ) {
    for (let duration = 1; duration <= maxHours; duration += 1) {
      const endHour = startHour + duration;

      if (endHour > DEFAULT_CLOSING_HOUR) break;

      const start = toTimeValue(startHour);
      const end = toTimeValue(endHour);

      slots.push({
        label: `${formatHour(start)} - ${formatHour(end)}`,
        start,
        end,
        durationHours: duration,
        source: "standard",
      });
    }
  }

  return slots;
}

export function reservationTimeSlotsForDate({
  selectedDate,
  maxReservationHours,
  bookingTimeSlots = [],
}: {
  selectedDate: string;
  maxReservationHours?: number | null;
  bookingTimeSlots?: BookingTimeSlot[];
}): TimeSlot[] {
  const activeCustomSlots = bookingTimeSlots.filter((slot) => slot.active);

  if (activeCustomSlots.length === 0) {
    return generateTimeSlots(maxReservationHours);
  }

  const dayName = dayNameForDate(selectedDate);

  return activeCustomSlots
    .filter((slot) => slot.days_of_week.split(",").includes(dayName))
    .sort((a, b) => a.start_minute - b.start_minute)
    .map((slot) => {
      const start = minuteToTime(slot.start_minute);
      const end = minuteToTime(slot.end_minute);

      return {
        id: slot.id,
        label: `${slot.name} · ${formatHour(start)} - ${formatHour(end)}`,
        start,
        end,
        durationHours: (slot.end_minute - slot.start_minute) / 60,
        source: "custom",
      };
    });
}

export function hasActiveCustomTimeSlots(
  bookingTimeSlots?: BookingTimeSlot[],
): boolean {
  return Boolean(bookingTimeSlots?.some((slot) => slot.active));
}

function normalizeMaxHours(value?: number | null): number {
  const parsed = Number(value || DEFAULT_MAX_HOURS);
  const maxBusinessHours = DEFAULT_CLOSING_HOUR - DEFAULT_OPENING_HOUR;

  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_MAX_HOURS;

  return Math.min(Math.floor(parsed), maxBusinessHours);
}

function toTimeValue(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

function minuteToTime(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}`;
}

function dayNameForDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  return DAY_NAMES[date.getDay()];
}

function formatHour(value: string): string {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = minuteText || "00";
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${period}`;
}