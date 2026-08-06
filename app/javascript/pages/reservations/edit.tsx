import { Link } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import EditReservationForm from "../../components/reservations/EditReservationForm";
import type { BookingRule } from "../../types/bookingRule";
import type { BookingTimeSlot } from "../../types/bookingTimeSlot";
import type { Reservation } from "../../types/reservation";
import type { Workspace } from "../../types/workspace";

type EditReservationProps = {
  reservation: Reservation;
  workspaces?: Workspace[];
  errors?: Record<string, string | string[]>;
  booking_rule?: BookingRule | null;
  booking_time_slots?: BookingTimeSlot[];
  can_manage_status?: boolean;
  initial_unavailable_workspace_ids?: number[];
};

export default function EditReservation({
  reservation,
  workspaces = [],
  errors = {},
  booking_rule = null,
  booking_time_slots = [],
  can_manage_status = false,
  initial_unavailable_workspace_ids = [],
}: EditReservationProps) {
  const reservationsHref = can_manage_status
    ? "/reservations"
    : "/my_reservations";

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 text-sm text-slate-400">
            <Link href={reservationsHref} className="hover:text-cyan-500">
              {can_manage_status ? "Reservations" : "My Bookings"}
            </Link>{" "}
            / Edit
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Edit Reservation
          </h1>

          <p className="mt-1 text-slate-500">
            {can_manage_status
              ? "Update workspace, schedule, attendees, notes, or reservation status."
              : "Update workspace, schedule, attendees, or notes for your booking."}
          </p>
        </div>

        <Link
          href={`/reservations/${reservation.id}`}
          className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Back to Details
        </Link>
      </div>

      <EditReservationForm
        reservation={reservation}
        workspaces={workspaces}
        errors={errors}
        maxReservationHours={booking_rule?.max_hours_per_reservation}
        minNoticeMinutes={booking_rule?.min_notice_minutes}
        allowWeekendBookings={booking_rule?.allow_weekend_bookings}
        bookingTimeSlots={booking_time_slots}
        canManageStatus={can_manage_status}
        initialUnavailableWorkspaceIds={initial_unavailable_workspace_ids}
      />
    </AppLayout>
  );
}