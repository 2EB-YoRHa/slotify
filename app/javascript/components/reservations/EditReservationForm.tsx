import { useForm } from "@inertiajs/react";
import { motion } from "motion/react";
import { useState } from "react";
import type { FormEvent } from "react";
import type { BookingTimeSlot } from "../../types/bookingTimeSlot";
import type { Reservation } from "../../types/reservation";
import type { Workspace } from "../../types/workspace";
import {
  buildDateTime,
  extractDate,
  extractTime,
  violatesMinimumNotice,
  violatesWeekendRule,
} from "../../utils/reservationFormUtils";
import {
  hasActiveCustomTimeSlots,
  reservationTimeSlotsForDate,
} from "../../utils/timeSlots";
import type { TimeSlot } from "../../utils/timeSlots";
import {
  hasValidationErrors,
  validateIntegerRange,
  validateTextLength,
  type ValidationErrors,
} from "../../utils/clientValidation";
import {
  normalizeNumber,
  normalizeString,
} from "../../utils/dirtyForm";
import useUnsavedChangesGuard from "../../hooks/useUnsavedChangesGuard";
import ConfirmDialog from "../ui/ConfirmDialog";
import EditReservationDetailsSection from "./edit/EditReservationDetailsSection";
import EditReservationScheduleSection from "./edit/EditReservationScheduleSection";
import EditReservationSummaryPanel from "./edit/EditReservationSummaryPanel";

type EditReservationFormProps = {
  reservation: Reservation;
  workspaces: Workspace[];
  errors?: Partial<Record<string, string | string[]>>;
  maxReservationHours?: number | null;
  minNoticeMinutes?: number | null;
  allowWeekendBookings?: boolean | null;
  bookingTimeSlots?: BookingTimeSlot[];
  canManageStatus?: boolean;
  initialUnavailableWorkspaceIds?: number[];
};

type EditReservationFormData = {
  workspace_id: number | string;
  start_time: string;
  end_time: string;
  status: string;
  attendees_count: number | string;
  notes: string;
};

const RESERVATION_STATUSES = ["confirmed", "cancelled"];

