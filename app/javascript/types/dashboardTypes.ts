export type DashboardCurrentUser = {
  id: number;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

export type DashboardStat = {
  label: string;
  value: string | number;
  helper: string;
};

export type DashboardWorkspace = {
  id?: number;
  name?: string | null;
  workspace_type?: string | null;
  location?: string | null;
};

export type DashboardUser = {
  id?: number;
  name?: string | null;
  email?: string | null;
};

export type UpcomingReservation = {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  attendees_count?: number | null;
  workspace?: DashboardWorkspace | null;
  user?: DashboardUser | null;
};

export type RecentActivity = {
  id: number;
  text: string;
  occurred_at: string;
};

export type WeeklyOccupancy = {
  label: string;
  count: number;
  percentage: number;
};

export type WorkspaceDistribution = {
  label: string;
  count: number;
  percentage: number;
};