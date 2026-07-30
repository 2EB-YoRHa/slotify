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
    <div className="mb-8 flex items-start justify-between">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-6 text-3xl font-bold text-slate-950"
        >
          Reservation for {reservation.workspace?.name || "Workspace"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-2xl text-slate-500"
        >
          Review the booking schedule, workspace details, attendees, and notes.
        </motion.p>
      </div>

      {canModify && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-3"
        >
          <Link
            href={`/reservations/${reservation.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 hover:shadow-md"
          >
            <Edit3 size={18} />
            Edit
          </Link>

          <Link
            href={`/reservations/${reservation.id}/cancel`}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-md"
          >
            <Ban size={18} />
            Cancel
          </Link>
        </motion.div>
      )}
    </div>
  );
}