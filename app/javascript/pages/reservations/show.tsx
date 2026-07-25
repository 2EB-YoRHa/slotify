import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Ban,
  Building2,
  CalendarCheck,
  CalendarDays,
  Clock3,
  DollarSign,
  Edit3,
  Layers3,
  MapPin,
  StickyNote,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import ReservationStatusBadge from "../../components/reservations/ReservationStatusBadge";
import { duration, formatDate, formatTime } from "../../utils/dateTime";
import type { Reservation } from "../../types/reservation";

type ReservationShowProps = {
  reservation: Reservation;
};

export default function ReservationShow({ reservation }: ReservationShowProps) {
  const canModify = canModifyReservation(reservation);

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/reservations"
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
            >
              <ArrowLeft size={16} />
              Back to Reservations
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="mt-6 text-sm font-bold uppercase tracking-wide text-cyan-500"
          >
            Reservation Details
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-2 text-3xl font-bold text-slate-950"
          >
            {reservation.workspace?.name || "Workspace Reservation"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-1 text-slate-500"
          >
            Review reservation information, schedule, status and workspace
            details.
          </motion.p>
        </div>

        {canModify && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-3"
          >
            <Link
              href={`/reservations/${reservation.id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 hover:shadow-md"
            >
              <Edit3 size={18} />
              Edit
            </Link>

            <Link
              href={`/reservations/${reservation.id}/cancel`}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-md"
            >
              <Ban size={18} />
              Cancel
            </Link>
          </motion.div>
        )}
      </div>

      <section className="mb-8 grid grid-cols-4 gap-6">
        <SummaryCard
          index={0}
          icon={CalendarDays}
          label="Date"
          value={formatDate(reservation.start_time)}
          helper="Reservation day"
        />

        <SummaryCard
          index={1}
          icon={Clock3}
          label="Time"
          value={`${formatTime(reservation.start_time)} - ${formatTime(
            reservation.end_time,
          )}`}
          helper={duration(reservation.start_time, reservation.end_time)}
        />

        <SummaryCard
          index={2}
          icon={UsersRound}
          label="Attendees"
          value={reservation.attendees_count || 1}
          helper="People expected"
        />

        <SummaryCard
          index={3}
          icon={CalendarCheck}
          label="Status"
          value={formatText(reservation.status)}
          helper="Current booking state"
        />
      </section>

      <section className="grid grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="col-span-2 space-y-8"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                  <Building2 size={26} strokeWidth={2.4} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Workspace Information
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Details about the space assigned to this reservation.
                  </p>
                </div>
              </div>

              <ReservationStatusBadge status={reservation.status} />
            </div>

            <div className="grid grid-cols-3 gap-5">
              <InfoCard
                icon={Building2}
                label="Workspace"
                value={reservation.workspace?.name || "Workspace removed"}
              />

              <InfoCard
                icon={Layers3}
                label="Type"
                value={formatText(reservation.workspace?.workspace_type)}
              />

              <InfoCard
                icon={UsersRound}
                label="Capacity"
                value={reservation.workspace?.capacity || "-"}
              />

              <InfoCard
                icon={DollarSign}
                label="Hourly Rate"
                value={formatRate(reservation.workspace?.hourly_rate)}
              />

              <InfoCard
                icon={Building2}
                label="Floor"
                value={reservation.workspace?.floor || "-"}
              />

              <InfoCard
                icon={MapPin}
                label="Zone"
                value={reservation.workspace?.zone || "-"}
              />

              <div className="col-span-3">
                <InfoCard
                  icon={MapPin}
                  label="Location"
                  value={reservation.workspace?.location || "-"}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                <UserRound size={26} strokeWidth={2.4} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Reserved By
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  User assigned to this reservation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-lg font-extrabold text-cyan-500">
                {initials(reservation.user?.name)}
              </div>

              <div>
                <p className="text-lg font-bold text-slate-950">
                  {reservation.user?.name || "Unknown user"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {reservation.user?.email || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                <StickyNote size={26} strokeWidth={2.4} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-950">Notes</h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Additional information added to this reservation.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              {reservation.notes || "No notes were added to this reservation."}
            </div>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="space-y-6"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                <CalendarCheck size={26} strokeWidth={2.4} />
              </div>

              <h2 className="text-2xl font-bold text-slate-950">
                Booking Summary
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Quick overview of this reservation.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
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
                label="Duration"
                value={duration(reservation.start_time, reservation.end_time)}
              />

              <SummaryRow
                label="Hourly Rate"
                value={formatRate(reservation.workspace?.hourly_rate)}
              />

              <SummaryRow
                label="Floor"
                value={reservation.workspace?.floor || "-"}
              />

              <SummaryRow
                label="Zone"
                value={reservation.workspace?.zone || "-"}
              />

              <SummaryRow
                label="Status"
                value={formatText(reservation.status)}
              />
            </div>

            {canModify ? (
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href={`/reservations/${reservation.id}/edit`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-500"
                >
                  <Edit3 size={16} />
                  Edit Reservation
                </Link>

                <Link
                  href={`/reservations/${reservation.id}/cancel`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-6 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"
                >
                  <Ban size={16} />
                  Cancel Reservation
                </Link>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                This reservation can no longer be modified.
              </div>
            )}
          </div>
        </motion.aside>
      </section>
    </AppLayout>
  );
}

type SummaryCardProps = {
  index: number;
  icon: LucideIcon;
  label: string;
  value: string | number;
  helper: string;
};

function SummaryCard({
  index,
  icon: Icon,
  label,
  value,
  helper,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">{value}</h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          <Icon size={19} strokeWidth={2.4} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{helper}</p>
    </motion.div>
  );
}

type InfoCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Icon size={16} />
        <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
      </div>

      <p className="wrap-break-word text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-bold text-slate-950">
        {value}
      </span>
    </div>
  );
}

function canModifyReservation(reservation: Reservation): boolean {
  if (reservation.status === "cancelled") return false;

  return new Date(reservation.end_time).getTime() >= Date.now();
}

function initials(name?: string | null): string {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRate(value?: string | number | null): string {
  const amount = Number(value || 0);

  return `$${amount.toFixed(2)}/h`;
}

function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}
