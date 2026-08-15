import { motion } from "motion/react";
import { CalendarClock, Clock3, UserRound } from "lucide-react";
import ReservationStatusBadge from "../../reservations/ReservationStatusBadge";
import { formatDate, formatTime } from "../../../utils/dateTime";
import { IconBox } from "./WorkspaceShowShared";
import type { WorkspaceReservation } from "../../../types/workspaceShowTypes";

type RecentReservationsProps = {
  reservations: WorkspaceReservation[];
};

export default function RecentReservations({
  reservations,
}: RecentReservationsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-3 sm:gap-4">
        <IconBox icon={CalendarClock} />

        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
            Recent Reservations
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Latest bookings related to this workspace.
          </p>
        </div>
      </div>

      {reservations.length === 0 ? (
        <EmptyReservationsState />
      ) : (
        <>
          <div className="grid min-w-0 grid-cols-1 gap-4 md:hidden">
            {reservations.map((reservation, index) => (
              <RecentReservationCard
                key={reservation.id}
                reservation={reservation}
                index={index}
              />
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <RecentReservationsTable reservations={reservations} />
          </div>
        </>
      )}
    </div>
  );
}

function EmptyReservationsState() {
  return (
    <div className="rounded-xl bg-slate-50 px-5 py-10 text-center sm:p-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <CalendarClock size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No reservations yet
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        This workspace has no reservation history.
      </p>
    </div>
  );
}

function RecentReservationCard({
  reservation,
  index,
}: {
  reservation: WorkspaceReservation;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
            <UserRound size={18} strokeWidth={2.4} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-950">
              {reservation.user?.name || "Unknown user"}
            </p>

            <p className="mt-1 truncate text-xs text-slate-400">
              {reservation.user?.email || "-"}
            </p>
          </div>
        </div>

        <div className="shrink-0 self-start">
          <ReservationStatusBadge status={reservation.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
        <InfoItem label="Date" value={formatDate(reservation.start_time)} />

        <InfoItem
          label="Time"
          value={`${formatTime(reservation.start_time)} - ${formatTime(
            reservation.end_time,
          )}`}
        />
      </div>
    </motion.article>
  );
}

function RecentReservationsTable({ reservations }: RecentReservationsProps) {
  return (
    <table className="min-w-180 w-full table-fixed text-sm">
      <colgroup>
        <col className="w-[26%]" />
        <col className="w-[24%]" />
        <col className="w-[30%]" />
        <col className="w-[20%]" />
      </colgroup>

      <thead className="bg-slate-50 text-slate-500">
        <tr>
          <th className="px-4 py-4 text-left font-bold">Member</th>
          <th className="px-4 py-4 text-center font-bold">Date</th>
          <th className="px-4 py-4 text-center font-bold">Time</th>
          <th className="px-4 py-4 text-center font-bold">Status</th>
        </tr>
      </thead>

      <tbody>
        {reservations.map((reservation, index) => (
          <motion.tr
            key={reservation.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            className="border-t border-slate-100 transition hover:bg-slate-50"
          >
            <td className="px-4 py-5 align-middle">
              <p className="truncate font-bold text-slate-950">
                {reservation.user?.name || "Unknown user"}
              </p>

              <p className="mt-1 truncate text-xs text-slate-400">
                {reservation.user?.email || "-"}
              </p>
            </td>

            <td className="px-4 py-5 text-center align-middle text-slate-600">
              {formatDate(reservation.start_time)}
            </td>

            <td className="px-4 py-5 text-center align-middle text-slate-600">
              <div className="inline-flex items-center gap-2">
                <Clock3 size={15} className="text-slate-400" />
                {formatTime(reservation.start_time)} -{" "}
                {formatTime(reservation.end_time)}
              </div>
            </td>

            <td className="px-4 py-5 text-center align-middle">
              <ReservationStatusBadge status={reservation.status} />
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-extrabold text-slate-950">
        {value}
      </p>
    </div>
  );
}
