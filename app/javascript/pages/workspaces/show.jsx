import { Link, router } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";

export default function WorkspaceShow({ workspace }) {
  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${workspace.name}"?`
    );

    if (confirmed) {
      router.delete(`/workspaces/${workspace.id}`);
    }
  }

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-2 text-sm text-slate-400">
            <Link href="/workspaces" className="hover:text-cyan-500">
              Workspaces
            </Link>{" "}
            / {workspace.name}
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">{workspace.name}</h1>

            <span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-500">
              {formatType(workspace.workspace_type)}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
              Up to {workspace.capacity} seats
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/workspaces/${workspace.id}/edit`}
            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Edit Space
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-100 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <section className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="mb-8 flex h-96 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            Workspace image placeholder
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="mb-3 text-xl font-bold">About this Space</h2>

              <p className="leading-8 text-slate-500">
                {workspace.description || "No description available."}
              </p>

              <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                  Booking Policy
                </h3>

                <ul className="space-y-3 text-sm text-slate-600">
                  <li>Free cancellation up to 24h before.</li>
                  <li>Instant confirmation for available spaces.</li>
                  <li>Standard workspace amenities included.</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Upcoming Reservations</h2>
                <Link
                  href="/reservations"
                  className="text-sm font-semibold text-cyan-500"
                >
                  View Calendar
                </Link>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white">
                {workspace.reservations?.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="text-slate-400">
                      <tr>
                        <th className="px-4 py-3 font-medium">User</th>
                        <th className="px-4 py-3 font-medium">Date & Time</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {workspace.reservations.map((reservation) => (
                        <tr
                          key={reservation.id}
                          className="border-t border-slate-100"
                        >
                          <td className="px-4 py-3">
                            {reservation.user?.name || "Unknown"}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {formatDateTime(reservation.start_time)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                              {reservation.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-sm text-slate-400">
                    No reservations for this workspace yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-cyan-500">
                Standard Rate
              </p>
              <p className="text-3xl font-bold">
                ${workspace.hourly_rate || 0}
                <span className="text-base font-normal text-slate-400">
                  /hour
                </span>
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                workspace.active
                  ? "bg-green-50 text-green-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {workspace.active ? "Available Now" : "Inactive"}
            </span>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <InfoCard label="Capacity" value={`${workspace.capacity} People`} />
            <InfoCard label="Location" value={workspace.location || "-"} />
          </div>

          <div className="mb-8">
            <h3 className="mb-4 font-bold">Amenities</h3>

            {workspace.amenities?.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-500">
                {workspace.amenities.map((amenity) => (
                  <div key={amenity.id}>✓ {amenity.name}</div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No amenities assigned.</p>
            )}
          </div>

          <Link
            href={`/reservations/new?workspace_id=${workspace.id}`}
            className="block rounded-lg bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-white hover:bg-cyan-500"
          >
            Book this Space
          </Link>
        </aside>
      </section>
    </AppLayout>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}

function formatType(type) {
  if (!type) return "-";

  return type
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDateTime(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString([], {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}