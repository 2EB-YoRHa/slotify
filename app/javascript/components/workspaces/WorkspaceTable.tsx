import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
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
import type { ReactNode } from "react";
import type { Workspace } from "../../types/workspace";
import WorkspacePhoto from "./WorkspacePhoto";

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
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="relative w-full lg:max-w-md lg:flex-1">
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

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto lg:shrink-0">
          <div className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-500">
            <SlidersHorizontal size={16} className="shrink-0" />
            <span>Filters</span>
          </div>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 sm:min-w-40"
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
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 sm:min-w-44"
          >
            <option value="all">Any Capacity</option>
            <option value="1-4">1-4 people</option>
            <option value="5-10">5-10 people</option>
            <option value="10+">10+ people</option>
          </select>
        </div>
      </div>

      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400 sm:px-6">
        Showing {filteredWorkspaces.length} of {workspaces.length} workspaces
      </div>

      {filteredWorkspaces.length === 0 ? (
        <EmptyWorkspaces />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
            {filteredWorkspaces.map((workspace, index) => (
              <WorkspaceMobileCard
                key={workspace.id}
                workspace={workspace}
                index={index}
              />
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <WorkspaceDesktopTable workspaces={filteredWorkspaces} />
          </div>
        </>
      )}
    </motion.div>
  );
}

function EmptyWorkspaces() {
  return (
    <div className="px-5 py-10 text-center sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Building2 size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No workspaces found
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Try changing the search text or selected filters.
      </p>
    </div>
  );
}

type WorkspaceDesktopTableProps = {
  workspaces: Workspace[];
};

function WorkspaceDesktopTable({ workspaces }: WorkspaceDesktopTableProps) {
  return (
    <table className="w-full min-w-245 table-fixed text-sm">
      <colgroup>
        <col className="w-[28%]" />
        <col className="w-[13%]" />
        <col className="w-[10%]" />
        <col className="w-[17%]" />
        <col className="w-[10%]" />
        <col className="w-[9%]" />
        <col className="w-[13%]" />
      </colgroup>

      <thead className="bg-white text-slate-500">
        <tr>
          <th className="px-6 py-4 text-left font-bold">Workspace</th>
          <th className="px-6 py-4 text-center font-bold">Type</th>
          <th className="px-6 py-4 text-center font-bold">Capacity</th>
          <th className="px-6 py-4 text-center font-bold">Location</th>
          <th className="px-6 py-4 text-center font-bold">Rate</th>
          <th className="px-6 py-4 text-center font-bold">Status</th>
          <th className="px-4 py-4 text-center font-bold">Actions</th>
        </tr>
      </thead>

      <tbody>
        {workspaces.map((workspace, index) => (
          <motion.tr
            key={workspace.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            className="border-t border-slate-100 transition hover:bg-slate-50"
          >
            <td className="px-6 py-5 align-middle">
              <WorkspaceIdentity workspace={workspace} />
            </td>

            <td className="px-6 py-5 text-center align-middle">
              <TypeBadge type={workspace.workspace_type} />
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
                <span className="truncate">{workspace.location || "-"}</span>
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

            <td className="px-4 py-5 text-center align-middle">
              <WorkspaceActions workspaceId={workspace.id} />
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}

type WorkspaceMobileCardProps = {
  workspace: Workspace;
  index: number;
};

function WorkspaceMobileCard({ workspace, index }: WorkspaceMobileCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <WorkspaceIdentity workspace={workspace} />
          <StatusBadge active={workspace.active} />
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
          <MobileInfo label="Type" value={formatType(workspace.workspace_type)} />
          <MobileInfo label="Capacity" value={`${workspace.capacity} people`} />
          <MobileInfo label="Rate" value={`$${workspace.hourly_rate || 0}/h`} />
          <MobileInfo label="Location" value={workspace.location || "-"} />
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
        <WorkspaceActions workspaceId={workspace.id} mobile />
      </div>
    </motion.article>
  );
}

function WorkspaceIdentity({ workspace }: { workspace: Workspace }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <WorkspacePhoto
        name={workspace.name}
        photoUrl={workspace.photo_url}
        fit="contain"
        position="object-center"
        className="h-12 w-16 shrink-0 rounded-xl border border-slate-100"
      />

      <div className="min-w-0">
        <div className="wrap-break-word font-bold text-slate-950">
          {workspace.name}
        </div>

        <div className="line-clamp-2 text-xs leading-5 text-slate-400">
          {workspace.amenities && workspace.amenities.length > 0
            ? workspace.amenities.map((amenity) => amenity.name).join(", ")
            : "No amenities assigned"}
        </div>
      </div>
    </div>
  );
}

type MobileInfoProps = {
  label: string;
  value: string | number;
};

function MobileInfo({ label, value }: MobileInfoProps) {
  return (
    <div className="min-w-0">
      <p className="truncate text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 wrap-break-word text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function TypeBadge({ type }: { type?: string | null }) {
  return (
    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
      {formatType(type)}
    </span>
  );
}

type StatusBadgeProps = {
  active: boolean;
};

function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex min-w-20 shrink-0 justify-center rounded-full px-3 py-1 text-xs font-bold ${
        active ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

type WorkspaceActionsProps = {
  workspaceId: number;
  mobile?: boolean;
};

function WorkspaceActions({ workspaceId, mobile = false }: WorkspaceActionsProps) {
  return (
    <div
      className={`flex items-center gap-2 ${
        mobile ? "justify-end" : "justify-center"
      }`}
    >
      <ActionLink
        href={`/workspaces/${workspaceId}`}
        title="View"
        icon={<Eye size={16} />}
      />

      <ActionLink
        href={`/workspaces/${workspaceId}/edit`}
        title="Edit"
        icon={<Pencil size={16} />}
      />

      <ActionLink
        href={`/workspaces/${workspaceId}/delete`}
        title="Delete"
        danger
        icon={<Trash2 size={16} />}
      />
    </div>
  );
}

type ActionLinkProps = {
  href: string;
  title: string;
  icon: ReactNode;
  danger?: boolean;
};

function ActionLink({ href, title, icon, danger = false }: ActionLinkProps) {
  return (
    <Link
      href={href}
      title={title}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-white transition hover:-translate-y-0.5 hover:shadow-sm ${
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