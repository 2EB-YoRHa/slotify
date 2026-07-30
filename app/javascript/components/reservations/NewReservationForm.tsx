import { useForm } from "@inertiajs/react";
import { motion } from "motion/react";
import type { FormEvent } from "react";
import { useState } from "react";
import { generateTimeSlots } from "../../utils/timeSlots";
import type { TimeSlot } from "../../utils/timeSlots";
import type { Workspace } from "../../types/workspace";
import AvailableWorkspaceGrid from "./new/AvailableWorkspaceGrid";
import ReservationDateTimeSection from "./new/ReservationDateTimeSection";
import ReservationSummaryPanel from "../reservations/new/ReservationSummaryPanel";
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
}: NewReservationFormProps) {
  const timeSlots = generateTimeSlots(maxReservationHours);
  const today = localDateValue();
  const firstSlot = timeSlots[0];

  const defaultStartTime =
    initialStartTime || buildDateTime(today, firstSlot.start);
  const defaultEndTime = initialEndTime || buildDateTime(today, firstSlot.end);
  const defaultDate = extractDate(defaultStartTime);
  const defaultSlot = findSlotByDateTimes(
    defaultStartTime,
    defaultEndTime,
    timeSlots,
  );

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>(defaultSlot);
  const [search, setSearch] = useState("");
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(true);
  const [unavailableWorkspaceIds, setUnavailableWorkspaceIds] = useState<
    number[]
  >(initialUnavailableWorkspaceIds);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );

  const validSelectedWorkspaceId = workspaces.some(
    (workspace) => workspace.id === Number(selectedWorkspaceId),
  )
    ? selectedWorkspaceId || ""
    : "";

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

  const allErrors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...(errors as Record<string, string | string[] | undefined>),
  };

  const baseErrors = [
    ...normalizeError(allErrors.base),
    ...normalizeError(allErrors.reservation),
    ...normalizeError(allErrors["reservation.base"]),
  ];

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

  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === Number(data.reservation.workspace_id),
  );

  const selectedWorkspaceUnavailable = Boolean(
    selectedWorkspace && unavailableWorkspaceIds.includes(selectedWorkspace.id),
  );

  const attendeesExceedCapacity = Boolean(
    selectedWorkspace &&
    Number(data.reservation.attendees_count) > selectedWorkspace.capacity,
  );

  const canSubmit =
    Boolean(data.reservation.workspace_id) &&
    availabilityChecked &&
    !checkingAvailability &&
    !availabilityError &&
    !ruleViolation &&
    !selectedWorkspaceUnavailable &&
    !attendeesExceedCapacity;

  const estimatedTotal = selectedWorkspace
    ? calculateEstimatedTotal(
        Number(selectedWorkspace.hourly_rate || 0),
        data.reservation.start_time,
        data.reservation.end_time,
      )
    : 0;

  function handleDateChange(date: string) {
    const nextStartTime = buildDateTime(date, selectedSlot.start);
    const nextEndTime = buildDateTime(date, selectedSlot.end);

    setSelectedDate(date);

    updateReservation({
      start_time: nextStartTime,
      end_time: nextEndTime,
    });

    void checkAvailabilityFor(nextStartTime, nextEndTime);
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
    updateReservation({
      workspace_id: workspaceId,
    });

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

    if (!canSubmit) return;

    post("/reservations");
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">
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
          onDateChange={handleDateChange}
          onSlotChange={handleSlotChange}
          onSearchChange={setSearch}
          onRefreshAvailability={() => void checkAvailability()}
        />

        <AvailableWorkspaceGrid
          workspaces={workspaces}
          filteredWorkspaces={filteredWorkspaces}
          selectedWorkspaceId={data.reservation.workspace_id}
          unavailableWorkspaceIds={unavailableWorkspaceIds}
          availabilityChecked={availabilityChecked}
          processing={processing}
          onSelectWorkspace={selectWorkspace}
        />
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

function filterWorkspaces(workspaces: Workspace[], search: string) {
  const query = search.toLowerCase();

  return workspaces.filter((workspace) => {
    return (
      workspace.name.toLowerCase().includes(query) ||
      workspace.workspace_type.toLowerCase().includes(query) ||
      (workspace.location || "").toLowerCase().includes(query) ||
      (workspace.amenities || []).some((amenity) =>
        amenity.name.toLowerCase().includes(query),
      )
    );
  });
}
