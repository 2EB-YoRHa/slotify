import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  Building2,
  CalendarCheck,
  CalendarPlus,
  Clock3,
  DoorOpen,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import { formatDate, formatTime } from "../../utils/dateTime";

type DashboardCurrentUser = {
  id: number;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

type DashboardStat = {
  label: string;
  value: string | number;
  helper: string;
};

type DashboardWorkspace = {
  id?: number;
  name?: string | null;
  workspace_type?: string | null;
  location?: string | null;
};

type DashboardUser = {
  id?: number;
  name?: string | null;
  email?: string | null;
};

type UpcomingReservation = {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  attendees_count?: number | null;
  workspace?: DashboardWorkspace | null;
  user?: DashboardUser | null;
};

type RecentActivity = {
  id: number;
  text: string;
  occurred_at: string;
};

type WeeklyOccupancy = {
  label: string;
  count: number;
  percentage: number;
};

type WorkspaceDistribution = {
  label: string;
  count: number;
  percentage: number;
};

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
  workspace_distribution = [],
}: DashboardIndexProps) {
  return (
    <AppLayout>
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
            Welcome back{current_user?.name ? `, ${current_user.name}` : ""}.
            Here's what's happening today.
          </motion.p>
        </div>
      </div>

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

      <section className="grid grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="col-span-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <IconBox icon={CalendarCheck} />

              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Upcoming Reservations
                </h2>

                <p className="text-sm text-slate-500">
                  Next confirmed or pending bookings.
                </p>
              </div>
            </div>

            <Link
              href="/reservations"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Workspace</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Time Range</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {upcoming_reservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No upcoming reservations yet.
                  </td>
                </tr>
              ) : (
                upcoming_reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">
                        {reservation.user?.name || "Unknown user"}
                      </div>

                      <div className="text-xs text-slate-400">
                        {reservation.user?.email || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">
                        {reservation.workspace?.name || "Workspace removed"}
                      </div>

                      <div className="text-xs uppercase text-slate-400">
                        {formatText(reservation.workspace?.workspace_type)}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(reservation.start_time)}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatTime(reservation.start_time)} -{" "}
                      {formatTime(reservation.end_time)}
                    </td>

                    <td className="px-6 py-4 text-center align-middle">
                      <div className="flex justify-center">
                        <StatusBadge status={reservation.status} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <IconBox icon={Zap} />
              <h2 className="text-lg font-bold text-slate-950">
                Quick Actions
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                href="/reservations/new"
                icon={CalendarPlus}
                label="Add Booking"
                primary
              />

              <QuickAction
                href="/workspaces/new"
                icon={DoorOpen}
                label="New Space"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconBox icon={Activity} />
                <h2 className="text-lg font-bold text-slate-950">
                  Recent Activity
                </h2>
              </div>
            </div>

            {recent_activities.length === 0 ? (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-400">
                No recent activity yet.
              </p>
            ) : (
              <div className="space-y-4 text-sm">
                {recent_activities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    text={activity.text}
                    time={formatRelativeTime(activity.occurred_at)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
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

          {workspace_distribution.length === 0 ? (
            <EmptyChartMessage />
          ) : (
            <div className="space-y-5">
              {workspace_distribution.map((item) => (
                <Bar
                  key={item.label}
                  label={`${item.label} (${item.count})`}
                  width={`${item.percentage}%`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </section>
    </AppLayout>
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

type IconBoxProps = {
  icon: LucideIcon;
};

function IconBox({ icon: Icon }: IconBoxProps) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
      <Icon size={19} strokeWidth={2.4} />
    </div>
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

type ActivityProps = {
  text: string;
  time: string;
};

function ActivityItem({ text, time }: ActivityProps) {
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

type BarProps = {
  label: string;
  width: string;
};

function Bar({ label, width }: BarProps) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm font-medium text-slate-600">
        <span>{label}</span>
        <span>{width}</span>
      </div>

      <div className="h-6 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="h-6 rounded-full bg-cyan-400"
        />
      </div>
    </div>
  );
}

type StatusBadgeProps = {
  status: string;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const className =
    status === "cancelled"
      ? "bg-red-50 text-red-600"
      : status === "confirmed"
        ? "bg-green-50 text-green-600"
        : "bg-yellow-50 text-yellow-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {formatText(status)}
    </span>
  );
}

function EmptyChartMessage() {
  return (
    <div className="flex h-56 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">
      Not enough data yet.
    </div>
  );
}

function iconForStat(label: string): LucideIcon {
  const normalized = label.toLowerCase();

  if (normalized.includes("workspace")) return Building2;
  if (normalized.includes("reservation")) return CalendarCheck;
  if (normalized.includes("available")) return DoorOpen;
  if (normalized.includes("user")) return UsersRound;
  if (normalized.includes("occupancy")) return Activity;

  return Sparkles;
}

function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function formatRelativeTime(value: string): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays}d ago`;
}
