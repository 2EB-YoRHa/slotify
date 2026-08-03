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
  const attendeesError =
    fieldError(errors, "attendees_count") ||
    (attendeesExceedCapacity
      ? "Attendees exceed workspace capacity."
      : undefined);

  const notesError = fieldError(errors, "notes");

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
            Update attendees and add relevant notes for this reservation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <label className="block">
          <FieldLabel label="Attendees" required />

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
              className={fieldClassName(Boolean(attendeesError))}
              disabled={processing}
              required
            />
          </div>

          <FormHelper
            helper={
              selectedWorkspace
                ? `Maximum capacity for this workspace: ${selectedWorkspace.capacity} people.`
                : "Select a workspace to validate its maximum capacity."
            }
          />

          <FormError error={attendeesError} />
        </label>

        <WorkspacePreview workspace={selectedWorkspace} />

        <label className="col-span-2 block">
          <FieldLabel label="Notes" />

          <div className="relative">
            <StickyNote
              size={17}
              className="pointer-events-none absolute left-4 top-4 text-slate-400"
            />

            <textarea
              value={data.notes}
              maxLength={500}
              onChange={(event) => onNotesChange(event.target.value)}
              className={`${fieldClassName(Boolean(notesError))} min-h-32 resize-y`}
              placeholder="Add reservation notes, setup details, or special instructions."
              disabled={processing}
            />
          </div>

          <div className="mt-2 flex items-center justify-between gap-4">
            <FormHelper helper="Optional. Keep notes short and relevant for the booking." />

            <span className="text-xs font-semibold text-slate-400">
              {data.notes.length}/500
            </span>
          </div>

          <FormError error={notesError} />
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

type FieldLabelProps = {
  label: string;
  required?: boolean;
};

function FieldLabel({ label, required = false }: FieldLabelProps) {
  return (
    <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700">
      {label}

      {required && <span className="text-red-500">*</span>}
    </span>
  );
}

type FormHelperProps = {
  helper?: string;
};

function FormHelper({ helper }: FormHelperProps) {
  if (!helper) return null;

  return <p className="mt-2 text-xs font-semibold text-slate-400">{helper}</p>;
}

type FormErrorProps = {
  error?: string | string[];
};

function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  const message = Array.isArray(error) ? error.join(", ") : error;

  return <p className="mt-2 text-xs font-semibold text-red-500">{message}</p>;
}

function fieldClassName(hasError: boolean): string {
  const baseClass =
    "w-full rounded-xl border py-3 pl-11 pr-4 text-sm font-medium outline-none transition disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

  if (hasError) {
    return `${baseClass} border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-50`;
  }

  return `${baseClass} border-slate-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50`;
}

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`reservation.${field}`];
}

function getBaseError(
  errors: Record<string, string | string[] | undefined>,
): string | null {
  const error = errors.base || errors["reservation.base"];

  if (!error) return null;

  return Array.isArray(error) ? error.join(", ") : error;
}