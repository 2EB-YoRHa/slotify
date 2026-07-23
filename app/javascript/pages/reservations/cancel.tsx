import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { formatDate, formatTime, duration } from "../../utils/dateTime";
import type { Reservation } from "../../types/reservation";

type CancelReservationProps = {
  reservation: Reservation;
  cancel_error?: string | null;
};

export default function CancelReservation({
  reservation,
  cancel_error = null,
}: CancelReservationProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  function confirmCancelReservation() {
    setProcessing(true);

    router.delete(`/reservations/${reservation.id}`, {
      onFinish: () => {
        setProcessing(false);
        setConfirmOpen(false);
      },
    });
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href={`/reservations/${reservation.id}`}
            className="text-sm font-bold text-cyan-500 hover:text-cyan-600"
          >
            ← Back to Reservation
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-950">
            Cancel Reservation
          </h1>

          <p className="mt-2 text-slate-500">
            Review the reservation details before cancelling this booking.
          </p>
        </div>

        {cancel_error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-5 text-sm leading-6 text-red-600">
            <p className="font-bold">Cancellation blocked</p>
            <p className="mt-1">{cancel_error}</p>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-wide text-red-500">
                Dangerous Action
              </p>

              <h2 className="text-2xl font-bold text-slate-950">
                Are you sure you want to cancel this reservation?
              </h2>

              <p className="mt-3 leading-7 text-slate-500">
                This action will mark the reservation as cancelled. The
                workspace will become available again if the booking rules allow
                the cancellation.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-500">
              !
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-6">
            <InfoRow
              label="Workspace"
              value={reservation.workspace?.name || "Workspace removed"}
            />

            <InfoRow
              label="Date"
              value={formatDate(reservation.start_time)}
            />

            <InfoRow
              label="Time"
              value={`${formatTime(reservation.start_time)} - ${formatTime(
                reservation.end_time
              )}`}
            />

            <InfoRow
              label="Duration"
              value={duration(reservation.start_time, reservation.end_time)}
            />

            <InfoRow
              label="Status"
              value={formatText(reservation.status)}
            />

            <InfoRow
              label="Attendees"
              value={reservation.attendees_count || 1}
            />
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Link
              href={`/reservations/${reservation.id}`}
              className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Keep Reservation
            </Link>

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={Boolean(cancel_error)}
              className="rounded-lg bg-red-500 px-6 py-3 text-sm font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel Reservation
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel reservation?"
        description={`This will cancel your reservation for ${
          reservation.workspace?.name || "this workspace"
        } on ${formatDate(reservation.start_time)} from ${formatTime(
          reservation.start_time
        )} to ${formatTime(reservation.end_time)}.`}
        confirmText="Cancel Reservation"
        cancelText="Keep Reservation"
        danger
        processing={processing}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmCancelReservation}
      />
    </AppLayout>
  );
}

type InfoRowProps = {
  label: string;
  value: string | number;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-4 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-950">{value}</span>
    </div>
  );
}

function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}