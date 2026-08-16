import { motion } from "motion/react";
import type { DashboardStat } from "../../types/dashboardTypes";
import { IconBox, iconForStat } from "./DashboardShared";

type DashboardStatsGridProps = {
  stats: DashboardStat[];
};

export default function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:mb-8 xl:grid-cols-4 xl:gap-6">
      {stats.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-center text-sm leading-6 text-slate-400 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:shadow-slate-950/30 sm:col-span-2 sm:p-8 xl:col-span-4">
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
      className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 dark:hover:border-slate-700 sm:p-5 xl:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-5 text-slate-500 dark:text-slate-400">
            {stat.label}
          </p>

          <h2 className="mt-2 truncate text-2xl font-bold text-slate-950 dark:text-slate-100 sm:text-3xl">
            {stat.value}
          </h2>
        </div>

        <IconBox icon={Icon} />
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {stat.helper}
      </p>
    </motion.div>
  );
}