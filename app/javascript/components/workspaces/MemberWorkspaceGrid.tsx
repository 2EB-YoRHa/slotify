import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarPlus,
  DollarSign,
  Grid3X3,
  Layers3,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import WorkspacePhoto from "./WorkspacePhoto";
import type { Workspace } from "../../types/workspace";
import { formatText } from "../../utils/reservationFormUtils";

type MemberWorkspaceGridProps = {
  workspaces: Workspace[];
};

type CapacityFilter = "all" | "1-4" | "5-10" | "10+";
type PriceFilter = "all" | "0-25" | "25-75" | "75+";
type SortOption = "name" | "capacity" | "rate_low" | "rate_high";

const CAPACITY_FILTERS: { value: CapacityFilter; label: string }[] = [
  { value: "all", label: "Any Capacity" },
  { value: "1-4", label: "1-4 People" },
  { value: "5-10", label: "5-10 People" },
  { value: "10+", label: "10+ People" },
];

const PRICE_FILTERS: { value: PriceFilter; label: string }[] = [
  { value: "all", label: "Any Rate" },
  { value: "0-25", label: "Up to $25/h" },
  { value: "25-75", label: "$25-$75/h" },
  { value: "75+", label: "$75+/h" },
];

export default function MemberWorkspaceGrid({
  workspaces,
}: MemberWorkspaceGridProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState<CapacityFilter>("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [amenityFilter, setAmenityFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const activeWorkspaces = useMemo(
    () => workspaces.filter((workspace) => workspace.active),
    [workspaces],
  );

  const workspaceTypes = useMemo(() => {
    return uniqueValues(
      activeWorkspaces.map((workspace) => workspace.workspace_type),
    );
  }, [activeWorkspaces]);

  const amenities = useMemo(() => {
    return uniqueValues(
      activeWorkspaces.flatMap((workspace) =>
        (workspace.amenities || []).map((amenity) => amenity.name),
      ),
    );
  }, [activeWorkspaces]);

  const filteredWorkspaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sortWorkspaces(
      activeWorkspaces.filter((workspace) => {
        const capacity = Number(workspace.capacity || 0);
        const hourlyRate = Number(workspace.hourly_rate || 0);
        const workspaceAmenities = workspace.amenities || [];

        const searchableText = [
          workspace.name,
          workspace.workspace_type,
          workspace.location,
          workspace.floor,
          workspace.zone,
          workspace.description,
          ...workspaceAmenities.map((amenity) => amenity.name),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          query.length === 0 || searchableText.includes(query);

        const matchesType =
          typeFilter === "all" || workspace.workspace_type === typeFilter;

        const matchesCapacity =
          capacityFilter === "all" ||
          (capacityFilter === "1-4" && capacity >= 1 && capacity <= 4) ||
          (capacityFilter === "5-10" && capacity >= 5 && capacity <= 10) ||
          (capacityFilter === "10+" && capacity > 10);

        const matchesPrice =
          priceFilter === "all" ||
          (priceFilter === "0-25" && hourlyRate <= 25) ||
          (priceFilter === "25-75" && hourlyRate > 25 && hourlyRate <= 75) ||
          (priceFilter === "75+" && hourlyRate > 75);

        const matchesAmenity =
          amenityFilter === "all" ||
          workspaceAmenities.some((amenity) => amenity.name === amenityFilter);

        return (
          matchesSearch &&
          matchesType &&
          matchesCapacity &&
          matchesPrice &&
          matchesAmenity
        );
      }),
      sortBy,
    );
  }, [
    activeWorkspaces,
    amenityFilter,
    capacityFilter,
    priceFilter,
    search,
    sortBy,
    typeFilter,
  ]);

  const hasFilters =
    search.trim().length > 0 ||
    typeFilter !== "all" ||
    capacityFilter !== "all" ||
    priceFilter !== "all" ||
    amenityFilter !== "all" ||
    sortBy !== "name";

  const featuredWorkspace =
    filteredWorkspaces[0] || activeWorkspaces[0] || null;

  function clearFilters() {
    setSearch("");
    setTypeFilter("all");
    setCapacityFilter("all");
    setPriceFilter("all");
    setAmenityFilter("all");
    setSortBy("name");
  }

  return (
    <div className="space-y-8">
      {featuredWorkspace && (
        <FeaturedWorkspacePanel workspace={featuredWorkspace} />
      )}

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
                Find a Workspace
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Search by name, location, type, or amenity and reserve the space
                that fits your visit.
              </p>
            </div>

            <div className="rounded-full bg-slate-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-400">
              {filteredWorkspaces.length} of {activeWorkspaces.length} shown
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative min-w-80 flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, amenity, type, floor, zone or location..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-500 xl:flex">
                <SlidersHorizontal size={16} />
                Filters
              </div>

              <SelectFilter
                value={typeFilter}
                onChange={setTypeFilter}
                ariaLabel="Workspace type filter"
              >
                <option value="all">All Types</option>
                {workspaceTypes.map((type) => (
                  <option key={type} value={type}>
                    {formatText(type)}
                  </option>
                ))}
              </SelectFilter>

              <SelectFilter
                value={amenityFilter}
                onChange={setAmenityFilter}
                ariaLabel="Amenity filter"
              >
                <option value="all">All Amenities</option>
                {amenities.map((amenity) => (
                  <option key={amenity} value={amenity}>
                    {amenity}
                  </option>
                ))}
              </SelectFilter>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
                className="h-12 w-44 rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                aria-label="Sort workspaces"
              >
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

          <div className="mt-5 flex flex-wrap gap-2">
            {CAPACITY_FILTERS.map((filter) => (
              <FilterPill
                key={filter.value}
                label={filter.label}
                selected={capacityFilter === filter.value}
                onClick={() => setCapacityFilter(filter.value)}
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {PRICE_FILTERS.map((filter) => (
              <FilterPill
                key={filter.value}
                label={filter.label}
                selected={priceFilter === filter.value}
                onClick={() => setPriceFilter(filter.value)}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {filteredWorkspaces.length === 0 ? (
            <WorkspaceBrowseEmptyState
              hasWorkspaces={activeWorkspaces.length > 0}
              hasFilters={hasFilters}
              onClearFilters={clearFilters}
            />
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
        </div>
      </motion.section>
    </div>
  );
}

function FeaturedWorkspacePanel({ workspace }: { workspace: Workspace }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="overflow-hidden rounded-xl border border-cyan-100 bg-white shadow-sm"
    >
      <div className="grid grid-cols-5">
        <WorkspacePhoto
          name={workspace.name}
          photoUrl={workspace.photo_url}
          galleryPhotos={workspace.gallery_photos || []}
          fit="contain"
          position="object-center"
          className="col-span-2 h-full min-h-80 border-0 bg-slate-100 p-3"
        />

        <div className="col-span-3 bg-linear-to-br from-cyan-50 to-white p-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-cyan-600 shadow-sm">
                <Sparkles size={14} />
                Suggested workspace
              </div>

              <h2 className="text-3xl font-extrabold text-slate-950">
                {workspace.name}
              </h2>

              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-slate-400">
                {formatText(workspace.workspace_type)}
              </p>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
              Available
            </span>
          </div>

          {workspace.description && (
            <p className="mb-6 max-w-2xl text-sm leading-6 text-slate-600">
              {workspace.description}
            </p>
          )}

          <div className="mb-6 grid grid-cols-3 gap-4">
            <FeatureInfo
              icon={UsersRound}
              label="Capacity"
              value={`${workspace.capacity} people`}
            />

            <FeatureInfo
              icon={DollarSign}
              label="Rate"
              value={`$${Number(workspace.hourly_rate || 0).toFixed(2)}/h`}
            />

            <FeatureInfo
              icon={MapPin}
              label="Location"
              value={workspace.location || "Not provided"}
            />
          </div>

          <AmenityPreview workspace={workspace} />

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/reservations/new?workspace_id=${workspace.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
            >
              <CalendarPlus size={18} />
              Reserve Workspace
            </Link>

            <Link
              href={`/workspaces/${workspace.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              View Details
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

type MemberWorkspaceCardProps = {
  workspace: Workspace;
  index: number;
};

function MemberWorkspaceCard({ workspace, index }: MemberWorkspaceCardProps) {
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

        <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-green-600 shadow-sm">
          Available
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
            value={`$${Number(workspace.hourly_rate || 0).toFixed(2)}/h`}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <SmallInfo
            icon={Layers3}
            label="Floor"
            value={workspace.floor || "-"}
          />

          <SmallInfo
            icon={Grid3X3}
            label="Zone"
            value={workspace.zone || "-"}
          />
        </div>

        {workspace.location && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <MapPin size={15} className="shrink-0 text-slate-400" />
            <span className="truncate">{workspace.location}</span>
          </div>
        )}

        <AmenityPreview workspace={workspace} compact />

        <div className="mt-auto flex gap-3 pt-6">
          <Link
            href={`/workspaces/${workspace.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-100 hover:bg-cyan-50 hover:text-cyan-600"
          >
            Details
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

type FeatureInfoProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function FeatureInfo({ icon: Icon, label, value }: FeatureInfoProps) {
  return (
    <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        <Icon size={15} />

        <p className="text-[10px] font-extrabold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="truncate text-sm font-extrabold text-slate-950">{value}</p>
    </div>
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

function AmenityPreview({
  workspace,
  compact = false,
}: {
  workspace: Workspace;
  compact?: boolean;
}) {
  const amenities = workspace.amenities || [];
  const visibleAmenities = amenities.slice(0, compact ? 4 : 6);

  return (
    <div className="mt-5 border-t border-slate-100 pt-4">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Sparkles size={15} />

        <p className="text-[10px] font-bold uppercase tracking-wide">
          Amenities
        </p>
      </div>

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
        <p className="text-sm text-slate-400">No amenities listed.</p>
      )}
    </div>
  );
}

type SelectFilterProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  children: React.ReactNode;
};

function SelectFilter({
  value,
  onChange,
  ariaLabel,
  children,
}: SelectFilterProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 w-44 rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
      aria-label={ariaLabel}
    >
      {children}
    </select>
  );
}

type FilterPillProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function FilterPill({ label, selected, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide transition ${
        selected
          ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100"
          : "bg-slate-100 text-slate-500 hover:bg-cyan-50 hover:text-cyan-600"
      }`}
    >
      {label}
    </button>
  );
}

type WorkspaceBrowseEmptyStateProps = {
  hasWorkspaces: boolean;
  hasFilters: boolean;
  onClearFilters: () => void;
};

function WorkspaceBrowseEmptyState({
  hasWorkspaces,
  hasFilters,
  onClearFilters,
}: WorkspaceBrowseEmptyStateProps) {
  if (!hasWorkspaces) {
    return (
      <div className="rounded-2xl bg-slate-50 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
          <Building2 size={30} strokeWidth={2.4} />
        </div>

        <h3 className="mt-5 text-xl font-extrabold text-slate-950">
          No workspaces are available yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          There are no active spaces ready for reservations. Please check again
          later.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Search size={30} strokeWidth={2.4} />
      </div>

      <h3 className="mt-5 text-xl font-extrabold text-slate-950">
        No workspaces match your filters
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Try changing the search text, capacity, rate, type, or amenity filter.
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <XCircle size={16} />
          Clear Filters
        </button>
      )}
    </div>
  );
}

function sortWorkspaces(workspaces: Workspace[], sortBy: SortOption) {
  return [...workspaces].sort((a, b) => {
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
  });
}

function uniqueValues(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort((a, b) => a.localeCompare(b));
}
