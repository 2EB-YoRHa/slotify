import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Building2,
  CalendarPlus,
  DollarSign,
  Edit3,
  Eye,
  Grid3X3,
  Layers3,
  MapPin,
  Search,
  Trash2,
  UsersRound,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import WorkspacePhoto from "./WorkspacePhoto";
import type { Workspace } from "../../types/workspace";
import { formatText } from "../../utils/reservationFormUtils";

type ManagerWorkspaceGridProps = {
  workspaces: Workspace[];
};

type StatusFilter = "all" | "active" | "inactive";
type SortOption = "name" | "capacity" | "rate_low" | "rate_high" | "status";

export default function ManagerWorkspaceGrid({
  workspaces,
}: ManagerWorkspaceGridProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("status");

  const workspaceTypes = useMemo(() => {
    return Array.from(
      new Set(
        workspaces
          .map((workspace) => workspace.workspace_type?.trim())
          .filter((type): type is string => Boolean(type)),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [workspaces]);

  const filteredWorkspaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...workspaces]
      .filter((workspace) => {
        const searchableText = [
          workspace.name,
          workspace.workspace_type,
          workspace.location,
          workspace.floor,
          workspace.zone,
          workspace.description,
          workspace.active ? "active" : "inactive",
          ...(workspace.amenities || []).map((amenity) => amenity.name),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          query.length === 0 || searchableText.includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && workspace.active) ||
          (statusFilter === "inactive" && !workspace.active);

        const matchesType =
          typeFilter === "all" || workspace.workspace_type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => sortWorkspace(a, b, sortBy));
  }, [search, sortBy, statusFilter, typeFilter, workspaces]);

  const hasFilters =
    search.trim().length > 0 ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    sortBy !== "status";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortBy("status");
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 p-6">
        <div className="mb-5 flex items-start justify-between gap-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">
              Workspace Browser
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Use the visual browser to review spaces, status, photos, and quick
              management actions.
            </p>
          </div>

          <div className="rounded-full bg-slate-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-400">
            {filteredWorkspaces.length} of {workspaces.length} shown
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-80 flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, amenity, floor, zone, status or location..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="h-12 w-40 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="h-12 w-44 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          >
            <option value="all">All Types</option>

            {workspaceTypes.map((type) => (
              <option key={type} value={type}>
                {formatText(type)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="h-12 w-44 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          >
            <option value="status">Sort by Status</option>
            <option value="name">Sort by Name</option>
            <option value="capacity">Sort by Capacity</option>
            <option value="rate_low">Lowest Rate</option>
            <option value="rate_high">Highest Rate</option>
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              <XCircle size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {filteredWorkspaces.length === 0 ? (
          <EmptyWorkspaceBrowser hasFilters={hasFilters} onClear={clearFilters} />
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {filteredWorkspaces.map((workspace, index) => (
              <ManagerWorkspaceCard
                key={workspace.id}
                workspace={workspace}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

function ManagerWorkspaceCard({
  workspace,
  index,
}: {
  workspace: Workspace;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      className="flex min-h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-cyan-100 hover:shadow-md"
    >
      <div className="relative">
        <WorkspacePhoto
          name={workspace.name}
          photoUrl={workspace.photo_url}
          galleryPhotos={workspace.gallery_photos || []}
          fit="contain"
          position="object-center"
          className="h-60 w-full border-0 bg-slate-100 p-2"
        />

        <span
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-extrabold shadow-sm ${
            workspace.active
              ? "bg-green-50 text-green-600 ring-1 ring-green-100"
              : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
          }`}
        >
          {workspace.active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
            <Building2 size={20} strokeWidth={2.4} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-extrabold text-slate-950">
              {workspace.name}
            </h3>

            <p className="mt-1 text-xs font-extrabold uppercase tracking-wide text-slate-400">
              {formatText(workspace.workspace_type)}
            </p>
          </div>
        </div>

        {workspace.description && (
          <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-500">
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
            value={`$${Number(workspace.hourly_rate || 0).toFixed(2)}/h`}
          />

          <SmallInfo
            icon={Layers3}
            label="Floor"
            value={workspace.floor || "-"}
          />

          <SmallInfo icon={Grid3X3} label="Zone" value={workspace.zone || "-"} />
        </div>

        {workspace.location && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <MapPin size={15} className="shrink-0 text-slate-400" />
            <span className="truncate">{workspace.location}</span>
          </div>
        )}

        <AmenityPreview workspace={workspace} />

        <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
          <WorkspaceAction
            href={`/workspaces/${workspace.id}`}
            icon={Eye}
            label="View"
            primary
          />

          <WorkspaceAction
            href={`/workspaces/${workspace.id}/edit`}
            icon={Edit3}
            label="Edit"
          />

          {workspace.active && (
            <WorkspaceAction
              href={`/reservations/new?workspace_id=${workspace.id}`}
              icon={CalendarPlus}
              label="Reserve"
            />
          )}

          <WorkspaceAction
            href={`/workspaces/${workspace.id}/delete`}
            icon={Trash2}
            label="Delete"
            danger
          />
        </div>
      </div>
    </motion.article>
  );
}

type SmallInfoProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function SmallInfo({ icon: Icon, label, value }: SmallInfoProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="mb-1 flex items-center gap-2 text-slate-400">
        <Icon size={14} />
        <p className="text-[10px] font-bold uppercase tracking-wide">{label}</p>
      </div>

      <p className="truncate text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function AmenityPreview({ workspace }: { workspace: Workspace }) {
  const amenities = workspace.amenities || [];
  const visibleAmenities = amenities.slice(0, 4);

  return (
    <div className="mt-5 border-t border-slate-100 pt-4">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        Amenities
      </p>

      {amenities.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {visibleAmenities.map((amenity) => (
            <span
              key={amenity.id}
              className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200"
            >
              {amenity.name}
            </span>
          ))}

          {amenities.length > visibleAmenities.length && (
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-600 ring-1 ring-cyan-100">
              +{amenities.length - visibleAmenities.length} more
            </span>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-400">No amenities assigned.</p>
      )}
    </div>
  );
}

type WorkspaceActionProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  primary?: boolean;
  danger?: boolean;
};

function WorkspaceAction({
  href,
  icon: Icon,
  label,
  primary = false,
  danger = false,
}: WorkspaceActionProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition hover:-translate-y-0.5 hover:shadow-sm ${
        primary
          ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100 hover:bg-cyan-500"
          : danger
            ? "border border-red-100 bg-white text-red-500 hover:bg-red-50"
            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}

function EmptyWorkspaceBrowser({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Search size={30} strokeWidth={2.4} />
      </div>

      <h3 className="mt-5 text-xl font-extrabold text-slate-950">
        No workspaces match your filters
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Try changing the search text, status, type, or sort option.
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <XCircle size={16} />
          Clear Filters
        </button>
      )}
    </div>
  );
}

function sortWorkspace(a: Workspace, b: Workspace, sortBy: SortOption) {
  if (sortBy === "status") {
    return Number(b.active) - Number(a.active) || a.name.localeCompare(b.name);
  }

  if (sortBy === "capacity") {
    return Number(b.capacity || 0) - Number(a.capacity || 0);
  }

  if (sortBy === "rate_low") {
    return Number(a.hourly_rate || 0) - Number(b.hourly_rate || 0);
  }

  if (sortBy === "rate_high") {
    return Number(b.hourly_rate || 0) - Number(a.hourly_rate || 0);
  }

  return a.name.localeCompare(b.name);
}