import { motion } from "motion/react";
import { CalendarPlus } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import NewReservationForm from "../../components/reservations/NewReservationForm";
import type { Workspace } from "../../types/workspace";

type NewReservationProps = {
  workspaces?: Workspace[];
  selected_workspace_id?: number | string | null;
  errors?: Record<string, string | string[]>;
};

export default function NewReservation({
  workspaces = [],
  selected_workspace_id = null,
  errors = {},
}: NewReservationProps) {
  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-sm font-bold uppercase tracking-wide text-cyan-500"
          >
            Reservation Flow
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl font-bold text-slate-950"
          >
            New Reservation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-slate-500"
          >
            Select a date, check availability and reserve an available
            workspace.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500"
        >
          <CalendarPlus size={24} strokeWidth={2.4} />
        </motion.div>
      </div>

      <NewReservationForm
        workspaces={workspaces}
        selectedWorkspaceId={selected_workspace_id}
        initialErrors={errors}
      />
    </AppLayout>
  );
}
