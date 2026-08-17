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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
          Reserved By
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          User assigned to this reservation.
        </p>
      </div>

      <div className="flex min-w-0 items-center gap-4 rounded-xl bg-slate-50 p-4 transition-colors dark:bg-slate-800/60 sm:p-5">
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name || "User"}
            className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 sm:h-16 sm:w-16"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-lg font-extrabold text-cyan-500 ring-4 ring-white transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-slate-900 sm:h-16 sm:w-16">
            {initials(user?.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-slate-950 dark:text-slate-100 sm:text-lg">
            {user?.name || "Unknown user"}
          </p>

          <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
            {user?.email || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}