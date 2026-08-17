import { Link } from "@inertiajs/react";
import { CalendarPlus, CalendarSearch, SearchX } from "lucide-react";

type ReservationsEmptyStateProps = {
  hasReservations?: boolean;
  hasFilters?: boolean;
  onClearFilters?: () => void;
};

export default function ReservationsEmptyState({
  hasReservations = false,
  hasFilters = false,
  onClearFilters,
}: ReservationsEmptyStateProps) {
  const filteredEmpty = hasReservations && hasFilters;
  const Icon = filteredEmpty ? SearchX : CalendarSearch;

  return (
    <div className="flex min-h-104 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-10 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:min-h-160 sm:p-8">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-dashed border-cyan-200 bg-cyan-50 text-cyan-400 transition-colors dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 sm:mb-8 sm:h-32 sm:w-32">
          <Icon size={44} strokeWidth={2.2} />
        </div>

        <h2 className="wrap-break-word text-2xl font-black text-slate-950 dark:text-slate-100 sm:text-3xl">
          {filteredEmpty
            ? "No reservations match your filters"
            : "No reservations yet"}
        </h2>

        <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-lg sm:leading-8">
          {filteredEmpty
            ? "Try changing the search text or selected filters to find another reservation."
            : "Your organization does not have reservations registered yet. Create the first booking to start managing workspace usage."}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          {filteredEmpty && onClearFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              href="/reservations/new"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:bg-cyan-500 dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950 sm:w-auto"
            >
              <CalendarPlus size={16} />
              New Reservation
            </Link>
          )}

          <Link
            href="/workspaces"
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
          >
            Browse Workspaces
          </Link>
        </div>
      </div>
    </div>
  );
}