import { StickyNote, UsersRound } from "lucide-react";
import LoadingButton from ".././ui/LoadingButton";
import type { Workspace } from "../.././types/workspace";
import { SelectedWorkspaceSummary } from "./WorkspaceInfoBlocks";
import { ValidationNotice } from "./ReservationNotices";

type ReservationSummaryPanelProps = {
  selectedWorkspace?: Workspace | null;
  selectedDate: string;
  selectedSlotLabel: string;
  attendeesCount: number | string;
  notes: string;
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
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
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
              value={attendeesCount}
              onChange={(event) => onAttendeesChange(event.target.value)}
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
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
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

        <SummaryRow label="Time" value={selectedSlotLabel} />

        <SummaryRow
          label="Availability"
          value={availabilityChecked ? "Checked" : "Pending"}
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