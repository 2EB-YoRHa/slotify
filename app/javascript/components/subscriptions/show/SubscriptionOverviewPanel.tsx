import { router } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  CalendarClock,
  CreditCard,
  Database,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  SubscriptionPlan,
  SubscriptionUsage,
} from "../../../types/subscription";
import { UsageMeter } from "./SubscriptionShowShared";
import {
  formatDate,
  formatLimit,
  formatUsage,
  overLimitAmount,
  usagePercentage,
  usageTone,
} from "../../../helpers/subscriptionShowHelpers";

type SubscriptionOverviewPanelProps = {
  currentPlan: string;
  currentPlanLabel: string;
  status: string;
  referenceDate?: string | null;
  usage?: SubscriptionUsage | null;
  activePlan?: SubscriptionPlan;
  canManageBilling: boolean;
};

export default function SubscriptionOverviewPanel({
  currentPlan,
  currentPlanLabel,
  status,
  referenceDate = null,
  usage = null,
  activePlan,
  canManageBilling,
}: SubscriptionOverviewPanelProps) {
  const workspaceUsage = formatUsage(
    usage?.workspaces_used,
    usage?.workspace_limit,
  );

  const memberUsage = formatUsage(usage?.member_slots_used, usage?.user_limit);
  const overPlanLimits = Boolean(usage?.over_plan_limits);

  function openBillingPortal() {
    if (!canManageBilling) return;

    router.post("/subscription/portal");
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:mb-8 sm:p-6 lg:p-8"
    >
      <div className="mb-6 flex flex-col gap-5 lg:mb-7 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="min-w-0">
          <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-500 dark:text-cyan-300">
            Current Subscription
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="wrap-break-word text-2xl font-extrabold text-slate-950 dark:text-slate-100 sm:text-3xl">
              {currentPlanLabel}
            </h2>

            <StatusPill status={status} />
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {activePlan?.description ||
              "This plan controls limits and access for the organization."}
          </p>
        </div>

        <button
          type="button"
          disabled={!canManageBilling}
          onClick={openBillingPortal}
          className={`inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition sm:w-auto ${
            canManageBilling
              ? "bg-slate-950 text-white shadow-sm hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:shadow-none dark:hover:bg-cyan-300"
              : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
          }`}
        >
          <CreditCard size={17} />
          Manage billing
        </button>
      </div>

      {overPlanLimits && <OverLimitNotice usage={usage} />}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:mb-7">
        <InfoCard
          icon={CalendarClock}
          label="Next Billing Date"
          value={referenceDate ? formatDate(referenceDate) : "Not available"}
          helper="Based on the current subscription period."
        />

        <InfoCard
          icon={Database}
          label="Workspace Limit"
          value={formatLimit(usage?.workspace_limit)}
          helper={`${usage?.workspaces_used || 0} currently registered`}
        />

        <InfoCard
          icon={UsersRound}
          label="Member Limit"
          value={formatLimit(usage?.user_limit)}
          helper={`${usage?.member_slots_used || 0} slots currently used`}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <UsageMeter
          label="Workspace Usage"
          value={workspaceUsage}
          percentage={usagePercentage(
            usage?.workspaces_used,
            usage?.workspace_limit,
          )}
          tone={usageTone(usage?.workspaces_used, usage?.workspace_limit)}
          overLimit={Boolean(usage?.workspace_over_limit)}
          helper="Registered workspaces compared with plan limit."
        />

        <UsageMeter
          label="Member Usage"
          value={memberUsage}
          percentage={usagePercentage(
            usage?.member_slots_used,
            usage?.user_limit,
          )}
          tone={usageTone(usage?.member_slots_used, usage?.user_limit)}
          overLimit={Boolean(usage?.user_over_limit)}
          helper="Users plus pending invitations compared with plan limit."
        />
      </div>

      {currentPlan === "starter" && (
        <div className="mt-6 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 transition-colors dark:border-cyan-500/20 dark:bg-cyan-500/10 sm:p-5">
          <p className="text-sm font-bold leading-6 text-cyan-700 dark:text-cyan-300">
            Pro is available if this organization needs unlimited workspaces,
            unlimited members, custom time slots, insights, and workspace
            galleries.
          </p>
        </div>
      )}
    </motion.section>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone = statusTone(status);

  const classes = {
    green:
      "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
    slate:
      "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-extrabold ${classes[tone]}`}
    >
      {status}
    </span>
  );
}

function statusTone(status: string): "green" | "amber" | "slate" {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes("active")) return "green";
  if (normalizedStatus.includes("needed")) return "amber";
  if (normalizedStatus.includes("past")) return "amber";
  if (normalizedStatus.includes("unpaid")) return "amber";

  return "slate";
}

type InfoCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  helper: string;
};

function InfoCard({ icon: Icon, label, value, helper }: InfoCardProps) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-700 dark:bg-slate-800/60 sm:p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm transition-colors dark:bg-slate-900 dark:text-cyan-300 dark:shadow-none">
        <Icon size={18} strokeWidth={2.4} />
      </div>

      <p className="truncate text-xs font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>

      <p className="mt-2 wrap-break-word text-lg font-extrabold text-slate-950 dark:text-slate-100">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {helper}
      </p>
    </div>
  );
}

type OverLimitNoticeProps = {
  usage?: SubscriptionUsage | null;
};

function OverLimitNotice({ usage }: OverLimitNoticeProps) {
  const workspaceOverBy = overLimitAmount(
    usage?.workspaces_used,
    usage?.workspace_limit,
  );

  const memberOverBy = overLimitAmount(
    usage?.member_slots_used,
    usage?.user_limit,
  );

  return (
    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 transition-colors dark:border-red-500/20 dark:bg-red-500/10 sm:mb-7 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm transition-colors dark:bg-red-500/10 dark:text-red-300 dark:shadow-none">
          <AlertTriangle size={22} strokeWidth={2.4} />
        </div>

        <div className="min-w-0">
          <h3 className="text-base font-extrabold text-red-700 dark:text-red-300">
            Usage is over the current plan limit
          </h3>

          <p className="mt-2 text-sm leading-6 text-red-600 dark:text-red-300/90">
            Existing data stays available, but creating more workspaces or
            inviting more members is blocked until usage fits the plan or the
            organization upgrades.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Boolean(usage?.workspace_over_limit) && (
              <OverLimitItem
                label="Workspaces"
                used={usage?.workspaces_used || 0}
                limit={usage?.workspace_limit || 0}
                overBy={workspaceOverBy}
              />
            )}

            {Boolean(usage?.user_over_limit) && (
              <OverLimitItem
                label="Member Slots"
                used={usage?.member_slots_used || 0}
                limit={usage?.user_limit || 0}
                overBy={memberOverBy}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type OverLimitItemProps = {
  label: string;
  used: number;
  limit: number;
  overBy: number;
};

function OverLimitItem({ label, used, limit, overBy }: OverLimitItemProps) {
  return (
    <div className="rounded-xl bg-white p-4 text-sm transition-colors dark:bg-slate-900">
      <p className="font-extrabold text-red-700 dark:text-red-300">{label}</p>

      <p className="mt-1 text-red-600 dark:text-red-300/90">
        {used} used / {limit} allowed
      </p>

      <p className="mt-1 text-xs font-bold text-red-500 dark:text-red-300">
        {overBy} over limit
      </p>
    </div>
  );
}