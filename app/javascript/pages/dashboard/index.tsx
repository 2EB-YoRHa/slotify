import AppLayout from "../../components/AppLayout";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardPremiumPanels from "../../components/dashboard/DashboardPremiumPanels";
import DashboardSidebarPanels from "../../components/dashboard/DashboardSidebarPanels";
import DashboardStatsGrid from "../../components/dashboard/DashboardStatsGrid";
import DashboardUpcomingReservations from "../../components/dashboard/DashboardUpcomingReservations";
import MemberDashboard from "../../components/dashboard/MemberDashboard";
import type {
  AvailabilityCommandCenterSummary,
  DashboardCurrentUser,
  DashboardPlanEntitlements,
  DashboardStat,
  RecentActivity,
  UpcomingReservation,
  WeeklyOccupancy,
  WorkspaceDistribution,
} from "../../types/dashboardTypes";

type DashboardIndexProps = {
  current_user?: DashboardCurrentUser | null;
  organization_name?: string | null;
  current_plan?: string;
  plan_entitlements?: DashboardPlanEntitlements;
  stats?: DashboardStat[];
  upcoming_reservations?: UpcomingReservation[];
  recent_activities?: RecentActivity[];
  weekly_occupancy?: WeeklyOccupancy[];
  workspace_distribution?: WorkspaceDistribution[];
  availability_command_center?: AvailabilityCommandCenterSummary | null;
  member_dashboard?: boolean;
  member_next_reservation?: UpcomingReservation | null;
  member_upcoming_reservations?: UpcomingReservation[];
};

const DEFAULT_ENTITLEMENTS: DashboardPlanEntitlements = {
  advanced_booking_rules: false,
  custom_time_slots: false,
  usage_insights: false,
  availability_command_center: false,
  multiple_workspace_photos: false,
  priority_support: false,
};

export default function DashboardIndex({
  current_user = null,
  current_plan = "starter",
  plan_entitlements = DEFAULT_ENTITLEMENTS,
  stats = [],
  upcoming_reservations = [],
  recent_activities = [],
  weekly_occupancy = [],
  workspace_distribution = [],
  availability_command_center = null,
  member_dashboard = false,
  member_next_reservation = null,
  member_upcoming_reservations = [],
}: DashboardIndexProps) {
  if (member_dashboard) {
    return (
      <AppLayout>
        <MemberDashboard
          currentUser={current_user}
          stats={stats}
          nextReservation={member_next_reservation}
          upcomingReservations={member_upcoming_reservations}
        />
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <DashboardHeader currentUser={current_user} />

      <DashboardStatsGrid stats={stats} />

      <section className="grid grid-cols-3 gap-6">
        <DashboardUpcomingReservations reservations={upcoming_reservations} />

        <DashboardSidebarPanels recentActivities={recent_activities} />
      </section>

      <DashboardPremiumPanels
        currentPlan={current_plan}
        planEntitlements={plan_entitlements}
        weeklyOccupancy={weekly_occupancy}
        workspaceDistribution={workspace_distribution}
        availabilityCommandCenter={availability_command_center}
      />
    </AppLayout>
  );
}
