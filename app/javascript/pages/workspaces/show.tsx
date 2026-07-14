import { Link } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import { formatDate, formatTime } from "../../utils/dateTime";
import type { Reservation } from "../../types/reservation";
import type { Workspace } from "../../types/workspace";

type WorkspaceShowProps = {
  workspace: Workspace & {
    reservations?: Reservation[];
  };
};

export default function WorkspaceShow({ workspace }: WorkspaceShowProps) {
  const reservations = workspace.reservations || [];

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 text-sm text-slate-400">
            <Link href="/workspaces" className="hover:text-cyan-500">
              Workspaces
            </Link>{" "}
            / Details
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            {workspace.name}
          </h1>

          <p className="mt-1 text-slate-500">
            View workspace details, amenities, and related reservations.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/workspaces"
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Back
          </Link>

          <Link
            href={`/workspaces/${workspace.id}/edit`}
            className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500"
          >
            Edit Workspace
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <section className="col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {formatType(workspace.workspace_type)}
                </span>

                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                  {workspace.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {workspace.description || "No description available."}
                </p>
              </div>

              <StatusBadge active={workspace.active} />
            </div>

            <div className="grid grid-cols-3 gap-5">
              <InfoCard label="Capacity" value={`${workspace.capacity} people`} />
              <InfoCard label="Location" value={workspace.location || "-"} />
              <InfoCard label="Hourly Rate" value={`$${workspace.hourly_rate || 0}`} />
              <InfoCard label="Floor" value={workspace.floor || "-"} />
              <InfoCard label="Zone" value={workspace.zone || "-"} />
              <InfoCard label="Status" value={workspace.active ? "Active" : "Inactive"} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Amenities</h2>

            {workspace.amenities && workspace.amenities.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-3">
                {workspace.amenities.map((amenity) => (
                  <span
                    key={amenity.id}
                    className="rounded-lg bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-600"
                  >
                    {amenity.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                No amenities assigned to this workspace.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Reservations
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Reservations associated with this workspace.
                </p>
              </div>

              <Link
                href={`/reservations/new?workspace_id=${workspace.id}`}
                className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-500"
              >
                + Reserve
              </Link>
            </div>

            {reservations.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400">
                No reservations found for this workspace.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Time</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 text-right font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {reservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {reservation.user?.name || "Unknown user"}
                        </div>

                        <div className="text-xs text-slate-400">
                          {reservation.user?.email || "-"}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(reservation.start_time)}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {formatTime(reservation.start_time)} -{" "}
                        {formatTime(reservation.end_time)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          {reservation.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/reservations/${reservation.id}`}
                          className="text-sm font-bold text-cyan-500 hover:text-cyan-600"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Workspace Summary
            </h2>

            <div className="mt-5 space-y-4 text-sm">
              <SummaryItem label="Type" value={formatType(workspace.workspace_type)} />
              <SummaryItem label="Capacity" value={`${workspace.capacity} people`} />
              <SummaryItem label="Rate" value={`$${workspace.hourly_rate || 0}/hour`} />
              <SummaryItem label="Reservations" value={reservations.length} />
            </div>
          </div>

          <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-6">
            <h2 className="font-bold text-slate-800">Quick Action</h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Members can reserve this workspace if it is active and available
              for the selected time.
            </p>

            <Link
              href={`/reservations/new?workspace_id=${workspace.id}`}
              className="mt-5 block rounded-lg bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-white hover:bg-cyan-500"
            >
              Create Reservation
            </Link>
          </div>

          <div className="rounded-xl border border-red-100 bg-red-50 p-6">
            <h2 className="font-bold text-red-700">Danger Zone</h2>

            <p className="mt-2 text-sm leading-6 text-red-600">
              Deleting this workspace will remove it from the organization.
            </p>

            <Link
              href={`/workspaces/${workspace.id}/delete`}
              className="mt-5 block rounded-lg bg-red-500 px-5 py-3 text-center text-sm font-bold text-white hover:bg-red-600"
            >
              Delete Workspace
            </Link>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}

type InfoCardProps = {
  label: string;
  value: string | number;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-bold text-slate-900">{value}</p>
    </div>
  );
}

type SummaryItemProps = {
  label: string;
  value: string | number;
};

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

type StatusBadgeProps = {
  active: boolean;
};

function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        active ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function formatType(type?: string | null): string {
  if (!type) return "-";

  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}