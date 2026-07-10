import { Link, router } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";

export default function WorkspacesIndex({ workspaces = [] }) {
  function handleDelete(workspace) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${workspace.name}"?`
    );

    if (confirmed) {
      router.delete(`/workspaces/${workspace.id}`);
    }
  }

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workspaces</h1>
          <p className="mt-1 text-slate-500">
            Manage your organization's desks, rooms, and studios.
          </p>
        </div>

        <Link
          href="/workspaces/new"
          className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500"
        >
          + Add Workspace
        </Link>
      </div>

      {workspaces.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <input
              type="text"
              placeholder="Search by name or location..."
              className="w-96 rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none"
            />

            <div className="flex gap-3">
              <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option>All Types</option>
                <option>meeting_room</option>
                <option>desk</option>
                <option>private_office</option>
              </select>

              <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option>Any Capacity</option>
                <option>1-4 people</option>
                <option>5-10 people</option>
                <option>10+ people</option>
              </select>
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Workspace Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Capacity</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Rate</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {workspaces.map((workspace) => (
                <tr
                  key={workspace.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">
                      {workspace.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {workspace.amenities?.length || 0} amenities
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {formatType(workspace.workspace_type)}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {workspace.capacity} people
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {workspace.location || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    ${workspace.hourly_rate || 0}/hour
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        workspace.active
                          ? "bg-green-50 text-green-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {workspace.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/workspaces/${workspace.id}`}
                        className="text-slate-500 hover:text-cyan-500"
                      >
                        View
                      </Link>

                      <Link
                        href={`/workspaces/${workspace.id}/edit`}
                        className="text-slate-500 hover:text-cyan-500"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(workspace)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[600px] items-center justify-center rounded-xl border border-slate-200 bg-white">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-3xl border border-dashed border-cyan-200 bg-cyan-50 text-5xl text-cyan-400">
          ⌖
        </div>

        <h2 className="text-3xl font-bold">No workspaces available</h2>

        <p className="mt-4 text-lg leading-8 text-slate-500">
          It looks like your organization hasn't added any coworking locations
          yet. Start by setting up your first workspace for your team.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/workspaces/new"
            className="rounded-lg bg-cyan-400 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500"
          >
            + Add Workspace
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            View Dashboard
          </Link>
        </div>

        <div className="mt-8 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500">
          You need Admin or Manager permissions to add new workspaces.
        </div>
      </div>
    </div>
  );
}

function formatType(type) {
  if (!type) return "-";

  return type
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}