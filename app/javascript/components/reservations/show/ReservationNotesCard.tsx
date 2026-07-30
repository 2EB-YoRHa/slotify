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
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-start gap-4">
        <IconBox icon={StickyNote} />

        <div>
          <h2 className="text-2xl font-bold text-slate-950">Notes</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Additional information added to this reservation.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
        {reservation.notes || "No notes were added to this reservation."}
      </div>
    </div>
  );
}