import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Workspace } from "../../types/workspace";
import type {
  MemberWorkspaceSortOption,
  WorkspaceBrowserOption,
  WorkspaceCapacityFilter,
  WorkspacePriceFilter,
} from "../../types/workspaceBrowser";
import {
  sortWorkspaceList,
  uniqueWorkspaceValues,
  workspaceMatchesAmenity,
  workspaceMatchesCapacity,
  workspaceMatchesPrice,
  workspaceMatchesSearch,
} from "../../utils/workspaceBrowser";
import { formatText } from "../../utils/reservationFormUtils";
import {
  ClearFiltersButton,
  WorkspaceBrowserHeader,
  WorkspaceSearchInput,
  WorkspaceSelectFilter,
} from "./browser/WorkspaceBrowserControls";
import { EmptyWorkspaceBrowser } from "./browser/WorkspaceBrowserShared";
import WorkspaceFilterPill from "./browser/WorkspaceFilterPill";
import MemberFeaturedWorkspacePanel from "./member/MemberFeaturedWorkspacePanel";
import MemberWorkspaceCard from "./member/MemberWorkspaceCard";

type MemberWorkspaceGridProps = {
  workspaces: Workspace[];
};

const CAPACITY_FILTERS: WorkspaceBrowserOption<WorkspaceCapacityFilter>[] = [
  { value: "all", label: "Any Capacity" },
  { value: "1-4", label: "1-4 People" },
  { value: "5-10", label: "5-10 People" },
  { value: "10+", label: "10+ People" },
];

const PRICE_FILTERS: WorkspaceBrowserOption<WorkspacePriceFilter>[] = [
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
  const [capacityFilter, setCapacityFilter] =
    useState<WorkspaceCapacityFilter>("all");
  const [priceFilter, setPriceFilter] = useState<WorkspacePriceFilter>("all");
  const [amenityFilter, setAmenityFilter] = useState("all");
  const [sortBy, setSortBy] = useState<MemberWorkspaceSortOption>("name");

  const activeWorkspaces = useMemo(
    () => workspaces.filter((workspace) => workspace.active),
    [workspaces],
  );

  const workspaceTypes = useMemo(
    () =>
      uniqueWorkspaceValues(
        activeWorkspaces.map((workspace) => workspace.workspace_type),
      ),
    [activeWorkspaces],
  );

  const amenities = useMemo(
    () =>
      uniqueWorkspaceValues(
        activeWorkspaces.flatMap((workspace) =>
          (workspace.amenities || []).map((amenity) => amenity.name),
        ),
      ),
    [activeWorkspaces],
  );

  const filteredWorkspaces = useMemo(() => {
    const matchingWorkspaces = activeWorkspaces.filter((workspace) => {
      const matchesSearch = workspaceMatchesSearch(workspace, search);
      const matchesType =
        typeFilter === "all" || workspace.workspace_type === typeFilter;
      const matchesCapacity = workspaceMatchesCapacity(
        workspace,
        capacityFilter,
      );
      const matchesPrice = workspaceMatchesPrice(workspace, priceFilter);
      const matchesAmenity = workspaceMatchesAmenity(workspace, amenityFilter);

      return (
        matchesSearch &&
        matchesType &&
        matchesCapacity &&
        matchesPrice &&
        matchesAmenity
      );
    });

    return sortWorkspaceList(matchingWorkspaces, sortBy);
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
    <div className="space-y-6 sm:space-y-8">
      {featuredWorkspace && (
        <MemberFeaturedWorkspacePanel workspace={featuredWorkspace} />
      )}

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30"
      >
        <div className="border-b border-slate-200 p-4 transition-colors dark:border-slate-800 sm:p-6">
          <WorkspaceBrowserHeader
            title="Find a Workspace"
            description="Search by name, location, type, or amenity and reserve the space that fits your visit."
            shownCount={filteredWorkspaces.length}
            totalCount={activeWorkspaces.length}
          />

          <div className="flex flex-col gap-4">
            <WorkspaceSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name, amenity, type, floor, zone or location..."
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <WorkspaceSelectFilter
                value={typeFilter}
                onChange={setTypeFilter}
                className="xl:w-full"
                ariaLabel="Workspace type filter"
              >
                <option value="all">All Types</option>

                {workspaceTypes.map((type) => (
                  <option key={type} value={type}>
                    {formatText(type)}
                  </option>
                ))}
              </WorkspaceSelectFilter>

              <WorkspaceSelectFilter
                value={amenityFilter}
                onChange={setAmenityFilter}
                className="xl:w-full"
                ariaLabel="Amenity filter"
              >
                <option value="all">All Amenities</option>

                {amenities.map((amenity) => (
                  <option key={amenity} value={amenity}>
                    {amenity}
                  </option>
                ))}
              </WorkspaceSelectFilter>

              <WorkspaceSelectFilter<MemberWorkspaceSortOption>
                value={sortBy}
                onChange={setSortBy}
                className="xl:w-full"
                ariaLabel="Sort workspaces"
              >
                <option value="name">Sort by Name</option>
                <option value="capacity">Sort by Capacity</option>
                <option value="rate_low">Lowest Rate</option>
                <option value="rate_high">Highest Rate</option>
              </WorkspaceSelectFilter>

              {hasFilters && <ClearFiltersButton onClick={clearFilters} />}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {CAPACITY_FILTERS.map((filter) => (
              <WorkspaceFilterPill
                key={filter.value}
                label={filter.label}
                selected={capacityFilter === filter.value}
                onClick={() => setCapacityFilter(filter.value)}
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {PRICE_FILTERS.map((filter) => (
              <WorkspaceFilterPill
                key={filter.value}
                label={filter.label}
                selected={priceFilter === filter.value}
                onClick={() => setPriceFilter(filter.value)}
              />
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {filteredWorkspaces.length === 0 ? (
            <EmptyWorkspaceBrowser
              title={
                activeWorkspaces.length === 0
                  ? "No workspaces are available yet"
                  : "No workspaces match your filters"
              }
              description={
                activeWorkspaces.length === 0
                  ? "There are no active spaces ready for reservations. Please check again later."
                  : "Try changing the search text, capacity, rate, type, or amenity filter."
              }
              hasFilters={hasFilters && activeWorkspaces.length > 0}
              onClear={clearFilters}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
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