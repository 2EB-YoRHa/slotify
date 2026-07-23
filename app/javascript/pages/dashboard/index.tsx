import { Link } from "@inertiajs/react";
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
  organization_name = null,
  stats = [],
  upcoming_reservations = [],
  recent_activities = [],
  weekly_occupancy = [],
  workspace_distribution = [],
}: DashboardIndexProps) {
  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-cyan-500">
            {organization_name || "Slotify"}
          </p>

          <h1 className="text-3xl font-bold text-slate-950">
            Manager Dashboard
          </h1>

          <p className="mt-1 text-slate-500">
            Welcome back{current_user?.name ? `, ${current_user.name}` : ""}.
            Here's what's happening today.
          </p>
        </div>

        <div className="rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-500">
          Live data
        </div>
      </div>

      <section className="mb-8 grid grid-cols-4 gap-6">
        {stats.length === 0 ? (
          <div className="col-span-4 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400">
            No organization data available yet.
          </div>
        ) : (
          stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))
        )}
      </section>

      <section className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Upcoming Reservations
              </h2>

              <p className="text-sm text-slate-500">
                Next confirmed or pending bookings.
              </p>
            </div>

            <Link
              href="/reservations"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              View All
            </Link>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Workspace</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Time Range</th>
                <th className="px-6 py-4 font-bold">Status</th>
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
                  <tr key={reservation.id} className="border-t border-slate-100">
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
                        {formatWorkspaceType(
                          reservation.workspace?.workspace_type
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(reservation.start_time)}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatTime(reservation.start_time)} -{" "}
                      {formatTime(reservation.end_time)}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={reservation.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-950">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/reservations/new"
                className="rounded-lg bg-cyan-400 px-4 py-6 text-center text-sm font-bold text-white hover:bg-cyan-500"
              >
                Add Booking
              </Link>

              <Link
                href="/workspaces/new"
                className="rounded-lg border border-slate-200 px-4 py-6 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                New Space
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">
                Recent Activity
              </h2>

              <span className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500">
                Real data
              </span>
            </div>

            {recent_activities.length === 0 ? (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-400">
                No recent activity yet.
              </p>
            ) : (
              <div className="space-y-4 text-sm">
                {recent_activities.map((activity) => (
                  <Activity
                    key={activity.id}
                    text={activity.text}
                    time={formatRelativeTime(activity.occurred_at)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Weekly Reservations
          </h2>

          <p className="mb-6 text-sm text-slate-500">
            Reservations created for each day of the current week.
          </p>

          {weekly_occupancy.length === 0 ? (
            <EmptyChartMessage />
          ) : (
            <div className="flex h-56 items-end gap-4">
              {weekly_occupancy.map((day) => (
                <div
                  key={day.label}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex h-full w-full items-end rounded bg-slate-50">
                    <div
                      className="w-full rounded-t-md bg-cyan-300"
                      style={{
                        height: `${Math.max(day.percentage, day.count > 0 ? 8 : 0)}%`,
                      }}
                      title={`${day.count} reservations`}
                    />
                  </div>

                  <span className="text-xs text-slate-400">{day.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Space Distribution
          </h2>

          <p className="mb-6 text-sm text-slate-500">
            Workspace categories registered in this organization.
          </p>

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
        </div>
      </section>
    </AppLayout>
  );
}

type StatCardProps = {
  stat: DashboardStat;
};

function StatCard({ stat }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            {stat.value}
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-500">
          ◇
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{stat.helper}</p>
    </div>
  );
}

type ActivityProps = {
  text: string;
  time: string;
};

function Activity({ text, time }: ActivityProps) {
  return (
    <div className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <p className="font-medium text-slate-800">{text}</p>
      <p className="text-xs text-slate-400">{time}</p>
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

      <div className="h-6 rounded bg-slate-100">
        <div className="h-6 rounded bg-cyan-400" style={{ width }} />
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
      {formatWorkspaceType(status)}
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

function formatWorkspaceType(value?: string | null): string {
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