import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { ArrowLeft, Ban, Edit3 } from "lucide-react";
import type { ReservationShowData } from "../../../types/reservationShowTypes";

type ReservationHeaderProps = {
  reservation: ReservationShowData;
  canModify: boolean;
  backHref: string;
  backLabel: string;
};

export default function ReservationHeader({
  reservation,
  canModify,
  backHref,
  backLabel,
}: ReservationHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-5 sm:mb-8 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
          >
            <ArrowLeft size={16} />
            <span className="truncate">{backLabel}</span>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-5 wrap-break-word text-2xl font-black leading-tight text-slate-950 sm:mt-6 sm:text-3xl"
        >
          Reservation for {reservation.workspace?.name || "Workspace"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base"
        >
          Review the booking schedule, workspace details, attendees, and notes.
        </motion.p>
      </div>

      {canModify && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:shrink-0"
        >
          <Link
            href={`/reservations/${reservation.id}/edit`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 hover:shadow-md xl:w-auto"
          >
            <Edit3 size={18} />
            Edit
          </Link>

          <Link
            href={`/reservations/${reservation.id}/cancel`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-md xl:w-auto"
          >
            <Ban size={18} />
            Cancel
          </Link>
        </motion.div>
      )}
    </div>
  );
}