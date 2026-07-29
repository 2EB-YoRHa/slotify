import { StickyNote, UsersRound } from "lucide-react";
import type { Workspace } from "../../../types/workspace";
import WorkspacePreview from "./WorkspacePreview";

type EditReservationFormData = {
  workspace_id: number | string;
  start_time: string;
  end_time: string;
  status: string;
  attendees_count: number | string;
  notes: string;
};

type EditReservationDetailsSectionProps = {
  data: EditReservationFormData;
  errors: Record<string, string | string[] | undefined>;
  processing: boolean;
  selectedWorkspace?: Workspace | null;
  attendeesExceedCapacity: boolean;
  onAttendeesChange: (value: string) => void;
  onNotesChange: (value: string) => void;
};

export default function EditReservationDetailsSection({
  data,
  errors,
  processing,
  selectedWorkspace,
  attendeesExceedCapacity,
  onAttendeesChange,
  onNotesChange,
}: EditReservationDetailsSectionProps) {
  return (
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
              onChange={(event) => onAttendeesChange(event.target.value)}
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
              onChange={(event) => onNotesChange(event.target.value)}
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