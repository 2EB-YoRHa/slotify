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
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-slate-950"
        >
          Welcome back{currentUser?.name ? `, ${currentUser.name}` : ""}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-2 max-w-3xl text-sm leading-6 text-slate-500"
        >
          Review your next booking, manage your reservations, and find a
          workspace for your next visit.
        </motion.p>
      </div>

      <section className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <MemberStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      <section className="grid grid-cols-3 gap-6">
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
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{stat.label}</p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {stat.value}
          </h2>
        </div>

        <IconBox icon={Icon} />
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">{stat.helper}</p>
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
      className="col-span-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <IconBox icon={CalendarCheck} />

          <div>
            <h2 className="text-lg font-extrabold text-slate-950">
              Next Reservation
            </h2>

            <p className="text-sm leading-6 text-slate-500">
              Your closest upcoming booking.
            </p>
          </div>
        </div>

        <Link
          href="/my_reservations"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
        >
          My Bookings
          <ArrowRight size={16} />
        </Link>
      </div>

      {reservation ? (
        <div className="grid grid-cols-5">
          <WorkspacePhoto
            name={reservation.workspace?.name || "Workspace"}
            photoUrl={reservation.workspace?.photo_url}
            fit="cover"
            position="object-center"
            className="col-span-2 h-full min-h-72 border-0 bg-slate-100"
          />

          <div className="col-span-3 p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-500">
                  {formatText(reservation.workspace?.workspace_type)}
                </p>

                <h3 className="mt-2 text-2xl font-extrabold text-slate-950">
                  {reservation.workspace?.name || "Workspace removed"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {reservation.workspace?.location || "Location not provided"}
                </p>
              </div>

              <ReservationStatusBadge status={reservation.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-5">
              <SummaryItem
                label="Date"
                value={formatDate(reservation.start_time)}
              />

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

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/reservations/${reservation.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
              >
                View Details
                <ArrowRight size={16} />
              </Link>

              {reservation.can_modify && (
                <Link
                  href={`/reservations/${reservation.id}/edit`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Edit Booking
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <EmptyNextReservation />
      )}
    </motion.div>
  );
}

function EmptyNextReservation() {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
        <CalendarPlus size={28} strokeWidth={2.4} />
      </div>

      <h3 className="mt-4 text-xl font-extrabold text-slate-950">
        No upcoming reservations
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Browse workspaces and create a reservation when you find the right
        space.
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

function QuickActionsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center gap-3">
        <IconBox icon={CalendarPlus} />

        <div>
          <h2 className="text-lg font-extrabold text-slate-950">
            Quick Actions
          </h2>

          <p className="text-sm leading-6 text-slate-500">
            Booking shortcuts.
          </p>
        </div>
      </div>

      <div className="space-y-3">
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
      className={`block rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${
        primary
          ? "border-cyan-100 bg-cyan-50"
          : "border-slate-200 bg-white hover:border-cyan-100 hover:bg-cyan-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
          <Icon size={18} strokeWidth={2.4} />
        </div>

        <div>
          <p className="text-sm font-extrabold text-slate-950">{title}</p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
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
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <IconBox icon={CalendarDays} />

          <div>
            <h2 className="text-lg font-extrabold text-slate-950">
              Upcoming Bookings
            </h2>

            <p className="text-sm leading-6 text-slate-500">
              Your next confirmed reservations.
            </p>
          </div>
        </div>

        <Link
          href="/my_reservations"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-400">
          You do not have upcoming reservations yet.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {reservations.map((reservation) => (
            <Link
              key={reservation.id}
              href={`/reservations/${reservation.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-cyan-100 hover:bg-cyan-50 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold text-slate-950">
                    {reservation.workspace?.name || "Workspace removed"}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                    {formatText(reservation.workspace?.workspace_type)}
                  </p>
                </div>

                <ReservationStatusBadge status={reservation.status} />
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-bold text-slate-950">Date: </span>
                  {formatDate(reservation.start_time)}
                </p>

                <p>
                  <span className="font-bold text-slate-950">Time: </span>
                  {formatTime(reservation.start_time)} -{" "}
                  {formatTime(reservation.end_time)}
                </p>

                <p>
                  <span className="font-bold text-slate-950">Duration: </span>
                  {duration(reservation.start_time, reservation.end_time)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.section>
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
    <div>
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-extrabold text-slate-950">{value}</p>
    </div>
  );
}

function iconForMemberStat(label: string): LucideIcon {
  const normalized = label.toLowerCase();

  if (normalized.includes("upcoming")) return CalendarDays;
  if (normalized.includes("active")) return Clock3;
  if (normalized.includes("completed")) return CheckCircle2;

  return CalendarCheck;
}