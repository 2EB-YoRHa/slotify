import { CalendarCheck } from "lucide-react";
import { duration, formatDate, formatTime } from "../../../utils/dateTime";
import {
  formatRate,
  formatText,
  IconBox,
  SummaryRow,
} from "./ReservationShowShared";
import type { ReservationShowData } from "../../../types/reservationShowTypes";

type ReservationSummaryPanelProps = {
  reservation: ReservationShowData;
  canModify: boolean;
};

export default function ReservationSummaryPanel({
  reservation,
  canModify,
}: ReservationSummaryPanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <div className="mb-4">
          <IconBox icon={CalendarCheck} />
        </div>

        <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
          Booking Summary
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Quick overview of this reservation.
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-4 sm:p-5">
        <SummaryRow
          label="Workspace"
          value={reservation.workspace?.name || "Workspace removed"}
        />

        <SummaryRow label="Date" value={formatDate(reservation.start_time)} />

        <SummaryRow
          label="Time"
          value={`${formatTime(reservation.start_time)} - ${formatTime(
            reservation.end_time,
          )}`}
        />

        <SummaryRow
          label="Duration"
          value={duration(reservation.start_time, reservation.end_time)}
        />

        <SummaryRow
          label="Hourly Rate"
          value={formatRate(reservation.workspace?.hourly_rate)}
        />

        <SummaryRow label="Floor" value={reservation.workspace?.floor || "-"} />

        <SummaryRow label="Zone" value={reservation.workspace?.zone || "-"} />

        <SummaryRow label="Status" value={formatText(reservation.status)} />
      </div>

      {!canModify && (
        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
          This reservation can no longer be modified.
        </div>
      )}
    </div>
  );
}