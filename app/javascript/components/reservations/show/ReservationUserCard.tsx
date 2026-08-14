import { initials } from "./ReservationShowShared";
import type { ReservationShowData } from "../../../types/reservationShowTypes";

type ReservationUserCardProps = {
  reservation: ReservationShowData;
};

export default function ReservationUserCard({
  reservation,
}: ReservationUserCardProps) {
  const user = reservation.user;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-950">Reserved By</h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          User assigned to this reservation.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-5">
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name || "User"}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-4 ring-white"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-lg font-extrabold text-cyan-500 ring-4 ring-white">
            {initials(user?.name)}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-slate-950">
            {user?.name || "Unknown user"}
          </p>

          <p className="mt-1 truncate text-sm text-slate-500">
            {user?.email || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}