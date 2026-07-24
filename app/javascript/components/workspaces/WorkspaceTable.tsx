import { Link } from "@inertiajs/react";
import { useState } from "react";
import type { Workspace } from "../../types/workspace";

type WorkspaceTableProps = {
  workspaces: Workspace[];
};

export default function WorkspaceTable({ workspaces }: WorkspaceTableProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");

  const filteredWorkspaces = workspaces.filter((workspace) => {
    const query = search.toLowerCase();
    const capacity = Number(workspace.capacity);

    const matchesSearch =
      query.length === 0 ||
      workspace.name.toLowerCase().includes(query) ||
      workspace.workspace_type.toLowerCase().includes(query) ||
      (workspace.location || "").toLowerCase().includes(query);

    const matchesType =
      typeFilter === "all" || workspace.workspace_type === typeFilter;

    const matchesCapacity =
      capacityFilter === "all" ||
      (capacityFilter === "1-4" && capacity >= 1 && capacity <= 4) ||
      (capacityFilter === "5-10" && capacity >= 5 && capacity <= 10) ||
      (capacityFilter === "10+" && capacity > 10);

    return matchesSearch && matchesType && matchesCapacity;
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, type or location..."
          className="w-96 rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-cyan-400"
        />

        <div className="flex gap-3">
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          >
            <option value="all">All Types</option>
            <option value="meeting_room">Meeting Room</option>
            <option value="private_office">Private Office</option>
            <option value="hot_desk">Hot Desk</option>
            <option value="event_space">Event Space</option>
            <option value="training_room">Training Room</option>
          </select>

          <select
            value={capacityFilter}
            onChange={(event) => setCapacityFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          >
            <option value="all">Any Capacity</option>
            <option value="1-4">1-4 people</option>
            <option value="5-10">5-10 people</option>
            <option value="10+">10+ people</option>
          </select>
        </div>
      </div>

      {filteredWorkspaces.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-400">
          No workspaces match your filters.
        </div>
      ) : (
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
            {filteredWorkspaces.map((workspace) => (
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
      )}
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