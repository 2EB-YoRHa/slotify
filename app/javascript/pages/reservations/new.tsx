import { motion } from "motion/react";
import AppLayout from "../../components/AppLayout";
import NewReservationForm from "../../components/reservations/NewReservationForm";
import type { Workspace } from "../../types/workspace";
import type { BookingRule } from "../../types/bookingRule";
import type { BookingTimeSlot } from "../../types/bookingTimeSlot";

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
  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === Number(selected_workspace_id),
  );

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between gap-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-slate-950"
          >
            {selectedWorkspace ? "Reserve Workspace" : "Create Reservation"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 max-w-2xl text-sm leading-6 text-slate-500"
          >
            {selectedWorkspace
              ? `Complete the booking details for ${selectedWorkspace.name}.`
              : "Choose a workspace, select an available time, and confirm your booking."}
          </motion.p>
        </div>
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