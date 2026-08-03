import { StickyNote, UsersRound } from "lucide-react";
import LoadingButton from "../../ui/LoadingButton";
import type { Workspace } from "../../../types/workspace";
import { SelectedWorkspaceSummary } from "../new/WorkspaceInfoBlocks";
import { ValidationNotice } from "../new/ReservationNotices";

type ReservationSummaryPanelProps = {
  selectedWorkspace?: Workspace | null;
  selectedDate: string;
  selectedSlotLabel: string;
  attendeesCount: number | string;
  notes: string;
  errors?: Record<string, string | string[] | undefined>;
  estimatedTotal: number;
  availabilityChecked: boolean;
  ruleViolation: boolean;
  selectedWorkspaceUnavailable: boolean;
  attendeesExceedCapacity: boolean;
  minNoticeViolation: boolean;
  minNoticeMinutes: number;
  weekendViolation: boolean;
  processing: boolean;
  canSubmit: boolean;
  onAttendeesChange: (value: string) => void;
  onNotesChange: (value: string) => void;
};

export default function ReservationSummaryPanel({
  selectedWorkspace,
  selectedDate,
  selectedSlotLabel,
  attendeesCount,
  notes,
  errors = {},
  estimatedTotal,
  availabilityChecked,
  ruleViolation,
  selectedWorkspaceUnavailable,
  attendeesExceedCapacity,
  minNoticeViolation,
  minNoticeMinutes,
  weekendViolation,
  processing,
  canSubmit,
  onAttendeesChange,
  onNotesChange,
}: ReservationSummaryPanelProps) {
  const attendeesError =
    fieldError(errors, "attendees_count") ||
    (attendeesExceedCapacity
      ? "Attendees exceed workspace capacity."
      : undefined);

  const notesError = fieldError(errors, "notes");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-950">
          Reservation Summary
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Confirm the number of attendees and add any useful notes before
          creating the reservation.
        </p>
      </div>

      <div className="space-y-5">
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
              value={attendeesCount}
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

        <label className="block">
          <FieldLabel label="Notes" />

          <div className="relative">
            <StickyNote
              size={17}
              className="pointer-events-none absolute left-4 top-4 text-slate-400"
            />

            <textarea
              value={notes}
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
              {notes.length}/500
            </span>
          </div>

          <FormError error={notesError} />
        </label>
      </div>

      <div className="mt-8 rounded-xl bg-slate-50 p-5">
        <SummaryRow
          label="Workspace"
          value={selectedWorkspace?.name || "Not selected"}
        />

        <SummaryRow label="Date" value={selectedDate} />

        <SummaryRow label="Time" value={selectedSlotLabel} />

        <SummaryRow
          label="Availability"
          value={availabilityChecked ? "Checked" : "Needs review"}
        />

        <SummaryRow
          label="Booking Rules"
          value={ruleViolation ? "Action required" : "Valid"}
        />

        <SummaryRow
          label="Estimated Total"
          value={`$${estimatedTotal.toFixed(2)}`}
        />
      </div>

      <SelectedWorkspaceSummary workspace={selectedWorkspace} />

      <ValidationNotice
        availabilityChecked={availabilityChecked}
        selectedWorkspaceUnavailable={selectedWorkspaceUnavailable}
        attendeesExceedCapacity={attendeesExceedCapacity}
        minNoticeViolation={minNoticeViolation}
        minNoticeMinutes={minNoticeMinutes}
        weekendViolation={weekendViolation}
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