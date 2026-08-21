import {
  CalendarCheck,
  CalendarDays,
  Clock3,
  UsersRound,
} from "lucide-react";
import { duration, formatDate, formatTime } from "../../../utils/dateTime";
import { formatText, SummaryCard } from "./ReservationShowShared";
import type { ReservationShowData } from "../../../types/reservationShowTypes";

type ReservationStatsGridProps = {
  reservation: ReservationShowData;
};

export default function ReservationStatsGrid({
  reservation,
}: ReservationStatsGridProps) {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:mb-8 xl:grid-cols-4 xl:gap-6">
      <SummaryCard
        index={0}
        icon={CalendarDays}
        label="Date"
        value={formatDate(reservation.start_time)}
        helper="Reservation day"
      />

      <SummaryCard
        index={1}
        icon={Clock3}
        label="Time"
        value={`${formatTime(reservation.start_time)} - ${formatTime(
          reservation.end_time,
        )}`}
        helper={duration(reservation.start_time, reservation.end_time)}
      />

      <SummaryCard
        index={2}
        icon={UsersRound}
        label="Attendees"
        value={reservation.attendees_count || 1}
        helper="People expected"
      />

      <SummaryCard
        index={3}
        icon={CalendarCheck}
        label="Status"
        value={formatText(reservation.status)}
        helper="Current booking state"
      />
    </section>
  );
}