import { useForm } from "@inertiajs/react";
import { motion } from "motion/react";
import type { FormEvent } from "react";
import { useState } from "react";
import {
  hasActiveCustomTimeSlots,
  reservationTimeSlotsForDate,
} from "../../utils/timeSlots";
import type { TimeSlot } from "../../utils/timeSlots";
import type { Workspace } from "../../types/workspace";
import AvailableWorkspaceGrid from "./new/AvailableWorkspaceGrid";
import ReservationDateTimeSection from "./new/ReservationDateTimeSection";
import ReservationSummaryPanel from "./new/ReservationSummaryPanel";
import type { BookingTimeSlot } from "../../types/bookingTimeSlot";
import {
  buildDateTime,
  calculateEstimatedTotal,
  extractDate,
  findSlotByDateTimes,
  localDateValue,
  normalizeError,
  violatesMinimumNotice,
  violatesWeekendRule,
} from "../../utils/reservationFormUtils";
import {
  hasValidationErrors,
  validateIntegerRange,
  validateTextLength,
  type ValidationErrors,
} from "../../utils/clientValidation";

type NewReservationFormProps = {
  workspaces: Workspace[];
  selectedWorkspaceId?: number | string | null;
  initialStartTime?: string | null;
  initialEndTime?: string | null;
  initialUnavailableWorkspaceIds?: number[];
  initialErrors?: Record<string, string | string[]>;
  maxReservationHours?: number | null;
  minNoticeMinutes?: number | null;
  allowWeekendBookings?: boolean | null;
  bookingTimeSlots?: BookingTimeSlot[];
};

type ReservationFormData = {
  reservation: {
    workspace_id: number | string;
    start_time: string;
    end_time: string;
    attendees_count: number | string;
    notes: string;
  };
};

export default function NewReservationForm({
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
  const today = localDateValue();
  const hasCustomSlots = hasActiveCustomTimeSlots(bookingTimeSlots);

  const initialDate = initialStartTime ? extractDate(initialStartTime) : today;

  const initialTimeSlots = reservationTimeSlotsForDate({
    selectedDate: initialDate,
    maxReservationHours,
    bookingTimeSlots,
  });

  const fallbackSlot = initialTimeSlots[0] || {
    label: "No time slot available",
    start: "00:00",
    end: "00:00",
    durationHours: 0,
    source: "custom" as const,
  };

  const defaultStartTime =
    initialStartTime || buildDateTime(today, fallbackSlot.start);

  const defaultEndTime =
    initialEndTime || buildDateTime(today, fallbackSlot.end);

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

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>(defaultSlot);
  const [search, setSearch] = useState("");
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(true);
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const [showWorkspacePicker, setShowWorkspacePicker] = useState(
    !validSelectedWorkspaceId,
  );

  const [unavailableWorkspaceIds, setUnavailableWorkspaceIds] = useState<
    number[]
  >(initialUnavailableWorkspaceIds);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );

  const timeSlots = reservationTimeSlotsForDate({
    selectedDate,
    maxReservationHours,
    bookingTimeSlots,
  });

  const noCustomSlotsForSelectedDate = hasCustomSlots && timeSlots.length === 0;

  const { data, setData, post, processing, errors } =
    useForm<ReservationFormData>({
      reservation: {
        workspace_id: validSelectedWorkspaceId,
        start_time: defaultStartTime,
        end_time: defaultEndTime,
        attendees_count: 1,
        notes: "",
      },
    });

  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === Number(data.reservation.workspace_id),
  );

  const allErrors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...(errors as Record<string, string | string[] | undefined>),
    ...clientErrors,
  };

  const baseErrors = [
    ...normalizeError(allErrors.base),
    ...normalizeError(allErrors.reservation),
    ...normalizeError(allErrors["reservation.base"]),
  ];

  if (noCustomSlotsForSelectedDate) {
    baseErrors.push(
      "There are no active custom time slots available for the selected date.",
    );
  }

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

    updateReservation({
      workspace_id: workspaceId,
    });

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

    const validationErrors = validateReservationForm(
      data,
      selectedWorkspace,
      selectedWorkspaceUnavailable,
      minNoticeViolation,
      weekendViolation,
      noCustomSlotsForSelectedDate,
    );

    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;
    if (!canSubmit) return;

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

  return (
    <form noValidate onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="col-span-2 space-y-8"
      >
        <ReservationDateTimeSection
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          timeSlots={timeSlots}
          search={search}
          processing={processing}
          checkingAvailability={checkingAvailability}
          availabilityChecked={availabilityChecked}
          availabilityError={availabilityError}
          unavailableCount={unavailableWorkspaceIds.length}
          minNoticeViolation={minNoticeViolation}
          minNoticeMinutes={minNoticeMinutes || 0}
          weekendViolation={weekendViolation}
          baseErrors={baseErrors}
          minDate={today}
          selectedWorkspaceName={selectedWorkspace?.name || null}
          workspacePickerVisible={showWorkspacePicker}
          onDateChange={handleDateChange}
          onSlotChange={handleSlotChange}
          onSearchChange={setSearch}
          onRefreshAvailability={() => void checkAvailability()}
          onToggleWorkspacePicker={() =>
            setShowWorkspacePicker((value) => !value)
          }
        />

        {(showWorkspacePicker || !selectedWorkspace) && (
          <AvailableWorkspaceGrid
            workspaces={workspaces}
            filteredWorkspaces={filteredWorkspaces}
            selectedWorkspaceId={data.reservation.workspace_id}
            unavailableWorkspaceIds={unavailableWorkspaceIds}
            availabilityChecked={availabilityChecked}
            processing={processing}
            onSelectWorkspace={selectWorkspace}
          />
        )}
      </motion.section>

      <motion.aside
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="space-y-6"
      >
        <ReservationSummaryPanel
          selectedWorkspace={selectedWorkspace}
          selectedDate={selectedDate}
          selectedSlotLabel={selectedSlot.label}
          attendeesCount={data.reservation.attendees_count}
          notes={data.reservation.notes}
          errors={allErrors}
          estimatedTotal={estimatedTotal}
          availabilityChecked={availabilityChecked}
          ruleViolation={ruleViolation}
          selectedWorkspaceUnavailable={selectedWorkspaceUnavailable}
          attendeesExceedCapacity={attendeesExceedCapacity}
          minNoticeViolation={minNoticeViolation}
          minNoticeMinutes={minNoticeMinutes || 0}
          weekendViolation={weekendViolation}
          processing={processing}
          canSubmit={canSubmit}
          onAttendeesChange={(value) =>
            updateReservation({ attendees_count: value })
          }
          onNotesChange={(value) => updateReservation({ notes: value })}
        />
      </motion.aside>
    </form>
  );
}

function validateReservationForm(
  data: ReservationFormData,
  selectedWorkspace: Workspace | undefined,
  selectedWorkspaceUnavailable: boolean,
  minNoticeViolation: boolean,
  weekendViolation: boolean,
  noCustomSlotsForSelectedDate: boolean,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.reservation.workspace_id) {
    errors.base = "Select a workspace before creating the reservation.";
  }

  const attendeesError = validateIntegerRange(
    data.reservation.attendees_count,
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

function filterWorkspaces(workspaces: Workspace[], search: string) {
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
