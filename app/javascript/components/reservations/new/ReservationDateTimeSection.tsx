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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-3 sm:mb-8 sm:gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 sm:h-14 sm:w-14">
          <CalendarDays size={24} strokeWidth={2.4} />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-black text-slate-950 dark:text-slate-100 sm:text-2xl">
            Booking Details
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Select the reservation date and time. Availability refreshes each
            time the schedule changes.
          </p>
        </div>
      </div>

      {selectedWorkspaceName && (
        <div className="mb-6 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 transition-colors dark:border-cyan-500/20 dark:bg-cyan-500/10 sm:mb-8 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                <Building2 size={20} strokeWidth={2.4} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-600 dark:text-cyan-300">
                  Selected Workspace
                </p>

                <p className="mt-1 truncate font-extrabold text-slate-950 dark:text-slate-100">
                  {selectedWorkspaceName}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={processing || checkingAvailability}
              onClick={onToggleWorkspacePicker}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-100 bg-white px-4 py-3 text-sm font-bold text-cyan-600 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-cyan-500/30 dark:bg-slate-900 dark:text-cyan-300 dark:hover:bg-cyan-500/10 sm:w-auto sm:py-2.5"
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

      <div className="space-y-6 sm:space-y-7">
        <div className="w-full max-w-xl">
          <DatePickerField
            label="Reservation Date"
            value={selectedDate}
            disabled={processing || checkingAvailability}
            min={minDate}
            onChange={onDateChange}
          />
        </div>

        <TimeSlotPicker
          label="Time Slot"
          value={selectedSlot.label}
          options={timeSlots}
          disabled={processing || checkingAvailability || timeSlots.length === 0}
          onChange={onSlotChange}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        {workspacePickerVisible ? (
          <label className="block min-w-0">
            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Search Workspace
            </span>

            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20"
                placeholder="Search by name, type, location, zone or amenity"
                disabled={processing}
              />
            </div>
          </label>
        ) : (
          <div className="hidden lg:block" />
        )}

        <LoadingButton
          type="button"
          loading={checkingAvailability}
          loadingText="Checking..."
          onClick={onRefreshAvailability}
          className="w-full lg:w-auto"
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
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-600 transition-colors dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {baseErrors.join(", ")}
        </div>
      )}
    </div>
  );
}