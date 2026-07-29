import {
  AlertTriangle,
  CalendarSearch,
  CheckCircle2,
} from "lucide-react";

export function BusinessRuleNotice({
  minNoticeViolation,
  minNoticeMinutes,
  weekendViolation,
}: {
  minNoticeViolation: boolean;
  minNoticeMinutes: number;
  weekendViolation: boolean;
}) {
  if (!minNoticeViolation && !weekendViolation) return null;

  return (
    <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />

      <div className="space-y-1">
        {minNoticeViolation && (
          <p>
            This organization requires reservations to be booked at least{" "}
            <span className="font-bold">{minNoticeMinutes} minutes</span> in
            advance. Please choose a later time slot.
          </p>
        )}

        {weekendViolation && (
          <p>
            Weekend bookings are disabled for this organization. Please choose a
            weekday.
          </p>
        )}
      </div>
    </div>
  );
}

export function AvailabilityMessage({
  checkingAvailability,
  availabilityChecked,
  availabilityError,
  unavailableCount,
}: {
  checkingAvailability: boolean;
  availabilityChecked: boolean;
  availabilityError: string | null;
  unavailableCount: number;
}) {
  if (checkingAvailability) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-700">
        <CalendarSearch size={18} className="mt-0.5 shrink-0" />
        <span>
          Checking availability automatically for the selected time slot...
        </span>
      </div>
    );
  }

  if (availabilityError) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <span>{availabilityError}</span>
      </div>
    );
  }

  if (!availabilityChecked) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <span>
          Availability has not been checked yet. You must check availability
          before creating the reservation.
        </span>
      </div>
    );
  }

  if (unavailableCount > 0) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <span>
          Availability checked. {unavailableCount} workspace
          {unavailableCount === 1 ? " is" : "s are"} unavailable for this time.
        </span>
      </div>
    );
  }

  return (
    <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
      <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
      <span>All workspaces are available for this time slot.</span>
    </div>
  );
}

export function ValidationNotice({
  availabilityChecked,
  selectedWorkspaceUnavailable,
  attendeesExceedCapacity,
  minNoticeViolation,
  minNoticeMinutes,
  weekendViolation,
}: {
  availabilityChecked: boolean;
  selectedWorkspaceUnavailable: boolean;
  attendeesExceedCapacity: boolean;
  minNoticeViolation: boolean;
  minNoticeMinutes: number;
  weekendViolation: boolean;
}) {
  if (!availabilityChecked) {
    return (
      <div className="mt-5 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
        Check availability before creating the reservation.
      </div>
    );
  }

  if (minNoticeViolation) {
    return (
      <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        Reservations must be booked at least {minNoticeMinutes} minutes in
        advance.
      </div>
    );
  }

  if (weekendViolation) {
    return (
      <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        Weekend bookings are disabled for this organization.
      </div>
    );
  }

  if (selectedWorkspaceUnavailable) {
    return (
      <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        The selected workspace is not available for this time slot.
      </div>
    );
  }

  if (attendeesExceedCapacity) {
    return (
      <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        Attendees exceed the selected workspace capacity.
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
      Reservation is ready to be created.
    </div>
  );
}