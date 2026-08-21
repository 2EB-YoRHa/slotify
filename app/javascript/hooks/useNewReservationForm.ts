import { useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import type {
  NewReservationFormProps,
  ReservationFormData,
} from "../types/newReservation";
import {
  hasValidationErrors,
  type ValidationErrors,
} from "../utils/clientValidation";
import {
  buildDateTime,
  calculateEstimatedTotal,
  violatesMinimumNotice,
  violatesWeekendRule,
} from "../utils/reservationFormUtils";
import type { TimeSlot } from "../utils/timeSlots";
import {
  hasActiveCustomTimeSlots,
  reservationTimeSlotsForDate,
} from "../utils/timeSlots";
import {
  buildInitialReservationState,
  buildReservationBaseErrors,
  filterWorkspaces,
  newReservationFormChanged,
  validateNewReservationForm,
} from "../utils/newReservationForm";
import useUnsavedChangesGuard from "./useUnsavedChangesGuard";

export default function useNewReservationForm({
  workspaces,
  selectedWorkspaceId = null,
  initialStartTime = null,
  initialEndTime = null,
  initialUnavailableWorkspaceIds = [],
  initialErrors = {},
  maxReservationHours = 4,
  minNoticeMinutes = 0,
  allowWeekendBookings = true,
  bookingTimeSlots = [],
}: NewReservationFormProps) {
  const [initialState] = useState(() =>
    buildInitialReservationState({
      workspaces,
      selectedWorkspaceId,
      initialStartTime,
      initialEndTime,
      maxReservationHours,
      bookingTimeSlots,
    }),
  );

  const [selectedDate, setSelectedDate] = useState(initialState.defaultDate);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>(
    initialState.defaultSlot,
  );
  const [search, setSearch] = useState("");
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(true);
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});
  const [showWorkspacePicker, setShowWorkspacePicker] = useState(
    !initialState.validSelectedWorkspaceId,
  );
  const [unavailableWorkspaceIds, setUnavailableWorkspaceIds] = useState<
    number[]
  >(initialUnavailableWorkspaceIds);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );

  const { data, setData, post, processing, errors } =
    useForm<ReservationFormData>(initialState.initialReservationData);

  const hasCustomSlots = hasActiveCustomTimeSlots(bookingTimeSlots);

  const timeSlots = reservationTimeSlotsForDate({
    selectedDate,
    maxReservationHours,
    bookingTimeSlots,
  });

  const noCustomSlotsForSelectedDate = hasCustomSlots && timeSlots.length === 0;

  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === Number(data.reservation.workspace_id),
  );

  const allErrors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...(errors as Record<string, string | string[] | undefined>),
    ...clientErrors,
  };

  const baseErrors = buildReservationBaseErrors({
    errors: allErrors,
    noCustomSlotsForSelectedDate,
  });

  const minNoticeViolation = violatesMinimumNotice(
    data.reservation.start_time,
    minNoticeMinutes,
  );

  const weekendViolation = violatesWeekendRule(
    data.reservation.start_time,
    allowWeekendBookings,
  );

  const ruleViolation = minNoticeViolation || weekendViolation;
  const filteredWorkspaces = filterWorkspaces(workspaces, search);

  const selectedWorkspaceUnavailable = Boolean(
    selectedWorkspace && unavailableWorkspaceIds.includes(selectedWorkspace.id),
  );

  const attendeesExceedCapacity = Boolean(
    selectedWorkspace &&
      Number(data.reservation.attendees_count) > selectedWorkspace.capacity,
  );

  const estimatedTotal = selectedWorkspace
    ? calculateEstimatedTotal(
        Number(selectedWorkspace.hourly_rate || 0),
        data.reservation.start_time,
        data.reservation.end_time,
      )
    : 0;

  const canSubmit =
    Boolean(data.reservation.workspace_id) &&
    !noCustomSlotsForSelectedDate &&
    availabilityChecked &&
    !availabilityError &&
    !ruleViolation &&
    !selectedWorkspaceUnavailable &&
    !attendeesExceedCapacity;

  const formDirty = newReservationFormChanged(
    data,
    initialState.initialReservationData,
  );

  const cancelHref = selectedWorkspace
    ? `/workspaces/${selectedWorkspace.id}`
    : "/reservations";

  const unsavedChangesGuard = useUnsavedChangesGuard({
    enabled: formDirty && !processing,
    title: "Discard new reservation?",
    description:
      "You have started creating a reservation. If you leave now, the selected workspace, schedule, attendees, and notes will be lost.",
    confirmText: "Discard Reservation",
    cancelText: "Keep Editing",
  });

  function handleDateChange(date: string) {
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

    setSelectedDate(date);
    setSelectedSlot(nextSlot);

    updateReservation({
      start_time: nextStartTime,
      end_time: nextEndTime,
    });

    if (nextTimeSlots.length > 0) {
      void checkAvailabilityFor(nextStartTime, nextEndTime);
    } else {
      setAvailabilityChecked(false);
    }
  }

  function handleSlotChange(slotLabel: string) {
    const slot = timeSlots.find((item) => item.label === slotLabel);

    if (!slot) return;

    const nextStartTime = buildDateTime(selectedDate, slot.start);
    const nextEndTime = buildDateTime(selectedDate, slot.end);

    setSelectedSlot(slot);

    updateReservation({
      start_time: nextStartTime,
      end_time: nextEndTime,
    });

    void checkAvailabilityFor(nextStartTime, nextEndTime);
  }

  function selectWorkspace(workspaceId: number) {
    clearClientError("workspace_id");
    clearClientError("base");

    updateReservation({ workspace_id: workspaceId });

    setShowWorkspacePicker(false);
    setSearch("");

    if (!availabilityChecked && !checkingAvailability) {
      void checkAvailabilityFor(
        data.reservation.start_time,
        data.reservation.end_time,
      );
    }
  }

  function updateReservation(
    values: Partial<ReservationFormData["reservation"]>,
  ) {
    Object.keys(values).forEach((field) => clearClientError(field));

    setData("reservation", {
      ...data.reservation,
      ...values,
    });
  }

  async function checkAvailability() {
    await checkAvailabilityFor(
      data.reservation.start_time,
      data.reservation.end_time,
    );
  }

  async function checkAvailabilityFor(startTime: string, endTime: string) {
    setCheckingAvailability(true);
    setAvailabilityChecked(false);
    setAvailabilityError(null);

    try {
      const params = new URLSearchParams({
        start_time: startTime,
        end_time: endTime,
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

    const validationErrors = validateNewReservationForm({
      data,
      selectedWorkspace,
      selectedWorkspaceUnavailable,
      minNoticeViolation,
      weekendViolation,
      noCustomSlotsForSelectedDate,
    });

    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;
    if (!canSubmit) return;

    unsavedChangesGuard.allowNextNavigation();

    post("/reservations");
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
    selectedDate,
    selectedSlot,
    search,
    checkingAvailability,
    availabilityChecked,
    availabilityError,
    unavailableWorkspaceIds,
    showWorkspacePicker,
    timeSlots,
    selectedWorkspace,
    allErrors,
    baseErrors,
    minNoticeViolation,
    weekendViolation,
    ruleViolation,
    filteredWorkspaces,
    selectedWorkspaceUnavailable,
    attendeesExceedCapacity,
    estimatedTotal,
    canSubmit,
    today: initialState.today,
    processing,
    unsavedChangesGuard,
    cancelHref,
    handleSubmit,
    handleDateChange,
    handleSlotChange,
    setSearch,
    checkAvailability,
    selectWorkspace,
    updateReservation,
    toggleWorkspacePicker: () => setShowWorkspacePicker((value) => !value),
  };
}