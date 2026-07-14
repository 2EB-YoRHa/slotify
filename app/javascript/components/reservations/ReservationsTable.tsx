import { Link } from "@inertiajs/react";
import { duration, formatDate, formatTime } from "../../utils/dateTime";
import type { Reservation } from "../../types/reservation";
import ReservationStatusBadge from "./ReservationStatusBadge";

type ReservationsTableProps = {
  reservations: Reservation[];
};

export default function ReservationsTable({
  reservations,
}: ReservationsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-6 py-4 font-medium">User</th>
            <th className="px-6 py-4 font-medium">Workspace</th>
            <th className="px-6 py-4 font-medium">Date</th>
            <th className="px-6 py-4 font-medium">Time</th>
            <th className="px-6 py-4 font-medium">Duration</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {reservations.map((reservation) => {
            const isCancelled = reservation.status === "cancelled";

            return (
              <tr
                key={reservation.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">
                    {reservation.user?.name || "Unknown user"}
                  </div>

                  <div className="text-xs text-slate-400">
                    {reservation.user?.email || "-"}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">
                    {reservation.workspace?.name || "Workspace removed"}
                  </div>

                  <div className="text-xs uppercase text-slate-400">
                    {formatType(reservation.workspace?.workspace_type)}
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {formatDate(reservation.start_time)}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {formatTime(reservation.start_time)} -{" "}
                  {formatTime(reservation.end_time)}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {duration(reservation.start_time, reservation.end_time)}
                </td>

                <td className="px-6 py-4">
                  <ReservationStatusBadge status={reservation.status} />
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/reservations/${reservation.id}`}
                      className="text-slate-500 hover:text-cyan-500"
                    >
                      View
                    </Link>

                    {!isCancelled && (
                      <>
                        <Link
                          href={`/reservations/${reservation.id}/edit`}
                          className="text-slate-500 hover:text-cyan-500"
                        >
                          Edit
                        </Link>

                        <Link
                          href={`/reservations/${reservation.id}/cancel`}
                          className="text-red-500 hover:text-red-600"
                        >
                          Cancel
                        </Link>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatType(type?: string | null): string {
  if (!type) return "-";

  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}