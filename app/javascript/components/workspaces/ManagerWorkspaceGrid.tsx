import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Workspace } from "../../types/workspace";
import type {
  WorkspaceSortOption,
  WorkspaceStatusFilter,
} from "../../types/workspaceBrowser";
import {
  sortWorkspaceList,
  uniqueWorkspaceValues,
  workspaceMatchesSearch,
  workspaceMatchesStatus,
} from "../../utils/workspaceBrowser";
import { formatText } from "../../utils/reservationFormUtils";
import {
  ClearFiltersButton,
  WorkspaceBrowserHeader,
  WorkspaceSearchInput,
  WorkspaceSelectFilter,
} from "./browser/WorkspaceBrowserControls";
import { EmptyWorkspaceBrowser } from "./browser/WorkspaceBrowserShared";
import ManagerWorkspaceCard from "./manager/ManagerWorkspaceCard";

type ManagerWorkspaceGridProps = {
  workspaces: Workspace[];
};

export default function ManagerWorkspaceGrid({
  workspaces,
}: ManagerWorkspaceGridProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<WorkspaceStatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<WorkspaceSortOption>("status");

  const workspaceTypes = useMemo(
    () =>
      uniqueWorkspaceValues(
        workspaces.map((workspace) => workspace.workspace_type),
      ),
    [workspaces],
  );

  const filteredWorkspaces = useMemo(() => {
    const matchingWorkspaces = workspaces.filter((workspace) => {
      const matchesSearch = workspaceMatchesSearch(workspace, search, true);
      const matchesStatus = workspaceMatchesStatus(workspace, statusFilter);
      const matchesType =
        typeFilter === "all" || workspace.workspace_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    return sortWorkspaceList(matchingWorkspaces, sortBy);
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
      className="rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30"
    >
      <div className="border-b border-slate-200 p-4 transition-colors dark:border-slate-800 sm:p-6">
        <WorkspaceBrowserHeader
          title="Workspace Browser"
          description="Use the visual browser to review spaces, status, photos, and quick management actions."
          shownCount={filteredWorkspaces.length}
          totalCount={workspaces.length}
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <WorkspaceSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, amenity, floor, zone, status or location..."
          />

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-wrap lg:items-center">
            <WorkspaceSelectFilter<WorkspaceStatusFilter>
              value={statusFilter}
              onChange={setStatusFilter}
              className="lg:w-40"
              ariaLabel="Workspace status filter"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </WorkspaceSelectFilter>

            <WorkspaceSelectFilter
              value={typeFilter}
              onChange={setTypeFilter}
              className="lg:w-44"
              ariaLabel="Workspace type filter"
            >
              <option value="all">All Types</option>

              {workspaceTypes.map((type) => (
                <option key={type} value={type}>
                  {formatText(type)}
                </option>
              ))}
            </WorkspaceSelectFilter>

            <WorkspaceSelectFilter<WorkspaceSortOption>
              value={sortBy}
              onChange={setSortBy}
              className="lg:w-44"
              ariaLabel="Workspace sort option"
            >
              <option value="status">Sort by Status</option>
              <option value="name">Sort by Name</option>
              <option value="capacity">Sort by Capacity</option>
              <option value="rate_low">Lowest Rate</option>
              <option value="rate_high">Highest Rate</option>
            </WorkspaceSelectFilter>

            {hasFilters && <ClearFiltersButton onClick={clearFilters} />}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {filteredWorkspaces.length === 0 ? (
          <EmptyWorkspaceBrowser
            hasFilters={hasFilters}
            onClear={clearFilters}
            description="Try changing the search text, status, type, or sort option."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
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