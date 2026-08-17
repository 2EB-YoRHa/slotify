import { Link, router } from "@inertiajs/react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Building2,
  CalendarX,
  CheckCircle2,
  Clock3,
  ShieldAlert,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import LoadingButton from "../../components/ui/LoadingButton";
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
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href={`/reservations/${reservation.id}`}
            className="inline-flex max-w-full items-center gap-2 text-sm font-bold text-cyan-500 transition hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
          >
            <ArrowLeft size={16} className="shrink-0" />
            <span className="truncate">Back to Reservation</span>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-5 wrap-break-word text-2xl font-black leading-tight text-slate-950 dark:text-slate-100 sm:mt-6 sm:text-3xl"
        >
          Cancel Reservation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base"
        >
          Review the reservation details and confirm whether this booking should
          be cancelled.
        </motion.p>
      </div>

      {cancel_error && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 transition-colors dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 sm:mb-8 sm:p-5"
        >
          <ShieldAlert size={20} className="mt-0.5 shrink-0" />

          <div className="min-w-0">
            <p className="font-bold">Cancellation blocked</p>
            <p className="mt-1 wrap-break-word leading-6">{cancel_error}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="space-y-6 xl:col-span-2 xl:space-y-8"
        >
          <div className="rounded-xl border border-red-100 bg-white p-5 shadow-sm transition-colors dark:border-red-500/20 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8">
            <div className="mb-6 flex items-start gap-3 sm:mb-8 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition-colors dark:bg-red-500/10 dark:text-red-300 sm:h-14 sm:w-14">
                <Ban size={26} strokeWidth={2.4} />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
                  Are you sure you want to cancel this reservation?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  This action will mark the reservation as cancelled. The
                  workspace may become available again depending on your booking
                  rules.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <InfoCard
                icon={Building2}
                label="Workspace"
                value={reservation.workspace?.name || "Workspace removed"}
              />

              <InfoCard
                icon={CalendarX}
                label="Date"
                value={formatDate(reservation.start_time)}
              />

              <InfoCard
                icon={Clock3}
                label="Time"
                value={`${formatTime(reservation.start_time)} - ${formatTime(
                  reservation.end_time,
                )}`}
              />

              <InfoCard
                icon={Clock3}
                label="Duration"
                value={duration(reservation.start_time, reservation.end_time)}
              />

              <InfoCard
                icon={UsersRound}
                label="Attendees"
                value={reservation.attendees_count || 1}
              />

              <InfoCard
                icon={CheckCircle2}
                label="Current Status"
                value={formatText(reservation.status)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-4 transition-colors dark:border-yellow-500/20 dark:bg-yellow-500/10 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={22}
                className="mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-300"
              />

              <div className="min-w-0">
                <h3 className="font-bold text-yellow-800 dark:text-yellow-200">
                  Important cancellation notice
                </h3>

                <p className="mt-2 text-sm leading-6 text-yellow-700 dark:text-yellow-200/90">
                  Cancelled reservations remain in the system for historical
                  records. This helps preserve audit history and reporting data.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="space-y-6 xl:sticky xl:top-24 xl:self-start"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
                Cancellation Summary
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Confirm the reservation information before continuing.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 transition-colors dark:bg-slate-800/60 sm:p-5">
              <SummaryRow
                label="Workspace"
                value={reservation.workspace?.name || "Workspace removed"}
              />

              <SummaryRow
                label="Date"
                value={formatDate(reservation.start_time)}
              />

              <SummaryRow
                label="Time"
                value={`${formatTime(reservation.start_time)} - ${formatTime(
                  reservation.end_time,
                )}`}
              />

              <SummaryRow
                label="Status"
                value={formatText(reservation.status)}
              />
            </div>

            {cancel_error ? (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-600 transition-colors dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                This reservation cannot be cancelled right now.
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm leading-6 text-green-700 transition-colors dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
                This reservation is eligible for cancellation.
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <LoadingButton
                type="button"
                variant="danger"
                loading={processing}
                loadingText="Cancelling..."
                disabled={Boolean(cancel_error)}
                onClick={() => setConfirmOpen(true)}
                className="w-full"
              >
                Cancel Reservation
              </LoadingButton>

              <Link
                href={`/reservations/${reservation.id}`}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Keep Reservation
              </Link>
            </div>
          </div>
        </motion.aside>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel reservation?"
        description={`This will cancel your reservation for ${
          reservation.workspace?.name || "this workspace"
        } on ${formatDate(reservation.start_time)} from ${formatTime(
          reservation.start_time,
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

type InfoCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors dark:border-slate-700 dark:bg-slate-800/60 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <Icon size={16} className="shrink-0" />
        <p className="truncate text-xs font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="wrap-break-word text-sm font-bold text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-200 py-3 last:border-0 dark:border-slate-700 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="wrap-break-word text-sm font-bold text-slate-950 dark:text-slate-100 sm:text-right">
        {value}
      </span>
    </div>
  );
}

function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}