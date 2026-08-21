import type { Workspace } from "../types/workspace";
import type {
  WorkspaceCapacityFilter,
  WorkspacePriceFilter,
  WorkspaceSortOption,
  WorkspaceStatusFilter,
} from "../types/workspaceBrowser";

export function uniqueWorkspaceValues(
  values: Array<string | null | undefined>,
): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

export function workspaceMatchesSearch(
  workspace: Workspace,
  search: string,
  includeStatus = false,
): boolean {
  const query = search.trim().toLowerCase();

  if (query.length === 0) return true;

  return workspaceSearchText(workspace, includeStatus).includes(query);
}

export function workspaceMatchesStatus(
  workspace: Workspace,
  statusFilter: WorkspaceStatusFilter,
): boolean {
  return (
    statusFilter === "all" ||
    (statusFilter === "active" && workspace.active) ||
    (statusFilter === "inactive" && !workspace.active)
  );
}

export function workspaceMatchesCapacity(
  workspace: Workspace,
  capacityFilter: WorkspaceCapacityFilter,
): boolean {
  const capacity = Number(workspace.capacity || 0);

  return (
    capacityFilter === "all" ||
    (capacityFilter === "1-4" && capacity >= 1 && capacity <= 4) ||
    (capacityFilter === "5-10" && capacity >= 5 && capacity <= 10) ||
    (capacityFilter === "10+" && capacity > 10)
  );
}

export function workspaceMatchesPrice(
  workspace: Workspace,
  priceFilter: WorkspacePriceFilter,
): boolean {
  const hourlyRate = Number(workspace.hourly_rate || 0);

  return (
    priceFilter === "all" ||
    (priceFilter === "0-25" && hourlyRate <= 25) ||
    (priceFilter === "25-75" && hourlyRate > 25 && hourlyRate <= 75) ||
    (priceFilter === "75+" && hourlyRate > 75)
  );
}

export function workspaceMatchesAmenity(
  workspace: Workspace,
  amenityFilter: string,
): boolean {
  if (amenityFilter === "all") return true;

  return (workspace.amenities || []).some(
    (amenity) => amenity.name === amenityFilter,
  );
}

export function sortWorkspaceList(
  workspaces: Workspace[],
  sortBy: WorkspaceSortOption,
): Workspace[] {
  return [...workspaces].sort((first, second) => {
    if (sortBy === "status") {
      return (
        Number(second.active) - Number(first.active) ||
        first.name.localeCompare(second.name)
      );
    }

    if (sortBy === "capacity") {
      return Number(second.capacity || 0) - Number(first.capacity || 0);
    }

    if (sortBy === "rate_low") {
      return Number(first.hourly_rate || 0) - Number(second.hourly_rate || 0);
    }

    if (sortBy === "rate_high") {
      return Number(second.hourly_rate || 0) - Number(first.hourly_rate || 0);
    }

    return first.name.localeCompare(second.name);
  });
}

function workspaceSearchText(
  workspace: Workspace,
  includeStatus: boolean,
): string {
  return [
    workspace.name,
    workspace.workspace_type,
    workspace.location,
    workspace.floor,
    workspace.zone,
    workspace.description,
    includeStatus ? (workspace.active ? "active" : "inactive") : null,
    ...(workspace.amenities || []).map((amenity) => amenity.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}