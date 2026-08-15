import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarCheck,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  ListChecks,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import HeaderActionButton from "../../components/ui/HeaderActionButton";
import MyReservationsTable from "../../components/reservations/MyReservationsTable";
import ReservationStatusBadge from "../../components/reservations/ReservationStatusBadge";
import WorkspacePhoto from "../../components/workspaces/WorkspacePhoto";
import { duration, formatDate, formatTime } from "../../utils/dateTime";
import type { Reservation } from "../../types/reservation";

type MyReservationsProps = {
  reservations?: Reservation[];
};

export default function MyReservations({
  reservations = [],
}: MyReservationsProps) {
  const now = Date.now();

  const activeReservations = reservations.filter((reservation) => {
    const start = new Date(reservation.start_time).getTime();
    const end = new Date(reservation.end_time).getTime();

    return reservation.status !== "cancelled" && start <= now && end >= now;
  });

  const upcomingReservations = reservations
    .filter(
      (reservation) =>
        reservation.status !== "cancelled" &&
        new Date(reservation.start_time).getTime() > now,
    )
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );

  const completedReservations = reservations.filter(
    (reservation) => reservation.status === "concluded",
  );

  const cancelledReservations = reservations.filter(
    (reservation) => reservation.status === "cancelled",
  );

  const nextReservation =
    upcomingReservations[0] || activeReservations[0] || null;

  const stats = [
    {
      label: "Total Bookings",
      value: reservations.length,
      helper: "All reservations created by you",
      icon: ListChecks,
    },
    {
      label: "Upcoming",
      value: upcomingReservations.length,
      helper: "Future confirmed bookings",
      icon: CalendarCheck,
    },
    {
      label: "Active Now",
      value: activeReservations.length,
      helper: "Bookings currently in progress",
      icon: Clock3,
    },
    {
      label: "Completed",
      value: completedReservations.length,
      helper: `${cancelledReservations.length} cancelled`,
      icon: CheckCircle2,
    },
  ];

  return (
    <AppLayout
      headerActions={
        <HeaderActionButton href="/reservations/new" icon={CalendarPlus}>
          New Booking
        </HeaderActionButton>
      }
    >
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:mb-8 xl:grid-cols-4 xl:gap-6">
        {stats.map((stat, index) => (
          <BookingStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      <NextBookingPanel reservation={nextReservation} />

      <MyReservationsTable reservations={reservations} />
    </AppLayout>
  );
}

type BookingStat = {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
};

type BookingStatCardProps = {
  stat: BookingStat;
  index: number;
};

function BookingStatCard({ stat, index }: BookingStatCardProps) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5 xl:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold leading-5 text-slate-500">
            {stat.label}
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {stat.value}
          </h2>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          <Icon size={20} strokeWidth={2.4} />
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">{stat.helper}</p>
    </motion.div>
  );
}

function NextBookingPanel({ reservation }: { reservation: Reservation | null }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 }}
      className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:mb-8"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500 sm:h-12 sm:w-12">
            <CalendarCheck size={22} strokeWidth={2.4} />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-slate-950 sm:text-xl">
              Next Booking
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              The closest reservation on your schedule.
            </p>
          </div>
        </div>

        <Link
          href="/workspaces"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 sm:w-auto"
        >
          Find another workspace
          <ArrowRight size={16} />
        </Link>
      </div>

      {reservation ? (
        <NextBookingDetails reservation={reservation} />
      ) : (
        <EmptyNextBooking />
      )}
    </motion.section>
  );
}

function NextBookingDetails({ reservation }: { reservation: Reservation }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <WorkspacePhoto
        name={reservation.workspace?.name || "Workspace"}
        photoUrl={reservation.workspace?.photo_url}
        galleryPhotos={reservation.workspace?.gallery_photos || []}
        fit="cover"
        position="object-center"
        className="h-56 w-full border-0 bg-slate-100 sm:h-72 lg:col-span-2 lg:h-full lg:min-h-80"
      />

      <div className="p-5 sm:p-8 lg:col-span-3">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-500">
              {formatText(reservation.workspace?.workspace_type)}
            </p>

            <h3 className="mt-2 text-2xl font-extrabold text-slate-950 sm:text-3xl">
              {reservation.workspace?.name || "Workspace removed"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {reservation.workspace?.location || "Location not provided"}
            </p>
          </div>

          <ReservationStatusBadge status={reservation.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 sm:p-5 lg:grid-cols-4">
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

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href={`/reservations/${reservation.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
          >
            View Details
            <ArrowRight size={16} />
          </Link>

          {reservation.can_modify && (
            <Link
              href={`/reservations/${reservation.id}/edit`}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Edit Booking
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyNextBooking() {
  return (
    <div className="px-5 py-10 text-center sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 sm:h-16 sm:w-16">
        <CalendarPlus size={30} strokeWidth={2.4} />
      </div>

      <h3 className="mt-5 text-lg font-extrabold text-slate-950 sm:text-xl">
        No upcoming bookings yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Browse available workspaces and create your next reservation when you
        find the right space.
      </p>

      <Link
        href="/workspaces"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md sm:w-auto"
      >
        Browse Workspaces
        <ArrowRight size={16} />
      </Link>
    </div>
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
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-extrabold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function formatText(value?: string | null): string {
  if (!value) return "Workspace";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}