import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ReservationStatusBadge from "../reservations/ReservationStatusBadge";
import WorkspacePhoto from "../workspaces/WorkspacePhoto";
import { duration, formatDate, formatTime } from "../../utils/dateTime";
import { formatText } from "../../utils/reservationFormUtils";
import { IconBox } from "./DashboardShared";
import type {
  DashboardCurrentUser,
  DashboardStat,
  UpcomingReservation,
} from "../../types/dashboardTypes";

type MemberDashboardProps = {
  currentUser?: DashboardCurrentUser | null;
  stats?: DashboardStat[];
  nextReservation?: UpcomingReservation | null;
  upcomingReservations?: UpcomingReservation[];
};

export default function MemberDashboard({
  currentUser = null,
  stats = [],
  nextReservation = null,
  upcomingReservations = [],
}: MemberDashboardProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="min-w-0">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="wrap-break-word text-2xl font-extrabold leading-tight text-slate-950 dark:text-slate-100 sm:text-3xl"
        >
          Welcome back{currentUser?.name ? `, ${currentUser.name}` : ""}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400"
        >
          Review your next booking, manage your reservations, and find a
          workspace for your next visit.
        </motion.p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        {stats.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-center text-sm leading-6 text-slate-400 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:shadow-slate-950/30 sm:col-span-2 sm:p-8 xl:col-span-4">
            No reservation data available yet.
          </div>
        ) : (
          stats.map((stat, index) => (
            <MemberStatCard key={stat.label} stat={stat} index={index} />
          ))
        )}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <NextReservationCard reservation={nextReservation} />
        <QuickActionsCard />
      </section>

      <UpcomingBookingsCard reservations={upcomingReservations} />
    </div>
  );
}

function MemberStatCard({
  stat,
  index,
}: {
  stat: DashboardStat;
  index: number;
}) {
  const Icon = iconForMemberStat(stat.label);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.05 }}
      className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 dark:hover:border-slate-700 sm:p-5 xl:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {stat.label}
          </p>

          <h2 className="mt-2 truncate text-2xl font-extrabold text-slate-950 dark:text-slate-100 sm:text-3xl">
            {stat.value}
          </h2>
        </div>

        <IconBox icon={Icon} />
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {stat.helper}
      </p>
    </motion.div>
  );
}

function NextReservationCard({
  reservation,
}: {
  reservation?: UpcomingReservation | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 xl:col-span-2"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 transition-colors dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <IconBox icon={CalendarCheck} />

          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-slate-950 dark:text-slate-100">
              Next Reservation
            </h2>

            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              Your closest upcoming booking.
            </p>
          </div>
        </div>

        <Link
          href="/my_reservations"
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300 sm:w-auto sm:py-2"
        >
          My Bookings
          <ArrowRight size={16} />
        </Link>
      </div>

      {reservation ? (
        <NextReservationBody reservation={reservation} />
      ) : (
        <EmptyNextReservation />
      )}
    </motion.div>
  );
}

