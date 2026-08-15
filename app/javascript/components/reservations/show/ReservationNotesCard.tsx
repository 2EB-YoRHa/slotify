import { StickyNote } from "lucide-react";
import { IconBox } from "./ReservationShowShared";
import type { ReservationShowData } from "../../../types/reservationShowTypes";

type ReservationNotesCardProps = {
  reservation: ReservationShowData;
};

export default function ReservationNotesCard({
  reservation,
}: ReservationNotesCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-3 sm:gap-4">
        <IconBox icon={StickyNote} />

        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
            Notes
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Additional information added to this reservation.
          </p>
        </div>
      </div>

      <div className="wrap-break-word rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 sm:p-5">
        {reservation.notes || "No notes were added to this reservation."}
      </div>
    </div>
  );
}