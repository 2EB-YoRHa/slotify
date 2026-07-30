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
    <div className="space-y-6">
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
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-3">
        <IconBox icon={Zap} />
        <h2 className="text-lg font-bold text-slate-950">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
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
      className={`group rounded-xl px-4 py-6 text-center text-sm font-bold transition hover:-translate-y-1 hover:shadow-md ${
        primary
          ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100 hover:bg-cyan-500"
          : "border border-slate-200 text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
      }`}
    >
      <div className="mb-3 flex justify-center">
        <Icon size={22} strokeWidth={2.4} />
      </div>

      {label}
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
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconBox icon={Activity} />
          <h2 className="text-lg font-bold text-slate-950">Recent Activity</h2>
        </div>
      </div>

      {recentActivities.length === 0 ? (
        <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-400">
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
    <div className="flex gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-500">
        <Clock3 size={14} />
      </div>

      <div>
        <p className="font-medium text-slate-800">{text}</p>
        <p className="text-xs text-slate-400">{time}</p>
      </div>
    </div>
  );
}