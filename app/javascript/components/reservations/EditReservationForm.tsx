import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import LoadingButton from "../ui/LoadingButton";
import type { Reservation } from "../../types/reservation";
import type { Workspace } from "../../types/workspace";

type EditReservationFormProps = {
  reservation: Reservation;
  workspaces: Workspace[];
  errors?: Partial<Record<string, string | string[]>>;
};

type EditReservationFormData = {
  workspace_id: number | string;
  start_time: string;
  end_time: string;
  status: string;
  attendees_count: number | string;
  notes: string;
};

const timeSlots = [
  { label: "09:00 AM - 10:00 AM", start: "09:00", end: "10:00" },
  { label: "10:00 AM - 11:00 AM", start: "10:00", end: "11:00" },
  { label: "11:00 AM - 12:00 PM", start: "11:00", end: "12:00" },
  { label: "01:00 PM - 02:00 PM", start: "13:00", end: "14:00" },
  { label: "02:00 PM - 03:00 PM", start: "14:00", end: "15:00" },
  { label: "03:00 PM - 04:00 PM", start: "15:00", end: "16:00" },
];

export default function EditReservationForm({
  reservation,
  workspaces,
  errors: initialErrors = {},
}: EditReservationFormProps) {
  const initialDate = extractDate(reservation.start_time);
  const initialSlot = findInitialSlot(
    reservation.start_time,
    reservation.end_time,
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
  };

  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === Number(data.workspace_id),
  );

  const attendeesExceedCapacity =
    selectedWorkspace &&
    Number(data.attendees_count) > selectedWorkspace.capacity;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (attendeesExceedCapacity) return;

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
    setData(field, value);
  }

  function handleDateChange(date: string) {
    const currentSlot = findSlotByDateTimes(data.start_time, data.end_time);

    setData({
      ...data,
      start_time: buildDateTime(date, currentSlot.start),
      end_time: buildDateTime(date, currentSlot.end),
    });
  }

  function handleSlotChange(slotLabel: string) {
    const slot = timeSlots.find((item) => item.label === slotLabel);

    if (!slot) return;

    const currentDate = extractDate(data.start_time);

    setData({
      ...data,
      start_time: buildDateTime(currentDate, slot.start),
      end_time: buildDateTime(currentDate, slot.end),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-950">Edit Reservation</h2>

        <p className="mt-2 text-sm text-slate-500">
          Update the workspace, time slot, attendees or reservation status.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Workspace
          </span>

          <select
            value={data.workspace_id}
            onChange={(event) =>
              updateField("workspace_id", event.target.value)
            }
            className="input"
            disabled={processing}
            required
          >
            <option value="">Select workspace</option>

            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>

          <FormError error={errors.workspace_id} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Status
          </span>

          <select
            value={data.status}
            onChange={(event) => updateField("status", event.target.value)}
            className="input"
            disabled={processing}
            required
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <FormError error={errors.status} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Reservation Date
          </span>

          <input
            type="date"
            value={extractDate(data.start_time)}
            onChange={(event) => handleDateChange(event.target.value)}
            className="input"
            disabled={processing}
            required
          />

          <FormError error={errors.start_time} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Time Slot
          </span>

          <select
            value={findSlotByDateTimes(data.start_time, data.end_time).label}
            onChange={(event) => handleSlotChange(event.target.value)}
            className="input"
            disabled={processing}
            required
          >
            {timeSlots.map((slot) => (
              <option key={slot.label} value={slot.label}>
                {slot.label}
              </option>
            ))}
          </select>

          <FormError error={errors.end_time} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Attendees
          </span>

          <input
            type="number"
            min="1"
            value={data.attendees_count}
            onChange={(event) =>
              updateField("attendees_count", event.target.value)
            }
            className="input"
            disabled={processing}
            required
          />

          <FormError error={errors.attendees_count} />

          {attendeesExceedCapacity && (
            <p className="mt-2 text-xs font-semibold text-red-500">
              Attendees exceed workspace capacity.
            </p>
          )}
        </label>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-700">Selected Workspace</p>

          <p className="mt-2 text-lg font-bold text-slate-950">
            {selectedWorkspace?.name || "Not selected"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Capacity: {selectedWorkspace?.capacity || "-"}
          </p>
        </div>

        <label className="col-span-2 block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Notes
          </span>

          <textarea
            value={data.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            className="input min-h-32"
            placeholder="Optional notes for this reservation"
            disabled={processing}
          />

          <FormError error={errors.notes} />
        </label>
      </div>

      {getBaseError(errors) && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {getBaseError(errors)}
        </div>
      )}

      <div className="mt-8 flex justify-end gap-4">
        <a
          href={`/reservations/${reservation.id}`}
          className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </a>

        <LoadingButton
          type="submit"
          loading={processing}
          loadingText="Saving..."
          disabled={Boolean(attendeesExceedCapacity)}
        >
          Save Changes
        </LoadingButton>
      </div>
    </form>
  );
}

type FormErrorProps = {
  error?: string | string[];
};

function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  const message = Array.isArray(error) ? error.join(", ") : error;

  return <p className="mt-2 text-xs font-semibold text-red-500">{message}</p>;
}

function getBaseError(
  errors: Record<string, string | string[] | undefined>,
): string | null {
  const error = errors.base;

  if (!error) return null;

  return Array.isArray(error) ? error.join(", ") : error;
}

function extractDate(value: string): string {
  return value.split("T")[0];
}

function extractTime(value: string): string {
  const timePart = value.split("T")[1] || "";

  return timePart.slice(0, 5);
}

function buildDateTime(date: string, time: string): string {
  return `${date}T${time}`;
}

function findInitialSlot(startTime: string, endTime: string) {
  const start = extractTime(startTime);
  const end = extractTime(endTime);

  return (
    timeSlots.find((slot) => slot.start === start && slot.end === end) ||
    timeSlots[0]
  );
}

function findSlotByDateTimes(startTime: string, endTime: string) {
  const start = extractTime(startTime);
  const end = extractTime(endTime);

  return (
    timeSlots.find((slot) => slot.start === start && slot.end === end) ||
    timeSlots[0]
  );
}
