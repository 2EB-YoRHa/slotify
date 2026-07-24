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
}: NewReservationProps) {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          New Reservation
        </h1>

        <p className="mt-1 text-slate-500">
          Select a date, check availability and reserve a workspace.
        </p>
      </div>

      <NewReservationForm workspaces={workspaces} />
    </AppLayout>
  );
}