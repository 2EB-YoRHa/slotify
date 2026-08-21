import { useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import type {
  EditReservationFormData,
  EditReservationFormProps,
} from "../types/editReservation";
import {
  hasValidationErrors,
  type ValidationErrors,
} from "../utils/clientValidation";
import {
  buildDateTime,
  extractDate,
  violatesMinimumNotice,
  violatesWeekendRule,
} from "../utils/reservationFormUtils";
import {
  hasActiveCustomTimeSlots,
  reservationTimeSlotsForDate,
} from "../utils/timeSlots";
import {
  buildInitialEditReservationState,
  buildSlotFromDateTimes,
  editReservationFormChanged,
  findMatchingSlot,
  validateEditReservationForm,
} from "../utils/editReservationForm";
import useUnsavedChangesGuard from "./useUnsavedChangesGuard";

export default function useEditReservationForm({
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
  const [initialState] = useState(() =>
    buildInitialEditReservationState({
      reservation,
      maxReservationHours,
      bookingTimeSlots,
    }),
  );

  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(true);
  const [unavailableWorkspaceIds, setUnavailableWorkspaceIds] = useState<
    number[]
  >(initialUnavailableWorkspaceIds);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );

  const {
    data,
    setData,
    patch,
    processing,
    errors: formErrors,
    transform,
  } = useForm<EditReservationFormData>(
    initialState.initialReservationData,
  );

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
    initialState.initialReservationData,
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

    const validationErrors = validateEditReservationForm({
      data,
      selectedWorkspace,
      selectedWorkspaceUnavailable,
      minNoticeViolation,
      weekendViolation,
      noCustomSlotsForSelectedDate,
      customTimeSlotViolation,
      canManageStatus,
    });

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

  return {
    data,
    errors,
    processing,
    selectedWorkspace,
    selectedSlot,
    timeSlots,
    canManageStatus,
    hasCustomSlots,
    noCustomSlotsForSelectedDate,
    customTimeSlotViolation,
    attendeesExceedCapacity,
    ruleViolation,
    checkingAvailability,
    availabilityChecked,
    availabilityError,
    selectedWorkspaceUnavailable,
    minNoticeViolation,
    weekendViolation,
    canSubmit,
    minNoticeMinutes,
    unsavedChangesGuard,
    handleSubmit,
    handleDateChange,
    handleSlotChange,
    updateField,
  };
}