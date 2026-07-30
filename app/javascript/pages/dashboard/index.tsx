import AppLayout from "../../components/AppLayout";
import DashboardCharts from "../../components/dashboard/DashboardCharts";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardSidebarPanels from "../../components/dashboard/DashboardSidebarPanels";
import DashboardStatsGrid from "../../components/dashboard/DashboardStatsGrid";
import DashboardUpcomingReservations from "../../components/dashboard/DashboardUpcomingReservations";
import type {
  DashboardCurrentUser,
  DashboardStat,
  RecentActivity,
  UpcomingReservation,
  WeeklyOccupancy,
  WorkspaceDistribution,
} from "../../types/dashboardTypes";

type DashboardIndexProps = {
  current_user?: DashboardCurrentUser | null;
  organization_name?: string | null;
  stats?: DashboardStat[];
  upcoming_reservations?: UpcomingReservation[];
  recent_activities?: RecentActivity[];
  weekly_occupancy?: WeeklyOccupancy[];
  workspace_distribution?: WorkspaceDistribution[];
};

export default function DashboardIndex({
  current_user = null,
  stats = [],
  upcoming_reservations = [],
  recent_activities = [],
  weekly_occupancy = [],
  workspace_distribution = [],
}: DashboardIndexProps) {
  return (
    <AppLayout>
      <DashboardHeader currentUser={current_user} />

      <DashboardStatsGrid stats={stats} />

      <section className="grid grid-cols-3 gap-6">
        <DashboardUpcomingReservations reservations={upcoming_reservations} />

        <DashboardSidebarPanels recentActivities={recent_activities} />
      </section>

      <DashboardCharts
        weeklyOccupancy={weekly_occupancy}
        workspaceDistribution={workspace_distribution}
      />
    </AppLayout>
  );
}