import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import WorkspacePhoto from "../workspaces/WorkspacePhoto";
import {
  ArrowRight,
  Ban,
  CalendarDays,
  Clock3,
  Eye,
  MapPin,
  Pencil,
  Search,
  SlidersHorizontal,
  UsersRound,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { duration, formatDate, formatTime } from "../../utils/dateTime";
import type { Reservation } from "../../types/reservation";
import ReservationStatusBadge from "./ReservationStatusBadge";

type MyReservationsTableProps = {
  reservations: Reservation[];
};

type DateFilter = "all" | "active" | "upcoming" | "past" | "cancelled";
type StatusFilter = "all" | "confirmed" | "cancelled" | "concluded";

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "active", label: "Active Now" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
];

export default function MyReservationsTable({
  reservations,
}: MyReservationsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  const filteredReservations = useMemo(() => {
    return sortReservations(
      reservations.filter((reservation) => {
        const query = search.trim().toLowerCase();
        const workspaceName = reservation.workspace?.name || "";
        const workspaceType = reservation.workspace?.workspace_type || "";
        const location = reservation.workspace?.location || "";
        const now = Date.now();
        const startTime = new Date(reservation.start_time).getTime();
        const endTime = new Date(reservation.end_time).getTime();

        const matchesSearch =
          query.length === 0 ||
          workspaceName.toLowerCase().includes(query) ||
          workspaceType.toLowerCase().includes(query) ||
          location.toLowerCase().includes(query) ||
          reservation.status.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "all" || reservation.status === statusFilter;

        const matchesDate =
          dateFilter === "all" ||
          (dateFilter === "cancelled" && reservation.status === "cancelled") ||
          (dateFilter === "upcoming" &&
            reservation.status !== "cancelled" &&
            startTime > now) ||
          (dateFilter === "past" &&
            reservation.status !== "cancelled" &&
            endTime < now) ||
          (dateFilter === "active" &&
            reservation.status !== "cancelled" &&
            startTime <= now &&
            endTime >= now);

        return matchesSearch && matchesStatus && matchesDate;
      }),
    );
  }, [reservations, search, statusFilter, dateFilter]);

  const hasFilters =
    search.trim().length > 0 || statusFilter !== "all" || dateFilter !== "all";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setDateFilter("all");
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 p-6">
        <div className="mb-5 flex items-start justify-between gap-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">
              Booking History
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Search, filter, and manage your personal reservations.
            </p>
          </div>

          <div className="rounded-full bg-slate-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-400">
            {filteredReservations.length} of {reservations.length} shown
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative min-w-80 flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by workspace, type, location, or status..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-500 xl:flex">
              <SlidersHorizontal size={16} />
              Filters
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="h-12 w-44 rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="concluded">Concluded</option>
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <XCircle size={16} />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {DATE_FILTERS.map((filter) => {
            const selected = dateFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setDateFilter(filter.value)}
                className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide transition ${
                  selected
                    ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100"
                    : "bg-slate-100 text-slate-500 hover:bg-cyan-50 hover:text-cyan-600"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {filteredReservations.length === 0 ? (
          <ReservationsEmptyState
            hasReservations={reservations.length > 0}
            hasFilters={hasFilters}
            onClearFilters={clearFilters}
          />
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {filteredReservations.map((reservation, index) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

function ReservationCard({
  reservation,
  index,
}: {
  reservation: Reservation;
  index: number;
}) {
  const canModify = canModifyReservation(reservation);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-100 hover:shadow-md"
    >
      <div className="grid grid-cols-5 gap-0">
        <WorkspacePhoto
          name={reservation.workspace?.name || "Workspace"}
          photoUrl={reservation.workspace?.photo_url}
          galleryPhotos={reservation.workspace?.gallery_photos || []}
          fit="cover"
          position="object-center"
          className="col-span-2 h-full min-h-52 border-0 bg-slate-100"
        />

        <div className="col-span-3 p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-xs font-extrabold uppercase tracking-wide text-cyan-500">
                {formatText(reservation.workspace?.workspace_type)}
              </p>

              <h3 className="mt-1 truncate text-lg font-extrabold text-slate-950">
                {reservation.workspace?.name || "Workspace removed"}
              </h3>

              <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-slate-500">
                <MapPin size={15} className="shrink-0 text-slate-400" />
                {reservation.workspace?.location || "Location not provided"}
              </p>
            </div>

            <ReservationStatusBadge status={reservation.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
            <InfoItem
              icon={CalendarDays}
              label="Date"
              value={formatDate(reservation.start_time)}
            />

            <InfoItem
              icon={Clock3}
              label="Time"
              value={`${formatTime(reservation.start_time)} - ${formatTime(
                reservation.end_time,
              )}`}
            />

            <InfoItem
              icon={Clock3}
              label="Duration"
              value={duration(reservation.start_time, reservation.end_time)}
            />

            <InfoItem
              icon={UsersRound}
              label="Attendees"
              value={reservation.attendees_count || 1}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <ActionButton
              href={`/reservations/${reservation.id}`}
              icon={Eye}
              label="View"
              primary
            />

            {canModify && (
              <>
                <ActionButton
                  href={`/reservations/${reservation.id}/edit`}
                  icon={Pencil}
                  label="Edit"
                />

                <ActionButton
                  href={`/reservations/${reservation.id}/cancel`}
                  icon={Ban}
                  label="Cancel"
                  danger
                />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

type InfoItemProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-400">
        <Icon size={13} />
        {label}
      </div>

      <p className="text-sm font-extrabold text-slate-950">{value}</p>
    </div>
  );
}

type ActionButtonProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  primary?: boolean;
  danger?: boolean;
};

function ActionButton({
  href,
  icon: Icon,
  label,
  primary = false,
  danger = false,
}: ActionButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition hover:-translate-y-0.5 hover:shadow-sm ${
        primary
          ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100 hover:bg-cyan-500"
          : danger
            ? "border border-red-100 bg-white text-red-500 hover:bg-red-50"
            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon size={15} />
      {label}
    </Link>
  );
}

type ReservationsEmptyStateProps = {
  hasReservations: boolean;
  hasFilters: boolean;
  onClearFilters: () => void;
};

function ReservationsEmptyState({
  hasReservations,
  hasFilters,
  onClearFilters,
}: ReservationsEmptyStateProps) {
  if (!hasReservations) {
    return (
      <div className="rounded-2xl bg-slate-50 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
          <CalendarDays size={30} strokeWidth={2.4} />
        </div>

        <h3 className="mt-5 text-xl font-extrabold text-slate-950">
          You do not have bookings yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Browse workspaces and create your first reservation when you find a
          space that works for you.
        </p>

        <Link
          href="/workspaces"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
        >
          Browse Workspaces
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Search size={30} strokeWidth={2.4} />
      </div>

      <h3 className="mt-5 text-xl font-extrabold text-slate-950">
        No bookings match your filters
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Try changing the search text, date filter, or status filter.
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <XCircle size={16} />
          Clear Filters
        </button>
      )}
    </div>
  );
}

function sortReservations(reservations: Reservation[]): Reservation[] {
  const now = Date.now();

  return [...reservations].sort((a, b) => {
    const bucketDifference =
      reservationBucket(a, now) - reservationBucket(b, now);

    if (bucketDifference !== 0) return bucketDifference;

    const aStart = new Date(a.start_time).getTime();
    const bStart = new Date(b.start_time).getTime();

    if (reservationBucket(a, now) <= 2) return aStart - bStart;

    return bStart - aStart;
  });
}

function reservationBucket(reservation: Reservation, now: number): number {
  const start = new Date(reservation.start_time).getTime();
  const end = new Date(reservation.end_time).getTime();

  if (reservation.status === "cancelled") return 4;
  if (start <= now && end >= now) return 0;
  if (start > now) return 1;
  if (reservation.status === "concluded" || end < now) return 3;

  return 2;
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
  if (!value) return "Workspace";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}