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
      <section className="mb-8 grid grid-cols-4 gap-6">
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
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{stat.label}</p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {stat.value}
          </h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
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
      className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
            <CalendarCheck size={22} strokeWidth={2.4} />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-950">
              Next Booking
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              The closest reservation on your schedule.
            </p>
          </div>
        </div>

        <Link
          href="/workspaces"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
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
    <div className="grid grid-cols-5 gap-0">
      <WorkspacePhoto
        name={reservation.workspace?.name || "Workspace"}
        photoUrl={reservation.workspace?.photo_url}
        galleryPhotos={reservation.workspace?.gallery_photos || []}
        fit="cover"
        position="object-center"
        className="col-span-2 h-full min-h-80 border-0 bg-slate-100"
      />

      <div className="col-span-3 p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-500">
              {formatText(reservation.workspace?.workspace_type)}
            </p>

            <h3 className="mt-2 text-3xl font-extrabold text-slate-950">
              {reservation.workspace?.name || "Workspace removed"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {reservation.workspace?.location || "Location not provided"}
            </p>
          </div>

          <ReservationStatusBadge status={reservation.status} />
        </div>

        <div className="grid grid-cols-4 gap-4 rounded-2xl bg-slate-50 p-5">
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

        <div className="mt-7 flex flex-wrap gap-3">
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
  );
}

function EmptyNextBooking() {
  return (
    <div className="p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
        <CalendarPlus size={30} strokeWidth={2.4} />
      </div>

      <h3 className="mt-5 text-xl font-extrabold text-slate-950">
        No upcoming bookings yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Browse available workspaces and create your next reservation when you
        find the right space.
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

      <p className="mt-1 text-sm font-extrabold text-slate-950">{value}</p>
    </div>
  );
}

function formatText(value?: string | null): string {
  if (!value) return "Workspace";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}