export type DashboardCurrentUser = {
  id: number;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

export type DashboardPlanEntitlements = {
  advanced_booking_rules: boolean;
  custom_time_slots: boolean;
  usage_insights: boolean;
  availability_command_center: boolean;
  multiple_workspace_photos: boolean;
  priority_support: boolean;
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
  photo_url?: string | null;
};

export type DashboardUser = {
  id?: number;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
};

export type UpcomingReservation = {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  can_modify?: boolean;
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

export type AvailabilityCommandCenterSummary = {
  active_workspace_count: number;
  occupied_workspace_count: number;
  available_workspace_count: number;
  occupancy_rate: number;
  busiest_workspace?: {
    id: number;
    name: string;
    reservation_count: number;
  } | null;
  next_reservation?: UpcomingReservation | null;
};