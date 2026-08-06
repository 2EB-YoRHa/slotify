import { CheckCircle2 } from "lucide-react";

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
      <div className="mt-5 rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-700">
        Checking availability for this time slot...
      </div>
    );
  }

  if (availabilityError) {
    return (
      <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        {availabilityError}
      </div>
    );
  }

  if (noCustomSlotsForSelectedDate) {
    return (
      <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        There are no active custom time slots available for the selected date.
      </div>
    );
  }

  if (customTimeSlotViolation) {
    return (
      <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        This reservation must use one of the organization's active custom time
        slots before it can be saved.
      </div>
    );
  }

  if (!availabilityChecked) {
    return (
      <div className="mt-5 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
        Availability must be checked before saving changes.
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
    <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
      <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
      <span>Reservation is ready to be updated.</span>
    </div>
  );
}