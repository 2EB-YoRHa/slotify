import { motion } from "motion/react";
import { router } from "@inertiajs/react";
import {
  Building2,
  CalendarClock,
  CreditCard,
  Database,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import SubscriptionPlanCard from "../../components/subscriptions/SubscriptionPlanCard";
import type {
  Subscription,
  SubscriptionPlan,
  SubscriptionUsage,
} from "../../types/subscription";

type SubscriptionShowProps = {
  subscription?: Subscription | null;
  plans?: SubscriptionPlan[];
  usage?: SubscriptionUsage | null;
  can_manage_billing?: boolean;
};

export default function SubscriptionShow({
  subscription = null,
  plans = [],
  usage = null,
  can_manage_billing = false,
}: SubscriptionShowProps) {
  const currentPlan = normalizePlan(
    subscription?.plan_name || subscription?.plan,
  );
  const status = formatStatus(subscription?.status);

  const referenceDate =
    subscription?.expires_at ||
    subscription?.ends_at ||
    subscription?.started_at ||
    subscription?.starts_at ||
    null;

  const workspaceUsage = formatUsage(
    usage?.workspaces_used,
    usage?.workspace_limit,
  );

  const memberUsage = formatUsage(usage?.member_slots_used, usage?.user_limit);

  function openBillingPortal() {
    if (!can_manage_billing) return;

    router.post("/subscription/portal");
  }

  const stats = [
    {
      label: "Current Plan",
      value: formatPlan(currentPlan),
      helper: "Plan assigned to the organization",
      icon: CreditCard,
    },
    {
      label: "Status",
      value: status,
      helper: "Current subscription state",
      icon: Sparkles,
    },
    {
      label: "Workspace Access",
      value: workspaceUsage,
      helper: "Current workspaces / plan limit",
      icon: Database,
    },
    {
      label: "Members",
      value: memberUsage,
      helper: "Users plus pending invitations",
      icon: UsersRound,
    },
  ];

  return (
    <AppLayout>
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-950"
        >
          Subscription
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-2 max-w-2xl text-slate-500"
        >
          Review the organization plan, subscription status, available features,
          and plan limits.
        </motion.p>
      </div>

      <section className="mb-8 grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <SubscriptionStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      <section className="mb-8 grid grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="col-span-2 rounded-2xl border border-cyan-100 bg-linear-to-br from-cyan-50 to-white p-8 shadow-sm"
        >
          <div className="flex items-start justify-between gap-8">
            <div>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-white shadow-sm shadow-cyan-100">
                <CreditCard size={26} strokeWidth={2.4} />
              </div>

              <h2 className="text-4xl font-extrabold text-slate-950">
                {formatPlan(currentPlan)}
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-slate-600">
                This plan controls the workspace limits, member management
                options, booking rules, and reporting features available to the
                organization.
              </p>

              <button
                type="button"
                disabled={!can_manage_billing}
                onClick={openBillingPortal}
                className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                  can_manage_billing
                    ? "bg-slate-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
              >
                <CreditCard size={17} />
                Manage Billing
              </button>
            </div>

            <div className="rounded-2xl border border-white bg-white/80 p-6 shadow-sm">
              <p className="text-sm font-bold text-slate-500">Status</p>

              <span className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-600">
                {status}
              </span>

              <div className="mt-6 h-px bg-slate-100" />

              <p className="mt-6 text-sm font-bold text-slate-500">
                Reference Date
              </p>

              <p className="mt-2 text-sm font-bold text-slate-950">
                {referenceDate ? formatDate(referenceDate) : "Not configured"}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
              <CalendarClock size={19} strokeWidth={2.4} />
            </div>

            <h2 className="text-lg font-bold text-slate-950">Plan Overview</h2>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <SummaryRow label="Plan" value={formatPlan(currentPlan)} />
            <SummaryRow label="Status" value={status} />
            <SummaryRow label="Workspaces" value={workspaceUsage} />
            <SummaryRow label="Members" value={memberUsage} />
            <SummaryRow label="Members" value="Included" />
            <SummaryRow
              label="Date"
              value={
                referenceDate ? formatDate(referenceDate) : "Not configured"
              }
            />
          </div>
        </motion.aside>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-950">Available Plans</h2>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Compare plan levels and the features available for each
            subscription.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.06 }}
            >
              <SubscriptionPlanCard
                planKey={plan.key}
                name={plan.name}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                icon={plan.key === "pro" ? Zap : Building2}
                highlighted={plan.highlighted}
                current={currentPlan === plan.key}
                checkoutReady={plan.checkout_ready}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}

type SubscriptionStat = {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
};

type SubscriptionStatCardProps = {
  stat: SubscriptionStat;
  index: number;
};

function SubscriptionStatCard({ stat, index }: SubscriptionStatCardProps) {
  const Icon = stat.icon;

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

          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            {stat.value}
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          <Icon size={19} strokeWidth={2.4} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{stat.helper}</p>
    </motion.div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-bold text-slate-950">
        {value}
      </span>
    </div>
  );
}

function normalizePlan(value?: string | null): string {
  if (!value) return "starter";

  return value.toLowerCase().replace(/\s+/g, "_");
}

function formatPlan(value?: string | null): string {
  if (!value) return "Starter";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function formatStatus(value?: string | null): string {
  if (!value) return "Not Configured";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function formatLimit(value?: number | null): string {
  if (value === null || value === undefined) return "Unlimited";

  return String(value);
}

function formatUsage(used?: number | null, limit?: number | null): string {
  return `${used || 0} / ${formatLimit(limit)}`;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}
