import { CalendarSearch, SearchX } from "lucide-react";

type ReservationsEmptyStateProps = {
  hasReservations?: boolean;
  hasFilters?: boolean;
};

export default function ReservationsEmptyState({
  hasReservations = false,
  hasFilters = false,
}: ReservationsEmptyStateProps) {
  const filteredEmpty = hasReservations && hasFilters;
  const Icon = filteredEmpty ? SearchX : CalendarSearch;

  return (
    <div className="px-5 py-10 text-center sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 transition-colors dark:bg-slate-800 dark:text-slate-500">
        <Icon size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
        {filteredEmpty
          ? "No reservations found"
          : "No reservations yet"}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {filteredEmpty
          ? "Try changing the search text or selected filters."
          : "Create the first reservation to start managing workspace usage."}
      </p>
    </div>
  );
}