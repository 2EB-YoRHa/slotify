import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  CalendarCheck,
  CalendarPlus,
  Clock3,
  ListChecks,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import MyReservationsTable from "../../components/reservations/MyReservationsTable";
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

  const upcomingReservations = reservations.filter(
    (reservation) =>
      reservation.status !== "cancelled" &&
      new Date(reservation.start_time).getTime() > now
  );

  const cancelledReservations = reservations.filter(
    (reservation) => reservation.status === "cancelled"
  );

  const stats = [
    {
      label: "My Bookings",
      value: reservations.length,
      helper: "Total reservations created by you",
      icon: ListChecks,
    },
    {
      label: "Active Now",
      value: activeReservations.length,
      helper: "Reservations currently in progress",
      icon: Clock3,
    },
    {
      label: "Upcoming",
      value: upcomingReservations.length,
      helper: "Future active bookings",
      icon: CalendarCheck,
    },
    {
      label: "Cancelled",
      value: cancelledReservations.length,
      helper: "Cancelled personal bookings",
      icon: XCircle,
    },
  ];

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-950"
          >
            My Bookings
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 max-w-2xl text-slate-500"
          >
            Review your workspace reservations, upcoming bookings, and booking
            history.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Link
            href="/reservations/new"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
          >
            <CalendarPlus size={18} />
            Create Reservation
          </Link>
        </motion.div>
      </div>

      <section className="mb-8 grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <BookingStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

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
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            {stat.value}
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          <Icon size={19} strokeWidth={2.4} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{stat.helper}</p>
    </motion.div>
  );
}