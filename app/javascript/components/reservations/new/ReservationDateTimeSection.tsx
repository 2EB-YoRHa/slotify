import {
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import DatePickerField from "../../ui/DatePickerField";
import LoadingButton from "../../ui/LoadingButton";
import TimeSlotPicker from "../../ui/TimeSlotPicker";
import type { TimeSlot } from "../../../utils/timeSlots";
import { AvailabilityMessage, BusinessRuleNotice } from "./ReservationNotices";

type ReservationDateTimeSectionProps = {
  selectedDate: string;
  selectedSlot: TimeSlot;
  timeSlots: TimeSlot[];
  search: string;
  processing: boolean;
  checkingAvailability: boolean;
  availabilityChecked: boolean;
  availabilityError: string | null;
  unavailableCount: number;
  minNoticeViolation: boolean;
  minNoticeMinutes: number;
  weekendViolation: boolean;
  baseErrors: string[];
  minDate: string;
  selectedWorkspaceName?: string | null;
  workspacePickerVisible: boolean;
  onDateChange: (date: string) => void;
  onSlotChange: (slotLabel: string) => void;
  onSearchChange: (search: string) => void;
  onRefreshAvailability: () => void;
  onToggleWorkspacePicker: () => void;
};

export default function ReservationDateTimeSection({
  selectedDate,
  selectedSlot,
  timeSlots,
  search,
  processing,
  checkingAvailability,
  availabilityChecked,
  availabilityError,
  unavailableCount,
  minNoticeViolation,
  minNoticeMinutes,
  weekendViolation,
  baseErrors,
  minDate,
  selectedWorkspaceName = null,
  workspacePickerVisible,
  onDateChange,
  onSlotChange,
  onSearchChange,
  onRefreshAvailability,
  onToggleWorkspacePicker,
}: ReservationDateTimeSectionProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
          <CalendarDays size={26} strokeWidth={2.4} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Booking Details
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Select the reservation date and time. Availability refreshes each
            time the schedule changes.
          </p>
        </div>
      </div>

      {selectedWorkspaceName && (
        <div className="mb-7 rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
                <Building2 size={20} strokeWidth={2.4} />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-600">
                  Selected Workspace
                </p>

                <p className="mt-1 font-extrabold text-slate-950">
                  {selectedWorkspaceName}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={processing || checkingAvailability}
              onClick={onToggleWorkspacePicker}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-100 bg-white px-4 py-2.5 text-sm font-bold text-cyan-600 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {workspacePickerVisible ? "Hide Workspaces" : "Change Workspace"}
              {workspacePickerVisible ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        <DatePickerField
          label="Reservation Date"
          value={selectedDate}
          disabled={processing || checkingAvailability}
          min={minDate}
          onChange={onDateChange}
        />

        <TimeSlotPicker
          label="Time Slot"
          value={selectedSlot.label}
          options={timeSlots}
          disabled={processing || checkingAvailability || timeSlots.length === 0}
          onChange={onSlotChange}
        />
      </div>

      <div className="mt-8 flex items-end gap-4">
        {workspacePickerVisible && (
          <label className="flex-1">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Search Workspace
            </span>

            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                placeholder="Search by name, type, location, zone or amenity"
                disabled={processing}
              />
            </div>
          </label>
        )}

        <LoadingButton
          type="button"
          loading={checkingAvailability}
          loadingText="Checking..."
          onClick={onRefreshAvailability}
          className={workspacePickerVisible ? "" : "ml-auto"}
        >
          Refresh Availability
        </LoadingButton>
      </div>

      <AvailabilityMessage
        checkingAvailability={checkingAvailability}
        availabilityChecked={availabilityChecked}
        availabilityError={availabilityError}
        unavailableCount={unavailableCount}
      />

      <BusinessRuleNotice
        minNoticeViolation={minNoticeViolation}
        minNoticeMinutes={minNoticeMinutes}
        weekendViolation={weekendViolation}
      />

      {baseErrors.length > 0 && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {baseErrors.join(", ")}
        </div>
      )}
    </div>
  );
}