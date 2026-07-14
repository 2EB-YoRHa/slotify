import { Link } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import ReservationStatusBadge from "../../components/reservations/ReservationStatusBadge";
import { duration, formatDate, formatTime } from "../../utils/dateTime";
import type { Reservation } from "../../types/reservation";

type MyReservationsProps = {
  reservations?: Reservation[];
};

export default function MyReservations({
  reservations = [],
}: MyReservationsProps) {
  const activeReservations = reservations.filter(
    (reservation) => reservation.status !== "cancelled"
  );

  const cancelledReservations = reservations.filter(
    (reservation) => reservation.status === "cancelled"
  );

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            My Reservations
          </h1>

          <p className="mt-1 text-slate-500">
            View and manage the workspaces you have booked.
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
        <NoMyReservations />
      ) : (
        <div className="grid grid-cols-3 gap-8">
          <section className="col-span-2 space-y-6">
            <ReservationSection
              title="Upcoming Bookings"
              description="Your active workspace reservations."
              badge={`${activeReservations.length} active`}
              reservations={activeReservations}
              emptyMessage="You do not have active reservations."
            />

            {cancelledReservations.length > 0 && (
              <ReservationSection
                title="Cancelled Reservations"
                description="These bookings remain visible for history."
                reservations={cancelledReservations}
                emptyMessage="You do not have cancelled reservations."
              />
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Reservation Summary
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                <SummaryItem label="Total" value={reservations.length} />
                <SummaryItem label="Active" value={activeReservations.length} />
                <SummaryItem
                  label="Cancelled"
                  value={cancelledReservations.length}
                />
              </div>
            </div>

            <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-6">
              <h2 className="font-bold text-slate-800">Quick Tip</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                You can cancel an active reservation from this page. Cancelled
                reservations are not deleted; they remain in your history.
              </p>
            </div>
          </aside>
        </div>
      )}
    </AppLayout>
  );
}

type ReservationSectionProps = {
  title: string;
  description: string;
  reservations: Reservation[];
  emptyMessage: string;
  badge?: string;
};

function ReservationSection({
  title,
  description,
  reservations,
  emptyMessage,
  badge,
}: ReservationSectionProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>

          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        {badge && (
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-500">
            {badge}
          </span>
        )}
      </div>

      {reservations.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-400">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
      )}
    </div>
  );
}

type ReservationCardProps = {
  reservation: Reservation;
};

function ReservationCard({ reservation }: ReservationCardProps) {
  const isCancelled = reservation.status === "cancelled";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-5">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">
              {reservation.workspace?.name || "Workspace removed"}
            </h3>

            <ReservationStatusBadge status={reservation.status} />
          </div>

          <p className="text-sm text-slate-500">
            {formatType(reservation.workspace?.workspace_type)}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <InfoItem label="Date" value={formatDate(reservation.start_time)} />

            <InfoItem
              label="Time"
              value={`${formatTime(reservation.start_time)} - ${formatTime(
                reservation.end_time
              )}`}
            />

            <InfoItem
              label="Duration"
              value={duration(reservation.start_time, reservation.end_time)}
            />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Attendees:{" "}
            <span className="font-bold text-slate-800">
              {reservation.attendees_count || 1}
            </span>
          </p>
        </div>

        <div className="flex min-w-32 flex-col gap-3">
          <Link
            href={`/reservations/${reservation.id}`}
            className="rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            View
          </Link>

          {!isCancelled && (
            <Link
              href={`/reservations/${reservation.id}/cancel`}
              className="rounded-lg bg-red-500 px-4 py-2 text-center text-sm font-bold text-white hover:bg-red-600"
            >
              Cancel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function NoMyReservations() {
  return (
    <div className="flex min-h-[650px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="max-w-lg text-center">
        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-slate-300 bg-cyan-50 text-6xl text-cyan-400">
          ◴

          <div className="absolute -right-2 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-400 text-lg text-white">
            +
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          No reservations yet
        </h2>

        <p className="mt-4 text-lg leading-8 text-slate-500">
          You have not booked any workspaces yet. Create your first reservation
          and it will appear here.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/reservations/new"
            className="rounded-lg bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500"
          >
            + Create Reservation
          </Link>

          <Link
            href="/workspaces"
            className="rounded-lg border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Browse Workspaces
          </Link>
        </div>
      </div>
    </div>
  );
}

type InfoItemProps = {
  label: string;
  value: string | number;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-900">{value}</p>
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