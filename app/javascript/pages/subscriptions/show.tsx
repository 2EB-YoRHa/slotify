import { motion } from "motion/react";
import {
  Building2,
  CalendarClock,
  CreditCard,
  Database,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import SubscriptionPlanCard from "../../components/subscriptions/SubscriptionPlanCard";

type Subscription = {
  id?: number;
  plan?: string | null;
  plan_name?: string | null;
  status?: string | null;
  started_at?: string | null;
  starts_at?: string | null;
  expires_at?: string | null;
  ends_at?: string | null;
};

type SubscriptionShowProps = {
  subscription?: Subscription | null;
};

const plans = [
  {
    key: "starter",
    name: "Starter",
    price: "$19",
    description: "For small coworking spaces starting with reservations.",
    icon: Building2,
    features: [
      "Up to 10 workspaces",
      "Basic reservation management",
      "Member invitations",
      "Booking rules",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$49",
    description: "For growing coworkings that need more control.",
    icon: Zap,
    highlighted: true,
    features: [
      "Unlimited workspaces",
      "Advanced availability checks",
      "Organization management",
      "Member access control",
      "Dashboard insights",
    ],
  },
  {
    key: "business",
    name: "Business",
    price: "$99",
    description: "For larger operations with advanced needs.",
    icon: ShieldCheck,
    features: [
      "Multi-location support",
      "Advanced reports",
      "Priority support",
      "Custom rules",
      "Audit-ready activity history",
    ],
  },
];

export default function SubscriptionShow({
  subscription = null,
}: SubscriptionShowProps) {
  const currentPlan = normalizePlan(subscription?.plan_name || subscription?.plan);
  const status = formatStatus(subscription?.status);
  const renewalDate =
    subscription?.expires_at ||
    subscription?.ends_at ||
    subscription?.started_at ||
    subscription?.starts_at ||
    null;

  const stats = [
    {
      label: "Current Plan",
      value: formatPlan(currentPlan),
      helper: "Configured subscription",
      icon: CreditCard,
    },
    {
      label: "Status",
      value: status,
      helper: "Billing state",
      icon: Sparkles,
    },
    {
      label: "Workspace Access",
      value: currentPlan === "starter" ? "10" : "Unlimited",
      helper: "Available spaces",
      icon: Database,
    },
    {
      label: "Members",
      value: "Included",
      helper: "Team management",
      icon: UsersRound,
    },
  ];

  return (
    <AppLayout>
      <div className="mb-8">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-sm font-bold uppercase tracking-wide text-cyan-500"
        >
          SaaS Billing
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-3xl font-bold text-slate-950"
        >
          Subscription
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-1 text-slate-500"
        >
          Review the organization plan, billing status and available features.
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
          className="col-span-2 rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-8 shadow-sm"
        >
          <div className="flex items-start justify-between gap-8">
            <div>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-white shadow-sm shadow-cyan-100">
                <CreditCard size={26} strokeWidth={2.4} />
              </div>

              <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
                Active Subscription
              </p>

              <h2 className="mt-2 text-4xl font-extrabold text-slate-950">
                {formatPlan(currentPlan)}
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-slate-600">
                This plan defines the features available for the organization.
                Billing integration can be connected later with Stripe or
                another payment provider.
              </p>
            </div>

            <div className="rounded-2xl border border-white bg-white/80 p-6 shadow-sm">
              <p className="text-sm font-bold text-slate-500">Status</p>

              <span className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-600">
                {status}
              </span>

              <div className="mt-6 h-px bg-slate-100" />

              <p className="mt-6 text-sm font-bold text-slate-500">
                Renewal / Reference Date
              </p>

              <p className="mt-2 text-sm font-bold text-slate-950">
                {renewalDate ? formatDate(renewalDate) : "Not configured"}
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

            <h2 className="text-lg font-bold text-slate-950">
              Billing Notes
            </h2>
          </div>

          <p className="text-sm leading-6 text-slate-500">
            Payment processing is not enabled in this MVP. The subscription is
            stored internally to demonstrate SaaS plan management.
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            <p className="font-bold text-slate-700">Demo scope</p>
            <p className="mt-1 leading-6">
              For the presentation, this screen shows the business model and
              future billing direction without charging real payments.
            </p>
          </div>
        </motion.aside>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-950">
            Available Plans
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Compare plan levels and features for future SaaS billing.
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
                name={plan.name}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                icon={plan.icon}
                highlighted={plan.highlighted}
                current={currentPlan === plan.key}
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

function SubscriptionStatCard({
  stat,
  index,
}: SubscriptionStatCardProps) {
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

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}