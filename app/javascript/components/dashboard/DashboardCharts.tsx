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
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
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
      className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6"
    >
      <div className="mb-6 flex min-w-0 items-start gap-3">
        <IconBox icon={Activity} />

        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
            Weekly Occupancy
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
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
      className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6"
    >
      <div className="mb-6 flex min-w-0 items-start gap-3">
        <IconBox icon={Building2} />

        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
            Space Distribution
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
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