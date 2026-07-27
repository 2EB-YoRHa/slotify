import { motion } from "motion/react";
import AppLayout from "../../components/AppLayout";
import NewReservationForm from "../../components/reservations/NewReservationForm";
import type { Workspace } from "../../types/workspace";

type NewReservationProps = {
  workspaces?: Workspace[];
  selected_workspace_id?: number | string | null;
  initial_start_time?: string | null;
  initial_end_time?: string | null;
  initial_unavailable_workspace_ids?: number[];
  errors?: Record<string, string | string[]>;
};

export default function NewReservation({
  workspaces = [],
  selected_workspace_id = null,
  initial_start_time = null,
  initial_end_time = null,
  initial_unavailable_workspace_ids = [],
  errors = {},
}: NewReservationProps) {
  return (
    <AppLayout>
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-950"
        >
          Create Reservation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-2 max-w-2xl text-slate-500"
        >
          Choose a date, review workspace availability, and complete your booking.
        </motion.p>
      </div>

      <NewReservationForm
        workspaces={workspaces}
        selectedWorkspaceId={selected_workspace_id}
        initialStartTime={initial_start_time}
        initialEndTime={initial_end_time}
        initialUnavailableWorkspaceIds={initial_unavailable_workspace_ids}
        initialErrors={errors}
      />
    </AppLayout>
  );
}