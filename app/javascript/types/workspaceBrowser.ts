export type WorkspaceStatusFilter = "all" | "active" | "inactive";

export type WorkspaceCapacityFilter = "all" | "1-4" | "5-10" | "10+";

export type WorkspacePriceFilter = "all" | "0-25" | "25-75" | "75+";

export type WorkspaceSortOption =
  | "name"
  | "capacity"
  | "rate_low"
  | "rate_high"
  | "status";

export type MemberWorkspaceSortOption = Exclude<
  WorkspaceSortOption,
  "status"
>;

export type WorkspaceBrowserOption<T extends string = string> = {
  value: T;
  label: string;
};