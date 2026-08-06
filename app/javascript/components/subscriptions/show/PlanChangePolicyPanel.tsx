import { router } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowRight,
  ArrowUpCircle,
  CalendarClock,
  CreditCard,
  Database,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type PlanChangePolicyPanelProps = {
  currentPlan: string;
  canManageBilling: boolean;
  overPlanLimits?: boolean;
};

export default function PlanChangePolicyPanel({
  currentPlan,
  canManageBilling,
  overPlanLimits = false,
}: PlanChangePolicyPanelProps) {
  const isPro = currentPlan === "pro";
  const isStarter = currentPlan === "starter";

  function openBillingPortal() {
    if (!canManageBilling) return;

    router.post("/subscription/portal");
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-7 flex items-start justify-between gap-8">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-500">
            Plan Changes
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
            Upgrade, downgrade, or cancel from the billing portal
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500">
            Slotify keeps your workspace data safe. Plan changes affect what
            the organization can create next, but existing workspaces,
            reservations, members, and history are not deleted.
          </p>
        </div>

        <button
          type="button"
          disabled={!canManageBilling}
          onClick={openBillingPortal}
          className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
            canManageBilling
              ? "bg-slate-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          <CreditCard size={17} />
          Open Billing Portal
          {canManageBilling && <ArrowRight size={16} />}
        </button>
      </div>

      {overPlanLimits && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm">
              <AlertTriangle size={21} strokeWidth={2.4} />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-red-700">
                This organization is currently over its plan limits
              </h3>

              <p className="mt-2 text-sm leading-6 text-red-600">
                Existing data remains available, but creating more workspaces or
                inviting more members is blocked until usage fits the current
                plan or the organization upgrades to Pro.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <PolicyCard
          icon={ArrowUpCircle}
          title="Upgrade to Pro"
          badge={isStarter ? "Available" : isPro ? "Already Pro" : undefined}
          description="Use the billing portal to move from Starter to Pro. Pro unlocks unlimited scale and advanced operational capabilities."
          items={[
            "Best for growing coworking operations.",
            "Unlocks Pro entitlements after the change is active.",
            "Existing Starter data is preserved.",
          ]}
          tone="cyan"
        />

        <PolicyCard
          icon={ArrowDownCircle}
          title="Downgrade to Starter"
          badge={isPro ? "Portal Managed" : isStarter ? "Already Starter" : undefined}
          description="Downgrades should be scheduled through the billing portal and are treated as reduced access at the end of the billing cycle."
          items={[
            "No workspaces, members, or reservations are deleted.",
            "Starter limits apply when the downgrade becomes active.",
            "Over-limit organizations cannot create more until usage fits.",
          ]}
          tone="amber"
        />

        <PolicyCard
          icon={CalendarClock}
          title="Cancel Subscription"
          badge="End of Cycle"
          description="Cancellation stops paid access after the current billing period, while preserving the organization's existing data."
          items={[
            "Data remains stored in Slotify.",
            "Management features lock when no active plan remains.",
            "The organization can reactivate by choosing Starter or Pro.",
          ]}
          tone="slate"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
            <ShieldCheck size={21} strokeWidth={2.4} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-950">
              Data safety rule
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Plan changes never delete existing data. They only control future
              access, future creation limits, and premium feature availability.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

type PolicyCardProps = {
  icon: LucideIcon;
  title: string;
  badge?: string;
  description: string;
  items: string[];
  tone: "cyan" | "amber" | "slate";
};

function PolicyCard({
  icon: Icon,
  title,
  badge,
  description,
  items,
  tone,
}: PolicyCardProps) {
  const toneClasses = {
    cyan: {
      container: "border-cyan-100 bg-cyan-50",
      icon: "text-cyan-500",
      badge: "bg-cyan-100 text-cyan-700",
    },
    amber: {
      container: "border-amber-100 bg-amber-50",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700",
    },
    slate: {
      container: "border-slate-200 bg-slate-50",
      icon: "text-slate-500",
      badge: "bg-white text-slate-600",
    },
  }[tone];

  return (
    <div className={`rounded-2xl border p-5 ${toneClasses.container}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${toneClasses.icon}`}
        >
          <Icon size={21} strokeWidth={2.4} />
        </div>

        {badge && (
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${toneClasses.badge}`}
          >
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-base font-extrabold text-slate-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2">
            <Database
              size={15}
              className={`mt-1 shrink-0 ${toneClasses.icon}`}
            />

            <span className="text-xs font-semibold leading-5 text-slate-600">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}