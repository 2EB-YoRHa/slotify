import { router } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CreditCard,
  Database,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  SubscriptionPlan,
  SubscriptionUsage,
} from "../../../types/subscription";
import { SummaryRow, UsageMeter } from "./SubscriptionShowShared";
import {
  formatDate,
  formatLimit,
  formatUsage,
  overLimitAmount,
  usagePercentage,
  usageTone,
} from "../../../helpers/subscriptionShowHelpers";

type CurrentPlanPanelProps = {
  currentPlanLabel: string;
  status: string;
  referenceDate?: string | null;
  usage?: SubscriptionUsage | null;
  activePlan?: SubscriptionPlan;
  canManageBilling: boolean;
};

export default function CurrentPlanPanel({
  currentPlanLabel,
  status,
  referenceDate = null,
  usage = null,
  activePlan,
  canManageBilling,
}: CurrentPlanPanelProps) {
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
    <section className="mb-10 grid grid-cols-[1.05fr_0.95fr] gap-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30"
      >
        <div className="mb-7 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-500 dark:text-cyan-300">
              Active Subscription
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-slate-100">
              {currentPlanLabel}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              This plan controls workspace capacity, member slots, billing
              access, and the operational features available to the
              organization.
            </p>
          </div>

          <StatusPill status={status} />
        </div>

        {overPlanLimits && <OverLimitNotice usage={usage} />}

        <div className="grid grid-cols-2 gap-4">
          <InfoCard
            icon={Database}
            label="Workspace Limit"
            value={formatLimit(usage?.workspace_limit)}
            helper="How many spaces can be published and managed."
          />

          <InfoCard
            icon={UsersRound}
            label="Member Slots"
            value={formatLimit(usage?.user_limit)}
            helper="Users plus pending invitations."
          />

          <InfoCard
            icon={CalendarClock}
            label="Reference Date"
            value={referenceDate ? formatDate(referenceDate) : "Not configured"}
            helper="Billing or subscription reference date."
          />

          <InfoCard
            icon={ShieldCheck}
            label="Billing Access"
            value={canManageBilling ? "Available" : "Unavailable"}
            helper={
              canManageBilling
                ? "Stripe Customer Portal is connected."
                : "Stripe Customer Portal is not available yet."
            }
          />
        </div>

        <div className="mt-7">
          <button
            type="button"
            disabled={!canManageBilling}
            onClick={openBillingPortal}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
              canManageBilling
                ? "bg-slate-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md dark:bg-cyan-400 dark:text-slate-950 dark:shadow-none dark:hover:bg-cyan-300"
                : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
            }`}
          >
            <CreditCard size={17} />
            Manage Billing
            {canManageBilling && <ArrowRight size={16} />}
          </button>
        </div>
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30"
      >
        <div className="mb-7">
          <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-500 dark:text-cyan-300">
            Usage Health
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-slate-100">
            Plan usage at a glance
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Track how close the organization is to the current plan limits.
          </p>
        </div>

        <div className="space-y-5">
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

        {activePlan?.limits && activePlan.limits.length > 0 && (
          <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors dark:border-slate-700 dark:bg-slate-800/60">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Current Plan Limits
            </p>

            <div className="space-y-1">
              {activePlan.limits.map((limit) => (
                <SummaryRow key={limit} label="Included" value={limit} />
              ))}
            </div>
          </div>
        )}
      </motion.aside>
    </section>
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
    <div className="mb-7 rounded-2xl border border-red-100 bg-red-50 p-5 transition-colors dark:border-red-500/20 dark:bg-red-500/10">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm transition-colors dark:bg-red-500/10 dark:text-red-300 dark:shadow-none">
          <AlertTriangle size={22} strokeWidth={2.4} />
        </div>

        <div>
          <h3 className="text-base font-extrabold text-red-700 dark:text-red-300">
            This organization is over the current plan limit
          </h3>

          <p className="mt-2 text-sm leading-6 text-red-600 dark:text-red-300/90">
            Existing data stays available, but creating new workspaces or
            inviting more members is blocked until usage fits the plan or the
            organization upgrades to Pro.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
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
    <div className="rounded-xl border border-red-100 bg-white p-4 transition-colors dark:border-red-500/20 dark:bg-slate-900">
      <p className="text-xs font-extrabold uppercase tracking-wide text-red-400 dark:text-red-300">
        {label}
      </p>

      <p className="mt-2 text-lg font-extrabold text-slate-950 dark:text-slate-100">
        {used} / {limit}
      </p>

      <p className="mt-1 text-xs font-bold text-red-600 dark:text-red-300">
        {overBy} over limit
      </p>
    </div>
  );
}

type InfoCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
};

function InfoCard({ icon: Icon, label, value, helper }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-colors dark:border-slate-700 dark:bg-slate-800/60">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm transition-colors dark:bg-slate-900 dark:text-cyan-300 dark:shadow-none">
        <Icon size={19} strokeWidth={2.4} />
      </div>

      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-extrabold text-slate-950 dark:text-slate-100">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {helper}
      </p>
    </div>
  );
}

type StatusPillProps = {
  status: string;
};

function StatusPill({ status }: StatusPillProps) {
  const normalized = status.toLowerCase();

  const className =
    normalized === "active"
      ? "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300"
      : normalized === "trialing"
        ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300"
        : normalized === "past due"
          ? "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"
          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300";

  return (
    <span
      className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide ${className}`}
    >
      {status}
    </span>
  );
}