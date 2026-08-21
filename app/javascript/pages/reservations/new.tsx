import { usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import AppLayout from "../../components/AppLayout";
import NewReservationForm from "../../components/reservations/NewReservationForm";
import BackLinkButton from "../../components/ui/BackLinkButton";
import type { BookingRule } from "../../types/bookingRule";
import type { BookingTimeSlot } from "../../types/bookingTimeSlot";
import type { SharedPageProps } from "../../types/layout";
import type { Workspace } from "../../types/workspace";

type NewReservationProps = {
  workspaces?: Workspace[];
  selected_workspace_id?: number | string | null;
  initial_start_time?: string | null;
  initial_end_time?: string | null;
  initial_unavailable_workspace_ids?: number[];
  errors?: Record<string, string | string[]>;
  booking_rule?: BookingRule | null;
  booking_time_slots?: BookingTimeSlot[];
};

export default function NewReservation({
  workspaces = [],
  selected_workspace_id = null,
  initial_start_time = null,
  initial_end_time = null,
  initial_unavailable_workspace_ids = [],
  errors = {},
  booking_rule = null,
  booking_time_slots = [],
}: NewReservationProps) {
  const { props } = usePage<SharedPageProps>();
  const currentRole = props.current_user?.role;

  const isMember = currentRole === "member";
  const backHref = isMember ? "/my_reservations" : "/reservations";
  const backLabel = isMember ? "Back to My Bookings" : "Back to Reservations";

  return (
    <AppLayout>
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BackLinkButton href={backHref}>{backLabel}</BackLinkButton>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-5 wrap-break-word text-2xl font-black leading-tight text-slate-950 dark:text-slate-100 sm:mt-6 sm:text-3xl"
        >
          New Reservation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base"
        >
          Choose a date, time slot, workspace, attendees, and notes. Slotify
          validates availability before creating the booking.
        </motion.p>
      </div>

      <NewReservationForm
        workspaces={workspaces}
        selectedWorkspaceId={selected_workspace_id}
        initialStartTime={initial_start_time}
        initialEndTime={initial_end_time}
        initialUnavailableWorkspaceIds={initial_unavailable_workspace_ids}
        initialErrors={errors}
        maxReservationHours={booking_rule?.max_hours_per_reservation}
        minNoticeMinutes={booking_rule?.min_notice_minutes}
        allowWeekendBookings={booking_rule?.allow_weekend_bookings}
        bookingTimeSlots={booking_time_slots}
      />
    </AppLayout>
  );
}