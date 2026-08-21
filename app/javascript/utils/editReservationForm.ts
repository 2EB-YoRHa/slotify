import type { BookingTimeSlot } from "../types/bookingTimeSlot";
import type {
  EditReservationFormData,
} from "../types/editReservation";
import type { Reservation } from "../types/reservation";
import type { Workspace } from "../types/workspace";
import {
  validateIntegerRange,
  validateTextLength,
  type ValidationErrors,
} from "./clientValidation";
import { normalizeNumber, normalizeString } from "./dirtyForm";
import {
  buildDateTime,
  extractDate,
  extractTime,
} from "./reservationFormUtils";
import type { TimeSlot } from "./timeSlots";
import { reservationTimeSlotsForDate } from "./timeSlots";

const RESERVATION_STATUSES = ["confirmed", "cancelled"];

export type InitialEditReservationState = {
  initialDate: string;
  initialSlot: TimeSlot;
  initialReservationData: EditReservationFormData;
};

export function buildInitialEditReservationState({
  reservation,
  maxReservationHours,
  bookingTimeSlots,
}: {
  reservation: Reservation;
  maxReservationHours?: number | null;
  bookingTimeSlots?: BookingTimeSlot[];
}): InitialEditReservationState {
  const initialDate = extractDate(reservation.start_time);

  const initialTimeSlots = reservationTimeSlotsForDate({
    selectedDate: initialDate,
    maxReservationHours,
    bookingTimeSlots,
  });

  const initialSlot =
    findMatchingSlot(
      reservation.start_time,
      reservation.end_time,
      initialTimeSlots,
    ) || buildSlotFromDateTimes(reservation.start_time, reservation.end_time);

  return {
    initialDate,
    initialSlot,
    initialReservationData: {
      workspace_id: reservation.workspace?.id || "",
      start_time: buildDateTime(initialDate, initialSlot.start),
      end_time: buildDateTime(initialDate, initialSlot.end),
      status: reservation.status || "confirmed",
      attendees_count: reservation.attendees_count || 1,
      notes: reservation.notes || "",
    },
  };
}

export function validateEditReservationForm({
  data,
  selectedWorkspace,
  selectedWorkspaceUnavailable,
  minNoticeViolation,
  weekendViolation,
  noCustomSlotsForSelectedDate,
  customTimeSlotViolation,
  canManageStatus,
}: {
  data: EditReservationFormData;
  selectedWorkspace?: Workspace;
  selectedWorkspaceUnavailable: boolean;
  minNoticeViolation: boolean;
  weekendViolation: boolean;
  noCustomSlotsForSelectedDate: boolean;
  customTimeSlotViolation: boolean;
  canManageStatus: boolean;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.workspace_id) {
    errors.workspace_id = "Select a workspace.";
  }

  if (canManageStatus && !RESERVATION_STATUSES.includes(data.status)) {
    errors.status = "Select a valid reservation status.";
  }

  const attendeesError = validateIntegerRange(data.attendees_count, "Attendees", {
    min: 1,
  });

  if (attendeesError) {
    errors.attendees_count = attendeesError;
  }

  if (
    selectedWorkspace &&
    Number(data.attendees_count) > Number(selectedWorkspace.capacity || 0)
  ) {
    errors.attendees_count = "Attendees cannot exceed workspace capacity.";
  }

  const notesError = validateTextLength(data.notes, "Notes", {
    max: 500,
    required: false,
  });

  if (notesError) {
    errors.notes = notesError;
  }

  if (selectedWorkspaceUnavailable) {
    errors.base = "The selected workspace is unavailable for this time slot.";
  }

  if (minNoticeViolation) {
    errors.base =
      "This reservation does not meet the minimum notice requirement.";
  }

  if (weekendViolation) {
    errors.base = "Weekend bookings are blocked for this organization.";
  }

  if (noCustomSlotsForSelectedDate) {
    errors.base =
      "There are no active custom time slots available for the selected date.";
  }

  if (customTimeSlotViolation) {
    errors.base =
      "This reservation must use one of the organization's active custom time slots.";
  }

  return errors;
}

export function editReservationFormChanged(
  data: EditReservationFormData,
  initialData: EditReservationFormData,
): boolean {
  return (
    normalizeNumber(data.workspace_id) !==
      normalizeNumber(initialData.workspace_id) ||
    normalizeString(data.start_time) !== normalizeString(initialData.start_time) ||
    normalizeString(data.end_time) !== normalizeString(initialData.end_time) ||
    normalizeString(data.status) !== normalizeString(initialData.status) ||
    normalizeNumber(data.attendees_count) !==
      normalizeNumber(initialData.attendees_count) ||
    normalizeString(data.notes) !== normalizeString(initialData.notes)
  );
}

export function findMatchingSlot(
  startTime: string,
  endTime: string,
  slots: TimeSlot[],
): TimeSlot | null {
  const start = extractTime(startTime);
  const end = extractTime(endTime);

  return slots.find((slot) => slot.start === start && slot.end === end) || null;
}

export function buildSlotFromDateTimes(
  startTime: string,
  endTime: string,
): TimeSlot {
  const start = extractTime(startTime);
  const end = extractTime(endTime);

  return {
    label: `Current · ${start} - ${end}`,
    start,
    end,
    durationHours: durationHoursBetween(startTime, endTime),
    source: "standard",
  };
}

function durationHoursBetween(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;

  return Math.max(0, (end - start) / 3600000);
}