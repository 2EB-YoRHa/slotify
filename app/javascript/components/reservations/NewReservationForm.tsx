import { useForm } from "@inertiajs/react";
import { motion } from "motion/react";
import type { FormEvent } from "react";
import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CalendarSearch,
  CheckCircle2,
  Clock3,
  DollarSign,
  MapPin,
  Search,
  StickyNote,
  UsersRound,
} from "lucide-react";
import LoadingButton from "../ui/LoadingButton";
import type { Workspace } from "../../types/workspace";

type NewReservationFormProps = {
  workspaces: Workspace[];
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

const timeSlots = [
  { label: "09:00 AM - 10:00 AM", start: "09:00", end: "10:00" },
  { label: "10:00 AM - 11:00 AM", start: "10:00", end: "11:00" },
  { label: "11:00 AM - 12:00 PM", start: "11:00", end: "12:00" },
  { label: "01:00 PM - 02:00 PM", start: "13:00", end: "14:00" },
  { label: "02:00 PM - 03:00 PM", start: "14:00", end: "15:00" },
  { label: "03:00 PM - 04:00 PM", start: "15:00", end: "16:00" },
];

export default function NewReservationForm({
  workspaces,
}: NewReservationFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const firstSlot = timeSlots[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(firstSlot);
  const [search, setSearch] = useState("");
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [unavailableWorkspaceIds, setUnavailableWorkspaceIds] = useState<
    number[]
  >([]);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null
  );

  const { data, setData, post, processing, errors } =
    useForm<ReservationFormData>({
      reservation: {
        workspace_id: "",
        start_time: buildDateTime(today, firstSlot.start),
        end_time: buildDateTime(today, firstSlot.end),
        attendees_count: 1,
        notes: "",
      },
    });

  const filteredWorkspaces = workspaces.filter((workspace) => {
    const query = search.toLowerCase();

    return (
      workspace.name.toLowerCase().includes(query) ||
      workspace.workspace_type.toLowerCase().includes(query) ||
      (workspace.location || "").toLowerCase().includes(query)
    );
  });

  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === Number(data.reservation.workspace_id)
  );

  const selectedWorkspaceUnavailable =
    selectedWorkspace &&
    unavailableWorkspaceIds.includes(selectedWorkspace.id);

  const attendeesExceedCapacity =
    selectedWorkspace &&
    Number(data.reservation.attendees_count) > selectedWorkspace.capacity;

  const canSubmit =
    Boolean(data.reservation.workspace_id) &&
    availabilityChecked &&
    !selectedWorkspaceUnavailable &&
    !attendeesExceedCapacity;

  const estimatedTotal = selectedWorkspace
    ? calculateEstimatedTotal(
        Number(selectedWorkspace.hourly_rate || 0),
        data.reservation.start_time,
        data.reservation.end_time
      )
    : 0;

  function handleDateChange(date: string) {
    setSelectedDate(date);
    resetAvailability();

    updateReservation({
      start_time: buildDateTime(date, selectedSlot.start),
      end_time: buildDateTime(date, selectedSlot.end),
    });
  }

  function handleSlotChange(slotLabel: string) {
    const slot = timeSlots.find((item) => item.label === slotLabel);

    if (!slot) return;

    setSelectedSlot(slot);
    resetAvailability();

    updateReservation({
      start_time: buildDateTime(selectedDate, slot.start),
      end_time: buildDateTime(selectedDate, slot.end),
    });
  }

  function selectWorkspace(workspaceId: number) {
    updateReservation({
      workspace_id: workspaceId,
    });
  }

  function updateReservation(
    values: Partial<ReservationFormData["reservation"]>
  ) {
    setData("reservation", {
      ...data.reservation,
      ...values,
    });
  }

  function resetAvailability() {
    setAvailabilityChecked(false);
    setUnavailableWorkspaceIds([]);
    setAvailabilityError(null);
  }

  async function checkAvailability() {
    setCheckingAvailability(true);
    setAvailabilityError(null);

    try {
      const params = new URLSearchParams({
        start_time: data.reservation.start_time,
        end_time: data.reservation.end_time,
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
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
              <CalendarDays size={26} strokeWidth={2.4} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Date & Time
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Choose when the workspace will be reserved. Availability must be
                checked before creating the reservation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Reservation Date
              </span>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => handleDateChange(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  disabled={processing || checkingAvailability}
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Time Slot
              </span>

              <div className="relative">
                <Clock3
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={selectedSlot.label}
                  onChange={(event) => handleSlotChange(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  disabled={processing || checkingAvailability}
                  required
                >
                  {timeSlots.map((slot) => (
                    <option key={slot.label} value={slot.label}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          <div className="mt-8 flex items-end gap-4">
            <label className="flex-1">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Search Workspace
              </span>

              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  placeholder="Search by name, type or location"
                  disabled={processing}
                />
              </div>
            </label>

            <LoadingButton
              type="button"
              loading={checkingAvailability}
              loadingText="Checking..."
              onClick={checkAvailability}
            >
              Check Availability
            </LoadingButton>
          </div>

          <AvailabilityMessage
            availabilityChecked={availabilityChecked}
            availabilityError={availabilityError}
            unavailableCount={unavailableWorkspaceIds.length}
          />

          {errors.reservation && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              {String(errors.reservation)}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Available Workspaces
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Showing {filteredWorkspaces.length} of {workspaces.length}{" "}
                workspaces.
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                availabilityChecked
                  ? "bg-green-50 text-green-600"
                  : "bg-yellow-50 text-yellow-600"
              }`}
            >
              {availabilityChecked ? "Availability checked" : "Check required"}
            </span>
          </div>

          {filteredWorkspaces.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Building2 size={24} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No workspaces found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing the search text.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredWorkspaces.map((workspace, index) => {
                const unavailable = unavailableWorkspaceIds.includes(
                  workspace.id
                );
                const selected =
                  Number(data.reservation.workspace_id) === workspace.id;

                return (
                  <WorkspaceOption
                    key={workspace.id}
                    workspace={workspace}
                    index={index}
                    selected={selected}
                    unavailable={unavailable}
                    disabled={processing || unavailable}
                    availabilityChecked={availabilityChecked}
                    onSelect={() => selectWorkspace(workspace.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </motion.section>

      <motion.aside
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="space-y-6"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
              <CalendarSearch size={26} strokeWidth={2.4} />
            </div>

            <h2 className="text-2xl font-bold text-slate-950">
              Reservation Summary
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Confirm attendees and notes before creating the reservation.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Attendees
              </span>

              <div className="relative">
                <UsersRound
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  min="1"
                  value={data.reservation.attendees_count}
                  onChange={(event) =>
                    updateReservation({
                      attendees_count: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  disabled={processing}
                  required
                />
              </div>

              {attendeesExceedCapacity && (
                <p className="mt-2 text-xs font-semibold text-red-500">
                  Attendees exceed workspace capacity.
                </p>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Notes
              </span>

              <div className="relative">
                <StickyNote
                  size={17}
                  className="pointer-events-none absolute left-4 top-4 text-slate-400"
                />

                <textarea
                  value={data.reservation.notes}
                  onChange={(event) =>
                    updateReservation({
                      notes: event.target.value,
                    })
                  }
                  className="min-h-32 w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  placeholder="Optional notes for this reservation"
                  disabled={processing}
                />
              </div>
            </label>
          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-5">
            <SummaryRow
              label="Workspace"
              value={selectedWorkspace?.name || "Not selected"}
            />

            <SummaryRow label="Date" value={selectedDate} />

            <SummaryRow label="Time" value={selectedSlot.label} />

            <SummaryRow
              label="Availability"
              value={availabilityChecked ? "Checked" : "Pending"}
            />

            <SummaryRow
              label="Estimated Total"
              value={`$${estimatedTotal.toFixed(2)}`}
            />
          </div>

          <ValidationNotice
            availabilityChecked={availabilityChecked}
            selectedWorkspaceUnavailable={Boolean(selectedWorkspaceUnavailable)}
            attendeesExceedCapacity={Boolean(attendeesExceedCapacity)}
          />

          <LoadingButton
            type="submit"
            loading={processing}
            loadingText="Creating..."
            disabled={!canSubmit}
            className="mt-8 w-full"
          >
            Create Reservation
          </LoadingButton>
        </div>
      </motion.aside>
    </form>
  );
}

type WorkspaceOptionProps = {
  workspace: Workspace;
  index: number;
  selected: boolean;
  unavailable: boolean;
  disabled: boolean;
  availabilityChecked: boolean;
  onSelect: () => void;
};

function WorkspaceOption({
  workspace,
  index,
  selected,
  unavailable,
  disabled,
  availabilityChecked,
  onSelect,
}: WorkspaceOptionProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      onClick={onSelect}
      disabled={disabled}
      className={`rounded-xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
        selected
          ? "border-cyan-300 bg-cyan-50 ring-4 ring-cyan-50"
          : "border-slate-200 bg-white hover:border-cyan-100"
      } ${unavailable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
            <Building2 size={20} strokeWidth={2.4} />
          </div>

          <div>
            <h3 className="font-bold text-slate-950">{workspace.name}</h3>

            <p className="mt-1 text-xs font-bold uppercase text-slate-400">
              {formatText(workspace.workspace_type)}
            </p>
          </div>
        </div>

        <AvailabilityBadge
          checked={availabilityChecked}
          unavailable={unavailable}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Info icon={UsersRound} label="Capacity" value={workspace.capacity} />

        <Info
          icon={DollarSign}
          label="Rate"
          value={`$${workspace.hourly_rate || 0}/h`}
        />

        <Info icon={Building2} label="Floor" value={workspace.floor || "-"} />

        <Info icon={MapPin} label="Zone" value={workspace.zone || "-"} />
      </div>

      {workspace.location && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <MapPin size={15} className="text-slate-400" />
          <span className="truncate">{workspace.location}</span>
        </div>
      )}
    </motion.button>
  );
}

type InfoProps = {
  icon: typeof UsersRound;
  label: string;
  value: string | number;
};

function Info({ icon: Icon, label, value }: InfoProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="mb-1 flex items-center gap-2 text-slate-400">
        <Icon size={14} />
        <p className="text-[10px] font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="font-bold text-slate-800">{value}</p>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-bold text-slate-950">
        {value}
      </span>
    </div>
  );
}

function AvailabilityMessage({
  availabilityChecked,
  availabilityError,
  unavailableCount,
}: {
  availabilityChecked: boolean;
  availabilityError: string | null;
  unavailableCount: number;
}) {
  if (availabilityError) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <span>{availabilityError}</span>
      </div>
    );
  }

  if (!availabilityChecked) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <span>
          Availability has not been checked yet. You must check availability
          before creating the reservation.
        </span>
      </div>
    );
  }

  return (
    <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
      <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
      <span>
        Availability checked successfully. {unavailableCount} workspace
        {unavailableCount === 1 ? " is" : "s are"} unavailable for this time.
      </span>
    </div>
  );
}

function ValidationNotice({
  availabilityChecked,
  selectedWorkspaceUnavailable,
  attendeesExceedCapacity,
}: {
  availabilityChecked: boolean;
  selectedWorkspaceUnavailable: boolean;
  attendeesExceedCapacity: boolean;
}) {
  if (!availabilityChecked) {
    return (
      <div className="mt-5 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
        Check availability before creating the reservation.
      </div>
    );
  }

  if (selectedWorkspaceUnavailable) {
    return (
      <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        The selected workspace is not available for this time slot.
      </div>
    );
  }

  if (attendeesExceedCapacity) {
    return (
      <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        Attendees exceed the selected workspace capacity.
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
      Reservation is ready to be created.
    </div>
  );
}

function AvailabilityBadge({
  checked,
  unavailable,
}: {
  checked: boolean;
  unavailable: boolean;
}) {
  if (!checked) {
    return (
      <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-600">
        Check first
      </span>
    );
  }

  if (unavailable) {
    return (
      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
        Unavailable
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
      Available
    </span>
  );
}

function buildDateTime(date: string, time: string): string {
  return `${date}T${time}`;
}

function calculateEstimatedTotal(
  hourlyRate: number,
  startTime: string,
  endTime: string
): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const hours = Math.max(0, (end - start) / 3600000);

  return hourlyRate * hours;
}

function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}