import { Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import type { Reservation } from "../../types/reservation";
import type { Workspace } from "../../types/workspace";

type TimeSlot = {
  label: string;
  start: string;
  end: string;
};

type EditReservationFormData = {
  workspace_id: number | string;
  start_time: string;
  end_time: string;
  status: string;
  attendees_count: number | string;
  notes: string;
};

type EditReservationFormProps = {
  reservation: Reservation;
  workspaces: Workspace[];
  errors?: Record<string, string | string[]>;
};

const timeSlots: TimeSlot[] = [
  { label: "09:00 AM - 10:00 AM", start: "09:00", end: "10:00" },
  { label: "10:00 AM - 11:00 AM", start: "10:00", end: "11:00" },
  { label: "11:00 AM - 12:00 PM", start: "11:00", end: "12:00" },
  { label: "10:00 AM - 12:00 PM", start: "10:00", end: "12:00" },
  { label: "01:00 PM - 02:00 PM", start: "13:00", end: "14:00" },
  { label: "02:00 PM - 04:00 PM", start: "14:00", end: "16:00" },
  { label: "04:00 PM - 05:00 PM", start: "16:00", end: "17:00" },
  { label: "05:00 PM - 06:00 PM", start: "17:00", end: "18:00" },
];

export default function EditReservationForm({
  reservation,
  workspaces,
  errors = {},
}: EditReservationFormProps) {
  const initialDate = getDatePart(reservation.start_time);
  const initialSlot =
    findMatchingSlot(reservation.start_time, reservation.end_time) ||
    timeSlots[0];

  const { data, setData, patch, processing, transform } =
    useForm<EditReservationFormData>({
      workspace_id: reservation.workspace?.id || "",
      start_time: buildDateTime(initialDate, initialSlot.start),
      end_time: buildDateTime(initialDate, initialSlot.end),
      status: reservation.status || "confirmed",
      attendees_count: reservation.attendees_count || 1,
      notes: reservation.notes || "",
    });

  const selectedWorkspace = workspaces.find(
    (workspace) => Number(workspace.id) === Number(data.workspace_id)
  );

  const attendeesCount = Number(data.attendees_count);
  const exceedsCapacity =
    selectedWorkspace && attendeesCount > Number(selectedWorkspace.capacity);

  function handleDateChange(date: string) {
    setData({
      ...data,
      start_time: buildDateTime(date, initialSlot.start),
      end_time: buildDateTime(date, initialSlot.end),
    });
  }

  function handleSlotChange(slotLabel: string) {
    const slot = timeSlots.find((currentSlot) => currentSlot.label === slotLabel);

    if (!slot) return;

    const date = getDatePart(data.start_time);

    setData({
      ...data,
      start_time: buildDateTime(date, slot.start),
      end_time: buildDateTime(date, slot.end),
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (exceedsCapacity) return;

    transform((formData) => ({
      reservation: {
        ...formData,
        workspace_id: Number(formData.workspace_id),
        attendees_count: Number(formData.attendees_count),
      },
    }));

    patch(`/reservations/${reservation.id}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-3 gap-8"
    >
      <section className="col-span-2 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Reservation Information
          </h2>

          <div className="grid grid-cols-2 gap-5">
            <Field label="Workspace" error={errors.workspace_id}>
              <select
                value={data.workspace_id}
                onChange={(event) =>
                  setData("workspace_id", Number(event.target.value))
                }
                className="input"
              >
                <option value="">Select workspace</option>

                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status" error={errors.status}>
              <select
                value={data.status}
                onChange={(event) => setData("status", event.target.value)}
                className="input"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </Field>

            <Field label="Date" error={errors.start_time}>
              <input
                type="date"
                value={getDatePart(data.start_time)}
                onChange={(event) => handleDateChange(event.target.value)}
                className="input"
              />
            </Field>

            <Field label="Time Slot" error={errors.end_time}>
              <select
                value={getSlotLabel(data.start_time, data.end_time)}
                onChange={(event) => handleSlotChange(event.target.value)}
                className="input"
              >
                {timeSlots.map((slot) => (
                  <option key={slot.label} value={slot.label}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Attendees" error={errors.attendees_count}>
              <input
                type="number"
                min="1"
                value={data.attendees_count}
                onChange={(event) =>
                  setData("attendees_count", Number(event.target.value))
                }
                className="input"
              />

              {exceedsCapacity && selectedWorkspace && (
                <p className="mt-2 text-sm text-red-500">
                  This workspace only allows up to {selectedWorkspace.capacity} people.
                </p>
              )}
            </Field>

            <div className="col-span-2">
              <Field label="Notes" error={errors.notes}>
                <textarea
                  value={data.notes}
                  onChange={(event) => setData("notes", event.target.value)}
                  rows={4}
                  className="input"
                  placeholder="Optional notes for this reservation..."
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-6">
          <h3 className="font-bold text-slate-800">
            Reservation Rules
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            When saving changes, the backend will validate workspace capacity,
            overlapping reservations, and booking rules configured by the organization.
          </p>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Selected Workspace
          </h2>

          {selectedWorkspace ? (
            <div className="mt-5 space-y-4 text-sm">
              <SummaryItem label="Name" value={selectedWorkspace.name} />
              <SummaryItem
                label="Type"
                value={formatType(selectedWorkspace.workspace_type)}
              />
              <SummaryItem
                label="Capacity"
                value={`${selectedWorkspace.capacity} people`}
              />
              <SummaryItem
                label="Location"
                value={selectedWorkspace.location || "-"}
              />
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              No workspace selected.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
          <h2 className="font-bold text-orange-700">
            Important
          </h2>

          <p className="mt-2 text-sm leading-6 text-orange-600">
            Editing the reservation may trigger validations again. If the new
            time overlaps another reservation, the system will reject the update.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/reservations/${reservation.id}`}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={processing || Boolean(exceedsCapacity)}
            className="flex-1 rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-500 disabled:opacity-60"
          >
            {processing ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </aside>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string | string[];
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  const message = Array.isArray(error) ? error[0] : error;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      {children}

      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </label>
  );
}

type SummaryItemProps = {
  label: string;
  value: string | number;
};

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

function buildDateTime(date: string, time: string): string {
  return `${date}T${time}:00`;
}

function getDatePart(value: string): string {
  return String(value).slice(0, 10);
}

function getTimePart(value: string): string {
  return String(value).slice(11, 16);
}

function findMatchingSlot(
  startTime: string,
  endTime: string
): TimeSlot | undefined {
  const start = getTimePart(startTime);
  const end = getTimePart(endTime);

  return timeSlots.find((slot) => slot.start === start && slot.end === end);
}

function getSlotLabel(startTime: string, endTime: string): string {
  const slot = findMatchingSlot(startTime, endTime);

  return slot ? slot.label : timeSlots[0].label;
}

function formatType(type?: string | null): string {
  if (!type) return "-";

  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}