function NextReservationBody({
  reservation,
}: {
  reservation: UpcomingReservation;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <WorkspacePhoto
        name={reservation.workspace?.name || "Workspace"}
        photoUrl={reservation.workspace?.photo_url}
        fit="cover"
        position="object-center"
        className="h-56 border-0 bg-slate-100 dark:bg-slate-800 lg:col-span-2 lg:h-full lg:min-h-72"
      />

      <div className="min-w-0 p-5 sm:p-6 lg:col-span-3 lg:p-7">
        <div className="mb-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="wrap-break-word text-xs font-extrabold uppercase tracking-wide text-cyan-500 dark:text-cyan-300">
              {formatText(reservation.workspace?.workspace_type)}
            </p>

            <h3 className="mt-2 wrap-break-word text-xl font-extrabold text-slate-950 dark:text-slate-100 sm:text-2xl">
              {reservation.workspace?.name || "Workspace removed"}
            </h3>

            <p className="mt-2 wrap-break-word text-sm leading-6 text-slate-500 dark:text-slate-400">
              {reservation.workspace?.location || "Location not provided"}
            </p>
          </div>

          <ReservationStatusBadge status={reservation.status} />
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-4 transition-colors dark:bg-slate-800/60 sm:grid-cols-2 sm:p-5">
          <SummaryItem label="Date" value={formatDate(reservation.start_time)} />

          <SummaryItem
            label="Time"
            value={`${formatTime(reservation.start_time)} - ${formatTime(
              reservation.end_time,
            )}`}
          />

          <SummaryItem
            label="Duration"
            value={duration(reservation.start_time, reservation.end_time)}
          />

          <SummaryItem
            label="Attendees"
            value={reservation.attendees_count || 1}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={`/reservations/${reservation.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950 sm:w-auto"
          >
            View Details
            <ArrowRight size={16} />
          </Link>

          {reservation.can_modify && (
            <Link
              href={`/reservations/${reservation.id}/edit`}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
            >
              Edit Booking
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyNextReservation() {
  return (
    <div className="px-5 py-10 text-center sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 sm:h-16 sm:w-16">
        <CalendarPlus size={28} strokeWidth={2.4} />
      </div>

      <h3 className="mt-4 text-lg font-extrabold text-slate-950 dark:text-slate-100 sm:text-xl">
        No upcoming reservations
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        Browse workspaces and create a reservation when you find the right
        space.
      </p>

      <Link
        href="/workspaces"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950 sm:w-auto"
      >
        Browse Workspaces
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function QuickActionsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6"
    >
      <div className="mb-5 flex min-w-0 items-start gap-3">
        <IconBox icon={CalendarPlus} />

        <div className="min-w-0">
          <h2 className="text-lg font-extrabold text-slate-950 dark:text-slate-100">
            Quick Actions
          </h2>

          <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
            Booking shortcuts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">
        <QuickAction
          href="/workspaces"
          icon={Building2}
          title="Browse Workspaces"
          description="Find a room, office, desk, or booth."
          primary
        />

        <QuickAction
          href="/reservations/new"
          icon={CalendarPlus}
          title="New Reservation"
          description="Create a booking from the form."
        />

        <QuickAction
          href="/my_reservations"
          icon={CalendarDays}
          title="My Bookings"
          description="Review or update your bookings."
        />
      </div>
    </motion.div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
  primary = false,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block min-w-0 rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${
        primary
          ? "border-cyan-100 bg-cyan-50 dark:border-cyan-500/20 dark:bg-cyan-500/10"
          : "border-slate-200 bg-white hover:border-cyan-100 hover:bg-cyan-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10"
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm transition-colors dark:shadow-none ${
            primary
              ? "bg-white text-cyan-500 dark:bg-cyan-500/10 dark:text-cyan-300"
              : "bg-slate-50 text-cyan-500 dark:bg-slate-800 dark:text-cyan-300"
          }`}
        >
          <Icon size={18} strokeWidth={2.4} />
        </div>

        <div className="min-w-0">
          <p className="wrap-break-word text-sm font-extrabold text-slate-950 dark:text-slate-100">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function UpcomingBookingsCard({
  reservations,
}: {
  reservations: UpcomingReservation[];
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.26 }}
      className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-start gap-3">
          <IconBox icon={CalendarDays} />

          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-slate-950 dark:text-slate-100">
              Upcoming Bookings
            </h2>

            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              Your next confirmed reservations.
            </p>
          </div>
        </div>

        <Link
          href="/my_reservations"
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300 sm:w-auto sm:py-2"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="rounded-xl bg-slate-50 px-5 py-8 text-center text-sm leading-6 text-slate-400 transition-colors dark:bg-slate-800/60 dark:text-slate-500 sm:p-8">
          You do not have upcoming reservations yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {reservations.map((reservation, index) => (
            <UpcomingBookingCard
              key={reservation.id}
              reservation={reservation}
              index={index}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}

type UpcomingBookingCardProps = {
  reservation: UpcomingReservation;
  index: number;
};

function UpcomingBookingCard({
  reservation,
  index,
}: UpcomingBookingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      className="min-w-0"
    >
      <Link
        href={`/reservations/${reservation.id}`}
        className="block min-w-0 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-cyan-100 hover:bg-cyan-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10 sm:p-5"
      >
        <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="wrap-break-word font-extrabold text-slate-950 dark:text-slate-100">
              {reservation.workspace?.name || "Workspace removed"}
            </p>

            <p className="mt-1 wrap-break-word text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {formatText(reservation.workspace?.workspace_type)}
            </p>
          </div>

          <ReservationStatusBadge status={reservation.status} />
        </div>

        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <BookingLine label="Date" value={formatDate(reservation.start_time)} />

          <BookingLine
            label="Time"
            value={`${formatTime(reservation.start_time)} - ${formatTime(
              reservation.end_time,
            )}`}
          />

          <BookingLine
            label="Duration"
            value={duration(reservation.start_time, reservation.end_time)}
          />
        </div>
      </Link>
    </motion.div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-w-0">
      <p className="truncate text-xs font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>

      <p className="mt-1 wrap-break-word font-extrabold text-slate-950 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

function BookingLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="wrap-break-word">
      <span className="font-bold text-slate-950 dark:text-slate-100">
        {label}:{" "}
      </span>
      {value}
    </p>
  );
}

function iconForMemberStat(label: string): LucideIcon {
  const normalized = label.toLowerCase();

  if (normalized.includes("upcoming")) return CalendarDays;
  if (normalized.includes("active")) return Clock3;
  if (normalized.includes("completed")) return CheckCircle2;

  return CalendarCheck;
}