export default function EditReservationForm({
  reservation,
  workspaces,
  errors: initialErrors = {},
  maxReservationHours = 4,
  minNoticeMinutes = 0,
  allowWeekendBookings = true,
  bookingTimeSlots = [],
  canManageStatus = false,
  initialUnavailableWorkspaceIds = [],
}: EditReservationFormProps) {
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

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

  const initialReservationData: EditReservationFormData = {
    workspace_id: reservation.workspace?.id || "",
    start_time: buildDateTime(initialDate, initialSlot.start),
    end_time: buildDateTime(initialDate, initialSlot.end),
    status: reservation.status || "confirmed",
    attendees_count: reservation.attendees_count || 1,
    notes: reservation.notes || "",
  };

  const {
    data,
    setData,
    patch,
    processing,
    errors: formErrors,
    transform,
  } = useForm<EditReservationFormData>(initialReservationData);

  const selectedDate = extractDate(data.start_time);
  const hasCustomSlots = hasActiveCustomTimeSlots(bookingTimeSlots);

  const availableTimeSlots = reservationTimeSlotsForDate({
    selectedDate,
    maxReservationHours,
    bookingTimeSlots,
  });

  const selectedMatchingSlot = findMatchingSlot(
    data.start_time,
    data.end_time,
    availableTimeSlots,
  );

  const selectedSlot =
    selectedMatchingSlot ||
    buildSlotFromDateTimes(data.start_time, data.end_time);

  const timeSlots = selectedMatchingSlot
    ? availableTimeSlots
    : [selectedSlot, ...availableTimeSlots];

  const noCustomSlotsForSelectedDate =
    hasCustomSlots && availableTimeSlots.length === 0;

  const customTimeSlotViolation =
    hasCustomSlots &&
    availableTimeSlots.length > 0 &&
    !selectedMatchingSlot &&
    data.status === "confirmed";

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === Number(data.workspace_id),
  );

  const attendeesExceedCapacity = Boolean(
    selectedWorkspace &&
      Number(data.attendees_count) > Number(selectedWorkspace.capacity || 0),
  );

  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(true);
  const [unavailableWorkspaceIds, setUnavailableWorkspaceIds] = useState<
    number[]
  >(initialUnavailableWorkspaceIds);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );

  const selectedWorkspaceUnavailable = Boolean(
    selectedWorkspace && unavailableWorkspaceIds.includes(selectedWorkspace.id),
  );

  const minNoticeViolation = violatesMinimumNotice(
    data.start_time,
    minNoticeMinutes,
  );

  const weekendViolation = violatesWeekendRule(
    data.start_time,
    allowWeekendBookings,
  );

  const ruleViolation =
    minNoticeViolation ||
    weekendViolation ||
    noCustomSlotsForSelectedDate ||
    customTimeSlotViolation;

  const canSubmit =
    Boolean(data.workspace_id) &&
    !noCustomSlotsForSelectedDate &&
    !customTimeSlotViolation &&
    availabilityChecked &&
    !checkingAvailability &&
    !availabilityError &&
    !ruleViolation &&
    !selectedWorkspaceUnavailable &&
    !attendeesExceedCapacity;

  const formDirty = editReservationFormChanged(
    data,
    initialReservationData,
  );

  const unsavedChangesGuard = useUnsavedChangesGuard({
    enabled: formDirty && !processing,
    title: "Discard reservation changes?",
    description:
      "You have unsaved changes for this reservation. If you leave now, those changes will be lost.",
    confirmText: "Discard Changes",
    cancelText: "Keep Editing",
  });

  async function checkAvailabilityFor(startTime: string, endTime: string) {
    setCheckingAvailability(true);
    setAvailabilityChecked(false);
    setAvailabilityError(null);

    try {
      const params = new URLSearchParams({
        start_time: startTime,
        end_time: endTime,
        reservation_id: String(reservation.id),
      });

      const response = await fetch(`/reservations/availability?${params}`);

      if (!response.ok) {
        throw new Error("Availability could not be checked.");
      }

      const result = await response.json();

      setUnavailableWorkspaceIds(result.unavailable_workspace_ids || []);
      setAvailabilityChecked(true);
    } catch {
      setAvailabilityError("Could not check availability. Please try again.");
      setAvailabilityChecked(false);
    } finally {
      setCheckingAvailability(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateEditReservationForm(
      data,
      selectedWorkspace,
      selectedWorkspaceUnavailable,
      minNoticeViolation,
      weekendViolation,
      noCustomSlotsForSelectedDate,
      customTimeSlotViolation,
      canManageStatus,
    );

    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;
    if (!canSubmit) return;

    transform((formData) => ({
      reservation: {
        ...formData,
        workspace_id: Number(formData.workspace_id),
        attendees_count: Number(formData.attendees_count),
      },
    }));

    unsavedChangesGuard.allowNextNavigation();

    patch(`/reservations/${reservation.id}`);
  }

  function updateField(
    field: keyof EditReservationFormData,
    value: string | number,
  ) {
    clearClientError(field);

    setData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function handleDateChange(date: string) {
    clearClientError("base");
    clearClientError("start_time");
    clearClientError("end_time");

    const nextTimeSlots = reservationTimeSlotsForDate({
      selectedDate: date,
      maxReservationHours,
      bookingTimeSlots,
    });

    const nextSlot =
      nextTimeSlots.find((slot) => slot.label === selectedSlot.label) ||
      nextTimeSlots[0] ||
      selectedSlot;

    const nextStartTime = buildDateTime(date, nextSlot.start);
    const nextEndTime = buildDateTime(date, nextSlot.end);

    setData({
      ...data,
      start_time: nextStartTime,
      end_time: nextEndTime,
    });

    if (nextTimeSlots.length > 0 || !hasCustomSlots) {
      void checkAvailabilityFor(nextStartTime, nextEndTime);
    } else {
      setAvailabilityChecked(false);
    }
  }

  function handleSlotChange(slotLabel: string) {
    clearClientError("base");
    clearClientError("start_time");
    clearClientError("end_time");

    const slot = timeSlots.find((item) => item.label === slotLabel);

    if (!slot) return;

    const currentDate = extractDate(data.start_time);
    const nextStartTime = buildDateTime(currentDate, slot.start);
    const nextEndTime = buildDateTime(currentDate, slot.end);

    setData({
      ...data,
      start_time: nextStartTime,
      end_time: nextEndTime,
    });

    void checkAvailabilityFor(nextStartTime, nextEndTime);
  }

  function clearClientError(field: string) {
    setClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`reservation.${field}`];

      return nextErrors;
    });
  }

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="grid grid-cols-3 gap-8"
      >
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="col-span-2 space-y-8"
        >
          <EditReservationScheduleSection
            workspaces={workspaces}
            data={data}
            errors={errors}
            processing={processing}
            selectedSlot={selectedSlot}
            timeSlots={timeSlots}
            canManageStatus={canManageStatus}
            hasCustomSlots={hasCustomSlots}
            noCustomSlotsForSelectedDate={noCustomSlotsForSelectedDate}
            customTimeSlotViolation={customTimeSlotViolation}
            onWorkspaceChange={(value) => updateField("workspace_id", value)}
            onStatusChange={(value) => updateField("status", value)}
            onDateChange={handleDateChange}
            onSlotChange={handleSlotChange}
          />

          <EditReservationDetailsSection
            data={data}
            errors={errors}
            processing={processing}
            selectedWorkspace={selectedWorkspace}
            attendeesExceedCapacity={attendeesExceedCapacity}
            onAttendeesChange={(value) =>
              updateField("attendees_count", value)
            }
            onNotesChange={(value) => updateField("notes", value)}
          />
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="space-y-6"
        >
          <EditReservationSummaryPanel
            reservationId={reservation.id}
            selectedWorkspace={selectedWorkspace}
            startTime={data.start_time}
            selectedSlotLabel={selectedSlot.label}
            status={data.status}
            attendeesCount={data.attendees_count}
            ruleViolation={ruleViolation}
            checkingAvailability={checkingAvailability}
            availabilityChecked={availabilityChecked}
            availabilityError={availabilityError}
            selectedWorkspaceUnavailable={selectedWorkspaceUnavailable}
            attendeesExceedCapacity={attendeesExceedCapacity}
            minNoticeViolation={minNoticeViolation}
            minNoticeMinutes={minNoticeMinutes || 0}
            weekendViolation={weekendViolation}
            noCustomSlotsForSelectedDate={noCustomSlotsForSelectedDate}
            customTimeSlotViolation={customTimeSlotViolation}
            processing={processing}
            canSubmit={canSubmit}
            onCancel={() =>
              unsavedChangesGuard.guardedVisit(`/reservations/${reservation.id}`)
            }
          />
        </motion.aside>
      </form>

      <ConfirmDialog
        open={unsavedChangesGuard.confirmOpen}
        title={unsavedChangesGuard.title}
        description={unsavedChangesGuard.description}
        confirmText={unsavedChangesGuard.confirmText}
        cancelText={unsavedChangesGuard.cancelText}
        danger
        onCancel={unsavedChangesGuard.cancelNavigation}
        onConfirm={unsavedChangesGuard.confirmNavigation}
      />
    </>
  );
}

