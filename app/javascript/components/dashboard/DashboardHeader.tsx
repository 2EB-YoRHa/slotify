import { motion } from "motion/react";
import type { DashboardCurrentUser } from "../../types/dashboardTypes";

type DashboardHeaderProps = {
  currentUser?: DashboardCurrentUser | null;
};

export default function DashboardHeader({
  currentUser = null,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-3xl font-bold text-slate-950"
        >
          Dashboard
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-1 text-slate-500"
        >
          Welcome back{currentUser?.name ? `, ${currentUser.name}` : ""}.
          Here&apos;s what&apos;s happening today.
        </motion.p>
      </div>
    </div>
  );
}