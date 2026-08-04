import { router } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarClock,
  CreditCard,
  Database,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type {
  SubscriptionPlan,
  SubscriptionUsage,
} from "../../../types/subscription";
import { SummaryRow, UsageMeter } from "./SubscriptionShowShared";
import {
  formatDate,
  formatLimit,
  formatUsage,
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
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-7 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-500">
              Active Subscription
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
              {currentPlanLabel}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              This plan controls workspace capacity, member slots, billing
              access, and the operational features available to the
              organization.
            </p>
          </div>

          <StatusPill status={status} />
        </div>

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
                ? "bg-slate-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
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
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-7">
          <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-500">
            Usage Health
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
            Plan usage at a glance
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
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
            helper="Users plus pending invitations compared with plan limit."
          />
        </div>

        {activePlan?.limits && activePlan.limits.length > 0 && (
          <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-slate-400">
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

type InfoCardProps = {
  icon: typeof Database;
  label: string;
  value: string;
  helper: string;
};

function InfoCard({ icon: Icon, label, value, helper }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
        <Icon size={19} strokeWidth={2.4} />
      </div>

      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-extrabold text-slate-950">{value}</p>

      <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>
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
      ? "bg-green-50 text-green-600"
      : normalized === "trialing"
        ? "bg-cyan-50 text-cyan-600"
        : normalized === "past due"
          ? "bg-amber-50 text-amber-600"
          : "bg-slate-100 text-slate-500";

  return (
    <span
      className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide ${className}`}
    >
      {status}
    </span>
  );
}