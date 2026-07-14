import { Link } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import EditReservationForm from "../../components/reservations/EditReservationForm";
import type { Reservation } from "../../types/reservation";
import type { Workspace } from "../../types/workspace";

type EditReservationProps = {
  reservation: Reservation;
  workspaces?: Workspace[];
  errors?: Record<string, string | string[]>;
};

export default function EditReservation({
  reservation,
  workspaces = [],
  errors = {},
}: EditReservationProps) {
  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 text-sm text-slate-400">
            <Link href="/reservations" className="hover:text-cyan-500">
              Reservations
            </Link>{" "}
            / Edit
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Edit Reservation
          </h1>

          <p className="mt-1 text-slate-500">
            Update workspace, schedule, or reservation status.
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
      />
    </AppLayout>
  );
}