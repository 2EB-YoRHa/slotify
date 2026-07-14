import { Link } from "@inertiajs/react";
import type { Workspace } from "../../types/workspace";

type WorkspaceTableProps = {
  workspaces: Workspace[];
};

export default function WorkspaceTable({ workspaces }: WorkspaceTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <input
          type="text"
          placeholder="Search by name or location..."
          className="w-96 rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-cyan-400"
        />

        <div className="flex gap-3">
          <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-400">
            <option>All Types</option>
            <option>Desk</option>
            <option>Meeting Room</option>
            <option>Private Office</option>
            <option>Studio</option>
          </select>

          <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-400">
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
                  {workspace.amenities && workspace.amenities.length > 0
                    ? workspace.amenities
                        .map((amenity) => amenity.name)
                        .join(", ")
                    : "No amenities"}
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
                <StatusBadge active={workspace.active} />
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

                  <Link
                    href={`/workspaces/${workspace.id}/delete`}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type StatusBadgeProps = {
  active: boolean;
};

function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
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