function validateEditReservationForm(
  data: EditReservationFormData,
  selectedWorkspace: Workspace | undefined,
  selectedWorkspaceUnavailable: boolean,
  minNoticeViolation: boolean,
  weekendViolation: boolean,
  noCustomSlotsForSelectedDate: boolean,
  customTimeSlotViolation: boolean,
  canManageStatus: boolean,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.workspace_id) {
    errors.workspace_id = "Select a workspace.";
  }

  if (canManageStatus && !RESERVATION_STATUSES.includes(data.status)) {
    errors.status = "Select a valid reservation status.";
  }

  const attendeesError = validateIntegerRange(
    data.attendees_count,
    "Attendees",
    {
      min: 1,
    },
  );

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

function editReservationFormChanged(
  data: EditReservationFormData,
  initialData: EditReservationFormData,
): boolean {
  return (
    normalizeNumber(data.workspace_id) !==
      normalizeNumber(initialData.workspace_id) ||
    normalizeString(data.start_time) !==
      normalizeString(initialData.start_time) ||
    normalizeString(data.end_time) !== normalizeString(initialData.end_time) ||
    normalizeString(data.status) !== normalizeString(initialData.status) ||
    normalizeNumber(data.attendees_count) !==
      normalizeNumber(initialData.attendees_count) ||
    normalizeString(data.notes) !== normalizeString(initialData.notes)
  );
}

function findMatchingSlot(
  startTime: string,
  endTime: string,
  slots: TimeSlot[],
): TimeSlot | null {
  const start = extractTime(startTime);
  const end = extractTime(endTime);

  return slots.find((slot) => slot.start === start && slot.end === end) || null;
}

function buildSlotFromDateTimes(startTime: string, endTime: string): TimeSlot {
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