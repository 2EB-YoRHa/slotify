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
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <IconBox icon={CalendarCheck} />

          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Recent Reservations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest reservations created by this member.
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
          {reservations.length} shown
        </span>
      </div>

      {reservations.length === 0 ? (
        <EmptyReservations />
      ) : (
        <ReservationsTable reservations={reservations} />
      )}
    </motion.div>
  );
}

function EmptyReservations() {
  return (
    <div className="p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <CalendarCheck size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No reservations yet
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        This member has not created any reservations.
      </p>
    </div>
  );
}

function ReservationsTable({
  reservations,
}: OrganizationMemberReservationsProps) {
  return (
    <table className="w-full table-fixed text-sm">
      <colgroup>
        <col className="w-[34%]" />
        <col className="w-[22%]" />
        <col className="w-[26%]" />
        <col className="w-[18%]" />
      </colgroup>

      <thead className="bg-slate-50 text-slate-500">
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
            className="border-t border-slate-100 transition hover:bg-slate-50"
          >
            <td className="px-6 py-5 align-middle">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                  <Building2 size={18} strokeWidth={2.4} />
                </div>

                <div className="truncate font-bold text-slate-950">
                  {reservation.workspace_name}
                </div>
              </div>
            </td>

            <td className="px-6 py-5 text-center align-middle text-slate-600">
              {formatDate(reservation.start_time)}
            </td>

            <td className="px-6 py-5 text-center align-middle text-slate-600">
              <div className="inline-flex items-center gap-2">
                <Clock3 size={15} className="text-slate-400" />
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