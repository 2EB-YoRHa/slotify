import AppLayout from "../../components/AppLayout";
import NewReservationForm from "../../components/reservations/NewReservationForm";
import type { Workspace } from "../../types/workspace";

type NewReservationProps = {
  workspaces?: Workspace[];
  selected_workspace_id?: number | string | null;
  errors?: string[];
};

export default function NewReservation({
  workspaces = [],
  selected_workspace_id = null,
  errors = [],
}: NewReservationProps) {
  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            New Reservation
          </h1>

          <p className="mt-1 text-slate-500">
            Select a workspace that fits your mission.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
          >
            Filters
          </button>

          <button
            type="button"
            className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-white"
          >
            Recommended
          </button>
        </div>
      </div>

      <NewReservationForm
        workspaces={workspaces}
        selectedWorkspaceId={selected_workspace_id}
        errors={errors}
      />
    </AppLayout>
  );
}