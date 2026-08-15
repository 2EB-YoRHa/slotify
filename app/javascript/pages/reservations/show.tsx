import { usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import AppLayout from "../../components/AppLayout";
import ReservationHeader from "../../components/reservations/show/ReservationHeader";
import ReservationNotesCard from "../../components/reservations/show/ReservationNotesCard";
import ReservationStatsGrid from "../../components/reservations/show/ReservationStatsGrid";
import ReservationSummaryPanel from "../../components/reservations/show/ReservationSummaryPanel";
import ReservationUserCard from "../../components/reservations/show/ReservationUserCard";
import ReservationWorkspacePanel from "../../components/reservations/show/ReservationWorkspacePanel";
import { canModifyReservation } from "../../components/reservations/show/ReservationShowShared";
import type {
  ReservationShowCurrentUser,
  ReservationShowData,
} from "../../types/reservationShowTypes";

type SharedPageProps = {
  current_user?: ReservationShowCurrentUser | null;
};

type ReservationShowProps = {
  reservation: ReservationShowData;
};

export default function ReservationShow({ reservation }: ReservationShowProps) {
  const { current_user } = usePage<SharedPageProps>().props;
  const isMember = current_user?.role === "member";
  const canModify = canModifyReservation(reservation);
  const backHref = isMember ? "/my_reservations" : "/reservations";
  const backLabel = isMember ? "Back to My Bookings" : "Back to Reservations";

  return (
    <AppLayout>
      <ReservationHeader
        reservation={reservation}
        canModify={canModify}
        backHref={backHref}
        backLabel={backLabel}
      />

      <ReservationStatsGrid reservation={reservation} />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="space-y-6 xl:col-span-2 xl:space-y-8"
        >
          <ReservationWorkspacePanel reservation={reservation} />
          <ReservationUserCard reservation={reservation} />
          <ReservationNotesCard reservation={reservation} />
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="space-y-6 xl:sticky xl:top-24 xl:self-start"
        >
          <ReservationSummaryPanel
            reservation={reservation}
            canModify={canModify}
          />
        </motion.aside>
      </section>
    </AppLayout>
  );
}