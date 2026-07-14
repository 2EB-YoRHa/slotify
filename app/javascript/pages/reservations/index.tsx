import { Link } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import ReservationsEmptyState from "../../components/reservations/ReservationsEmptyState";
import ReservationsTable from "../../components/reservations/ReservationsTable";
import type { Reservation } from "../../types/reservation";

type ReservationsIndexProps = {
  reservations?: Reservation[];
};

export default function ReservationsIndex({
  reservations = [],
}: ReservationsIndexProps) {
  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Reservations Management
          </h1>

          <p className="mt-1 text-slate-500">
            Review, update, and manage workspace reservations.
          </p>
        </div>

        <Link
          href="/reservations/new"
          className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500"
        >
          + New Reservation
        </Link>
      </div>

      {reservations.length === 0 ? (
        <ReservationsEmptyState />
      ) : (
        <ReservationsTable reservations={reservations} />
      )}
    </AppLayout>
  );
}