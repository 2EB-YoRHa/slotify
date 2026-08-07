import { motion } from "motion/react";
import {
  BarChart3,
  CalendarClock,
  Camera,
  CheckCircle2,
  Clock3,
  Database,
  ShieldCheck,
  TimerReset,
  UsersRound,
  XCircle,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SubscriptionPlan } from "../../../types/subscription";

type PlanFeatureComparisonPanelProps = {
  plans: SubscriptionPlan[];
};

export default function PlanFeatureComparisonPanel({
  plans,
}: PlanFeatureComparisonPanelProps) {
  const starter = plans.find((plan) => plan.key === "starter");
  const pro = plans.find((plan) => plan.key === "pro");

  if (!starter || !pro) return null;

  const rows = [
    {
      label: "Workspace Capacity",
      icon: Database,
      starter: formatLimit(starter.workspace_limit),
      pro: formatLimit(pro.workspace_limit),
      proWins: true,
    },
    {
      label: "Member Slots",
      icon: UsersRound,
      starter: formatLimit(starter.user_limit),
      pro: formatLimit(pro.user_limit),
      proWins: true,
    },
    {
      label: "Max Reservation Duration",
      icon: Clock3,
      starter: `${starter.booking_rule_constraints?.max_hours_per_reservation_max || 4} hours`,
      pro: `${pro.booking_rule_constraints?.max_hours_per_reservation_max || 12} hours`,
      proWins: true,
    },
    {
      label: "Minimum Notice Window",
      icon: CalendarClock,
      starter: formatMinutes(
        starter.booking_rule_constraints?.min_notice_minutes_max || 1_440,
      ),
      pro: formatMinutes(
        pro.booking_rule_constraints?.min_notice_minutes_max || 10_080,
      ),
      proWins: true,
    },
    {
      label: "Cancellation Policy Window",
      icon: TimerReset,
      starter: `${starter.booking_rule_constraints?.cancellation_limit_hours_max || 72} hours`,
      pro: `${pro.booking_rule_constraints?.cancellation_limit_hours_max || 168} hours`,
      proWins: true,
    },
    {
      label: "Custom Time Slots",
      icon: CalendarClock,
      starter: entitlementValue(starter, "custom_time_slots"),
      pro: entitlementValue(pro, "custom_time_slots"),
      proWins: true,
    },
    {
      label: "Usage Insights",
      icon: BarChart3,
      starter: entitlementValue(starter, "usage_insights"),
      pro: entitlementValue(pro, "usage_insights"),
      proWins: true,
    },
    {
      label: "Availability Command Center",
      icon: Zap,
      starter: entitlementValue(starter, "availability_command_center"),
      pro: entitlementValue(pro, "availability_command_center"),
      proWins: true,
    },
    {
      label: "Multiple Workspace Photos",
      icon: Camera,
      starter: entitlementValue(starter, "multiple_workspace_photos"),
      pro: entitlementValue(pro, "multiple_workspace_photos"),
      proWins: true,
    },
    {
      label: "Priority Support",
      icon: ShieldCheck,
      starter: entitlementValue(starter, "priority_support"),
      pro: entitlementValue(pro, "priority_support"),
      proWins: true,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-7 flex items-start justify-between gap-8">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-500">
            Plan Comparison
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
            Compare limits and features
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500">
            Use this table to confirm which limits and tools are included in
            each plan.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="grid grid-cols-[1.3fr_0.85fr_0.85fr] bg-slate-50">
          <div className="border-r border-slate-200 px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Capability
          </div>

          <div className="border-r border-slate-200 px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Starter
          </div>

          <div className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-cyan-500">
            Pro
          </div>
        </div>

        {rows.map((row) => (
          <ComparisonRow key={row.label} row={row} />
        ))}
      </div>
    </motion.section>
  );
}

type ComparisonRowData = {
  label: string;
  icon: LucideIcon;
  starter: string | boolean;
  pro: string | boolean;
  proWins: boolean;
};

type ComparisonRowProps = {
  row: ComparisonRowData;
};

function ComparisonRow({ row }: ComparisonRowProps) {
  const Icon = row.icon;

  return (
    <div className="grid grid-cols-[1.3fr_0.85fr_0.85fr] border-t border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-r border-slate-200 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-cyan-500">
          <Icon size={17} strokeWidth={2.4} />
        </div>

        <span className="text-sm font-extrabold text-slate-950">
          {row.label}
        </span>
      </div>

      <PlanValue value={row.starter} muted={row.proWins} />

      <PlanValue value={row.pro} highlighted />
    </div>
  );
}

type PlanValueProps = {
  value: string | boolean;
  highlighted?: boolean;
  muted?: boolean;
};

function PlanValue({
  value,
  highlighted = false,
  muted = false,
}: PlanValueProps) {
  if (typeof value === "boolean") {
    return (
      <div
        className={`flex items-center gap-2 border-r border-slate-200 px-5 py-4 text-sm font-bold ${
          highlighted
            ? "text-cyan-600"
            : muted
              ? "text-slate-400"
              : "text-slate-700"
        }`}
      >
        {value ? (
          <CheckCircle2 size={18} className="shrink-0 text-cyan-500" />
        ) : (
          <XCircle size={18} className="shrink-0 text-slate-300" />
        )}

        {value ? "Included" : "Not included"}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center border-r border-slate-200 px-5 py-4 text-sm font-bold ${
        highlighted
          ? "text-cyan-600"
          : muted
            ? "text-slate-500"
            : "text-slate-700"
      }`}
    >
      {value}
    </div>
  );
}

function formatLimit(value?: number | null): string {
  if (value === null || value === undefined) return "Unlimited";

  return String(value);
}

function formatMinutes(minutes: number): string {
  if (minutes % 1_440 === 0) {
    return `${minutes / 1_440} day${minutes / 1_440 === 1 ? "" : "s"}`;
  }

  if (minutes % 60 === 0) {
    return `${minutes / 60} hour${minutes / 60 === 1 ? "" : "s"}`;
  }

  return `${minutes} minutes`;
}

function entitlementValue(
  plan: SubscriptionPlan,
  key: keyof NonNullable<SubscriptionPlan["entitlements"]>,
): boolean {
  return plan.entitlements?.[key] === true;
}
