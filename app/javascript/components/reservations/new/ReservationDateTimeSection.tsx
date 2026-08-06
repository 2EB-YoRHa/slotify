import { CalendarDays, Search } from "lucide-react";
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
  onDateChange: (date: string) => void;
  onSlotChange: (slotLabel: string) => void;
  onSearchChange: (search: string) => void;
  onRefreshAvailability: () => void;
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
  onDateChange,
  onSlotChange,
  onSearchChange,
  onRefreshAvailability,
}: ReservationDateTimeSectionProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
          <CalendarDays size={26} strokeWidth={2.4} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-950">Date & Time</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Choose when the workspace will be reserved. If your organization has
            active custom time slots, reservations must use one of those
            configured blocks.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="max-w-xl">
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
          disabled={processing || checkingAvailability}
          onChange={onSlotChange}
        />
      </div>

      <div className="mt-8 flex items-end gap-4">
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
              placeholder="Search by name, type or location"
              disabled={processing}
            />
          </div>
        </label>

        <LoadingButton
          type="button"
          loading={checkingAvailability}
          loadingText="Checking..."
          onClick={onRefreshAvailability}
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
