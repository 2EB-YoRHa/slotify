import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Clock3,
  UserRound,
} from "lucide-react";
import ReservationStatusBadge from "../reservations/ReservationStatusBadge";
import { formatDate, formatTime } from "../../utils/dateTime";
import { formatText } from "../../utils/reservationFormUtils";
import { EmptyPanelMessage, IconBox } from "./DashboardShared";
import type { UpcomingReservation } from "../../types/dashboardTypes";

type DashboardUpcomingReservationsProps = {
  reservations: UpcomingReservation[];
};

export default function DashboardUpcomingReservations({
  reservations,
}: DashboardUpcomingReservationsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 xl:col-span-2"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 transition-colors dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <IconBox icon={CalendarCheck} />

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
              Upcoming Reservations
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Next confirmed or pending bookings.
            </p>
          </div>
        </div>

        <Link
          href="/reservations"
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300 sm:w-auto"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="p-4 sm:p-6">
          <EmptyPanelMessage message="No upcoming reservations yet." />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
            {reservations.map((reservation, index) => (
              <UpcomingReservationCard
                key={reservation.id}
                reservation={reservation}
                index={index}
              />
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-205 table-fixed text-left text-sm">
              <colgroup>
                <col className="w-[24%]" />
                <col className="w-[26%]" />
                <col className="w-[17%]" />
                <col className="w-[21%]" />
                <col className="w-[12%]" />
              </colgroup>

              <thead className="bg-slate-50 text-slate-500 transition-colors dark:bg-slate-800/70 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Workspace</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Time Range</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((reservation) => (
                  <UpcomingReservationRow
                    key={reservation.id}
                    reservation={reservation}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </motion.div>
  );
}

type UpcomingReservationCardProps = {
  reservation: UpcomingReservation;
  index: number;
};

function UpcomingReservationCard({
  reservation,
  index,
}: UpcomingReservationCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-950/40"
    >
      <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300">
            <Building2 size={18} strokeWidth={2.4} />
          </div>

          <div className="min-w-0">
            <p className="wrap-break-word font-bold text-slate-950 dark:text-slate-100">
              {reservation.workspace?.name || "Workspace removed"}
            </p>

            <p className="mt-1 wrap-break-word text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {formatText(reservation.workspace?.workspace_type)}
            </p>
          </div>
        </div>

        <ReservationStatusBadge status={reservation.status} />
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 transition-colors dark:bg-slate-800/60 sm:grid-cols-2">
        <CardLine
          icon={UserRound}
          label="User"
          value={reservation.user?.name || "Unknown user"}
          helper={reservation.user?.email || "-"}
        />

        <CardLine
          icon={CalendarCheck}
          label="Date"
          value={formatDate(reservation.start_time)}
        />

        <CardLine
          icon={Clock3}
          label="Time"
          value={`${formatTime(reservation.start_time)} - ${formatTime(
            reservation.end_time,
          )}`}
        />
      </div>
    </motion.article>
  );
}

function UpcomingReservationRow({
  reservation,
}: {
  reservation: UpcomingReservation;
}) {
  return (
    <tr className="border-t border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
      <td className="px-6 py-4">
        <div className="truncate font-bold text-slate-900 dark:text-slate-100">
          {reservation.user?.name || "Unknown user"}
        </div>

        <div className="truncate text-xs text-slate-400 dark:text-slate-500">
          {reservation.user?.email || "-"}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="truncate font-bold text-slate-900 dark:text-slate-100">
          {reservation.workspace?.name || "Workspace removed"}
        </div>

        <div className="truncate text-xs uppercase text-slate-400 dark:text-slate-500">
          {formatText(reservation.workspace?.workspace_type)}
        </div>
      </td>

      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
        {formatDate(reservation.start_time)}
      </td>

      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
        {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
      </td>

      <td className="px-6 py-4 text-center align-middle">
        <div className="flex justify-center">
          <ReservationStatusBadge status={reservation.status} />
        </div>
      </td>
    </tr>
  );
}

type CardLineProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  helper?: string;
};

function CardLine({ icon: Icon, label, value, helper }: CardLineProps) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        <Icon size={14} className="shrink-0" />
        <span className="truncate">{label}</span>
      </div>

      <p className="wrap-break-word text-sm font-bold text-slate-900 dark:text-slate-100">
        {value}
      </p>

      {helper && (
        <p className="mt-1 break-all text-xs text-slate-400 dark:text-slate-500">
          {helper}
        </p>
      )}
    </div>
  );
}