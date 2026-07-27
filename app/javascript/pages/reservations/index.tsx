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
import ReservationsTable from "../../components/reservations/ReservationsTable";
import type { Reservation } from "../../types/reservation";

type ReservationsIndexProps = {
  reservations?: Reservation[];
};

export default function ReservationsIndex({
  reservations = [],
}: ReservationsIndexProps) {
  const upcomingReservations = reservations.filter(
    (reservation) =>
      reservation.status !== "cancelled" &&
      new Date(reservation.start_time).getTime() >= Date.now()
  );

  const confirmedReservations = reservations.filter(
    (reservation) => reservation.status === "confirmed"
  );

  const cancelledReservations = reservations.filter(
    (reservation) => reservation.status === "cancelled"
  );

  const stats = [
    {
      label: "Total Reservations",
      value: reservations.length,
      helper: "All bookings in the organization",
      icon: ListChecks,
    },
    {
      label: "Upcoming",
      value: upcomingReservations.length,
      helper: "Future active reservations",
      icon: Clock3,
    },
    {
      label: "Confirmed",
      value: confirmedReservations.length,
      helper: "Approved bookings",
      icon: CalendarCheck,
    },
    {
      label: "Cancelled",
      value: cancelledReservations.length,
      helper: "Cancelled bookings",
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
            Reservations
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 max-w-2xl text-slate-500"
          >
            Manage workspace bookings, review availability, and keep reservation
            activity organized.
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
            New Reservation
          </Link>
        </motion.div>
      </div>

      <section className="mb-8 grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <ReservationStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      <ReservationsTable reservations={reservations} />
    </AppLayout>
  );
}

type ReservationStat = {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
};

type ReservationStatCardProps = {
  stat: ReservationStat;
  index: number;
};

function ReservationStatCard({ stat, index }: ReservationStatCardProps) {
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