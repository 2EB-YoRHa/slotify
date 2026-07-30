import { UserRound } from "lucide-react";
import { IconBox, initials } from "./ReservationShowShared";
import type { ReservationShowData } from "../../../types/reservationShowTypes";

type ReservationUserCardProps = {
  reservation: ReservationShowData;
};

export default function ReservationUserCard({
  reservation,
}: ReservationUserCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-start gap-4">
        <IconBox icon={UserRound} />

        <div>
          <h2 className="text-2xl font-bold text-slate-950">Reserved By</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            User assigned to this reservation.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-lg font-extrabold text-cyan-500">
          {initials(reservation.user?.name)}
        </div>

        <div>
          <p className="text-lg font-bold text-slate-950">
            {reservation.user?.name || "Unknown user"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {reservation.user?.email || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}