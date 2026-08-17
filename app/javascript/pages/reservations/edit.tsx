import { motion } from "motion/react";
import AppLayout from "../../components/AppLayout";
import EditReservationForm from "../../components/reservations/EditReservationForm";
import BackLinkButton from "../../components/ui/BackLinkButton";
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
  return (
    <AppLayout>
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BackLinkButton href={`/reservations/${reservation.id}`}>
            Back to Reservation
          </BackLinkButton>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-5 wrap-break-word text-2xl font-black leading-tight text-slate-950 dark:text-slate-100 sm:mt-6 sm:text-3xl"
        >
          Edit Reservation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base"
        >
          {can_manage_status
            ? "Update workspace, schedule, attendees, notes, or reservation status."
            : "Update workspace, schedule, attendees, or notes for your booking."}
        </motion.p>
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