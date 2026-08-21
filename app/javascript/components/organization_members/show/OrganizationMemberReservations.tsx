import { motion } from "motion/react";
import { Building2, CalendarCheck, Clock3 } from "lucide-react";
import ReservationStatusBadge from "../../reservations/ReservationStatusBadge";
import { formatDate, formatTime } from "../../../utils/dateTime";
import { IconBox } from "./OrganizationMemberShowShared";
import type { MemberReservation } from "../../../types/organizationMemberShowTypes";

type OrganizationMemberReservationsProps = {
  reservations: MemberReservation[];
};

export default function OrganizationMemberReservations({
  reservations,
}: OrganizationMemberReservationsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 transition-colors dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <IconBox icon={CalendarCheck} />

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100">
              Recent Reservations
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Latest reservations created by this member.
            </p>
          </div>
        </div>

        <span className="w-fit shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 transition-colors dark:bg-slate-800 dark:text-slate-400">
          {reservations.length} shown
        </span>
      </div>

      {reservations.length === 0 ? (
        <EmptyReservations />
      ) : (
        <ReservationsContent reservations={reservations} />
      )}
    </motion.div>
  );
}

function EmptyReservations() {
  return (
    <div className="px-5 py-10 text-center sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 transition-colors dark:bg-slate-800 dark:text-slate-500">
        <CalendarCheck size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
        No reservations yet
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        This member has not created any reservations.
      </p>
    </div>
  );
}

function ReservationsContent({
  reservations,
}: OrganizationMemberReservationsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
        {reservations.map((reservation, index) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            index={index}
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <ReservationsTable reservations={reservations} />
      </div>
    </>
  );
}

type ReservationCardProps = {
  reservation: MemberReservation;
  index: number;
};

function ReservationCard({ reservation, index }: ReservationCardProps) {
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
              {reservation.workspace_name}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {formatDate(reservation.start_time)}
            </p>
          </div>
        </div>

        <ReservationStatusBadge status={reservation.status} />
      </div>

      <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors dark:bg-slate-800/60 dark:text-slate-300">
        <div className="flex min-w-0 items-center gap-2">
          <Clock3
            size={15}
            className="shrink-0 text-slate-400 dark:text-slate-500"
          />
          <span className="wrap-break-word">
            {formatTime(reservation.start_time)} -{" "}
            {formatTime(reservation.end_time)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function ReservationsTable({
  reservations,
}: OrganizationMemberReservationsProps) {
  return (
    <table className="w-full min-w-190 table-fixed text-sm">
      <colgroup>
        <col className="w-[34%]" />
        <col className="w-[22%]" />
        <col className="w-[26%]" />
        <col className="w-[18%]" />
      </colgroup>

      <thead className="bg-slate-50 text-slate-500 transition-colors dark:bg-slate-800/70 dark:text-slate-400">
        <tr>
          <th className="px-6 py-4 text-left font-bold">Workspace</th>
          <th className="px-6 py-4 text-center font-bold">Date</th>
          <th className="px-6 py-4 text-center font-bold">Time</th>
          <th className="px-6 py-4 text-center font-bold">Status</th>
        </tr>
      </thead>

      <tbody>
        {reservations.map((reservation, index) => (
          <motion.tr
            key={reservation.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            className="border-t border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
          >
            <td className="px-6 py-5 align-middle">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300">
                  <Building2 size={18} strokeWidth={2.4} />
                </div>

                <div className="truncate font-bold text-slate-950 dark:text-slate-100">
                  {reservation.workspace_name}
                </div>
              </div>
            </td>

            <td className="px-6 py-5 text-center align-middle text-slate-600 dark:text-slate-400">
              {formatDate(reservation.start_time)}
            </td>

            <td className="px-6 py-5 text-center align-middle text-slate-600 dark:text-slate-400">
              <div className="inline-flex items-center gap-2">
                <Clock3
                  size={15}
                  className="text-slate-400 dark:text-slate-500"
                />
                {formatTime(reservation.start_time)} -{" "}
                {formatTime(reservation.end_time)}
              </div>
            </td>

            <td className="px-6 py-5 text-center align-middle">
              <ReservationStatusBadge status={reservation.status} />
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}