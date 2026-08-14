import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";
import WorkspacePhoto from "../workspaces/WorkspacePhoto";
import {
  Ban,
  CalendarDays,
  Clock3,
  Eye,
  Pencil,
  Search,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import { duration, formatDate, formatTime } from "../../utils/dateTime";
import type { Reservation } from "../../types/reservation";
import ReservationStatusBadge from "./ReservationStatusBadge";

type ReservationsTableProps = {
  reservations: Reservation[];
};

export default function ReservationsTable({
  reservations,
}: ReservationsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReservations = reservations.filter((reservation) => {
    const query = search.toLowerCase();

    const workspaceName = reservation.workspace?.name || "";
    const workspaceType = reservation.workspace?.workspace_type || "";
    const userName = reservation.user?.name || "";
    const userEmail = reservation.user?.email || "";

    const matchesSearch =
      query.length === 0 ||
      workspaceName.toLowerCase().includes(query) ||
      workspaceType.toLowerCase().includes(query) ||
      userName.toLowerCase().includes(query) ||
      userEmail.toLowerCase().includes(query) ||
      reservation.status.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || reservation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <div className="relative w-96">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by user, workspace or status..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-500">
            <SlidersHorizontal size={16} />
            Filters
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-12 w-44 rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="concluded">Concluded</option>
          </select>
        </div>
      </div>

      <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
        Showing {filteredReservations.length} of {reservations.length}{" "}
        reservations
      </div>

      {filteredReservations.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <CalendarDays size={24} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            No reservations found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Try changing the search text or selected status.
          </p>
        </div>
      ) : (
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[19%]" />
            <col className="w-[22%]" />
            <col className="w-[13%]" />
            <col className="w-[16%]" />
            <col className="w-[11%]" />
            <col className="w-[10%]" />
            <col className="w-[9%]" />
          </colgroup>

          <thead className="bg-white text-slate-500">
            <tr>
              <th className="px-6 py-4 text-left font-bold">User</th>
              <th className="px-6 py-4 text-left font-bold">Workspace</th>
              <th className="px-6 py-4 text-center font-bold">Date</th>
              <th className="px-6 py-4 text-center font-bold">Time</th>
              <th className="px-6 py-4 text-center font-bold">Duration</th>
              <th className="px-6 py-4 text-center font-bold">Status</th>
              <th className="px-6 py-4 text-center font-bold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredReservations.map((reservation, index) => {
              const canModify =
                reservation.can_modify ??
                (reservation.status === "confirmed" &&
                  new Date(reservation.end_time).getTime() >= Date.now());

              return (
                <motion.tr
                  key={reservation.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.035 }}
                  className="border-t border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-6 py-5 align-middle">
                    <div className="flex items-center gap-3">
                      {reservation.user?.avatar_url ? (
                        <img
                          src={reservation.user.avatar_url}
                          alt={reservation.user.name || "User"}
                          className="h-10 w-10 shrink-0 rounded-2xl object-cover ring-4 ring-cyan-50"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                          <UserRound size={18} strokeWidth={2.4} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="truncate font-bold text-slate-950">
                          {reservation.user?.name || "Unknown user"}
                        </div>

                        <div className="truncate text-xs text-slate-400">
                          {reservation.user?.email || "-"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 align-middle">
                    <div className="flex items-center gap-3">
                      <WorkspacePhoto
                        name={reservation.workspace?.name || "Workspace"}
                        photoUrl={reservation.workspace?.photo_url}
                        fit="contain"
                        position="object-center"
                        className="h-10 w-14 shrink-0 rounded-xl border border-slate-100"
                      />

                      <div className="min-w-0">
                        <div className="truncate font-bold text-slate-950">
                          {reservation.workspace?.name || "Workspace removed"}
                        </div>

                        <div className="truncate text-xs uppercase text-slate-400">
                          {formatText(reservation.workspace?.workspace_type)}
                        </div>
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

                  <td className="px-6 py-5 text-center align-middle text-slate-600">
                    {duration(reservation.start_time, reservation.end_time)}
                  </td>

                  <td className="px-6 py-5 text-center align-middle">
                    <ReservationStatusBadge status={reservation.status} />
                  </td>

                  <td className="px-6 py-5 text-center align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <ActionLink
                        href={`/reservations/${reservation.id}`}
                        title="View"
                        icon={<Eye size={16} />}
                      />

                      {canModify && (
                        <>
                          <ActionLink
                            href={`/reservations/${reservation.id}/edit`}
                            title="Edit"
                            icon={<Pencil size={16} />}
                          />

                          <ActionLink
                            href={`/reservations/${reservation.id}/cancel`}
                            title="Cancel"
                            danger
                            icon={<Ban size={16} />}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}

type ActionLinkProps = {
  href: string;
  title: string;
  icon: ReactNode;
  danger?: boolean;
};

function ActionLink({ href, title, icon, danger = false }: ActionLinkProps) {
  return (
    <Link
      href={href}
      title={title}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition hover:-translate-y-0.5 hover:shadow-sm ${
        danger
          ? "border-red-100 text-red-500 hover:bg-red-50"
          : "border-slate-200 text-slate-500 hover:border-cyan-100 hover:bg-cyan-50 hover:text-cyan-500"
      }`}
    >
      {icon}
    </Link>
  );
}

function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}
