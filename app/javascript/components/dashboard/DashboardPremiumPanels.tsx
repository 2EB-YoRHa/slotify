import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarCheck,
  DoorOpen,
  LockKeyhole,
  Sparkles,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import DashboardCharts from "./DashboardCharts";
import { IconBox } from "./DashboardShared";
import { formatDate, formatTime } from "../../utils/dateTime";
import type {
  AvailabilityCommandCenterSummary,
  DashboardPlanEntitlements,
  UpcomingReservation,
  WeeklyOccupancy,
  WorkspaceDistribution,
} from "../../types/dashboardTypes";

type DashboardPremiumPanelsProps = {
  planEntitlements: DashboardPlanEntitlements;
  weeklyOccupancy: WeeklyOccupancy[];
  workspaceDistribution: WorkspaceDistribution[];
  availabilityCommandCenter?: AvailabilityCommandCenterSummary | null;
};

export default function DashboardPremiumPanels({
  planEntitlements,
  weeklyOccupancy,
  workspaceDistribution,
  availabilityCommandCenter = null,
}: DashboardPremiumPanelsProps) {
  const usageInsightsEnabled = planEntitlements.usage_insights;
  const commandCenterEnabled = planEntitlements.availability_command_center;

  return (
    <section className="mt-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-950">
          Availability insights
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Monitor occupancy and workspace distribution across your organization.
        </p>
      </div>

      {usageInsightsEnabled ? (
        <DashboardCharts
          weeklyOccupancy={weeklyOccupancy}
          workspaceDistribution={workspaceDistribution}
        />
      ) : (
        <LockedPremiumPanel
          icon={BarChart3}
          title="Usage Insights"
          badge="Pro Feature"
          description="Unlock weekly occupancy and workspace distribution insights to understand how your coworking spaces are being used."
          benefits={[
            "Weekly reservation activity",
            "Workspace category distribution",
            "Operational visibility for managers",
          ]}
        />
      )}

      {commandCenterEnabled && availabilityCommandCenter ? (
        <AvailabilityCommandCenterPreview summary={availabilityCommandCenter} />
      ) : (
        <LockedPremiumPanel
          icon={Zap}
          title="Availability Command Center"
          badge="Pro Feature"
          description="Unlock a premium operational view designed to monitor workspace availability and activity in one place."
          benefits={[
            "Live availability summary",
            "Current occupancy snapshot",
            "Busiest workspace visibility",
          ]}
        />
      )}
    </section>
  );
}

type LockedPremiumPanelProps = {
  icon: LucideIcon;
  title: string;
  badge: string;
  description: string;
  benefits: string[];
};

function LockedPremiumPanel({
  icon: Icon,
  title,
  badge,
  description,
  benefits,
}: LockedPremiumPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-[1fr_auto] gap-8">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <LockKeyhole size={22} strokeWidth={2.4} />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-extrabold text-slate-950">
                  {title}
                </h3>

                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-cyan-600">
                  {badge}
                </span>
              </div>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <Sparkles
                  size={16}
                  className="mb-2 text-cyan-500"
                  strokeWidth={2.4}
                />

                <p className="text-xs font-bold leading-5 text-slate-600">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-56 flex-col justify-between rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
          <div>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
              <Icon size={21} strokeWidth={2.4} />
            </div>

            <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-600">
              Unlock with Pro
            </p>

            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Upgrade to Pro to enable this feature.
            </p>
          </div>

          <Link
            href="/subscription"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            View Pro
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

type AvailabilityCommandCenterPreviewProps = {
  summary: AvailabilityCommandCenterSummary;
};

function AvailabilityCommandCenterPreview({
  summary,
}: AvailabilityCommandCenterPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className="rounded-xl border border-cyan-100 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <IconBox icon={Zap} />

          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-slate-950">
                Availability Command Center
              </h3>
            </div>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Monitor availability, occupancy, and the next scheduled booking in
              real time.
            </p>
          </div>
        </div>

        <Link
          href="/reservations"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
        >
          Manage Reservations
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <CommandMetric
          icon={DoorOpen}
          label="Available Now"
          value={summary.available_workspace_count}
          helper={`${summary.active_workspace_count} active spaces`}
        />

        <CommandMetric
          icon={Activity}
          label="Occupied Now"
          value={summary.occupied_workspace_count}
          helper={`${summary.occupancy_rate}% occupancy`}
        />

        <CommandMetric
          icon={BarChart3}
          label="Busiest Space"
          value={summary.busiest_workspace?.name || "No data"}
          helper={
            summary.busiest_workspace
              ? `${summary.busiest_workspace.reservation_count} bookings this month`
              : "No reservations this month"
          }
        />

        <CommandMetric
          icon={CalendarCheck}
          label="Next Booking"
          value={nextReservationValue(summary.next_reservation)}
          helper={nextReservationHelper(summary.next_reservation)}
        />
      </div>
    </motion.div>
  );
}

type CommandMetricProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  helper: string;
};

function CommandMetric({
  icon: Icon,
  label,
  value,
  helper,
}: CommandMetricProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
        <Icon size={19} strokeWidth={2.4} />
      </div>

      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 truncate text-xl font-extrabold text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>
    </div>
  );
}

function nextReservationValue(
  reservation?: UpcomingReservation | null,
): string {
  if (!reservation) return "No upcoming";

  return reservation.workspace?.name || "Workspace";
}

function nextReservationHelper(
  reservation?: UpcomingReservation | null,
): string {
  if (!reservation) return "No scheduled bookings";

  return `${formatDate(reservation.start_time)} · ${formatTime(
    reservation.start_time,
  )}`;
}
