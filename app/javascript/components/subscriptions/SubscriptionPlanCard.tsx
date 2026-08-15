import { router } from "@inertiajs/react";
import { useState } from "react";
import {
  AlertTriangle,
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
  const [showConfirmation, setShowConfirmation] = useState(false);

  const canChooseNewPlan = billingRequired && checkoutReady && canStartCheckout;

  const canUpgradeToPro =
    !billingRequired &&
    canManageBilling &&
    currentPlan === "starter" &&
    planKey === "pro" &&
    checkoutReady;

  const canScheduleDowngradeToStarter =
    !billingRequired &&
    canManageBilling &&
    currentPlan === "pro" &&
    planKey === "starter" &&
    checkoutReady;

  const canManagePlanChange =
    !billingRequired &&
    !current &&
    !canUpgradeToPro &&
    !canScheduleDowngradeToStarter &&
    canManageBilling;

  const canSubmit =
    canChooseNewPlan ||
    canUpgradeToPro ||
    canScheduleDowngradeToStarter ||
    canManagePlanChange;

  const requiresConfirmation = canUpgradeToPro || canScheduleDowngradeToStarter;

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
    canUpgradeToPro,
    canScheduleDowngradeToStarter,
    canManagePlanChange,
    checkoutReady,
  });

  function handleAction() {
    if (current || !canSubmit || processing) return;

    if (requiresConfirmation) {
      setShowConfirmation(true);
      return;
    }

    submitAction();
  }

  function submitAction() {
    setProcessing(true);
    setShowConfirmation(false);

    const path =
      canChooseNewPlan || canUpgradeToPro || canScheduleDowngradeToStarter
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
    <>
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
          highlighted
            ? "border-cyan-200 ring-4 ring-cyan-50"
            : "border-slate-200"
        }`}
      >
        {highlighted && (
          <div className="absolute right-4 top-4 max-w-[calc(100%-2rem)] truncate rounded-full bg-cyan-400 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white shadow-sm sm:right-5 sm:top-5 sm:px-4">
            {badge || "Recommended"}
          </div>
        )}

        {!highlighted && badge && (
          <div className="absolute right-4 top-4 max-w-[calc(100%-2rem)] truncate rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500 sm:right-5 sm:top-5 sm:px-4">
            {badge}
          </div>
        )}

        <div
          className={`p-5 pt-16 sm:p-7 ${
            highlighted
              ? "bg-linear-to-br from-cyan-50 to-white"
              : "bg-linear-to-br from-slate-50 to-white"
          }`}
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-cyan-500 shadow-sm sm:mb-6 sm:h-14 sm:w-14">
            <Icon size={24} strokeWidth={2.4} />
          </div>

          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <h3 className="text-xl font-extrabold text-slate-950 sm:text-2xl">{name}</h3>

            {current && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                Current
              </span>
            )}
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600 sm:min-h-12">
            {description}
          </p>

          {bestFor && (
            <div className="mt-5 rounded-2xl border border-white bg-white/80 p-4 text-sm leading-6 text-slate-600 shadow-sm">
              <span className="font-extrabold text-slate-950">Best for: </span>
              {bestFor}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-end gap-1">
            <span className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              {price}
            </span>

            <span className="pb-2 text-sm font-bold text-slate-400">
              /month
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-7">
          {highlights.length > 0 && (
            <div className="mb-6 grid grid-cols-1 gap-2">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex min-w-0 items-start gap-2 rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs font-extrabold text-cyan-700"
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

                    <span className="min-w-0 wrap-break-word text-sm font-semibold leading-6 text-slate-700">
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

                      <span className="min-w-0 wrap-break-word text-sm leading-6 text-slate-600">
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
                <XCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-500"
                />

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

      {showConfirmation && (
        <PlanChangeConfirmationModal
          planName={name}
          isUpgrade={canUpgradeToPro}
          isDowngrade={canScheduleDowngradeToStarter}
          processing={processing}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={submitAction}
        />
      )}
    </>
  );
}

type PlanActionInput = {
  planKey: string;
  currentPlan: string;
  current: boolean;
  billingRequired: boolean;
  canChooseNewPlan: boolean;
  canUpgradeToPro: boolean;
  canScheduleDowngradeToStarter: boolean;
  canManagePlanChange: boolean;
  checkoutReady: boolean;
};

function actionForPlan({
  planKey,
  current,
  billingRequired,
  canChooseNewPlan,
  canUpgradeToPro,
  canScheduleDowngradeToStarter,
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
      helper: "Configure this plan's Stripe Price ID before it can be selected.",
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

  if (canUpgradeToPro) {
    return {
      label: "Upgrade to Pro",
      icon: ArrowUpCircle,
      helper:
        "You will review and confirm the plan change securely in Stripe before Pro is activated.",
    };
  }

  if (canScheduleDowngradeToStarter) {
    return {
      label: "Schedule Downgrade",
      icon: ArrowDownCircle,
      helper:
        "Starter will begin after the current Pro billing period ends. Pro features remain active until then.",
    };
  }

  if (canManagePlanChange) {
    return {
      label: "Manage in Billing Portal",
      icon: CreditCard,
      helper: "Plan changes are managed through Stripe.",
    };
  }

  return {
    label: "Billing Not Available",
    icon: XCircle,
    helper: "Billing access is not available for this organization yet.",
  };
}

function planName(planKey: string): string {
  return planKey
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

type PlanChangeConfirmationModalProps = {
  planName: string;
  isUpgrade: boolean;
  isDowngrade: boolean;
  processing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function PlanChangeConfirmationModal({
  planName,
  isUpgrade,
  isDowngrade,
  processing,
  onCancel,
  onConfirm,
}: PlanChangeConfirmationModalProps) {
  const title = isUpgrade
    ? `Upgrade to ${planName}?`
    : `Schedule downgrade to ${planName}?`;

  const description = isUpgrade
    ? "You will be redirected to Stripe to review the plan change, confirm the charge, and complete any payment verification required. Pro will only be active after Stripe confirms the subscription update."
    : "Your Pro plan will remain active until the end of the current billing period. Starter will begin automatically after that date.";

  const confirmLabel = isUpgrade ? "Continue to Stripe" : "Schedule in Stripe";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
            <AlertTriangle size={24} strokeWidth={2.4} />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-950">{title}</h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
        </div>

        {isUpgrade && (
          <div className="mb-5 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-semibold leading-6 text-cyan-700">
            You may not be asked to enter a card again if Stripe already has a
            valid payment method. Stripe will still show the plan update before
            confirming the charge.
          </div>
        )}

        {isDowngrade && (
          <div className="mb-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-700">
            No Pro features are removed immediately. The downgrade is scheduled
            for the end of the paid period.
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={processing}
            onClick={onCancel}
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={processing}
            onClick={onConfirm}
            className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {processing ? "Redirecting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}