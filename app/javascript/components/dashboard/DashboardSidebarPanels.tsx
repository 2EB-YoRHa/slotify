import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  Activity,
  CalendarPlus,
  Clock3,
  DoorOpen,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatRelativeTime, IconBox } from "./DashboardShared";
import type { RecentActivity } from "../../types/dashboardTypes";

type DashboardSidebarPanelsProps = {
  recentActivities: RecentActivity[];
};

export default function DashboardSidebarPanels({
  recentActivities,
}: DashboardSidebarPanelsProps) {
  return (
    <div className="min-w-0 space-y-6">
      <QuickActionsPanel />
      <RecentActivityPanel recentActivities={recentActivities} />
    </div>
  );
}

function QuickActionsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 }}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex min-w-0 items-center gap-3">
        <IconBox icon={Zap} />
        <h2 className="min-w-0 wrap-break-word text-lg font-bold text-slate-950">
          Quick Actions
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <QuickAction
          href="/reservations/new"
          icon={CalendarPlus}
          label="Add Booking"
          primary
        />

        <QuickAction href="/workspaces/new" icon={DoorOpen} label="New Space" />
      </div>
    </motion.div>
  );
}

type QuickActionProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  primary?: boolean;
};

function QuickAction({
  href,
  icon: Icon,
  label,
  primary = false,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className={`group flex min-w-0 items-center justify-center gap-2 rounded-xl px-4 py-4 text-center text-sm font-bold transition hover:-translate-y-1 hover:shadow-md sm:flex-col sm:gap-3 sm:py-5 ${
        primary
          ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100 hover:bg-cyan-500"
          : "border border-slate-200 text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
      }`}
    >
      <Icon size={22} strokeWidth={2.4} className="shrink-0" />
      <span className="min-w-0 truncate">{label}</span>
    </Link>
  );
}

function RecentActivityPanel({
  recentActivities,
}: DashboardSidebarPanelsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex min-w-0 items-center gap-3">
        <IconBox icon={Activity} />
        <h2 className="min-w-0 wrap-break-word text-lg font-bold text-slate-950">
          Recent Activity
        </h2>
      </div>

      {recentActivities.length === 0 ? (
        <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-400">
          No recent activity yet.
        </p>
      ) : (
        <div className="space-y-4 text-sm">
          {recentActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              text={activity.text}
              time={formatRelativeTime(activity.occurred_at)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex min-w-0 gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-500">
        <Clock3 size={14} />
      </div>

      <div className="min-w-0">
        <p className="wrap-break-word font-medium leading-6 text-slate-800">
          {text}
        </p>
        <p className="text-xs text-slate-400">{time}</p>
      </div>
    </div>
  );
}