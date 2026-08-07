import { ChevronDown } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import AvailablePlansSection from "../../components/subscriptions/show/AvailablePlansSection";
import BillingRequiredActivationPanel from "../../components/subscriptions/show/BillingRequiredActivationPanel";
import PlanFeatureComparisonPanel from "../../components/subscriptions/show/PlanFeatureComparisonPanel";
import SubscriptionHeader from "../../components/subscriptions/show/SubscriptionHeader";
import SubscriptionOverviewPanel from "../../components/subscriptions/show/SubscriptionOverviewPanel";
import {
  formatPlan,
  formatStatus,
  normalizePlan,
} from "../../helpers/subscriptionShowHelpers";
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
  can_start_checkout?: boolean;
};

export default function SubscriptionShow({
  subscription = null,
  plans = [],
  usage = null,
  can_manage_billing = false,
  can_start_checkout = true,
}: SubscriptionShowProps) {
  const billingRequired = Boolean(usage?.billing_required);

  const currentPlan = billingRequired
    ? "billing_required"
    : normalizePlan(subscription?.plan_name || subscription?.plan);

  const currentPlanLabel = billingRequired
    ? "Plan Required"
    : formatPlan(currentPlan);

  const status = billingRequired
    ? "Activation Needed"
    : formatStatus(subscription?.status);

  const activePlan = billingRequired
    ? undefined
    : plans.find((plan) => plan.key === currentPlan);

  const referenceDate =
    subscription?.expires_at ||
    subscription?.ends_at ||
    subscription?.started_at ||
    subscription?.starts_at ||
    null;

  return (
    <AppLayout>
      <SubscriptionHeader
        currentPlanLabel={currentPlanLabel}
        status={status}
        billingRequired={billingRequired}
      />

      {billingRequired ? (
        <BillingRequiredActivationPanel />
      ) : (
        <SubscriptionOverviewPanel
          currentPlan={currentPlan}
          currentPlanLabel={currentPlanLabel}
          status={status}
          referenceDate={referenceDate}
          usage={usage}
          activePlan={activePlan}
          canManageBilling={can_manage_billing}
        />
      )}

      <CollapsibleSection
        title="Plan options"
        description={
          billingRequired
            ? "Choose the plan that should activate this organization."
            : "Review available plans or upgrade the current subscription."
        }
        defaultOpen={billingRequired}
      >
        <AvailablePlansSection
          plans={plans}
          currentPlan={currentPlan}
          billingRequired={billingRequired}
          canStartCheckout={can_start_checkout}
          canManageBilling={can_manage_billing}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Plan comparison"
        description="Compare limits and operational features before changing plans."
      >
        <PlanFeatureComparisonPanel plans={plans} />
      </CollapsibleSection>
    </AppLayout>
  );
}

type CollapsibleSectionProps = {
  title: string;
  description: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function CollapsibleSection({
  title,
  description,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  return (
    <details
      open={defaultOpen}
      className="group mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950">{title}</h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-open:rotate-180">
          <ChevronDown size={18} strokeWidth={2.4} />
        </div>
      </summary>

      <div className="mt-6 border-t border-slate-100 pt-6">{children}</div>
    </details>
  );
}