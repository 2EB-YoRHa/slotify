import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  Building2,
  CalendarPlus,
  DollarSign,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import type { Workspace } from "../../types/workspace";
import { formatText } from "../../utils/reservationFormUtils";

type MemberWorkspaceGridProps = {
  workspaces: Workspace[];
};

export default function MemberWorkspaceGrid({
  workspaces,
}: MemberWorkspaceGridProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");

  const activeWorkspaces = workspaces.filter((workspace) => workspace.active);

  const filteredWorkspaces = activeWorkspaces.filter((workspace) => {
    const query = search.toLowerCase();
    const capacity = Number(workspace.capacity);

    const matchesSearch =
      query.length === 0 ||
      workspace.name.toLowerCase().includes(query) ||
      workspace.workspace_type.toLowerCase().includes(query) ||
      (workspace.location || "").toLowerCase().includes(query) ||
      (workspace.amenities || []).some((amenity) =>
        amenity.name.toLowerCase().includes(query),
      );

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
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, amenity, type or location..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-500">
            <SlidersHorizontal size={16} />
            Filters
          </div>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="h-12 w-44 rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          >
            <option value="all">All Types</option>
            <option value="meeting_room">Meeting Room</option>
            <option value="private_office">Private Office</option>
            <option value="open_desk">Open Desk</option>
            <option value="training_room">Training Room</option>
            <option value="phone_booth">Phone Booth</option>
          </select>

          <select
            value={capacityFilter}
            onChange={(event) => setCapacityFilter(event.target.value)}
            className="h-12 w-44 rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          >
            <option value="all">Any Capacity</option>
            <option value="1-4">1-4 people</option>
            <option value="5-10">5-10 people</option>
            <option value="10+">10+ people</option>
          </select>
        </div>
      </div>

      <div className="mb-5 rounded-xl bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
        Showing {filteredWorkspaces.length} of {activeWorkspaces.length}{" "}
        available workspaces
      </div>

      {filteredWorkspaces.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {filteredWorkspaces.map((workspace, index) => (
            <MemberWorkspaceCard
              key={workspace.id}
              workspace={workspace}
              index={index}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}

type MemberWorkspaceCardProps = {
  workspace: Workspace;
  index: number;
};

function MemberWorkspaceCard({ workspace, index }: MemberWorkspaceCardProps) {
  const amenities = workspace.amenities || [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex min-h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-cyan-100 hover:shadow-md"
    >
      <div className="border-b border-slate-100 bg-linear-to-br from-cyan-50 to-white p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-cyan-500 shadow-sm">
            <Building2 size={22} strokeWidth={2.4} />
          </div>

          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
            Available
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-slate-950">
          {workspace.name}
        </h3>

        <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
          {formatText(workspace.workspace_type)}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {workspace.description && (
          <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-500">
            {workspace.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <SmallInfo
            icon={UsersRound}
            label="Capacity"
            value={`${workspace.capacity} people`}
          />

          <SmallInfo
            icon={DollarSign}
            label="Rate"
            value={`$${workspace.hourly_rate || 0}/h`}
          />
        </div>

        {workspace.location && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <MapPin size={15} className="shrink-0 text-slate-400" />
            <span className="truncate">{workspace.location}</span>
          </div>
        )}

        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="mb-3 flex items-center gap-2 text-slate-400">
            <Sparkles size={15} />

            <p className="text-[10px] font-bold uppercase tracking-wide">
              Amenities
            </p>
          </div>

          {amenities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity.id}
                  className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200"
                >
                  {amenity.name}
                </span>
              ))}

              {amenities.length > 4 && (
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-600 ring-1 ring-cyan-100">
                  +{amenities.length - 4} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No amenities listed.</p>
          )}
        </div>

        <div className="mt-auto flex gap-3 pt-6">
          <Link
            href={`/workspaces/${workspace.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-100 hover:bg-cyan-50 hover:text-cyan-600"
          >
            View Details
          </Link>

          <Link
            href={`/reservations/new?workspace_id=${workspace.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
          >
            <CalendarPlus size={17} />
            Reserve
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

type SmallInfoProps = {
  icon: typeof UsersRound;
  label: string;
  value: string;
};

function SmallInfo({ icon: Icon, label, value }: SmallInfoProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="mb-1 flex items-center gap-2 text-slate-400">
        <Icon size={14} />

        <p className="text-[10px] font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl bg-slate-50 p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Building2 size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No available workspaces found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Try changing the search text or selected filters.
      </p>
    </div>
  );
}