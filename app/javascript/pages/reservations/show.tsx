import { Link } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import ReservationStatusBadge from "../../components/reservations/ReservationStatusBadge";
import { duration, formatDate, formatTime } from "../../utils/dateTime";
import type { Reservation } from "../../types/reservation";

type ReservationShowProps = {
  reservation: Reservation;
};

export default function ReservationShow({ reservation }: ReservationShowProps) {
  const isCancelled = reservation.status === "cancelled";

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 text-sm text-slate-400">
            <Link href="/reservations" className="hover:text-cyan-500">
              Reservations
            </Link>{" "}
            / Details
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Reservation Details
          </h1>

          <p className="mt-1 text-slate-500">
            Review the full information for this workspace booking.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/reservations"
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Back
          </Link>

          {!isCancelled && (
            <Link
              href={`/reservations/${reservation.id}/edit`}
              className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500"
            >
              Edit Reservation
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <section className="col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {reservation.workspace?.name || "Workspace removed"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {formatType(reservation.workspace?.workspace_type)}
                </p>
              </div>

              <ReservationStatusBadge status={reservation.status} />
            </div>

            <div className="grid grid-cols-3 gap-5">
              <InfoCard
                label="Date"
                value={formatDate(reservation.start_time)}
              />

              <InfoCard
                label="Time"
                value={`${formatTime(reservation.start_time)} - ${formatTime(
                  reservation.end_time
                )}`}
              />

              <InfoCard
                label="Duration"
                value={duration(reservation.start_time, reservation.end_time)}
              />

              <InfoCard
                label="Attendees"
                value={`${reservation.attendees_count || 1} people`}
              />

              <InfoCard
                label="Total Price"
                value={`$${reservation.total_price || 0}`}
              />

              <InfoCard
                label="Status"
                value={capitalize(reservation.status)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Notes</h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              {reservation.notes || "No notes were added to this reservation."}
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Reserved By</h2>

            <div className="mt-5 space-y-4 text-sm">
              <SummaryItem
                label="Name"
                value={reservation.user?.name || "Unknown user"}
              />

              <SummaryItem
                label="Email"
                value={reservation.user?.email || "-"}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Workspace</h2>

            <div className="mt-5 space-y-4 text-sm">
              <SummaryItem
                label="Name"
                value={reservation.workspace?.name || "Workspace removed"}
              />

              <SummaryItem
                label="Type"
                value={formatType(reservation.workspace?.workspace_type)}
              />

              <SummaryItem
                label="Capacity"
                value={
                  reservation.workspace?.capacity
                    ? `${reservation.workspace.capacity} people`
                    : "-"
                }
              />
            </div>
          </div>

          {!isCancelled && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-6">
              <h2 className="font-bold text-red-700">Danger Zone</h2>

              <p className="mt-2 text-sm leading-6 text-red-600">
                Cancelling this reservation will keep the record in the system
                but mark it as cancelled.
              </p>

              <Link
                href={`/reservations/${reservation.id}/cancel`}
                className="mt-5 block w-full rounded-lg bg-red-500 px-5 py-3 text-center text-sm font-bold text-white hover:bg-red-600"
              >
                Cancel Reservation
              </Link>
            </div>
          )}
        </aside>
      </div>
    </AppLayout>
  );
}

type InfoCardProps = {
  label: string;
  value: string | number;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-bold text-slate-900">{value}</p>
    </div>
  );
}

type SummaryItemProps = {
  label: string;
  value: string | number;
};

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

function formatType(type?: string | null): string {
  if (!type) return "-";

  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function capitalize(value?: string | null): string {
  if (!value) return "-";

  return value.charAt(0).toUpperCase() + value.slice(1);
}