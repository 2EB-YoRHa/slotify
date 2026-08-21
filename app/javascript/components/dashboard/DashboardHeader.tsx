import { motion } from "motion/react";
import type { DashboardCurrentUser } from "../../types/dashboardTypes";

type DashboardHeaderProps = {
  currentUser?: DashboardCurrentUser | null;
};

export default function DashboardHeader({
  currentUser = null,
}: DashboardHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="wrap-break-word text-2xl font-black leading-tight text-slate-950 dark:text-slate-100 sm:text-3xl"
      >
        Dashboard
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base"
      >
        Welcome back{currentUser?.name ? `, ${currentUser.name}` : ""}.
        Here&apos;s what&apos;s happening today.
      </motion.p>
    </div>
  );
}