import { motion } from "motion/react";
import { CalendarClock, Clock3 } from "lucide-react";
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
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-start gap-4">
        <IconBox icon={CalendarClock} />

        <div>
          <h2 className="text-2xl font-bold text-slate-950">
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
        <RecentReservationsTable reservations={reservations} />
      )}
    </div>
  );
}

function EmptyReservationsState() {
  return (
    <div className="rounded-xl bg-slate-50 p-8 text-center">
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

function RecentReservationsTable({
  reservations,
}: RecentReservationsProps) {
  return (
    <table className="w-full table-fixed text-sm">
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
              <p className="font-bold text-slate-950">
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