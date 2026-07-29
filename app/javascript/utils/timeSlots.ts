export type TimeSlot = {
  label: string;
  start: string;
  end: string;
  durationHours: number;
};

const DEFAULT_OPENING_HOUR = 9;
const DEFAULT_CLOSING_HOUR = 17;
const DEFAULT_MAX_HOURS = 4;

export function generateTimeSlots(maxReservationHours?: number | null): TimeSlot[] {
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
      });
    }
  }

  return slots;
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

function formatHour(value: string): string {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = minuteText || "00";
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${period}`;
}