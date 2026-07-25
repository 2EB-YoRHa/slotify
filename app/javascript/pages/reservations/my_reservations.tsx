import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  Clock3,
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

  const activeNow = reservations.filter((reservation) => {
    const startTime = new Date(reservation.start_time).getTime();
    const endTime = new Date(reservation.end_time).getTime();

    return (
      reservation.status !== "cancelled" &&
      startTime <= now &&
      endTime >= now
    );
  });

  const upcomingReservations = reservations.filter((reservation) => {
    return (
      reservation.status !== "cancelled" &&
      new Date(reservation.start_time).getTime() >= now
    );
  });

  const cancelledReservations = reservations.filter(
    (reservation) => reservation.status === "cancelled"
  );

  const stats = [
    {
      label: "My Bookings",
      value: reservations.length,
      helper: "Total reservations",
      icon: CalendarCheck,
    },
    {
      label: "Active Now",
      value: activeNow.length,
      helper: "Currently in use",
      icon: Clock3,
    },
    {
      label: "Upcoming",
      value: upcomingReservations.length,
      helper: "Future bookings",
      icon: CalendarClock,
    },
    {
      label: "Cancelled",
      value: cancelledReservations.length,
      helper: "Inactive bookings",
      icon: CalendarX,
    },
  ];

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-sm font-bold uppercase tracking-wide text-cyan-500"
          >
            Personal Reservations
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl font-bold text-slate-950"
          >
            My Bookings
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-slate-500"
          >
            View and manage the reservations created with your account.
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
            New Booking
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