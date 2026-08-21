import type { Workspace } from "../../types/workspace";
import WorkspacePhoto from "../workspaces/WorkspacePhoto";

type ReservationWorkspaceCardProps = {
  workspace: Workspace;
  selected: boolean;
  processing: boolean;
  attendeesCount: number;
  unavailable: boolean;
  availabilityChecked: boolean;
  onBook: () => void;
};

export default function ReservationWorkspaceCard({
  workspace,
  selected,
  processing,
  attendeesCount,
  unavailable,
  availabilityChecked,
  onBook,
}: ReservationWorkspaceCardProps) {
  const exceedsCapacity = attendeesCount > Number(workspace.capacity);
  const cannotBook = processing || exceedsCapacity || unavailable;

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-colors dark:bg-slate-900 dark:shadow-slate-950/30 ${
        selected
          ? "border-cyan-300 dark:border-cyan-500/50"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="flex">
        <WorkspacePhoto
          name={workspace.name}
          photoUrl={workspace.photo_url}
          fit="contain"
          position="object-center"
          className="h-36 w-44 shrink-0 bg-slate-100 transition-colors dark:bg-slate-800"
        />

        <div className="flex flex-1 items-start justify-between p-5">
          <div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 transition-colors dark:bg-slate-800 dark:text-slate-300">
              {formatType(workspace.workspace_type)}
            </span>

            <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-100">
              {workspace.name}
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Up to {workspace.capacity} people
            </p>

            {availabilityChecked && (
              <p
                className={`mt-2 text-sm font-semibold ${
                  unavailable
                    ? "text-red-500 dark:text-red-300"
                    : "text-green-600 dark:text-green-300"
                }`}
              >
                {unavailable
                  ? "Not available for selected time"
                  : "Available for selected time"}
              </p>
            )}

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {workspace.description || "No description available."}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {workspace.amenities?.slice(0, 3).map((amenity) => (
                <span
                  key={amenity.id}
                  className="rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-500 transition-colors dark:bg-slate-800 dark:text-slate-400"
                >
                  {amenity.name}
                </span>
              ))}
            </div>
          </div>

          <div className="ml-5 text-right">
            <p className="text-2xl font-bold text-cyan-500 dark:text-cyan-300">
              ${workspace.hourly_rate || 0}
            </p>

            <p className="text-xs text-slate-400 dark:text-slate-500">/ hour</p>

            <button
              type="button"
              onClick={onBook}
              disabled={cannotBook}
              className="mt-8 rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-950 dark:shadow-none dark:hover:bg-cyan-300"
            >
              {unavailable
                ? "Not Available"
                : exceedsCapacity
                  ? `Max ${workspace.capacity} people`
                  : processing
                    ? "Booking..."
                    : "Book Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatType(type?: string | null): string {
  if (!type) return "-";

  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}