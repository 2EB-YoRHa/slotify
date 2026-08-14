import type { Workspace } from "../types/workspace";
import type {
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