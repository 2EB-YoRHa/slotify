import LoadingButton from "../../ui/LoadingButton";
import { extractDate, formatText } from "../../../utils/reservationFormUtils";
import type { Workspace } from "../../../types/workspace";
import UpdateValidationNotice from "./UpdateValidationNotice";

type EditReservationSummaryPanelProps = {
  reservationId: number;
  selectedWorkspace?: Workspace | null;
  startTime: string;
  selectedSlotLabel: string;
  status: string;
  attendeesCount: number | string;
  ruleViolation: boolean;
  checkingAvailability: boolean;
  availabilityChecked: boolean;
  availabilityError: string | null;
  selectedWorkspaceUnavailable: boolean;
  attendeesExceedCapacity: boolean;
  minNoticeViolation: boolean;
  minNoticeMinutes: number;
  weekendViolation: boolean;
  noCustomSlotsForSelectedDate: boolean;
  customTimeSlotViolation: boolean;
  processing: boolean;
  canSubmit: boolean;
  onCancel: () => void;
};

export default function EditReservationSummaryPanel({
  selectedWorkspace,
  startTime,
  selectedSlotLabel,
  status,
  attendeesCount,
  ruleViolation,
  checkingAvailability,
  availabilityChecked,
  availabilityError,
  selectedWorkspaceUnavailable,
  attendeesExceedCapacity,
  minNoticeViolation,
  minNoticeMinutes,
  weekendViolation,
  noCustomSlotsForSelectedDate,
  customTimeSlotViolation,
  processing,
  canSubmit,
  onCancel,
}: EditReservationSummaryPanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-950">Update Summary</h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Review the updated reservation information before saving changes.
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-5">
        <SummaryRow
          label="Workspace"
          value={selectedWorkspace?.name || "Not selected"}
        />

        <SummaryRow label="Date" value={extractDate(startTime)} />

        <SummaryRow label="Time" value={selectedSlotLabel} />

        <SummaryRow label="Status" value={formatText(status)} />

        <SummaryRow label="Attendees" value={attendeesCount} />

        <SummaryRow
          label="Booking Rules"
          value={ruleViolation ? "Action required" : "Valid"}
        />
      </div>

      <UpdateValidationNotice
        checkingAvailability={checkingAvailability}
        availabilityChecked={availabilityChecked}
        availabilityError={availabilityError}
        selectedWorkspaceUnavailable={selectedWorkspaceUnavailable}
        attendeesExceedCapacity={attendeesExceedCapacity}
        minNoticeViolation={minNoticeViolation}
        minNoticeMinutes={minNoticeMinutes}
        weekendViolation={weekendViolation}
        noCustomSlotsForSelectedDate={noCustomSlotsForSelectedDate}
        customTimeSlotViolation={customTimeSlotViolation}
      />

      <div className="mt-8 flex flex-col gap-3">
        <LoadingButton
          type="submit"
          loading={processing}
          loadingText="Saving..."
          disabled={!canSubmit}
          className="w-full"
        >
          Save Changes
        </LoadingButton>

        <button
          type="button"
          disabled={processing}
          onClick={onCancel}
          className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
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