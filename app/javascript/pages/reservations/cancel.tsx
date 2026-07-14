import { Link, router } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import { duration, formatDate, formatTime } from "../../utils/dateTime";
import type { Reservation } from "../../types/reservation";

type CancelReservationProps = {
  reservation: Reservation;
  cancel_error?: string | null;
};

export default function CancelReservation({
  reservation,
  cancel_error = null,
}: CancelReservationProps) {
  function handleCancelReservation() {
    router.delete(`/reservations/${reservation.id}`);
  }

  return (
    <AppLayout>
      <div className="relative min-h-[calc(100vh-10rem)] overflow-hidden rounded-xl bg-white">
        <div className="pointer-events-none absolute left-20 top-16 h-24 w-72 rounded-full bg-slate-100 blur-2xl" />
        <div className="pointer-events-none absolute right-20 top-32 h-20 w-80 rounded-full bg-red-100 blur-2xl" />
        <div className="pointer-events-none absolute bottom-20 left-32 h-20 w-72 rounded-full bg-slate-100 blur-2xl" />

        <div className="relative z-10 flex min-h-[calc(100vh-10rem)] items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-8 flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-500">
                !
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Cancel Reservation
                </h1>

                <p className="mt-1 text-slate-500">
                  This reservation will be marked as cancelled.
                </p>
              </div>
            </div>

            {cancel_error && (
              <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-500">
                    !
                  </div>

                  <div>
                    <h2 className="font-bold text-red-700">
                      Cancellation blocked
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-red-600">
                      {cancel_error}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-red-500">
                      The reservation remains active and was not changed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-base leading-7 text-slate-700">
                Are you sure you want to cancel this reservation for{" "}
                <span className="font-bold text-slate-900">
                  {reservation.workspace?.name || "this workspace"}
                </span>
                ?
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
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
              </div>

              <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-600">
                This action will not permanently delete the reservation. It will
                remain visible in the system with status{" "}
                <span className="font-bold">cancelled</span> for historical
                tracking.
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-slate-600">
              <span className="font-bold text-cyan-500">ⓘ</span>

              <p>
                Cancelling a reservation frees the workspace for the selected
                date and time, but the record remains available in the
                reservation history.
              </p>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/reservations"
                className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Go Back
              </Link>

              <button
                type="button"
                onClick={handleCancelReservation}
                className="rounded-lg bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-red-600"
              >
                Cancel Reservation
              </button>
            </div>
          </div>
        </div>
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