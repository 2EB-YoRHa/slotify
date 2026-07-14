import { Link } from "@inertiajs/react";

export default function ReservationsEmptyState() {
  return (
    <div className="flex min-h-[650px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-slate-300 bg-cyan-50 text-6xl text-cyan-400">
          ◴
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          No reservations yet
        </h2>

        <p className="mt-4 text-lg leading-8 text-slate-500">
          Your organization does not have reservations registered yet. Create
          the first booking to start managing workspace usage.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/reservations/new"
            className="rounded-lg bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500"
          >
            + New Reservation
          </Link>

          <Link
            href="/workspaces"
            className="rounded-lg border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Browse Workspaces
          </Link>
        </div>
      </div>
    </div>
  );
}