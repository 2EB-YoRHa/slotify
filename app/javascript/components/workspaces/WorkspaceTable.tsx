import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import {
  Building2,
  DollarSign,
  Eye,
  MapPin,
  Pencil,
  Search,
  SlidersHorizontal,
  Trash2,
  UsersRound,
} from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <div className="relative w-96">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, type or location..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-500">
            <SlidersHorizontal size={16} />
            Filters
          </div>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
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
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          >
            <option value="all">Any Capacity</option>
            <option value="1-4">1-4 people</option>
            <option value="5-10">5-10 people</option>
            <option value="10+">10+ people</option>
          </select>
        </div>
      </div>

      <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
        Showing {filteredWorkspaces.length} of {workspaces.length} workspaces
      </div>

      {filteredWorkspaces.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Building2 size={24} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            No workspaces found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Try changing the search text or selected filters.
          </p>
        </div>
      ) : (
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[18%]" />
            <col className="w-[12%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
          </colgroup>

          <thead className="bg-white text-slate-500">
            <tr>
              <th className="px-6 py-4 text-left font-bold">Workspace</th>
              <th className="px-6 py-4 text-center font-bold">Type</th>
              <th className="px-6 py-4 text-center font-bold">Capacity</th>
              <th className="px-6 py-4 text-center font-bold">Location</th>
              <th className="px-6 py-4 text-center font-bold">Rate</th>
              <th className="px-6 py-4 text-center font-bold">Status</th>
              <th className="px-6 py-4 text-center font-bold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredWorkspaces.map((workspace, index) => (
              <motion.tr
                key={workspace.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035 }}
                className="border-t border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-6 py-5 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                      <Building2 size={20} strokeWidth={2.4} />
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-bold text-slate-950">
                        {workspace.name}
                      </div>

                      <div className="truncate text-xs text-slate-400">
                        {workspace.amenities && workspace.amenities.length > 0
                          ? workspace.amenities
                              .map((amenity) => amenity.name)
                              .join(", ")
                          : "No amenities assigned"}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5 text-center align-middle">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {formatType(workspace.workspace_type)}
                  </span>
                </td>

                <td className="px-6 py-5 text-center align-middle">
                  <div className="inline-flex items-center gap-2 font-bold text-slate-700">
                    <UsersRound size={16} className="text-slate-400" />
                    {workspace.capacity}
                  </div>
                </td>

                <td className="px-6 py-5 text-center align-middle text-slate-600">
                  <div className="inline-flex max-w-full items-center justify-center gap-2">
                    <MapPin size={16} className="shrink-0 text-slate-400" />

                    <span className="truncate">
                      {workspace.location || "-"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5 text-center align-middle">
                  <div className="inline-flex items-center gap-1 font-bold text-slate-700">
                    <DollarSign size={15} className="text-slate-400" />
                    {workspace.hourly_rate || 0}/h
                  </div>
                </td>

                <td className="px-6 py-5 text-center align-middle">
                  <StatusBadge active={workspace.active} />
                </td>

                <td className="px-6 py-5 text-center align-middle">
                  <div className="flex items-center justify-center gap-2">
                    <ActionLink
                      href={`/workspaces/${workspace.id}`}
                      title="View"
                      icon={<Eye size={16} />}
                    />

                    <ActionLink
                      href={`/workspaces/${workspace.id}/edit`}
                      title="Edit"
                      icon={<Pencil size={16} />}
                    />

                    <ActionLink
                      href={`/workspaces/${workspace.id}/delete`}
                      title="Delete"
                      danger
                      icon={<Trash2 size={16} />}
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}

type StatusBadgeProps = {
  active: boolean;
};

function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex min-w-20 justify-center rounded-full px-3 py-1 text-xs font-bold ${
        active ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

type ActionLinkProps = {
  href: string;
  title: string;
  icon: React.ReactNode;
  danger?: boolean;
};

function ActionLink({ href, title, icon, danger = false }: ActionLinkProps) {
  return (
    <Link
      href={href}
      title={title}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition hover:-translate-y-0.5 hover:shadow-sm ${
        danger
          ? "border-red-100 text-red-500 hover:bg-red-50"
          : "border-slate-200 text-slate-500 hover:border-cyan-100 hover:bg-cyan-50 hover:text-cyan-500"
      }`}
    >
      {icon}
    </Link>
  );
}

function formatType(type?: string | null): string {
  if (!type) return "-";

  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}