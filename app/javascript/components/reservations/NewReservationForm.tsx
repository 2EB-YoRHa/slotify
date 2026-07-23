import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { useState } from "react";
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
      workspace.location?.toLowerCase().includes(query)
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

  function handleDateChange(date: string) {
    setSelectedDate(date);
    setAvailabilityChecked(false);
    setUnavailableWorkspaceIds([]);
    setAvailabilityError(null);

    updateReservation({
      start_time: buildDateTime(date, selectedSlot.start),
      end_time: buildDateTime(date, selectedSlot.end),
    });
  }

  function handleSlotChange(slotLabel: string) {
    const slot = timeSlots.find((item) => item.label === slotLabel);

    if (!slot) return;

    setSelectedSlot(slot);
    setAvailabilityChecked(false);
    setUnavailableWorkspaceIds([]);
    setAvailabilityError(null);

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
      setAvailabilityError(
        "Could not check availability. Please try again."
      );
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
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
      <section className="col-span-2 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-950">
            New Reservation
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Choose a date, time slot and available workspace.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Reservation Date
            </span>

            <input
              type="date"
              value={selectedDate}
              onChange={(event) => handleDateChange(event.target.value)}
              className="input"
              disabled={processing || checkingAvailability}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Time Slot
            </span>

            <select
              value={selectedSlot.label}
              onChange={(event) => handleSlotChange(event.target.value)}
              className="input"
              disabled={processing || checkingAvailability}
              required
            >
              {timeSlots.map((slot) => (
                <option key={slot.label} value={slot.label}>
                  {slot.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mb-8 flex items-end gap-4">
          <label className="flex-1">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Search Workspace
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input"
              placeholder="Search by name, type or location"
              disabled={processing}
            />
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

        {availabilityError && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {availabilityError}
          </div>
        )}

        {availabilityChecked && (
          <div className="mb-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
            Availability checked. Unavailable spaces are disabled.
          </div>
        )}

        {errors.reservation && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {String(errors.reservation)}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {filteredWorkspaces.length === 0 ? (
            <div className="col-span-2 rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-400">
              No workspaces found.
            </div>
          ) : (
            filteredWorkspaces.map((workspace) => {
              const unavailable = unavailableWorkspaceIds.includes(
                workspace.id
              );
              const selected =
                Number(data.reservation.workspace_id) === workspace.id;

              return (
                <button
                  key={workspace.id}
                  type="button"
                  onClick={() => selectWorkspace(workspace.id)}
                  disabled={processing || unavailable}
                  className={`rounded-xl border p-5 text-left transition ${
                    selected
                      ? "border-cyan-300 bg-cyan-50"
                      : "border-slate-200 bg-white hover:border-cyan-200"
                  } ${
                    unavailable
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-950">
                        {workspace.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatText(workspace.workspace_type)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        unavailable
                          ? "bg-red-50 text-red-500"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {unavailable ? "Unavailable" : "Available"}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <Info label="Capacity" value={workspace.capacity} />
                    <Info label="Rate" value={`$${workspace.hourly_rate || 0}`} />
                    <Info label="Floor" value={workspace.floor || "-"} />
                    <Info label="Zone" value={workspace.zone || "-"} />
                  </div>

                  {workspace.location && (
                    <p className="mt-4 text-sm text-slate-400">
                      {workspace.location}
                    </p>
                  )}
                </button>
              );
            })
          )}
        </div>
      </section>

      <aside className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">
          Reservation Details
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Confirm attendees and optional notes before creating the reservation.
        </p>

        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Attendees
            </span>

            <input
              type="number"
              min="1"
              value={data.reservation.attendees_count}
              onChange={(event) =>
                updateReservation({
                  attendees_count: event.target.value,
                })
              }
              className="input"
              disabled={processing}
              required
            />

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

            <textarea
              value={data.reservation.notes}
              onChange={(event) =>
                updateReservation({
                  notes: event.target.value,
                })
              }
              className="input min-h-32"
              placeholder="Optional notes for this reservation"
              disabled={processing}
            />
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
        </div>

        {!availabilityChecked && (
          <div className="mt-5 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
            Please check availability before creating the reservation.
          </div>
        )}

        {selectedWorkspaceUnavailable && (
          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            The selected workspace is not available for this time slot.
          </div>
        )}

        <LoadingButton
          type="submit"
          loading={processing}
          loadingText="Creating..."
          disabled={!canSubmit}
          className="mt-8 w-full"
        >
          Create Reservation
        </LoadingButton>
      </aside>
    </form>
  );
}

type InfoProps = {
  label: string;
  value: string | number;
};

function Info({ label, value }: InfoProps) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between border-b border-slate-200 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-950">{value}</span>
    </div>
  );
}

function buildDateTime(date: string, time: string): string {
  return `${date}T${time}`;
}

function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}