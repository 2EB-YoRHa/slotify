import type { BookingTimeSlot } from "../types/bookingTimeSlot";
import type { ReservationFormData } from "../types/newReservation";
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
  findSlotByDateTimes,
  localDateValue,
  normalizeError,
} from "./reservationFormUtils";
import type { TimeSlot } from "./timeSlots";
import { reservationTimeSlotsForDate } from "./timeSlots";

export type InitialReservationState = {
  today: string;
  defaultDate: string;
  defaultSlot: TimeSlot;
  initialReservationData: ReservationFormData;
  validSelectedWorkspaceId: number | string;
};

export function buildInitialReservationState({
  workspaces,
  selectedWorkspaceId,
  initialStartTime,
  initialEndTime,
  maxReservationHours,
  bookingTimeSlots,
}: {
  workspaces: Workspace[];
  selectedWorkspaceId?: number | string | null;
  initialStartTime?: string | null;
  initialEndTime?: string | null;
  maxReservationHours?: number | null;
  bookingTimeSlots?: BookingTimeSlot[];
}): InitialReservationState {
  const today = localDateValue();
  const initialDate = initialStartTime ? extractDate(initialStartTime) : today;

  const initialTimeSlots = reservationTimeSlotsForDate({
    selectedDate: initialDate,
    maxReservationHours,
    bookingTimeSlots,
  });

  const fallbackSlot = initialTimeSlots[0] || emptyTimeSlot();

  const defaultStartTime =
    initialStartTime || buildDateTime(today, fallbackSlot.start);

  const defaultEndTime = initialEndTime || buildDateTime(today, fallbackSlot.end);
  const defaultDate = extractDate(defaultStartTime);

  const defaultSlot = findSlotByDateTimes(
    defaultStartTime,
    defaultEndTime,
    initialTimeSlots,
  );

  const validSelectedWorkspaceId = workspaces.some(
    (workspace) => workspace.id === Number(selectedWorkspaceId),
  )
    ? selectedWorkspaceId || ""
    : "";

  return {
    today,
    defaultDate,
    defaultSlot,
    validSelectedWorkspaceId,
    initialReservationData: {
      reservation: {
        workspace_id: validSelectedWorkspaceId,
        start_time: defaultStartTime,
        end_time: defaultEndTime,
        attendees_count: 1,
        notes: "",
      },
    },
  };
}

export function buildReservationBaseErrors({
  errors,
  noCustomSlotsForSelectedDate,
}: {
  errors: Record<string, string | string[] | undefined>;
  noCustomSlotsForSelectedDate: boolean;
}): string[] {
  const baseErrors = [
    ...normalizeError(errors.base),
    ...normalizeError(errors.reservation),
    ...normalizeError(errors["reservation.base"]),
  ];

  if (noCustomSlotsForSelectedDate) {
    baseErrors.push(
      "There are no active custom time slots available for the selected date.",
    );
  }

  return baseErrors;
}

export function validateNewReservationForm({
  data,
  selectedWorkspace,
  selectedWorkspaceUnavailable,
  minNoticeViolation,
  weekendViolation,
  noCustomSlotsForSelectedDate,
}: {
  data: ReservationFormData;
  selectedWorkspace?: Workspace;
  selectedWorkspaceUnavailable: boolean;
  minNoticeViolation: boolean;
  weekendViolation: boolean;
  noCustomSlotsForSelectedDate: boolean;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.reservation.workspace_id) {
    errors.base = "Select a workspace before creating the reservation.";
  }

  const attendeesError = validateIntegerRange(
    data.reservation.attendees_count,
    "Attendees",
    { min: 1 },
  );

  if (attendeesError) {
    errors.attendees_count = attendeesError;
  }

  if (
    selectedWorkspace &&
    Number(data.reservation.attendees_count) > selectedWorkspace.capacity
  ) {
    errors.attendees_count = "Attendees cannot exceed workspace capacity.";
  }

  const notesError = validateTextLength(data.reservation.notes, "Notes", {
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

  return errors;
}

export function filterWorkspaces(workspaces: Workspace[], search: string) {
  const query = search.trim().toLowerCase();

  return workspaces.filter((workspace) => {
    if (query.length === 0) return true;

    const searchableText = [
      workspace.name,
      workspace.workspace_type,
      workspace.location,
      workspace.floor,
      workspace.zone,
      workspace.description,
      ...(workspace.amenities || []).map((amenity) => amenity.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });
}

export function newReservationFormChanged(
  data: ReservationFormData,
  initialData: ReservationFormData,
): boolean {
  return (
    normalizeNumber(data.reservation.workspace_id) !==
      normalizeNumber(initialData.reservation.workspace_id) ||
    normalizeString(data.reservation.start_time) !==
      normalizeString(initialData.reservation.start_time) ||
    normalizeString(data.reservation.end_time) !==
      normalizeString(initialData.reservation.end_time) ||
    normalizeNumber(data.reservation.attendees_count) !==
      normalizeNumber(initialData.reservation.attendees_count) ||
    normalizeString(data.reservation.notes) !==
      normalizeString(initialData.reservation.notes)
  );
}

function emptyTimeSlot(): TimeSlot {
  return {
    label: "No time slot available",
    start: "00:00",
    end: "00:00",
    durationHours: 0,
    source: "custom",
  };
}