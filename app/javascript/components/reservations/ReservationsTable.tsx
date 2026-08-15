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
    const query = search.trim().toLowerCase();

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
      <div className="border-b border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
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

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[auto_1fr] lg:w-auto lg:flex lg:items-center">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-500 sm:flex">
              <SlidersHorizontal size={16} />
              Filters
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 lg:w-44"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="concluded">Concluded</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400 sm:px-6">
        Showing {filteredReservations.length} of {reservations.length}{" "}
        reservations
      </div>

      {filteredReservations.length === 0 ? (
        <EmptyReservationsResult />
      ) : (
        <>
          <div className="grid gap-4 p-4 lg:hidden">
            {filteredReservations.map((reservation, index) => (
              <ReservationMobileCard
                key={reservation.id}
                reservation={reservation}
                index={index}
              />
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-262.5 w-full table-fixed text-sm">
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
                {filteredReservations.map((reservation, index) => (
                  <ReservationTableRow
                    key={reservation.id}
                    reservation={reservation}
                    index={index}
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

function ReservationMobileCard({
  reservation,
  index,
}: {
  reservation: Reservation;
  index: number;
}) {
  const canModify = canModifyReservation(reservation);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-500">
              Reservation
            </p>

            <h3 className="mt-1 truncate text-lg font-extrabold text-slate-950">
              {reservation.workspace?.name || "Workspace removed"}
            </h3>
          </div>

          <ReservationStatusBadge status={reservation.status} />
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
          {reservation.user?.avatar_url ? (
            <img
              src={reservation.user.avatar_url}
              alt={reservation.user.name || "User"}
              className="h-11 w-11 shrink-0 rounded-2xl object-cover ring-4 ring-white"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 ring-4 ring-white">
              <UserRound size={18} strokeWidth={2.4} />
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-slate-950">
              {reservation.user?.name || "Unknown user"}
            </p>

            <p className="mt-1 truncate text-xs font-semibold text-slate-400">
              {reservation.user?.email || "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4 flex min-w-0 items-center gap-3">
          <WorkspacePhoto
            name={reservation.workspace?.name || "Workspace"}
            photoUrl={reservation.workspace?.photo_url}
            fit="contain"
            position="object-center"
            className="h-14 w-20 shrink-0 rounded-xl border border-slate-100 bg-slate-100"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-slate-950">
              {reservation.workspace?.name || "Workspace removed"}
            </p>

            <p className="mt-1 truncate text-xs font-bold uppercase text-slate-400">
              {formatText(reservation.workspace?.workspace_type)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3">
          <InfoItem label="Date" value={formatDate(reservation.start_time)} />

          <InfoItem
            label="Time"
            value={`${formatTime(reservation.start_time)} - ${formatTime(
              reservation.end_time,
            )}`}
          />

          <InfoItem
            label="Duration"
            value={duration(reservation.start_time, reservation.end_time)}
          />

          <InfoItem label="Status" value={formatText(reservation.status)} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <ActionButton
            href={`/reservations/${reservation.id}`}
            icon={<Eye size={16} />}
            label="View"
            primary
          />

          {canModify && (
            <>
              <ActionButton
                href={`/reservations/${reservation.id}/edit`}
                icon={<Pencil size={16} />}
                label="Edit"
              />

              <ActionButton
                href={`/reservations/${reservation.id}/cancel`}
                icon={<Ban size={16} />}
                label="Cancel"
                danger
              />
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function ReservationTableRow({
  reservation,
  index,
}: {
  reservation: Reservation;
  index: number;
}) {
  const canModify = canModifyReservation(reservation);

  return (
    <motion.tr
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
          <ActionIcon
            href={`/reservations/${reservation.id}`}
            title="View"
            icon={<Eye size={16} />}
          />

          {canModify && (
            <>
              <ActionIcon
                href={`/reservations/${reservation.id}/edit`}
                title="Edit"
                icon={<Pencil size={16} />}
              />

              <ActionIcon
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
}

function EmptyReservationsResult() {
  return (
    <div className="px-5 py-10 text-center sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <CalendarDays size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No reservations found
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Try changing the search text or selected status.
      </p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
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

type ActionIconProps = {
  href: string;
  title: string;
  icon: ReactNode;
  danger?: boolean;
};

function ActionIcon({ href, title, icon, danger = false }: ActionIconProps) {
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

function ActionButton({
  href,
  icon,
  label,
  primary = false,
  danger = false,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  primary?: boolean;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition hover:-translate-y-0.5 hover:shadow-sm ${
        primary
          ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100 hover:bg-cyan-500"
          : danger
            ? "border border-red-100 bg-white text-red-500 hover:bg-red-50"
            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function canModifyReservation(reservation: Reservation): boolean {
  if (typeof reservation.can_modify === "boolean") {
    return reservation.can_modify;
  }

  return (
    reservation.status === "confirmed" &&
    new Date(reservation.end_time).getTime() >= Date.now()
  );
}

function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}