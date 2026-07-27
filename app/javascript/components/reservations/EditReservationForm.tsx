import { useForm } from "@inertiajs/react";
import { motion } from "motion/react";
import type { FormEvent } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  StickyNote,
  UsersRound,
} from "lucide-react";
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
  const initialSlot = findSlotByDateTimes(
    reservation.start_time,
    reservation.end_time
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
    (workspace) => workspace.id === Number(data.workspace_id)
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
    value: string | number
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
                Reservation Schedule
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Update the workspace, date, time slot and reservation status.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Workspace
              </span>

              <div className="relative">
                <Building2
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={data.workspace_id}
                  onChange={(event) =>
                    updateField("workspace_id", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
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
              </div>

              <FormError error={errors.workspace_id} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Status
              </span>

              <div className="relative">
                <ShieldCheck
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={data.status}
                  onChange={(event) => updateField("status", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  disabled={processing}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <FormError error={errors.status} />
            </label>

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
                  value={extractDate(data.start_time)}
                  onChange={(event) => handleDateChange(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  disabled={processing}
                  required
                />
              </div>

              <FormError error={errors.start_time} />
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
                  value={findSlotByDateTimes(data.start_time, data.end_time).label}
                  onChange={(event) => handleSlotChange(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  disabled={processing}
                  required
                >
                  {timeSlots.map((slot) => (
                    <option key={slot.label} value={slot.label}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>

              <FormError error={errors.end_time} />
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
              <UsersRound size={26} strokeWidth={2.4} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Reservation Details
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Update attendees and notes for this reservation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
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
                  value={data.attendees_count}
                  onChange={(event) =>
                    updateField("attendees_count", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  disabled={processing}
                  required
                />
              </div>

              <FormError error={errors.attendees_count} />

              {attendeesExceedCapacity && (
                <p className="mt-2 text-xs font-semibold text-red-500">
                  Attendees exceed workspace capacity.
                </p>
              )}
            </label>

            <WorkspacePreview workspace={selectedWorkspace} />

            <label className="col-span-2 block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Notes
              </span>

              <div className="relative">
                <StickyNote
                  size={17}
                  className="pointer-events-none absolute left-4 top-4 text-slate-400"
                />

                <textarea
                  value={data.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  className="min-h-32 w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  placeholder="Optional notes for this reservation"
                  disabled={processing}
                />
              </div>

              <FormError error={errors.notes} />
            </label>
          </div>

          {getBaseError(errors) && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              {getBaseError(errors)}
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

            <h2 className="text-2xl font-bold text-slate-950">
              Update Summary
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review the updated reservation information before saving changes.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <SummaryRow
              label="Workspace"
              value={selectedWorkspace?.name || "Not selected"}
            />

            <SummaryRow label="Date" value={extractDate(data.start_time)} />

            <SummaryRow
              label="Time"
              value={findSlotByDateTimes(data.start_time, data.end_time).label}
            />

            <SummaryRow label="Status" value={formatText(data.status)} />

            <SummaryRow label="Attendees" value={data.attendees_count} />
          </div>

          {attendeesExceedCapacity ? (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              Attendees exceed the selected workspace capacity.
            </div>
          ) : (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>Reservation is ready to be updated.</span>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <LoadingButton
              type="submit"
              loading={processing}
              loadingText="Saving..."
              disabled={Boolean(attendeesExceedCapacity)}
              className="w-full"
            >
              Save Changes
            </LoadingButton>

            <a
              href={`/reservations/${reservation.id}`}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </a>
          </div>
        </div>
      </motion.aside>
    </form>
  );
}

type WorkspacePreviewProps = {
  workspace?: Workspace | null;
};

function WorkspacePreview({ workspace }: WorkspacePreviewProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Building2 size={16} />
        <p className="text-xs font-bold uppercase tracking-wide">
          Selected Workspace
        </p>
      </div>

      <p className="font-bold text-slate-950">
        {workspace?.name || "Not selected"}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Capacity: {workspace?.capacity || "-"}
      </p>
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

type FormErrorProps = {
  error?: string | string[];
};

function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  const message = Array.isArray(error) ? error.join(", ") : error;

  return <p className="mt-2 text-xs font-semibold text-red-500">{message}</p>;
}

function getBaseError(
  errors: Record<string, string | string[] | undefined>
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

function findSlotByDateTimes(startTime: string, endTime: string) {
  const start = extractTime(startTime);
  const end = extractTime(endTime);

  return (
    timeSlots.find((slot) => slot.start === start && slot.end === end) ||
    timeSlots[0]
  );
}

function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}