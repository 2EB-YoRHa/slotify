export type WorkspaceStatusFilter = "all" | "active" | "inactive";

export type WorkspaceSortOption =
  | "name"
  | "capacity"
  | "rate_low"
  | "rate_high"
  | "status";

export type WorkspaceBrowserOption<T extends string = string> = {
  value: T;
  label: string;
};