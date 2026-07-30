import { motion } from "motion/react";
import type { DashboardStat } from "../../types/dashboardTypes";
import { IconBox, iconForStat } from "./DashboardShared";

type DashboardStatsGridProps = {
  stats: DashboardStat[];
};

export default function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <section className="mb-8 grid grid-cols-4 gap-6">
      {stats.length === 0 ? (
        <div className="col-span-4 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400">
          No organization data available yet.
        </div>
      ) : (
        stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))
      )}
    </section>
  );
}

type StatCardProps = {
  stat: DashboardStat;
  index: number;
};

function StatCard({ stat, index }: StatCardProps) {
  const Icon = iconForStat(stat.label);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            {stat.value}
          </h2>
        </div>

        <IconBox icon={Icon} />
      </div>

      <p className="mt-3 text-xs text-slate-500">{stat.helper}</p>
    </motion.div>
  );
}