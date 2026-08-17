import { AlertTriangle, CalendarSearch, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

type UpdateValidationNoticeProps = {
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
};

export default function UpdateValidationNotice({
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
}: UpdateValidationNoticeProps) {
  if (checkingAvailability) {
    return (
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-700 transition-colors dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300">
        <CalendarSearch size={18} className="mt-0.5 shrink-0" />
        <span>Checking availability for this time slot...</span>
      </div>
    );
  }

  if (availabilityError) {
    return <ErrorNotice>{availabilityError}</ErrorNotice>;
  }

  if (noCustomSlotsForSelectedDate) {
    return (
      <ErrorNotice>
        There are no active custom time slots available for the selected date.
      </ErrorNotice>
    );
  }

  if (customTimeSlotViolation) {
    return (
      <ErrorNotice>
        This reservation must use one of the organization's active custom time
        slots before it can be saved.
      </ErrorNotice>
    );
  }

  if (!availabilityChecked) {
    return (
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700 transition-colors dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-200">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <span>Availability must be checked before saving changes.</span>
      </div>
    );
  }

  if (minNoticeViolation) {
    return (
      <ErrorNotice>
        Reservations must be booked at least {minNoticeMinutes} minutes in
        advance.
      </ErrorNotice>
    );
  }

  if (weekendViolation) {
    return (
      <ErrorNotice>
        Weekend bookings are disabled for this organization.
      </ErrorNotice>
    );
  }

  if (selectedWorkspaceUnavailable) {
    return (
      <ErrorNotice>
        The selected workspace is not available for this time slot.
      </ErrorNotice>
    );
  }

  if (attendeesExceedCapacity) {
    return (
      <ErrorNotice>Attendees exceed the selected workspace capacity.</ErrorNotice>
    );
  }

  return (
    <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700 transition-colors dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
      <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
      <span>Reservation is ready to be updated.</span>
    </div>
  );
}

function ErrorNotice({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 transition-colors dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}