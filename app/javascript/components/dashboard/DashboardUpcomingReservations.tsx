import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { ArrowRight, CalendarCheck } from "lucide-react";
import ReservationStatusBadge from "../reservations/ReservationStatusBadge";
import { formatDate, formatTime } from "../../utils/dateTime";
import { formatText } from "../../utils/reservationFormUtils";
import { IconBox } from "./DashboardShared";
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
      className="col-span-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <IconBox icon={CalendarCheck} />

          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Upcoming Reservations
            </h2>

            <p className="text-sm text-slate-500">
              Next confirmed or pending bookings.
            </p>
          </div>
        </div>

        <Link
          href="/reservations"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-6 py-4 font-bold">User</th>
            <th className="px-6 py-4 font-bold">Workspace</th>
            <th className="px-6 py-4 font-bold">Date</th>
            <th className="px-6 py-4 font-bold">Time Range</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-500">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {reservations.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-10 text-center text-slate-400"
              >
                No upcoming reservations yet.
              </td>
            </tr>
          ) : (
            reservations.map((reservation) => (
              <UpcomingReservationRow
                key={reservation.id}
                reservation={reservation}
              />
            ))
          )}
        </tbody>
      </table>
    </motion.div>
  );
}

function UpcomingReservationRow({
  reservation,
}: {
  reservation: UpcomingReservation;
}) {
  return (
    <tr className="border-t border-slate-100 transition hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="font-bold text-slate-900">
          {reservation.user?.name || "Unknown user"}
        </div>

        <div className="text-xs text-slate-400">
          {reservation.user?.email || "-"}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="font-bold text-slate-900">
          {reservation.workspace?.name || "Workspace removed"}
        </div>

        <div className="text-xs uppercase text-slate-400">
          {formatText(reservation.workspace?.workspace_type)}
        </div>
      </td>

      <td className="px-6 py-4 text-slate-500">
        {formatDate(reservation.start_time)}
      </td>

      <td className="px-6 py-4 text-slate-500">
        {formatTime(reservation.start_time)} -{" "}
        {formatTime(reservation.end_time)}
      </td>

      <td className="px-6 py-4 text-center align-middle">
        <div className="flex justify-center">
          <ReservationStatusBadge status={reservation.status} />
        </div>
      </td>
    </tr>
  );
}