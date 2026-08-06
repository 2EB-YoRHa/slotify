import { router } from "@inertiajs/react";
import { useState } from "react";
import {
  ArrowDownCircle,
  ArrowRight,
  ArrowUpCircle,
  CheckCircle2,
  CreditCard,
  Sparkles,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SubscriptionFeatureGroup } from "../../types/subscription";

type SubscriptionPlanCardProps = {
  planKey: string;
  currentPlan?: string;
  name: string;
  price: string;
  description: string;
  bestFor?: string;
  badge?: string;
  limits?: string[];
  highlights?: string[];
  featureGroups?: SubscriptionFeatureGroup[];
  features: string[];
  icon: LucideIcon;
  current?: boolean;
  highlighted?: boolean;
  billingRequired?: boolean;
  checkoutReady?: boolean;
  canStartCheckout?: boolean;
  canManageBilling?: boolean;
};

export default function SubscriptionPlanCard({
  planKey,
  currentPlan = "starter",
  name,
  price,
  description,
  bestFor,
  badge,
  limits = [],
  highlights = [],
  featureGroups = [],
  features,
  icon: Icon,
  current = false,
  highlighted = false,
  billingRequired = false,
  checkoutReady = true,
  canStartCheckout = true,
  canManageBilling = false,
}: SubscriptionPlanCardProps) {
  const [processing, setProcessing] = useState(false);

  const canChooseNewPlan = billingRequired && checkoutReady && canStartCheckout;
  const canManagePlanChange = !billingRequired && !current && canManageBilling;
  const canSubmit = canChooseNewPlan || canManagePlanChange;

  const visibleFeatureGroups =
    featureGroups.length > 0
      ? featureGroups
      : [
          {
            title: "Included",
            items: features,
          },
        ];

  const action = actionForPlan({
    planKey,
    currentPlan,
    current,
    billingRequired,
    canChooseNewPlan,
    canManagePlanChange,
    checkoutReady,
  });

  function handleAction() {
    if (current || !canSubmit || processing) return;

    setProcessing(true);

    const path = canChooseNewPlan
      ? `/subscription/checkout/${planKey}`
      : "/subscription/portal";

    router.post(
      path,
      {},
      {
        onFinish: () => setProcessing(false),
      },
    );
  }

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        highlighted
          ? "border-cyan-200 ring-4 ring-cyan-50"
          : "border-slate-200"
      }`}
    >
      {highlighted && (
        <div className="absolute right-5 top-5 rounded-full bg-cyan-400 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white shadow-sm">
          {badge || "Recommended"}
        </div>
      )}

      {!highlighted && badge && (
        <div className="absolute right-5 top-5 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500">
          {badge}
        </div>
      )}

      <div
        className={`p-7 ${
          highlighted
            ? "bg-linear-to-br from-cyan-50 to-white"
            : "bg-linear-to-br from-slate-50 to-white"
        }`}
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-cyan-500 shadow-sm">
          <Icon size={27} strokeWidth={2.4} />
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-extrabold text-slate-950">{name}</h3>

          {current && (
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
              Current
            </span>
          )}
        </div>

        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
          {description}
        </p>

        {bestFor && (
          <div className="mt-5 rounded-2xl border border-white bg-white/80 p-4 text-sm leading-6 text-slate-600 shadow-sm">
            <span className="font-extrabold text-slate-950">Best for: </span>
            {bestFor}
          </div>
        )}

        <div className="mt-6 flex items-end gap-1">
          <span className="text-5xl font-extrabold tracking-tight text-slate-950">
            {price}
          </span>

          <span className="pb-2 text-sm font-bold text-slate-400">/month</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7">
        {highlights.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-2">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="flex items-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs font-extrabold text-cyan-700"
              >
                <Sparkles size={14} className="shrink-0" />
                {highlight}
              </div>
            ))}
          </div>
        )}

        {limits.length > 0 && (
          <div className="mb-7 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-slate-400">
              Plan Limits
            </p>

            <div className="space-y-2">
              {limits.map((limit) => (
                <div key={limit} className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-cyan-500"
                  />

                  <span className="text-sm font-semibold leading-6 text-slate-700">
                    {limit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {visibleFeatureGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-sm font-extrabold text-slate-950">
                {group.title}
              </p>

              <div className="space-y-3">
                {group.items.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-cyan-500"
                    />

                    <span className="text-sm leading-6 text-slate-600">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!checkoutReady && (
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <XCircle size={18} className="mt-0.5 shrink-0 text-amber-500" />

              <p className="text-sm font-semibold leading-6 text-amber-700">
                Stripe price is not configured for this plan yet.
              </p>
            </div>
          </div>
        )}

        {action.helper && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold leading-5 text-slate-500">
              {action.helper}
            </p>
          </div>
        )}

        <button
          type="button"
          disabled={current || processing || !canSubmit}
          onClick={handleAction}
          className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
            current
              ? "bg-green-50 text-green-600"
              : canSubmit
                ? highlighted
                  ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100 hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
                  : "bg-slate-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          {current ? (
            <>
              <Sparkles size={16} />
              Active Plan
            </>
          ) : (
            <>
              {processing ? (
                <CreditCard size={16} />
              ) : (
                <action.icon size={16} />
              )}

              {processing ? "Redirecting..." : action.label}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

type PlanActionInput = {
  planKey: string;
  currentPlan: string;
  current: boolean;
  billingRequired: boolean;
  canChooseNewPlan: boolean;
  canManagePlanChange: boolean;
  checkoutReady: boolean;
};

function actionForPlan({
  planKey,
  currentPlan,
  current,
  billingRequired,
  canChooseNewPlan,
  canManagePlanChange,
  checkoutReady,
}: PlanActionInput) {
  if (current) {
    return {
      label: "Active Plan",
      icon: Sparkles,
      helper: null,
    };
  }

  if (!checkoutReady) {
    return {
      label: "Stripe Not Configured",
      icon: XCircle,
      helper:
        "Configure this plan's Stripe Price ID before it can be selected.",
    };
  }

  if (billingRequired && canChooseNewPlan) {
    return {
      label: `Choose ${planName(planKey)}`,
      icon: ArrowRight,
      helper:
        "This starts Stripe Checkout and activates the organization after payment succeeds.",
    };
  }

  if (canManagePlanChange && currentPlan === "starter" && planKey === "pro") {
    return {
      label: "Upgrade in Billing Portal",
      icon: ArrowUpCircle,
      helper:
        "Upgrades are managed in Stripe so billing, invoices, and payment methods stay consistent.",
    };
  }

  if (canManagePlanChange && currentPlan === "pro" && planKey === "starter") {
    return {
      label: "Schedule Downgrade",
      icon: ArrowDownCircle,
      helper:
        "Downgrades should be scheduled from Stripe and take effect at the end of the billing cycle. Existing data is not deleted.",
    };
  }

  if (canManagePlanChange) {
    return {
      label: "Manage in Billing Portal",
      icon: CreditCard,
      helper:
        "Plan changes are managed through the Stripe Customer Portal.",
    };
  }

  return {
    label: "Billing Not Available",
    icon: XCircle,
    helper:
      "Billing portal access is not available for this organization yet.",
  };
}

function planName(planKey: string): string {
  return planKey
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}