import { motion } from "motion/react";
import { Activity, Building2 } from "lucide-react";
import { DataBar, EmptyPanelMessage, IconBox } from "./DashboardShared";
import type {
  WeeklyOccupancy,
  WorkspaceDistribution,
} from "../../types/dashboardTypes";

type DashboardChartsProps = {
  weeklyOccupancy: WeeklyOccupancy[];
  workspaceDistribution: WorkspaceDistribution[];
};

export default function DashboardCharts({
  weeklyOccupancy,
  workspaceDistribution,
}: DashboardChartsProps) {
  return (
    <section className="mt-8 grid grid-cols-2 gap-6">
      <WeeklyOccupancyChart weeklyOccupancy={weeklyOccupancy} />
      <WorkspaceDistributionChart workspaceDistribution={workspaceDistribution} />
    </section>
  );
}

function WeeklyOccupancyChart({
  weeklyOccupancy,
}: {
  weeklyOccupancy: WeeklyOccupancy[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.26 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex items-center gap-3">
        <IconBox icon={Activity} />

        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Weekly Occupancy
          </h2>

          <p className="text-sm text-slate-500">
            Reservations distributed across the current week.
          </p>
        </div>
      </div>

      {weeklyOccupancy.length === 0 ? (
        <EmptyPanelMessage message="Not enough occupancy data yet." />
      ) : (
        <div className="space-y-5">
          {weeklyOccupancy.map((item) => (
            <DataBar
              key={item.label}
              label={`${item.label} (${item.count})`}
              width={`${item.percentage}%`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function WorkspaceDistributionChart({
  workspaceDistribution,
}: {
  workspaceDistribution: WorkspaceDistribution[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex items-center gap-3">
        <IconBox icon={Building2} />

        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Space Distribution
          </h2>

          <p className="text-sm text-slate-500">
            Workspace categories registered in this organization.
          </p>
        </div>
      </div>

      {workspaceDistribution.length === 0 ? (
        <EmptyPanelMessage message="Not enough workspace data yet." />
      ) : (
        <div className="space-y-5">
          {workspaceDistribution.map((item) => (
            <DataBar
              key={item.label}
              label={`${item.label} (${item.count})`}
              width={`${item.percentage}%`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}