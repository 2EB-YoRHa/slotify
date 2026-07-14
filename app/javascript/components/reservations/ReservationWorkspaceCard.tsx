import type { Workspace } from "../../types/workspace";

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
      className={`overflow-hidden rounded-xl border bg-white shadow-sm ${
        selected ? "border-cyan-300" : "border-slate-200"
      }`}
    >
      <div className="flex">
        <div className="flex h-36 w-44 shrink-0 items-center justify-center bg-slate-100 text-slate-400">
          Space
        </div>

        <div className="flex flex-1 items-start justify-between p-5">
          <div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {formatType(workspace.workspace_type)}
            </span>

            <h3 className="mt-3 text-xl font-bold text-slate-900">
              {workspace.name}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Up to {workspace.capacity} people
            </p>

            {availabilityChecked && (
              <p
                className={`mt-2 text-sm font-semibold ${
                  unavailable ? "text-red-500" : "text-green-600"
                }`}
              >
                {unavailable
                  ? "Not available for selected time"
                  : "Available for selected time"}
              </p>
            )}

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
              {workspace.description || "No description available."}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {workspace.amenities?.slice(0, 3).map((amenity) => (
                <span
                  key={amenity.id}
                  className="rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-500"
                >
                  {amenity.name}
                </span>
              ))}
            </div>
          </div>

          <div className="ml-5 text-right">
            <p className="text-2xl font-bold text-cyan-500">
              ${workspace.hourly_rate || 0}
            </p>

            <p className="text-xs text-slate-400">/ hour</p>

            <button
              type="button"
              onClick={onBook}
              disabled={cannotBook}
              className="mt-8 rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
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