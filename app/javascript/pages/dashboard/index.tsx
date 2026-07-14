import AppLayout from "../../components/AppLayout";
import { formatTime } from "../../utils/dateTime";

type DashboardWorkspace = {
  id?: number;
  name?: string | null;
  workspace_type?: string | null;
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
  workspace?: DashboardWorkspace | null;
  user?: DashboardUser | null;
};

type DashboardIndexProps = {
  total_workspaces?: number;
  total_reservations?: number;
  upcoming_reservations?: UpcomingReservation[];
};

type Stat = {
  label: string;
  value: string | number;
  change: string;
};

export default function DashboardIndex({
  total_workspaces = 0,
  total_reservations = 0,
  upcoming_reservations = [],
}: DashboardIndexProps) {
  const stats: Stat[] = [
    {
      label: "Total Reservations",
      value: total_reservations,
      change: "+12.5%",
    },
    {
      label: "Occupancy Rate",
      value: "78.2%",
      change: "+5.4%",
    },
    {
      label: "Available Spaces",
      value: total_workspaces,
      change: "-2",
    },
    {
      label: "Active Users",
      value: "84",
      change: "+18%",
    },
  ];

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="mt-1 text-slate-500">
            Welcome back. Here's what's happening today.
          </p>
        </div>

        <div className="flex rounded-lg border border-slate-200 bg-white p-1 text-sm">
          <button type="button" className="rounded-md bg-slate-100 px-4 py-2">
            Today
          </button>
          <button type="button" className="px-4 py-2 text-slate-500">
            7d
          </button>
          <button type="button" className="px-4 py-2 text-slate-500">
            30d
          </button>
          <button type="button" className="px-4 py-2 text-slate-500">
            All time
          </button>
        </div>
      </div>

      <section className="mb-8 grid grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-500">
                ◇
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">
                {stat.change}
              </span>{" "}
              vs last month
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div>
              <h2 className="text-lg font-bold">Upcoming Reservations</h2>
              <p className="text-sm text-slate-500">
                Scheduled bookings for the next 24 hours
              </p>
            </div>

            <a
              href="/reservations"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium"
            >
              View All
            </a>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Workspace</th>
                <th className="px-6 py-4 font-medium">Time Range</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {upcoming_reservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No upcoming reservations yet.
                  </td>
                </tr>
              ) : (
                upcoming_reservations.map((reservation) => (
                  <tr key={reservation.id} className="border-t border-slate-100">
                    <td className="px-6 py-4">
                      {reservation.user?.name || "Unknown user"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {reservation.workspace?.name || "Workspace removed"}
                      </div>

                      <div className="text-xs uppercase text-slate-400">
                        {reservation.workspace?.workspace_type || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatTime(reservation.start_time)} -{" "}
                      {formatTime(reservation.end_time)}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Quick Actions</h2>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="/reservations/new"
                className="rounded-lg bg-cyan-400 px-4 py-6 text-center text-sm font-bold text-white"
              >
                Add Booking
              </a>

              <a
                href="/workspaces/new"
                className="rounded-lg border border-slate-200 px-4 py-6 text-center text-sm font-bold"
              >
                New Space
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Live Activity</h2>
              <span className="rounded-full border border-slate-200 px-2 py-1 text-xs">
                Real-time
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <Activity text="Mark Thompson booked Desk B-12" time="5 mins ago" />
              <Activity text="Alisa V. canceled Meeting Room A" time="12 mins ago" />
              <Activity text="John Doe checked in at Pod 04" time="25 mins ago" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Occupancy Trends</h2>

          <p className="mb-6 text-sm text-slate-500">
            Daily reservation rates vs. monthly average
          </p>

          <div className="flex h-56 items-end gap-4">
            {[60, 72, 78, 70, 88, 42, 30].map((height, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t-md bg-cyan-300"
                  style={{ height: `${height}%` }}
                />

                <span className="text-xs text-slate-400">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Space Distribution</h2>

          <p className="mb-6 text-sm text-slate-500">
            Most utilized workspace categories
          </p>

          <div className="space-y-5">
            <Bar label="Desks" width="90%" />
            <Bar label="Meeting Rooms" width="55%" />
            <Bar label="Pods" width="38%" />
            <Bar label="Private Offices" width="20%" />
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

type ActivityProps = {
  text: string;
  time: string;
};

function Activity({ text, time }: ActivityProps) {
  return (
    <div className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <p className="font-medium">{text}</p>
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
      <div className="mb-1 text-sm font-medium text-slate-600">{label}</div>
      <div className="h-6 rounded bg-slate-100">
        <div className="h-6 rounded bg-cyan-400" style={{ width }} />
      </div>
    </div>
  );
}