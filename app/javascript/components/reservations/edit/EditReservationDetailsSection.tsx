import { StickyNote, UsersRound } from "lucide-react";
import {
  FieldError,
  FieldHint,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../../ui/FormFeedback";
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
  const baseError = getBaseError(errors);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-3 sm:mb-8 sm:gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 sm:h-14 sm:w-14">
          <UsersRound size={24} strokeWidth={2.4} />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
            Reservation Details
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Update attendees and add relevant notes for this reservation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="block min-w-0">
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
              className={formInputClassName(hasFieldError(attendeesError))}
              disabled={processing}
            />
          </div>

          <FieldHint>
            {selectedWorkspace
              ? `Maximum capacity for this workspace: ${selectedWorkspace.capacity} people.`
              : "Select a workspace to validate its maximum capacity."}
          </FieldHint>

          <FieldError error={attendeesError} label="Attendees" />
        </label>

        <WorkspacePreview workspace={selectedWorkspace} />

        <label className="block md:col-span-2">
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
              className={`${formInputClassName(
                hasFieldError(notesError),
              )} min-h-32 resize-y`}
              placeholder="Add reservation notes, setup details, or special instructions."
              disabled={processing}
            />
          </div>

          <div className="mt-2 flex items-start justify-between gap-4">
            <FieldHint>
              Optional. Keep notes short and relevant for the booking.
            </FieldHint>

            <span className="shrink-0 text-xs font-semibold text-slate-400">
              {data.notes.length}/500
            </span>
          </div>

          <FieldError error={notesError} label="Notes" />
        </label>
      </div>

      {baseError && (
        <div className="mt-6">
          <FieldError error={baseError} label="Reservation" />
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
      <RequiredMark show={required} />
    </span>
  );
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