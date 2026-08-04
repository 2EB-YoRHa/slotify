import { useForm } from "@inertiajs/react";
import { motion } from "motion/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { generateTimeSlots } from "../../utils/timeSlots";
import {
  buildDateTime,
  extractDate,
  findSlotByDateTimes,
  violatesMinimumNotice,
  violatesWeekendRule,
} from "../../utils/reservationFormUtils";
import {
  hasValidationErrors,
  validateIntegerRange,
  validateTextLength,
  type ValidationErrors,
} from "../../utils/clientValidation";
import type { Reservation } from "../../types/reservation";
import type { Workspace } from "../../types/workspace";
import EditReservationScheduleSection from "./edit/EditReservationScheduleSection";
import EditReservationDetailsSection from "./edit/EditReservationDetailsSection";
import EditReservationSummaryPanel from "./edit/EditReservationSummaryPanel";

type EditReservationFormProps = {
  reservation: Reservation;
  workspaces: Workspace[];
  errors?: Partial<Record<string, string | string[]>>;
  maxReservationHours?: number | null;
  minNoticeMinutes?: number | null;
  allowWeekendBookings?: boolean | null;
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
  canManageStatus = false,
  initialUnavailableWorkspaceIds = [],
}: EditReservationFormProps) {
  const timeSlots = generateTimeSlots(maxReservationHours);
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const initialDate = extractDate(reservation.start_time);
  const initialSlot = findSlotByDateTimes(
    reservation.start_time,
    reservation.end_time,
    timeSlots,
  );

  const {
    data,
    setData,
    patch,
    processing,
    errors: formErrors,
    transform,
  } = useForm<EditReservationFormData>({
    workspace_id: reservation.workspace?.id || "",
    start_time: buildDateTime(initialDate, initialSlot.start),
    end_time: buildDateTime(initialDate, initialSlot.end),
    status: reservation.status || "confirmed",
    attendees_count: reservation.attendees_count || 1,
    notes: reservation.notes || "",
  });

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

  const selectedSlot = findSlotByDateTimes(
    data.start_time,
    data.end_time,
    timeSlots,
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

  const ruleViolation = minNoticeViolation || weekendViolation;

  const canSubmit =
    Boolean(data.workspace_id) &&
    availabilityChecked &&
    !checkingAvailability &&
    !availabilityError &&
    !ruleViolation &&
    !selectedWorkspaceUnavailable &&
    !attendeesExceedCapacity;

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
    clearClientError("start_time");
    clearClientError("end_time");

    const currentSlot = findSlotByDateTimes(
      data.start_time,
      data.end_time,
      timeSlots,
    );

    const nextStartTime = buildDateTime(date, currentSlot.start);
    const nextEndTime = buildDateTime(date, currentSlot.end);

    setData({
      ...data,
      start_time: nextStartTime,
      end_time: nextEndTime,
    });

    void checkAvailabilityFor(nextStartTime, nextEndTime);
  }

  function handleSlotChange(slotLabel: string) {
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
    <form noValidate onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">
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
          onAttendeesChange={(value) => updateField("attendees_count", value)}
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
          processing={processing}
          canSubmit={canSubmit}
        />
      </motion.aside>
    </form>
  );
}

function validateEditReservationForm(
  data: EditReservationFormData,
  selectedWorkspace: Workspace | undefined,
  selectedWorkspaceUnavailable: boolean,
  minNoticeViolation: boolean,
  weekendViolation: boolean,
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

  return errors;
}